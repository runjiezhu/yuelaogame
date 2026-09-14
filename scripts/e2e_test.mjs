// e2e_test.mjs - 端到端测试：验证引擎能正常工作
import { generateOpeningProfile, rerollProfile } from "../js/engine/randomProfile.js";
import { applyEffects, getPhase, shouldTriggerEnding, ageToBand, normGender } from "../js/engine/statSystem.js";
import { createNewGameState, saveGame, loadGame, hasSave, clearSave } from "../js/engine/gameState.js";
import { nextStep } from "../js/engine/eventEngine.js";

console.log("===== 月老养成 端到端测试 =====\n");

// 1. 数据完整性检查
const { ARCHETYPES } = await import("../data/archetypes.js");
const { EVENTS }     = await import("../data/events.js");
const { ENDINGS }    = await import("../data/endings.js");
console.log(`[1] archetype 数量: ${ARCHETYPES.length}`);
console.log(`[2] event 数量: ${EVENTS.length}`);
console.log(`[3] ending 数量: ${ENDINGS.length}`);
console.log("");

// 2. 性别归一化
console.log("[4] 性别归一化测试:");
console.log(`    normGender('F')  = ${normGender("F")} (期望: 女)`);
console.log(`    normGender('M')  = ${normGender("M")} (期望: 男)`);
console.log(`    normGender('女') = ${normGender("女")} (期望: 女)`);
console.log("");

// 3. 随机角色卡生成
console.log("[5] 随机角色卡生成测试:");
for (let i = 0; i < 3; i++) {
  const p = generateOpeningProfile();
  console.log(`    ${p.emoji} ${p.name} | ${p.stats.gender}/${p.stats.age}岁/${p.stats.cityTier}`);
}
console.log("");

// 4. 属性效果应用
console.log("[6] applyEffects 测试:");
const base = { age: 25, confidence: 50, social: 50, incomeTier: "10-30万", looksTier: "普通" };
const after = applyEffects(base, { age: 2, confidence: 8, social: -5, incomeTier: true });
console.log(`    {age:25, conf:50, social:50} + {age:+2, conf:+8, social:-5}`);
console.log(`    → {age:${after.age}, conf:${after.confidence}, social:${after.social}}`);
console.log("");

// 5. 完整 playthrough
console.log("===== 完整 playthrough 模拟 =====\n");
const profile = generateOpeningProfile();
console.log(`起始: ${profile.name} | ${profile.stats.age}岁 | ${profile.stats.cityTier}`);
console.log(`核心困境: ${profile.coreIssue}\n`);

let state = createNewGameState(profile);
let chapters = 0;
let maxChapters = 7;

while (chapters < maxChapters) {
  const result = nextStep(state.currentStats, chapters, state.currentStats.triggeredEventIds || []);

  if (result.type === "ending") {
    console.log(`\n>>> 触发结局: ${result.ending.name}`);
    console.log(`>>> ${result.ending.insight}`);
    break;
  }

  const event = result.event;
  chapters++;
  console.log(`[第 ${chapters} 章] ${event.title}`);

  // 提取剧情第一行
  const firstLine = (event.body || "").split("\n")[0];
  if (firstLine) console.log(`剧情: ${firstLine.slice(0, 60)}...`);

  // 默认选第一个选项
  if (event.choices?.length) {
    const choice = event.choices[0];
    const prevAge = state.currentStats.age;
    state.currentStats = applyEffects(state.currentStats, choice.effects);
    state.chaptersPlayed = chapters;
    state.currentStats.triggeredEventIds = [...(state.currentStats.triggeredEventIds || []), event.id];

    const ageAfter = state.currentStats.age;
    const confAfter = state.currentStats.confidence;
    const socialAfter = state.currentStats.social ?? 50;
    console.log(`>>> 选择 [${choice.text}] 后属性变化:`);
    console.log(`    年龄: ${prevAge} → ${ageAfter} | 自信: ${confAfter} | 社交: ${socialAfter}\n`);
  }
}

console.log("===== 测试完成 =====");
console.log(`总章节数: ${chapters}`);
if (state) {
  console.log(`最终年龄: ${state.currentStats.age}`);
  console.log(`最终自信: ${state.currentStats.confidence} | 社交: ${state.currentStats.social ?? 50}`);
}
