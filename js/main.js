// main.js - 主入口：协调所有引擎 + UI
// v2: 新增 NPC 好感度侧边栏、春节主线进度条
// v3: 集成支线任务引擎 (SideQuestEngine)
// v4: 新增时间系统 / 5 大属性 / HUD 顶栏
// v5: 新增随机危机事件系统（CrisisEngine + renderCrisis）
// v6: 新增技能检定 + 道具背包系统
// v6: 新增时间段活动选择（renderTimeSlotSelect + handleActivity）
import { $, showView, toast, showLoading, hideLoading,
         showQuestTracker, hideQuestTracker,
         showProfileSidebar, hideProfileSidebar,
         showSideQuestPanel, hideSideQuestPanel } from "./ui/dom.js";
import {
  renderTitle,
  renderCard,
  renderStats,
  renderChapter,
  renderChoiceResult,
  renderEnding,
  renderProfileSidebar,
  renderQuestTracker,
  renderSideQuestProgress,
  renderCrisis,            // v5: 危机事件视图
  renderCrisisResult,      // v5: 危机结果视图
  renderSkillCheck,        // v6: 技能检定弹窗
  renderInventory,         // v6: 道具背包
  renderTimeSlotSelect,    // v6: 时间段活动选择
  renderActivityResult,    // v6: 活动结果浮层
  closeActivityResult,     // v6: 关闭活动结果
  renderOutcomePreview,    // v6: 结局预览
  closeOutcomePreview,     // v6: 关闭结局预览
  renderOutcomeHudPreview, // v7: HUD 结局预览小提示
  renderSideQuestsPanel,   // v6: 支线任务浮层
  closeSideQuestsPanel,    // v6: 关闭支线任务
  getTimeSlotLabel,        // v6: 时间段标签工具
  renderHUD,               // v4: HUD 顶栏
  renderAttributes,        // v4: 5 大属性条
  NPC_META,
} from "./ui/views.js";
import { generateOpeningProfile, rerollProfile } from "./engine/randomProfile.js";
import {
  applyEffects,      // v2: 现在接收 choice 对象（含 _event）
  applyStatEffects,
  applyActivityEffect, // v6: 应用时间段活动效果
  getPhase,
  shouldTriggerEnding,
} from "./engine/statSystem.js";
import { nextStep } from "./engine/eventEngine.js";
import { CrisisEngine } from "./engine/crisisEngine.js";  // v5: 危机引擎
import { SideQuestEngine } from "./engine/sideQuestEngine.js";
import { ItemSystem } from "./engine/itemSystem.js";      // v6: 道具系统
import {
  determineOutcome,        // 15 种结局系统（v7 新增）
  getOutcomePreview,       // 结局预览（HUD 用，v7 新增）
  computeStats as computeOutcomeStats, // 投影当前 stats 为 5 维属性（v7 新增）
} from "./engine/outcomeEngine.js";
import {
  saveGame,
  loadGame,
  hasSave,
  clearSave,
  createNewGameState,
  getCurrentQuestTitle,
} from "./engine/gameState.js";
import { createDefaultPlayerStats } from "../data/player_stats.js";
import { DAILY_ACTIVITIES, isActivityAvailable } from "../data/daily_activities.js";

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
  sideQuestEngine: null,
  crisisEngine: null,  // v5: 危机事件引擎
  itemSystem: null,    // v6: 道具系统
  // v6: 当前 UI 模式（"novel"=章节剧情 / "timeslot"=时间段选择）
  mode: "novel",
};

// ===== v4 新增：初始化玩家养成属性到 game.state =====
function initGame() {
  if (!game.state) return;
  // 把 PLAYER_STATS 浅合并到 currentStats（保留已有字段）
  const defaults = createDefaultPlayerStats();
  if (!game.state.currentStats) {
    game.state.currentStats = {};
  }
  for (const [key, val] of Object.entries(defaults)) {
    if (game.state.currentStats[key] === undefined) {
      game.state.currentStats[key] = val;
    }
  }
  // 建立 game.state.stats 镜像（saveGame/loadGame 也会走同一份）
  game.state.stats = game.state.currentStats;
}

