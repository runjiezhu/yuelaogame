// 主入口：协调所有引擎 + UI
import { $, showView, toast, showLoading, hideLoading } from "./ui/dom.js";
import {
  renderTitle,
  renderCard,
  renderStats,
  renderChapter,
  renderChoiceResult,
  renderEnding,
} from "./ui/views.js";
import {
  generateOpeningProfile,
  rerollProfile,
} from "./engine/randomProfile.js";
import {
  applyEffects,
  getPhase,
  shouldTriggerEnding,
} from "./engine/statSystem.js";
import { nextStep } from "./engine/eventEngine.js";
import {
  saveGame,
  loadGame,
  hasSave,
  clearSave,
  createNewGameState,
} from "./engine/gameState.js";

// ===== 全局错误展示（防 loading 卡死） =====
// 任何未捕获错误都会显示在页面上，并强制关掉 loading
function showFatalError(err, where = "") {
  console.error("[yuelao] fatal", where, err);
  hideLoading();
  let box = document.getElementById("yuelao-error-box");
  if (!box) {
    box = document.createElement("div");
    box.id = "yuelao-error-box";
    box.style.cssText =
      "position:fixed;left:8px;right:8px;bottom:8px;max-height:60vh;overflow:auto;" +
      "background:#2B2B2B;color:#F4ECD8;padding:16px;border-radius:6px;" +
      "font:12px/1.6 ui-monospace,monospace;z-index:99999;white-space:pre-wrap;";
    document.body.appendChild(box);
  }
  const msg = err?.stack || err?.message || String(err);
  box.style.display = "block";
  box.innerHTML = `<div style="color:#FFB4A2;font-weight:bold;margin-bottom:8px;">⚠ ${where || "运行错误"}</div><div>${msg.replace(/</g, "&lt;")}</div>` +
    `<button onclick="this.parentElement.style.display='none'" style="margin-top:12px;padding:6px 12px;background:#8B0000;color:#fff;border:none;border-radius:3px;cursor:pointer;">关闭</button>`;
}

window.addEventListener("error", (e) => showFatalError(e.error || e.message, e.filename ? `${e.message}` : "uncaught"));
window.addEventListener("unhandledrejection", (e) => showFatalError(e.reason, "Promise 拒绝"));

// 安全包装：任何函数出错时都强制关掉 loading 并显示错误
function safe(fn, label) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (e) {
      showFatalError(e, label);
      throw e;
    }
  };
}

// 全局游戏状态
const game = {
  state: null, // current game state
  profile: null,
};

// ===== 入口 =====
function init() {
  try {
    renderTitle({
      onNewGame: handleNewGame,
      onContinue: handleContinue,
      hasSave: hasSave(),
    });
    bindGlobalHandlers();
  } catch (e) {
    showFatalError(e, "init() 启动失败");
  }
}

// ===== 标题页：开始新游戏 =====
function handleNewGame() {
  showLoading("翻开你的命运...");
  setTimeout(() => {
    try {
      game.profile = generateOpeningProfile();
      game.state = createNewGameState(game.profile);
      showView("card");
      renderCard(game.profile, {
        onReroll: handleReroll,
        onConfirm: handleConfirm,
      });
    } catch (e) {
      showFatalError(e, "handleNewGame");
    } finally {
      hideLoading();
    }
  }, 400);
}

// 继续上次
function handleContinue() {
  const save = loadGame();
  if (!save) {
    toast("没有存档");
    handleNewGame();
    return;
  }
  game.profile = save.profile;
  game.state = {
    profile: save.profile,
    currentStats: save.currentStats,
    chaptersPlayed: save.chaptersPlayed,
    currentView: save.currentView || "stats",
    pendingEvent: save.pendingEvent,
  };
  showLoading("回到你的故事...");
  setTimeout(() => {
    if (game.state.pendingEvent) {
      showView("novel");
      renderChapter(game.state.pendingEvent, {
        onChoice: (choice) => handleChoice(choice),
      });
    } else if (game.state.currentView === "stats") {
      showView("stats");
      const phase = getPhase(game.state.currentStats.age);
      renderStats(game.state.currentStats, phase);
      bindStartChapter();
    } else if (game.state.currentView === "ending") {
      triggerEnding();
    }
    hideLoading();
  }, 300);
}

// ===== 角色卡：换一个 / 确认 =====
function handleReroll() {
  game.profile = rerollProfile(game.profile);
  game.state = createNewGameState(game.profile);
  renderCard(game.profile, {
    onReroll: handleReroll,
    onConfirm: handleConfirm,
  });
  toast("换个命运");
}

function handleConfirm() {
  saveGame(game.state);
  enterStats();
}

// ===== 进入属性面板（章节开头） =====
function enterStats() {
  showView("stats");
  const phase = getPhase(game.state.currentStats.age);
  renderStats(game.state.currentStats, phase);
  bindStartChapter();
}

function bindStartChapter() {
  const btn = $("#btn-start-chapter");
  btn.onclick = () => {
    enterChapter();
  };
}

// ===== 进入章节剧情 =====
function enterChapter() {
  showLoading();
  setTimeout(() => {
    try {
      const result = nextStep(
        game.state.currentStats,
        game.state.chaptersPlayed,
        game.state.currentStats.triggeredEventIds || []
      );

      if (result.type === "ending") {
        triggerEnding(result.ending);
        return;
      }

      game.state.pendingEvent = result.event;
      game.state.currentStats.triggeredEventIds = [
        ...(game.state.currentStats.triggeredEventIds || []),
        result.event.id,
      ];
      saveGame(game.state);

      showView("novel");
      renderChapter(result.event, {
        onChoice: (choice) => handleChoice(choice),
      });
    } catch (e) {
      showFatalError(e, "enterChapter");
    } finally {
      hideLoading();
    }
  }, 200);
}

// ===== 选项点击 =====
function handleChoice(choice) {
  // 应用效果
  const prevStats = { ...game.state.currentStats };
  game.state.currentStats = applyEffects(game.state.currentStats, choice.effects);
  game.state.chaptersPlayed += 1;
  saveGame(game.state);

  renderChoiceResult(choice);
  toast("存档成功");
}

// ===== 触发结局 =====
function triggerEnding(predefinedEnding = null) {
  let ending = predefinedEnding;
  if (!ending) {
    const result = nextStep(
      game.state.currentStats,
      game.state.chaptersPlayed,
      game.state.currentStats.triggeredEventIds || []
    );
    ending = result.ending;
  }

  showView("ending");
  renderEnding(ending, game.state.currentStats);

  // 清档（防止下次继续旧局）
  clearSave();
}

// ===== 全局事件 =====
function bindGlobalHandlers() {
  // 章节末点击 "进入下一阶段"
  document.addEventListener("yuelao:next-chapter", () => {
    // 检查是否到达结局
    if (shouldTriggerEnding(game.state.currentStats, game.state.chaptersPlayed).trigger) {
      triggerEnding();
      return;
    }
    enterStats();
  });

  // 结局页按钮
  $("#btn-restart").onclick = () => {
    clearSave();
    handleNewGame();
  };
  $("#btn-back-title").onclick = () => {
    clearSave();
    showView("title");
    renderTitle({
      onNewGame: handleNewGame,
      onContinue: handleContinue,
      hasSave: hasSave(),
    });
  };
}

// 启动
init();

// 暴露到 window 方便调试
window.__yuelao = { game, handleNewGame, handleContinue };
