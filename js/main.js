// main.js - 主入口：协调所有引擎 + UI
// v2: 新增 NPC 好感度侧边栏、春节主线进度条
import { $, showView, toast, showLoading, hideLoading,
         showQuestTracker, hideQuestTracker,
         showProfileSidebar, hideProfileSidebar } from "./ui/dom.js";
import {
  renderTitle,
  renderCard,
  renderStats,
  renderChapter,
  renderChoiceResult,
  renderEnding,
  renderProfileSidebar,
  renderQuestTracker,
  NPC_META,
} from "./ui/views.js";
import { generateOpeningProfile, rerollProfile } from "./engine/randomProfile.js";
import {
  applyEffects,      // v2: 现在接收 choice 对象（含 _event）
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
  getCurrentQuestTitle,
} from "./engine/gameState.js";

// ===== 全局错误展示（防 loading 卡死） =====
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
  state: null,
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

// ===== 继续上次 =====
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

  // v2: 恢复时也显示侧边栏和进度条
  showProfileSidebar();
  showQuestTracker();

  showLoading("回到你的故事...");
  setTimeout(() => {
    if (game.state.pendingEvent) {
      showView("novel");
      renderProfileSidebar(game.profile, game.state.currentStats);
      renderQuestTracker(
        game.state.currentStats.currentMainQuestIndex ?? 0,
        getCurrentQuestTitle(game.state.currentStats),
        10
      );
      renderChapter(game.state.pendingEvent, { onChoice: handleChoice });
    } else if (game.state.currentView === "stats") {
      showView("stats");
      const phase = getPhase(game.state.currentStats.age);
      renderStats(game.state.currentStats, phase);
      renderProfileSidebar(game.profile, game.state.currentStats);
      renderQuestTracker(
        game.state.currentStats.currentMainQuestIndex ?? 0,
        getCurrentQuestTitle(game.state.currentStats),
        10
      );
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
  // v2: 进入游戏前展示侧边栏 + 进度条
  showProfileSidebar();
  showQuestTracker();
  renderProfileSidebar(game.profile, game.state.currentStats);
  renderQuestTracker(
    game.state.currentStats.currentMainQuestIndex ?? 0,
    getCurrentQuestTitle(game.state.currentStats),
    10
  );
  saveGame(game.state);
  enterStats();
}

// ===== 进入属性面板 =====
function enterStats() {
  showView("stats");
  const phase = getPhase(game.state.currentStats.age);
  renderStats(game.state.currentStats, phase);
  renderProfileSidebar(game.profile, game.state.currentStats);
  renderQuestTracker(
    game.state.currentStats.currentMainQuestIndex ?? 0,
    getCurrentQuestTitle(game.state.currentStats),
    10
  );
  bindStartChapter();
}

function bindStartChapter() {
  const btn = $("#btn-start-chapter");
  if (btn) btn.onclick = () => enterChapter();
}

// ===== 进入章节剧情 =====
async function enterChapter() {
  showLoading();
  try {
    // ===== 检查是否有分支跳转 =====
    let result;
    if (game.state.pendingNextQuestId) {
      // 有分支跳转，直接获取指定的 quest
      const { QUESTS } = await import("../data/quests.js");
      const targetQuest = QUESTS.find(q => q.id === game.state.pendingNextQuestId);
      if (targetQuest) {
        console.log(`[main] 执行分支跳转: ${game.state.pendingNextQuestId}`);
        result = { type: "event", event: targetQuest };
        // 清除跳转标记
        game.state.pendingNextQuestId = null;
      } else {
        console.warn(`[main] 找不到分支 quest: ${game.state.pendingNextQuestId}`);
        // 降级为正常流程
        result = nextStep(
          game.state.currentStats,
          game.state.chaptersPlayed,
          game.state.currentStats.triggeredEventIds || []
        );
      }
    } else {
      // 正常流程
      result = nextStep(
        game.state.currentStats,
        game.state.chaptersPlayed,
        game.state.currentStats.triggeredEventIds || []
      );
    }

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

    // v2: 更新进度条（如果触发了主线，显示当前章节）
    const progress = game.state.currentStats.currentMainQuestIndex ?? 0;
    const questTitle = result.event.title ?? getCurrentQuestTitle(game.state.currentStats);
    renderQuestTracker(progress, questTitle, 10);
    renderProfileSidebar(game.profile, game.state.currentStats);

    showView("novel");
    renderChapter(result.event, { onChoice: handleChoice });
  } catch (e) {
    showFatalError(e, "enterChapter");
  } finally {
    hideLoading();
  }
}

// ===== 选项点击 =====
function handleChoice(choice) {
  // v2: applyEffects 现在接收 choice 对象（含 _event 用于判断主线）
  const prevStats = { ...game.state.currentStats };
  game.state.currentStats = applyEffects(game.state.currentStats, {
    effects: choice.effects,
    affinityChange: choice.affinityChange,
    _event: game.state.pendingEvent,
  });
  game.state.chaptersPlayed += 1;
  
  // ===== 处理分支跳转 =====
  // 如果选项有 nextQuestId，记录下一个要跳转的 quest
  if (choice.nextQuestId) {
    game.state.pendingNextQuestId = choice.nextQuestId;
    console.log(`[main] 分支跳转: 下一章将进入 ${choice.nextQuestId}`);
  }
  
  saveGame(game.state);

  renderChoiceResult(choice);

  // v2: 更新侧边栏（affinity 变了）+ 进度条（主线推进了）
  renderProfileSidebar(game.profile, game.state.currentStats);
  renderQuestTracker(
    game.state.currentStats.currentMainQuestIndex ?? 0,
    getCurrentQuestTitle(game.state.currentStats),
    10
  );

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

  // v2: 结局时隐藏侧边栏和进度条
  hideProfileSidebar();
  hideQuestTracker();

  showView("ending");
  renderEnding(ending, game.state.currentStats);
  clearSave();
}

// ===== 全局事件 =====
function bindGlobalHandlers() {
  // 章节末点击"进入下一章"
  document.addEventListener("yuelao:next-chapter", () => {
    if (shouldTriggerEnding(game.state.currentStats, game.state.chaptersPlayed).trigger) {
      triggerEnding();
      return;
    }
    enterStats();
  });

  // 结局页按钮
  const btnRestart = $("#btn-restart");
  const btnBack = $("#btn-back-title");
  if (btnRestart) btnRestart.onclick = () => {
    clearSave();
    hideProfileSidebar();
    hideQuestTracker();
    handleNewGame();
  };
  if (btnBack) btnBack.onclick = () => {
    clearSave();
    hideProfileSidebar();
    hideQuestTracker();
    showView("title");
    renderTitle({
      onNewGame: handleNewGame,
      onContinue: handleContinue,
      hasSave: hasSave(),
    });
  };
}

// ===== 启动 =====
init();

// 暴露调试接口
window.__yuelao = { game, handleNewGame, handleContinue };