// ===== v4 新增：本地存档包装（确保 stats 一并存入） =====
function saveGameWithStats() {
  if (!game.state) return;
  // 把 currentStats 的字段同步回 game.state.stats
  if (game.state.currentStats) {
    game.state.stats = { ...game.state.stats, ...game.state.currentStats };
  }
  saveGame(game.state);
}

function loadGameWithStats() {
  const save = loadGame();
  if (!save) return null;
  // 保证 currentStats 与 stats 一致（向后兼容旧存档）
  if (save.currentStats) {
    save.stats = { ...save.currentStats };
  }
  return save;
}

// ===== v4 新增：刷新 HUD（每次状态变化后调用） =====
function refreshHUD() {
  if (!game.state || !game.state.currentStats) return;
  renderHUD(game.state.currentStats);
  renderAttributes(game.state.currentStats);
  // v7: 同步 HUD 结局预览小提示
  try {
    const previews = getOutcomePreview(game.state.currentStats, 3);
    renderOutcomeHudPreview(previews);
  } catch (e) {
    console.warn("[main] HUD 结局预览刷新失败", e);
  }
}

// ===== v6 新增：刷新道具背包按钮 =====
function refreshInventory() {
  if (game.itemSystem) {
    renderInventory(game.itemSystem, (result) => {
      if (result.success) {
        toast(`✨ ${result.message}`);
        refreshHUD();
        renderProfileSidebar(game.profile, game.state.currentStats);
      }
    });
  }
}

