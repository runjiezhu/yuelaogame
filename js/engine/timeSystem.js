// timeSystem.js - 时间系统
// 管理 8 天 × 3 时段（24 个总时段）的时间推进

import { TIME_SLOT_LABELS, getLunarDateLabel } from "../../data/player_stats.js";

// 每个时间段的精力消耗
const TIME_SLOT_ENERGY_COST = {
  0: 10,  // 上午
  1: 15,  // 下午
  2: 20,  // 晚上
};

// 一天结束时恢复的精力（每 3 个时间段）
const DAILY_ENERGY_RECOVERY = 10;

// 总天数
const TOTAL_DAYS = 8;
// 每天时间段数（上午/下午/晚上）
const SLOTS_PER_DAY = 3;

/**
 * 推进到下一时间段
 * - 消耗精力：上午-10，下午-15，晚上-20
 * - 每3个时间段（一整天结束）恢复 10 精力
 * - 时间段循环：上午→下午→晚上→下一天上午
 *
 * @param {Object} stats - 当前玩家状态
 * @returns {Object} 新状态 { stats, advanced, dayEnded, gameEnded }
 */
export function advanceTime(stats) {
  const next = { ...stats };
  const currentSlot = stats.timeSlot ?? 0;
  const currentDay = stats.day ?? 1;
  const totalSlots = stats.timeSlotsTotal ?? 0;

  // 1. 推进时间段
  let newDay = currentDay;
  let newSlot = currentSlot + 1;
  if (newSlot >= SLOTS_PER_DAY) {
    newSlot = 0;
    newDay = currentDay + 1;
  }

  next.day = newDay;
  next.timeSlot = newSlot;
  next.timeSlotsTotal = totalSlots + 1;

  // 2. 消耗精力（消耗当前时间段，因为这是"刚刚经历"的时段）
  const energyCost = TIME_SLOT_ENERGY_COST[currentSlot] ?? 10;
  next.energy = Math.max(0, Math.min(next.maxEnergy ?? 100, (next.energy ?? 100) - energyCost));

  // 3. 一整天结束时恢复精力（newSlot=0 表示新一天开始，即上一天结束）
  let dayEnded = false;
  if (newSlot === 0) {
    next.energy = Math.min(next.maxEnergy ?? 100, (next.energy ?? 0) + DAILY_ENERGY_RECOVERY);
    dayEnded = true;
  }

  // 4. 判断是否到达最大时段
  const gameEnded = next.timeSlotsTotal >= (next.maxTimeSlots ?? 24);

  return {
    stats: next,
    advanced: true,
    dayEnded,
    gameEnded,
  };
}

/**
 * 检查精力是否足够进行某项行动
 * @param {Object} stats - 当前玩家状态
 * @param {number} cost - 行动消耗的精力
 * @returns {boolean}
 */
export function canPerformAction(stats, cost) {
  return (stats.energy ?? 0) >= cost;
}

/**
 * 获取当前时间标签
 * 格式："腊月二十九 · 上午"
 * @param {Object} stats
 * @returns {string}
 */
export function getCurrentTimeLabel(stats) {
  const dayLabel = getLunarDateLabel(stats.day ?? 1);
  const slotLabel = TIME_SLOT_LABELS[stats.timeSlot ?? 0] ?? "未知";
  return `${dayLabel} · ${slotLabel}`;
}

/**
 * 是否到达最后一天（第 8 天）且晚上已结束
 * @param {Object} stats
 * @returns {boolean}
 */
export function isLastDay(stats) {
  // 当 timeSlotsTotal 已经达到 24 时，意味着第 8 天晚上已经结束
  return (stats.timeSlotsTotal ?? 0) >= (stats.maxTimeSlots ?? 24);
}

/**
 * 是否为第 8 天（最后一天）
 * @param {Object} stats
 * @returns {boolean}
 */
export function isFinalDay(stats) {
  return (stats.day ?? 1) >= TOTAL_DAYS;
}

/**
 * 获取时间进度百分比（0-100）
 * @param {Object} stats
 * @returns {number}
 */
export function getTimeProgress(stats) {
  const total = stats.maxTimeSlots ?? 24;
  const current = stats.timeSlotsTotal ?? 0;
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((current / total) * 100)));
}

/**
 * 获取已用/总时段数（用于 HUD 显示 "X/24"）
 * @param {Object} stats
 * @returns {{current: number, total: number}}
 */
export function getTimeSlotProgress(stats) {
  return {
    current: Math.min(stats.timeSlotsTotal ?? 0, stats.maxTimeSlots ?? 24),
    total: stats.maxTimeSlots ?? 24,
  };
}

/**
 * 获取精力信息（用于 HUD 显示）
 * @param {Object} stats
 * @returns {{current: number, max: number, pct: number, level: string, color: string}}
 */
export function getEnergyInfo(stats) {
  const current = Math.max(0, stats.energy ?? 0);
  const max = stats.maxEnergy ?? 100;
  const pct = max > 0 ? Math.round((current / max) * 100) : 0;

  let level = "充沛";
  let color = "#5cb85c"; // 绿
  if (pct < 30) {
    level = "疲惫";
    color = "#C1440E"; // 红
  } else if (pct < 60) {
    level = "疲劳";
    color = "#c9a84c"; // 黄
  }

  return { current, max, pct, level, color };
}

/**
 * 获取每个时间段消耗的精力值
 * @param {number} slot - 时间段 (0/1/2)
 * @returns {number}
 */
export function getEnergyCostForSlot(slot) {
  return TIME_SLOT_ENERGY_COST[slot] ?? 10;
}

export { TIME_SLOT_ENERGY_COST, DAILY_ENERGY_RECOVERY, TOTAL_DAYS, SLOTS_PER_DAY };