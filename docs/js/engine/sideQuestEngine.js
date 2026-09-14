// sideQuestEngine.js - 支线任务引擎
// 管理支线任务的激活、推进、道具获取与使用

import { SIDE_QUESTS, getSideQuestById } from "../../data/side_quests.js";

/**
 * SideQuestEngine - 支线任务系统
 *
 * 设计：
 *   - 支线任务在某个主线 quest 触发时激活（checkTrigger）
 *   - 玩家做选择时调用 handleChoice 推进
 *   - 完成/失败的支线记录在 completedQuests / failedQuests
 *   - 获得的道具保存在 items 数组
 *
 * 选项格式（兼容多种风格）：
 *   {
 *     text: "...",
 *     effects: { confidence: 5 } | [{ type: "attr", target: "...", delta: 5 }],
 *     affinityChange: { npc_mom: 10 },
 *     feedback: "...",
 *     nextStep: "step_id" | null,
 *     completion: true | false,
 *     failed: true | false,
 *     reward: { type: "item", id, name, desc } | null,
 *     skillCheck: { attr, difficulty, label } | null,
 *     setFlags: { flag_name: true } | null
 *   }
 */
export class SideQuestEngine {
  constructor() {
    this.activeQuests = new Map();    // sqId -> { currentStepIdx, status }
    this.completedQuests = new Set(); // sqId
    this.failedQuests = new Set();    // sqId
    this.items = [];                  // [{id, name, desc}]
    this.onUpdate = null;             // 状态变更回调
  }

  /**
   * 从 stats 初始化引擎（继续游戏时调用）
   */
  init(stats) {
    this.activeQuests = new Map();
    this.completedQuests = new Set(stats?.completedSideQuests || []);
    this.failedQuests = new Set(stats?.failedSideQuests || []);
    this.items = Array.isArray(stats?.sideQuestItems) ? [...stats.sideQuestItems] : [];
  }

  /**
   * 序列化引擎状态
   */
  serialize() {
    return {
      completedSideQuests: [...this.completedQuests],
      failedSideQuests: [...this.failedQuests],
      sideQuestItems: [...this.items],
    };
  }

  /**
   * 检查某个主线 quest 是否触发了支线任务
   * 若触发则自动激活并返回 quest 定义
   */
  checkTrigger(triggerQuestId, stats) {
    if (!triggerQuestId) return null;

    for (const [sqId, sq] of Object.entries(SIDE_QUESTS)) {
      // 跳过已完成/失败/已激活的
      if (this.completedQuests.has(sqId)) continue;
      if (this.failedQuests.has(sqId)) continue;
      if (this.activeQuests.has(sqId)) continue;

      const step = sq.steps[0];
      if (!step?.trigger) continue;

      if (step.trigger.questId !== triggerQuestId) continue;

      // 检查额外 condition
      if (typeof step.condition === "function") {
        try {
          if (step.condition(stats) === false) continue;
        } catch (e) {
          console.warn(`[sideQuest] condition error in ${sqId}`, e);
        }
      }

      // 激活支线
      this.activeQuests.set(sqId, {
        currentStepIdx: 0,
        status: "active",
      });
      this._notify();
      return sq;
    }
    return null;
  }

  /**
   * 获取支线的当前步骤
   */
  getCurrentStep(sqId) {
    const state = this.activeQuests.get(sqId);
    if (!state) return null;
    const sq = SIDE_QUESTS[sqId];
    if (!sq) return null;
    return sq.steps[state.currentStepIdx] || null;
  }

  /**
   * 获取所有活跃支线
   */
  getActiveQuests() {
    const result = [];
    for (const [sqId, state] of this.activeQuests.entries()) {
      const sq = SIDE_QUESTS[sqId];
      if (!sq) continue;
      result.push({
        quest: sq,
        state,
        currentStep: sq.steps[state.currentStepIdx],
      });
    }
    return result;
  }