// ===== v6 新增：道具持久化到存档 =====
function saveItemState() {
  if (game.state && game.itemSystem) {
    game.state.currentStats.items = game.itemSystem.getItems();
  }
}

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
      // v4: 初始化玩家养成属性 + game.state.stats
      initGame();
      // v3: 初始化支线任务引擎
      game.sideQuestEngine = new SideQuestEngine();
      game.sideQuestEngine.init(game.state.currentStats);
      game.sideQuestEngine.onUpdate = () => {
        renderSideQuestProgress(game.sideQuestEngine);
        // 同步道具到存档
        if (game.state) {
          game.state.currentStats.completedSideQuests = [...game.sideQuestEngine.completedQuests];
          game.state.currentStats.failedSideQuests = [...game.sideQuestEngine.failedQuests];
          game.state.currentStats.sideQuestItems = game.sideQuestEngine.getItems();
        }
      };
      // v6: 初始化道具系统
      game.itemSystem = new ItemSystem();
      // 应用被动效果（若玩家已有道具）
      game.itemSystem.applyPassiveEffects();
      // 应用道具系统的初始好感度加成
      const initBonus = game.itemSystem.getInitAffectionBonus();
      if (initBonus > 0 && game.state.currentStats.npcs) {
        for (const npcId of Object.keys(game.state.currentStats.npcs)) {
          game.state.currentStats.npcs[npcId] = Math.max(
            0,
            Math.min(100, (game.state.currentStats.npcs[npcId] ?? 50) + initBonus)
          );
        }
      }
      // 把初始道具同步到存档
      game.state.currentStats.items = game.itemSystem.getItems();
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
  const save = loadGameWithStats();
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
    stats: save.stats || save.currentStats,  // v4: 恢复 stats
  };

  // v4: 同步 stats 镜像 + 补全缺失字段
  initGame();

  // v3: 恢复支线任务引擎
  game.sideQuestEngine = new SideQuestEngine();
  game.sideQuestEngine.init(game.state.currentStats);
  game.sideQuestEngine.onUpdate = () => {
    renderSideQuestProgress(game.sideQuestEngine);
    if (game.state) {
      game.state.currentStats.completedSideQuests = [...game.sideQuestEngine.completedQuests];
      game.state.currentStats.failedSideQuests = [...game.sideQuestEngine.failedQuests];
      game.state.currentStats.sideQuestItems = game.sideQuestEngine.getItems();
    }
  };

  // v6: 恢复道具系统
  game.itemSystem = new ItemSystem();
  if (save.items && Array.isArray(save.items)) {
    save.items.forEach(item => game.itemSystem.items.push(item));
  }
  game.itemSystem.applyPassiveEffects();
  const initBonus = game.itemSystem.getInitAffectionBonus();
  if (initBonus > 0 && game.state.currentStats.npcs) {
    for (const npcId of Object.keys(game.state.currentStats.npcs)) {
      game.state.currentStats.npcs[npcId] = Math.max(
        0,
        Math.min(100, (game.state.currentStats.npcs[npcId] ?? 50) + initBonus)
      );
    }
  }

  // v2: 恢复时也显示侧边栏和进度条
  showProfileSidebar();
  showQuestTracker();
  showSideQuestPanel();

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
  showSideQuestPanel();
  renderProfileSidebar(game.profile, game.state.currentStats);
  renderQuestTracker(
    game.state.currentStats.currentMainQuestIndex ?? 0,
    getCurrentQuestTitle(game.state.currentStats),
    10
  );
  renderSideQuestProgress(game.sideQuestEngine);
  // v4: 显示 HUD
  refreshHUD();
  // v6: 显示背包按钮
  refreshInventory();
  saveGameWithStats();
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
  renderSideQuestProgress(game.sideQuestEngine);
  // v4: 刷新 HUD 与属性条
  refreshHUD();
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

    // ===== v5 新增：处理危机事件 =====
    if (result.type === "crisis") {
      // 把 crisisEngine 已更新的 stats（已加 triggeredCrisisIds / flags）写回
      if (result.updatedStats) {
        game.state.currentStats = result.updatedStats;
      }
      game.state.pendingEvent = result.crisis;
      saveGameWithStats();
      renderQuestTracker(
        game.state.currentStats.currentMainQuestIndex ?? 0,
        getCurrentQuestTitle(game.state.currentStats),
        10
      );
      renderProfileSidebar(game.profile, game.state.currentStats);
      refreshHUD();
      showView("novel");
      renderCrisis(result.crisis, game.state.currentStats, { onChoice: handleCrisisChoice });
      return;
    }

    game.state.pendingEvent = result.event;
    game.state.currentStats.triggeredEventIds = [
      ...(game.state.currentStats.triggeredEventIds || []),
      result.event.id,
    ];

    // v3: 检查是否触发支线任务
    let triggeredSideQuest = null;
    if (game.sideQuestEngine) {
      triggeredSideQuest = game.sideQuestEngine.checkTrigger(
        result.event.id,
        game.state.currentStats
      );
    }

    saveGameWithStats();

    // v2: 更新进度条（如果触发了主线，显示当前章节）
    const progress = game.state.currentStats.currentMainQuestIndex ?? 0;
    const questTitle = result.event.title ?? getCurrentQuestTitle(game.state.currentStats);
    renderQuestTracker(progress, questTitle, 10);
    renderProfileSidebar(game.profile, game.state.currentStats);
    renderSideQuestProgress(game.sideQuestEngine);
    // v4: 刷新 HUD
    refreshHUD();

    showView("novel");
    renderChapter(result.event, {
      onChoice: handleChoice,
      sideQuest: triggeredSideQuest, // 若有支线触发，一并渲染
    });
    // v6: 显示背包按钮
    refreshInventory();
  } catch (e) {
    showFatalError(e, "enterChapter");
  } finally {
    hideLoading();
  }
}

