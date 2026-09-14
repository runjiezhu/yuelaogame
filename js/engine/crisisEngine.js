// crisisEngine.js - 随机危机事件引擎
// v1: 触发条件过滤 + 加权随机选择 + 技能检定 + 单日单次
//
// 设计要点：
//   - 每个 crisis 每天最多触发 1 次（通过 stats.flags.todayCrisis 控制）
//   - 每个 crisis 全程只触发 1 次（通过 stats.triggeredCrisisIds 控制）
//   - 技能检定（skillCheck）：玩家属性 >= 难度时返回 true
//   - applyChoice: 应用选项 effects 到 stats（消耗精力 + 处理技能检定反馈）

import { CRISIS_EVENTS } from "../../data/crisis_events.js";
import {
  applyEffects,
  getAttribute,
} from "./statSystem.js";

// 危机触发概率（可由 eventEngine 调整）
export const CRISIS_TRIGGER_RATE = 0.10;

export class CrisisEngine {
  constructor() {
    this.activeCrisis = null;
  }

  // 是否可以触发危机
  canTrigger(stats) {
    // 每天最多触发 1 个危机
    if (stats.flags?.todayCrisis) return false;
    // 必须存在至少一个可用危机
    return this.getAvailableCrises(stats).length > 0;
  }

  // 获取当前 stats 下可用的危机列表（已排除已触发的 + 不满足条件的）
  getAvailableCrises(stats) {
    const triggeredSet = new Set(stats.triggeredCrisisIds ?? []);
    return CRISIS_EVENTS.filter((c) => {
      if (triggeredSet.has(c.id)) return false;
      if (c.condition && !c.condition(stats)) return false;
      return true;
    });
  }

  // 根据权重加权随机选择一个可用危机
  selectCrisis(stats) {
    const available = this.getAvailableCrises(stats);
    if (available.length === 0) return null;

    const totalWeight = available.reduce((sum, c) => sum + (c.triggerWeight ?? 1), 0);
    let rand = Math.random() * totalWeight;

    for (const crisis of available) {
      rand -= (crisis.triggerWeight ?? 1);
      if (rand <= 0) return crisis;
    }
    return available[0];
  }

  // 激活一个危机（标记为今日已触发）
  trigger(crisis, stats) {
    this.activeCrisis = crisis;
    // 标记该危机为已触发（全程不再出现）
    const triggered = [...(stats.triggeredCrisisIds ?? []), crisis.id];
    // 标记今日已触发危机
    const flags = { ...(stats.flags ?? {}), todayCrisis: true };
    return {
      ...stats,
      triggeredCrisisIds: triggered,
      flags,
    };
  }

  // 应用危机的某个选择，返回更新后的 stats + 反馈文本
  applyChoice(stats, crisis, choiceIndex) {
    const choice = crisis.choices[choiceIndex];
    if (!choice) {
      console.warn(`[crisisEngine] choice ${choiceIndex} not found in ${crisis.id}`);
      return { stats, feedback: "", success: null, effects: [] };
    }

    // 1) 扣除精力成本（energyCost 是静态扣除，不算在 effects 里）
    let next = { ...stats };
    if (choice.energyCost && choice.energyCost > 0) {
      if (!next.attributes) next.attributes = {};
      const cur = next.attributes.energy ?? 100;
      next.attributes.energy = Math.max(0, cur - choice.energyCost);
    }

    // 2) 技能检定
    let success = null;
    if (choice.skillCheck) {
      const attrValue = getAttribute(stats, choice.skillCheck.attr);
      success = attrValue >= choice.skillCheck.difficulty;
    }

    // 3) 应用 effects（让 statSystem.applyEffects 处理数组 / 扁平对象）
    const effectsToApply = Array.isArray(choice.effects) ? choice.effects : (choice.effects ?? []);
    next = applyEffects(next, { effects: effectsToApply });

    // 4) 确定反馈文本
    let feedback = "";
    if (typeof choice.feedback === "string") {
      feedback = choice.feedback;
    } else if (choice.feedback && typeof choice.feedback === "object") {
      feedback = success ? choice.feedback.success : choice.feedback.fail;
    }

    this.activeCrisis = null;
    return { stats: next, feedback, success, effects: effectsToApply };
  }

  // 清除今日标记（每天开始时由 gameState 调用）
  clearDailyFlag(stats) {
    if (!stats.flags?.todayCrisis) return stats;
    const flags = { ...stats.flags };
    delete flags.todayCrisis;
    return { ...stats, flags };
  }

  getActiveCrisis() {
    return this.activeCrisis;
  }
}