  /**
   * 处理支线选项
   *
   * @returns {{
   *   sqId, sqTitle, emoji,
   *   completed, failed,
   *   effects, affinityChange, feedback,
   *   extraFlags, reward, skillCheck, nextStep
   * } | null}
   */
  handleChoice(sqId, choice, stats) {
    const sq = SIDE_QUESTS[sqId];
    if (!sq) return null;
    const state = this.activeQuests.get(sqId);
    if (!state) return null;
    const step = sq.steps[state.currentStepIdx];
    if (!step) return null;

    const result = {
      sqId,
      sqTitle: sq.title,
      emoji: sq.emoji,
      completed: false,
      failed: false,
      effects: {},
      affinityChange: {},
      feedback: choice.feedback || "",
      extraFlags: {},
      reward: null,
      skillCheck: null,
      nextStep: null,
    };

    // 1. skillCheck（如有）
    if (choice.skillCheck) {
      const { attr, difficulty } = choice.skillCheck;
      const value = stats?.[attr] ?? 50;
      const passed = value >= difficulty;
      result.skillCheck = {
        attr,
        difficulty,
        label: choice.skillCheck.label || "",
        value,
        passed,
      };
    }

    // 2. 处理 effects（支持对象和数组两种格式）
    const eff = choice.effects;
    if (Array.isArray(eff)) {
      for (const e of eff) {
        if (!e || typeof e !== "object") continue;
        if (e.type === "affection") {
          const npcId = String(e.target || "").replace(/_affection$/, "");
          if (npcId) result.affinityChange[npcId] = (result.affinityChange[npcId] || 0) + (e.delta || 0);
        } else if (e.type === "attr") {
          if (e.target) result.effects[e.target] = (result.effects[e.target] || 0) + (e.delta || 0);
        } else if (e.type === "flag") {
          if (e.key) result.extraFlags[e.key] = e.value;
        } else if (e.type === "redPacket") {
          result.effects._redPacket = (result.effects._redPacket || 0) + (e.delta || 0);
        } else if (e.type === "item") {
          if (e.id) this.addItem({ id: e.id, name: e.name || e.id, desc: e.desc || "" });
        }
      }
    } else if (eff && typeof eff === "object") {
      for (const [k, v] of Object.entries(eff)) {
        result.effects[k] = (result.effects[k] || 0) + (v || 0);
      }
    }

    // 3. affinityChange 直接写在 choice 上的情况
    if (choice.affinityChange && typeof choice.affinityChange === "object") {
      for (const [npcId, delta] of Object.entries(choice.affinityChange)) {
        result.affinityChange[npcId] = (result.affinityChange[npcId] || 0) + delta;
      }
    }

    // 4. setFlags（用于标记支线完成、解锁条件等）
    if (choice.setFlags && typeof choice.setFlags === "object") {
      for (const [k, v] of Object.entries(choice.setFlags)) {
        result.extraFlags[k] = v;
      }
    }

    // 5. 自动标记 step1_done（用于触发下一步的 auto 步骤）
    if (state.currentStepIdx === 0) {
      result.extraFlags[`${sqId}_step1_done`] = true;
    }

    // 6. 决定状态：失败 > 完成 > 推进
    if (choice.failed === true) {
      state.status = "failed";
      this.failedQuests.add(sqId);
      this.activeQuests.delete(sqId);
      result.failed = true;
    } else if (choice.completion === true) {
      state.status = "completed";
      this.completedQuests.add(sqId);
      this.activeQuests.delete(sqId);
      result.completed = true;

      // 给奖励
      if (choice.reward?.type === "item") {
        this.addItem({
          id: choice.reward.id,
          name: choice.reward.name,
          desc: choice.reward.desc || "",
        });
        result.reward = choice.reward;
      }
    } else if (choice.nextStep) {
      const nextIdx = sq.steps.findIndex(s => s.id === choice.nextStep);
      if (nextIdx >= 0) {
        state.currentStepIdx = nextIdx;
        const nextStep = sq.steps[nextIdx];

        // 检查下一步是否为终态
        if (nextStep.completion === true) {
          state.status = "completed";
          this.completedQuests.add(sqId);
          this.activeQuests.delete(sqId);
          result.completed = true;
          if (nextStep.reward?.type === "item") {
            this.addItem(nextStep.reward);
            result.reward = nextStep.reward;
          }
        } else if (nextStep.failed === true) {
          state.status = "failed";
          this.failedQuests.add(sqId);
          this.activeQuests.delete(sqId);
          result.failed = true;
        } else {
          result.nextStep = nextStep;
        }
      } else {
        console.warn(`[sideQuest] 找不到 nextStep: ${choice.nextStep} in ${sqId}`);
      }
    } else {
      // 没有 nextStep/completion/failed → 默认视为完成（一次性支线）
      state.status = "completed";
      this.completedQuests.add(sqId);
      this.activeQuests.delete(sqId);
      result.completed = true;
    }

    this._notify();
    return result;
  }

  /**
   * 道具系统
   */
  addItem(item) {
    if (!item?.id) return false;
    if (this.hasItem(item.id)) return false;
    this.items.push({ ...item });
    return true;
  }

  getItems() {
    return [...this.items];
  }

  hasItem(id) {
    return this.items.some(i => i.id === id);
  }

  useItem(id) {
    const idx = this.items.findIndex(i => i.id === id);
    if (idx >= 0) {
      const [item] = this.items.splice(idx, 1);
      this._notify();
      return item;
    }
    return null;
  }

  /**
   * 查询支线进度
   */
  getQuestProgress(sqId) {
    if (this.completedQuests.has(sqId)) return { status: "completed", pct: 100 };
    if (this.failedQuests.has(sqId)) return { status: "failed", pct: 0 };
    const state = this.activeQuests.get(sqId);
    if (state) {
      const sq = SIDE_QUESTS[sqId];
      const total = sq.steps.length;
      const cur = state.currentStepIdx + 1;
      return {
        status: state.status,
        pct: Math.round((cur / total) * 100),
        stepTitle: sq.steps[state.currentStepIdx]?.title || "",
      };
    }
    return { status: "locked", pct: 0 };
  }

  /**
   * 获取所有支线进度（用于侧栏 UI）
   */
  getAllProgress() {
    const result = [];
    for (const [sqId, sq] of Object.entries(SIDE_QUESTS)) {
      result.push({
        ...sq,
        progress: this.getQuestProgress(sqId),
      });
    }
    return result;
  }

  /**
   * 状态查询
   */
  isActive(sqId) {
    return this.activeQuests.has(sqId);
  }
  isCompleted(sqId) {
    return this.completedQuests.has(sqId);
  }
  isFailed(sqId) {
    return this.failedQuests.has(sqId);
  }
  getActiveCount() {
    return this.activeQuests.size;
  }
  getCompletedCount() {
    return this.completedQuests.size;
  }
  getFailedCount() {
    return this.failedQuests.size;
  }

  /**
   * 内部：触发更新回调
   */
  _notify() {
    try {
      if (typeof this.onUpdate === "function") this.onUpdate();
    } catch (e) {
      console.warn("[sideQuest] onUpdate error", e);
    }
  }
}