// ===== v6 新增：技能检定选项处理 =====
// 弹出检定弹窗，根据成功/失败应用效果
function handleSkillCheckChoice(choice) {
  if (!game.itemSystem) game.itemSystem = new ItemSystem();
  const sc = choice.skillCheck;
  renderSkillCheck(choice, game.state.currentStats, (result) => {
    if (result.declined) {
      // 玩家放弃，不应用任何效果
      return;
    }

    const success = result.success;
    const feedback = result.feedback;

    // 计算最终效果：基础效果 + 成功/失败额外效果
    const finalEffects = { ...(choice.effects || {}) };
    if (success && sc.successEffects) {
      Object.assign(finalEffects, sc.successEffects);
    } else if (!success && sc.failEffects) {
      Object.assign(finalEffects, sc.failEffects);
    }

    // 应用好感度变化（应用道具的好感倍率）
    let finalAffinity = choice.affinityChange ? { ...choice.affinityChange } : null;
    if (finalAffinity && game.itemSystem) {
      const mult = game.itemSystem.getAffectionMultiplier();
      if (mult !== 1.0) {
        for (const npcId of Object.keys(finalAffinity)) {
          finalAffinity[npcId] = Math.round(finalAffinity[npcId] * mult);
        }
      }
    }

    // 应用效果
    game.state.currentStats = applyEffects(game.state.currentStats, {
      effects: finalEffects,
      affinityChange: finalAffinity,
      _event: game.state.pendingEvent,
    });
    game.state.chaptersPlayed += 1;

    // 处理分支跳转（即使检定失败，也允许后续跳转）
    if (choice.nextQuestId) {
      game.state.pendingNextQuestId = choice.nextQuestId;
    }

    // 处理 flags
    if (choice.flags && typeof choice.flags === "object") {
      if (!game.state.currentStats.flags) game.state.currentStats.flags = {};
      for (const [key, value] of Object.entries(choice.flags)) {
        game.state.currentStats.flags[key] = value;
      }
    }

    // 重置检定相关的瞬时道具标记
    if (game.itemSystem) game.itemSystem.resetPerActionFlags();

    saveGameWithStats();

    // 用玩家实际得到的 feedback 覆盖 choice.feedback
    const resultChoice = {
      ...choice,
      feedback: feedback,
      effects: finalEffects,
    };
    renderChoiceResult(resultChoice);

    // 刷新 UI
    renderProfileSidebar(game.profile, game.state.currentStats);
    renderQuestTracker(
      game.state.currentStats.currentMainQuestIndex ?? 0,
      getCurrentQuestTitle(game.state.currentStats),
      10
    );
    renderSideQuestProgress(game.sideQuestEngine);
    refreshHUD();
    saveItemState();

    toast(success ? "✨ 检定成功" : "💨 检定失败");
    game.mode = "post_novel_pending_timeslot";
  });
}

// ===== 选项点击 =====
function handleChoice(choice) {
  // ===== v6 新增：技能检定选项需要先弹出检定弹窗 =====
  if (choice.skillCheck) {
    handleSkillCheckChoice(choice);
    return;
  }
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

  // ===== v7 新增：应用 choice.flags（结局判定用）=====
  // 例如：{ reconciled_ex: true, completed_grandma_wish: true }
  if (choice.flags && typeof choice.flags === "object") {
    if (!game.state.currentStats.flags) game.state.currentStats.flags = {};
    for (const [key, value] of Object.entries(choice.flags)) {
      game.state.currentStats.flags[key] = value;
    }
  }

  // ===== v7 新增：处理 choice.outcomes（直接解锁特定结局）=====
  // 例如：outcomes: ["outcome_career_hometown_startup"]
  if (choice.outcomes && Array.isArray(choice.outcomes) && choice.outcomes.length > 0) {
    if (!game.state.currentStats.flags) game.state.currentStats.flags = {};
    game.state.currentStats.flags._forcedOutcomes = [
      ...(game.state.currentStats.flags._forcedOutcomes || []),
      ...choice.outcomes,
    ];
    toast(`🎯 结局已解锁：${choice.outcomes[0]}`);
  }

  // v3: 处理支线任务的道具效果
  // 若 choice 来自支线任务，应用道具/好感度变化
  if (choice._sideQuestId && game.sideQuestEngine) {
    const sqResult = game.sideQuestEngine.handleChoice(
      choice._sideQuestId,
      choice,
      game.state.currentStats
    );
    if (sqResult) {
      // 合并属性变化（若支线有 effects）
      if (sqResult.effects && Object.keys(sqResult.effects).length > 0) {
        const redPacketDelta = sqResult.effects._redPacket;
        const cleanEffects = { ...sqResult.effects };
        delete cleanEffects._redPacket;
        game.state.currentStats = applyStatEffects(game.state.currentStats, cleanEffects);
        if (redPacketDelta) {
          game.state.currentStats.redPacket = (game.state.currentStats.redPacket ?? 0) + redPacketDelta;
        }
      }
      // 合并 NPC 好感度
      if (sqResult.affinityChange && game.state.currentStats.npcs) {
        for (const [npcId, delta] of Object.entries(sqResult.affinityChange)) {
          const cur = game.state.currentStats.npcs[npcId] ?? 50;
          game.state.currentStats.npcs[npcId] = Math.max(0, Math.min(100, cur + delta));
        }
      }
      // 设置额外 flag
      if (sqResult.extraFlags) {
        game.state.currentStats.flags = {
          ...(game.state.currentStats.flags || {}),
          ...sqResult.extraFlags,
        };
      }
      // 更新道具
      game.state.currentStats.sideQuestItems = game.sideQuestEngine.getItems();
      game.state.currentStats.completedSideQuests = [...game.sideQuestEngine.completedQuests];
      game.state.currentStats.failedSideQuests = [...game.sideQuestEngine.failedQuests];

      // Toast 提示完成/失败
      if (sqResult.completed) {
        toast(`✅ 支线完成：${sqResult.sqTitle}`);
        if (sqResult.reward) {
          setTimeout(() => toast(`🎁 获得道具：${sqResult.reward.name}`), 2200);
        }
      } else if (sqResult.failed) {
        toast(`❌ 支线失败：${sqResult.sqTitle}`);
      }
    }
  }

  saveGameWithStats();

  renderChoiceResult(choice);

  // v2: 更新侧边栏（affinity 变了）+ 进度条（主线推进了）
  renderProfileSidebar(game.profile, game.state.currentStats);
  renderQuestTracker(
    game.state.currentStats.currentMainQuestIndex ?? 0,
    getCurrentQuestTitle(game.state.currentStats),
    10
  );
  renderSideQuestProgress(game.sideQuestEngine);
  // v4: 刷新 HUD（5 大属性 / 精力 / 红包 / 人情债 等都变了）
  refreshHUD();
  // v6: 保存道具状态并刷新背包按钮
  saveItemState();
  if (game.itemSystem) game.itemSystem.resetPerActionFlags();
  // v7: 刷新结局预览浮窗
  try {
    const previews = getOutcomePreview(game.state.currentStats, 3);
    renderOutcomePreview(previews);
  } catch (e) {
    console.warn("[main] 结局预览失败", e);
  }

  toast("存档成功");

  // ===== v6 新增：章节结束后自动进入时间段选择 =====
  // 但要等用户点击"进入下一章"按钮后再触发
  game.mode = "post_novel_pending_timeslot";
}

// ===== v5 新增：危机事件选项处理 =====
// 应用危机选项 effects + 技能检定，渲染结果
function handleCrisisChoice(choiceIndex) {
  if (!game.crisisEngine) game.crisisEngine = new CrisisEngine();
  const crisis = game.state.pendingEvent;
  if (!crisis) {
    console.warn("[main] handleCrisisChoice: pendingEvent 不是危机事件");
    return;
  }

  const { stats: nextStats, feedback, success, effects } =
    game.crisisEngine.applyChoice(game.state.currentStats, crisis, choiceIndex);

  game.state.currentStats = nextStats;
  game.state.chaptersPlayed += 1;
  saveGameWithStats();

  // 更新侧边栏 / HUD（属性变化了）
  renderProfileSidebar(game.profile, game.state.currentStats);
  refreshHUD();

  // 显示结果视图
  renderCrisisResult(crisis, choiceIndex, success, feedback, effects);
  toast(success === false ? "⚠ 检定失败" : (success === true ? "✅ 检定通过" : "已处理"));
}

// ===== 触发结局 =====
function triggerEnding(predefinedEnding = null) {
  let ending = predefinedEnding;

  if (!ending) {
    // v7: 优先使用新的 15 种结局系统
    // 但若旧系统有特殊触发（main_quest_complete 等），保持兼容
    try {
      ending = determineOutcome(game.state.currentStats);
    } catch (e) {
      console.warn("[main] determineOutcome 失败，回退到旧系统", e);
      const result = nextStep(
        game.state.currentStats,
        game.state.chaptersPlayed,
        game.state.currentStats.triggeredEventIds || []
      );
      ending = result.ending;
    }
  }

  // 检查是否有 forced outcomes（来自 choice.outcomes）
  const forcedOutcomes = game.state.currentStats?.flags?._forcedOutcomes;
  if (Array.isArray(forcedOutcomes) && forcedOutcomes.length > 0) {
    // 如果有 forced outcomes，尝试优先匹配
    try {
      const previews = getOutcomePreview(game.state.currentStats, 15);
      const forced = previews.find(o => forcedOutcomes.includes(o.id));
      if (forced) {
        ending = forced;
        console.log(`[main] 使用 forced outcome: ${forced.id}`);
      }
    } catch (e) {
      console.warn("[main] forced outcome 处理失败", e);
    }
  }

  // v2: 结局时隐藏侧边栏和进度条
  hideProfileSidebar();
  hideQuestTracker();
  hideSideQuestPanel();
  // v4: 隐藏 HUD
  const hudBar = document.getElementById("hud-bar");
  if (hudBar) hudBar.classList.remove("is-active");

  showView("ending");
  renderEnding(ending, game.state.currentStats);
  clearSave();
}

// ===== 全局事件 =====
function bindGlobalHandlers() {
  // 章节末点击"进入下一章"——分支：
  //   - 若处于 "post_novel_pending_timeslot" 模式（刚做完章节选择），进入时间段选择
  //   - 若处于 "post_timeslot_pending_chapter" 模式（刚做完时间段活动），检查结局或进入下一章
  document.addEventListener("yuelao:next-chapter", () => {
    // v5: 进入下一章时清除今日危机标记，允许下一章再次判定
    if (game.state?.currentStats?.flags?.todayCrisis) {
      const flags = { ...game.state.currentStats.flags };
      delete flags.todayCrisis;
      game.state.currentStats.flags = flags;
    }
    if (shouldTriggerEnding(game.state.currentStats, game.state.chaptersPlayed).trigger) {
      triggerEnding();
      return;
    }

    if (game.mode === "post_novel_pending_timeslot") {
      // 进入时间段选择
      game.mode = "timeslot";
      enterTimeSlot();
    } else if (game.mode === "post_timeslot_pending_chapter") {
      // 一天的活动结束，进入下一章
      game.mode = "novel";
      enterStats();
    } else {
      // 默认行为
      enterStats();
    }
  });

  // 活动结果浮层的"继续"按钮（手动跳过自动推进）
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".ar-continue-btn");
    if (btn) {
      e.stopPropagation();
      const t = game._activityAdvanceTimer;
      if (t) { clearTimeout(t); game._activityAdvanceTimer = null; }
      closeActivityResult();
      advanceAfterActivity();
      return;
    }

    // 结局预览浮层关闭
    if (e.target.closest(".op-close-btn")) {
      closeOutcomePreview();
      return;
    }

    // 支线任务面板关闭
    if (e.target.closest(".sqp-close-btn")) {
      closeSideQuestsPanel();
      return;
    }
  });

  // 结局页按钮
  const btnRestart = $("#btn-restart");
  const btnBack = $("#btn-back-title");
  if (btnRestart) btnRestart.onclick = () => {
    clearSave();
    hideProfileSidebar();
    hideQuestTracker();
    hideSideQuestPanel();
    handleNewGame();
  };
  if (btnBack) btnBack.onclick = () => {
    clearSave();
    hideProfileSidebar();
    hideQuestTracker();
    hideSideQuestPanel();
    showView("title");
    renderTitle({
      onNewGame: handleNewGame,
      onContinue: handleContinue,
      hasSave: hasSave(),
    });
  };
}

// ============================================================
// ===== v6 新增：时间段活动流程 =====
// ============================================================

// 进入时间段选择界面
function enterTimeSlot() {
  showView("timeslot");
  renderTimeSlotSelect(game.state.currentStats, handleActivity);
  // 侧边栏和 HUD 仍然显示
  refreshHUD();
  renderProfileSidebar(game.profile, game.state.currentStats);
  // v6: 显示背包按钮
  refreshInventory();
}

// 玩家点击活动卡片
function handleActivity(activityId) {
  const activity = DAILY_ACTIVITIES[activityId];
  if (!activity) {
    console.warn("[main] 未知活动:", activityId);
    return;
  }

  // 检查可用性（防误点）
  if (!isActivityAvailable(activity, game.state.currentStats)) {
    toast("这个活动现在做不了");
    return;
  }

  // 特殊活动：open_side_quests / open_outcome_preview 直接打开浮层
  if (activity.effect?.type === "open_side_quests") {
    renderSideQuestsPanel(game.state.currentStats, game.sideQuestEngine);
    return;
  }
  if (activity.effect?.type === "open_outcome_preview") {
    renderOutcomePreview(game.state.currentStats, calcLikelyEnding);
    return;
  }

  // 应用活动效果
  const result = applyActivityEffect(game.state.currentStats, activity);
  game.state.currentStats = result.stats;
  game.state.currentStats.completedActivityIds = [
    ...(game.state.currentStats.completedActivityIds || []),
    activityId,
  ];

  // 检查支线任务触发
  if (game.sideQuestEngine) {
    try {
      if (typeof game.sideQuestEngine.checkActivityTrigger === "function") {
        game.sideQuestEngine.checkActivityTrigger(activityId, game.state.currentStats);
      }
    } catch (e) {
      console.warn("[main] 支线触发检查失败", e);
    }
  }

  // 检查结局（在推进时间之前）
  const endingCheck = shouldTriggerEnding(
    game.state.currentStats,
    game.state.chaptersPlayed
  );

  // 推进时间（自动）
  const nextLabel = advanceTimeSlot();

  // 保存
  saveGameWithStats();

  // 刷新 UI
  refreshHUD();
  renderProfileSidebar(game.profile, game.state.currentStats);
  renderQuestTracker(
    game.state.currentStats.currentMainQuestIndex ?? 0,
    getCurrentQuestTitle(game.state.currentStats),
    10
  );

  // 显示活动结果
  renderActivityResult(activity, result, nextLabel);

  // 绑定"继续"按钮（点击时关闭浮层 + 推进）
  // 1.5 秒后自动推进
  if (game._activityAdvanceTimer) clearTimeout(game._activityAdvanceTimer);
  game._activityAdvanceTimer = setTimeout(() => {
    game._activityAdvanceTimer = null;
    closeActivityResult();
    advanceAfterActivity();
  }, 1500);

  // 若触发了结局，立刻关闭浮层并触发结局（不进入下一段时间段）
  if (endingCheck.trigger) {
    setTimeout(() => {
      closeActivityResult();
      if (game._activityAdvanceTimer) {
        clearTimeout(game._activityAdvanceTimer);
        game._activityAdvanceTimer = null;
      }
      triggerEnding();
    }, 1800);
  }
}

// 活动结束后：要么进入下一段时间段，要么进入下一章
function advanceAfterActivity() {
  if (!game.state) return;

  // 如果处于结局触发状态，则不推进
  if (shouldTriggerEnding(game.state.currentStats, game.state.chaptersPlayed).trigger) {
    triggerEnding();
    return;
  }

  // 若还在时间段范围内（timeSlot < 3），回到时间段选择
  // 否则进入下一章
  const ts = game.state.currentStats.timeSlot ?? 0;
  if (ts < 2) {
    // 还有时间段
    enterTimeSlot();
  } else {
    // 当天时间段用完：进入下一章
    game.mode = "post_timeslot_pending_chapter";
    // 触发"下一章"事件，调用方进入下一章
    document.dispatchEvent(new CustomEvent("yuelao:next-chapter"));
  }
}

// 推进 timeSlot / day（修改 stats 并返回下一段时间段标签）
function advanceTimeSlot() {
  const stats = game.state.currentStats;
  let curSlot = stats.timeSlot ?? 0;
  let curDay = stats.day ?? 1;
  curSlot += 1;
  if (curSlot > 2) {
    curSlot = 0;
    curDay += 1;
    // 每天重置精力为满
    stats.energy = stats.maxEnergy ?? 100;
    // v6: 应用伴侣/宠物类道具的 dailyEffect（如小黄 +5 精力）
    if (game.itemSystem) {
      game.itemSystem.applyDailyEffects();
      const energyBonus = game.itemSystem.getEnergyBonus();
      if (energyBonus > 0) {
        stats.energy = Math.min(
          stats.maxEnergy ?? 100,
          (stats.energy ?? 0) + energyBonus
        );
        console.log(`[main] 宠物道具加成 +${energyBonus} 精力`);
        // 重置 bonus，避免重复累积
        game.itemSystem.energyBonus = 0;
      }
    }
  }
  stats.timeSlot = curSlot;
  stats.day = curDay;
  stats.timeSlotsTotal = (stats.timeSlotsTotal ?? 0) + 1;
  // 重置当日已完成活动（允许每天重复做）
  stats.completedActivityIds = [];
  // 返回下一段时间段标签（如果 curSlot 仍在 0-2 则有下一段）
  if (curSlot <= 2) {
    return getTimeSlotLabel(curSlot);
  }
  return null; // 当天结束
}

// 计算最可能结局（基于 shouldTriggerEnding 逻辑 + 简单属性匹配）
function calcLikelyEnding(stats) {
  try {
    const check = shouldTriggerEnding(stats, game.state?.chaptersPlayed || 0);
    if (check.trigger) {
      // 从全局引擎引用中找 ENDINGS
      const ENDINGS = window.__yuelao_engines?.ENDINGS;
      if (ENDINGS) {
        return ENDINGS.find(e => e.id === check.id) || null;
      }
    }
  } catch (e) {
    console.warn("[main] calcLikelyEnding 失败", e);
  }
  return null;
}

// ===== 启动 =====
init();

// 暴露调试接口
window.__yuelao = { game, handleNewGame, handleContinue, handleChoice, handleActivity };
window.__yuelao_handleChoice = handleChoice;

// v7: 暴露结局预览渲染器（HUD 提示用）
window.__yuelao_renderOutcomePreview = (stats) => {
  try {
    const previews = getOutcomePreview(stats, 3);
    renderOutcomePreview(previews);
  } catch (e) {
    console.warn("[main] renderOutcomePreview 失败", e);
  }
};
