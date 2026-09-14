// Integration test for time-slot activity flow
import {
  DAILY_ACTIVITIES,
  ACTIVITY_GROUPS,
  TIME_SLOTS,
  isActivityAvailable,
  getDisabledReason,
} from "./data/daily_activities.js";
import { applyActivityEffect, shouldTriggerEnding } from "./js/engine/statSystem.js";

let failures = 0;
function expect(condition, msg) {
  if (condition) {
    console.log(`OK ${msg}`);
  } else {
    console.log(`FAIL ${msg}`);
    failures++;
  }
}

console.log("=== Test 1: All activities have required fields ===");
for (const [id, a] of Object.entries(DAILY_ACTIVITIES)) {
  expect(typeof a.label === "string" && a.label.length > 0, `${id}.label is non-empty string`);
  expect(typeof a.desc === "string" && a.desc.length > 0, `${id}.desc is non-empty string`);
  expect(typeof a.energyCost === "number", `${id}.energyCost is number`);
  expect(typeof a.available === "function", `${id}.available is function`);
  expect(a.effect !== undefined || a.attrEffect !== undefined || a.energyCost !== 0 || a.redPacketCost, `${id} has some effect defined`);
}

console.log("\n=== Test 2: ACTIVITY_GROUPS references valid activities ===");
const allIds = new Set(Object.keys(DAILY_ACTIVITIES));
for (const g of ACTIVITY_GROUPS) {
  for (const id of g.activities) {
    expect(allIds.has(id), `group references ${id}`);
  }
}

console.log("\n=== Test 3: Each activity belongs to exactly one group ===");
const seenInGroups = new Set();
for (const g of ACTIVITY_GROUPS) {
  for (const id of g.activities) {
    expect(!seenInGroups.has(id), `${id} not already in another group`);
    seenInGroups.add(id);
  }
}
const missing = [...allIds].filter(id => !seenInGroups.has(id));
expect(missing.length === 0, `all activities are in a group`);

console.log("\n=== Test 4: TIME_SLOTS has 3 slots ===");
expect(TIME_SLOTS.length === 3, `TIME_SLOTS has 3 entries`);

console.log("\n=== Test 5: isActivityAvailable works correctly ===");
const initialStats = {
  day: 1,
  energy: 100,
  maxEnergy: 100,
  redPacket: 5000,
  currentMainQuestIndex: 0,
  npcs: { npc_mom: 50, npc_dad: 50, npc_grandma: 50, npc_bestie: 30, npc_ex: 20 }
};

expect(!isActivityAvailable(DAILY_ACTIVITIES.visit_mom, initialStats), "visit_mom unavailable on day 1");
const day2 = { ...initialStats, day: 2 };
expect(isActivityAvailable(DAILY_ACTIVITIES.visit_mom, day2), "visit_mom available on day 2");
const noEnergy = { ...day2, energy: 0 };
expect(!isActivityAvailable(DAILY_ACTIVITIES.exercise, noEnergy), "exercise unavailable with 0 energy");
const lowEnergy = { ...day2, energy: 50 };
expect(isActivityAvailable(DAILY_ACTIVITIES.nap, lowEnergy), "nap available with low energy");
expect(!isActivityAvailable(DAILY_ACTIVITIES.nap, day2), "nap unavailable with full energy");
const poorStats = { ...day2, redPacket: 100 };
expect(!isActivityAvailable(DAILY_ACTIVITIES.buy_gift, poorStats), "buy_gift unavailable with 100 redPacket");
expect(isActivityAvailable(DAILY_ACTIVITIES.buy_gift, day2), "buy_gift available with 5000 redPacket");

console.log("\n=== Test 6: getDisabledReason returns proper messages ===");
expect(getDisabledReason(DAILY_ACTIVITIES.visit_mom, initialStats) === "\u672a\u89e3\u9501", "visit_mom reason");
expect(getDisabledReason(DAILY_ACTIVITIES.exercise, noEnergy)?.includes("\u7cbe\u529b\u4e0d\u8db3"), "exercise reason includes");
expect(getDisabledReason(DAILY_ACTIVITIES.buy_gift, poorStats)?.includes("\u7ea2\u5305\u4e0d\u591f"), "buy_gift reason includes");

console.log("\n=== Test 7: applyActivityEffect correctly applies effects ===");
let stats = { ...day2, energy: 80 };

let r = applyActivityEffect(stats, DAILY_ACTIVITIES.read_book);
expect(r.changes.length >= 3, "read_book returns 3+ changes");
expect(r.stats.career === 58, `career went from 50 to 58 (got ${r.stats.career})`);
expect(r.stats.independence === 53, `independence went from 50 to 53 (got ${r.stats.independence})`);
expect(r.stats.energy === 65, `energy went from 80 to 65 (got ${r.stats.energy})`);

stats = r.stats;
r = applyActivityEffect(stats, DAILY_ACTIVITIES.visit_mom);
expect(r.stats.npcs.npc_mom === 65, `npc_mom went from 50 to 65 (got ${r.stats.npcs.npc_mom})`);
expect(r.stats.independence === 55, `independence 53 + 2 = 55 (got ${r.stats.independence})`);

const tired = { ...stats, energy: 40 };
r = applyActivityEffect(tired, DAILY_ACTIVITIES.nap);
expect(r.stats.energy === 70, `nap energy 40 + 30 = 70 (got ${r.stats.energy})`);
const energyChanges = r.changes.filter(c => c.type === "energy");
expect(energyChanges.length === 1, `nap returns 1 energy change`);

const rich = { ...stats, energy: 100, redPacket: 5000, npcs: { ...stats.npcs, npc_mom: 50 }, family: 50 };
r = applyActivityEffect(rich, DAILY_ACTIVITIES.buy_gift);
expect(r.stats.redPacket === 2000, `buy_gift redPacket 5000 - 3000 = 2000`);
expect(r.stats.family === 75, `buy_gift family 50 + 25 = 75`);
expect(r.stats.npcs.npc_mom === 80, `buy_gift npc_mom 50 + 30 = 80`);
const redPacketChanges = r.changes.filter(c => c.type === "redPacket");
expect(redPacketChanges.length === 1, `buy_gift returns 1 redPacket change`);

r = applyActivityEffect(rich, DAILY_ACTIVITIES.treat_family);
expect(r.stats.redPacket === 4500, `treat_family redPacket 5000 - 500 = 4500`);
expect(r.stats.npcs.npc_mom === 65, `treat_family npc_mom 50 + 15 = 65`);
expect(r.stats.npcs.npc_dad === 65, `treat_family npc_dad 50 + 15 = 65`);

console.log("\n=== Test 8: mainline activity advances quest index ===");
const mainStats = { ...day2, currentMainQuestIndex: 5, mainQuestProgress: 5 };
r = applyActivityEffect(mainStats, DAILY_ACTIVITIES.mainline);
expect(r.stats.currentMainQuestIndex === 6, `mainline advances index to 6`);
expect(r.stats.mainQuestProgress === 6, `mainline advances progress to 6`);
const mainChanges = r.changes.filter(c => c.type === "mainline");
expect(mainChanges.length === 1, `mainline returns 1 mainline change`);

console.log("\n=== Test 9: shopping activity with redPacketCost + attrEffect ===");
r = applyActivityEffect(rich, DAILY_ACTIVITIES.shopping);
expect(r.stats.redPacket === 4800, `shopping redPacket 5000 - 200 = 4800`);
expect(r.stats.family === 60, `shopping family 50 + 10 = 60`);

console.log("\n=== Test 10: stay_up negative effects ===");
r = applyActivityEffect(rich, DAILY_ACTIVITIES.stay_up);
expect(r.stats.energy === 80, `stay_up energy 100 - 20 = 80`);
expect(r.stats.career === 45, `stay_up career 50 - 5 = 45`);

console.log("\n=== Test 11: Energy bounds ===");
const highEnergy = { ...rich, energy: 100, maxEnergy: 100 };
r = applyActivityEffect(highEnergy, DAILY_ACTIVITIES.nap);
expect(r.stats.energy === 100, `nap at full energy stays at 100`);

const almostEmpty = { ...rich, energy: 5, maxEnergy: 100 };
r = applyActivityEffect(almostEmpty, DAILY_ACTIVITIES.exercise);
expect(r.stats.energy === 0, `exercise clamps to 0 when insufficient`);

console.log("\n=== Test 12: Original stats object not mutated ===");
const originalNpcs = { npc_mom: 50 };
const originalStats = { ...day2, energy: 100, npcs: originalNpcs };
r = applyActivityEffect(originalStats, DAILY_ACTIVITIES.visit_mom);
expect(originalNpcs.npc_mom === 50, `original stats.npcs.npc_mom not mutated (got ${originalNpcs.npc_mom})`);
expect(r.stats.npcs.npc_mom === 65, `returned stats has npc_mom = 65`);

console.log("\n=== Test 13: All stat changes have proper structure ===");
for (const [id, a] of Object.entries(DAILY_ACTIVITIES)) {
  const stats2 = { ...day2, energy: 100, maxEnergy: 100, redPacket: 5000 };
  const r = applyActivityEffect(stats2, a);
  for (const c of r.changes) {
    if (c.type === "ui") continue;
    expect(typeof c.label === "string", `${id} change has label`);
    expect(typeof c.delta === "number", `${id} change has numeric delta`);
  }
}

console.log("\n=== Final ===");
if (failures === 0) {
  console.log("ALL TESTS PASSED");
} else {
  console.log(`${failures} TESTS FAILED`);
  process.exit(1);
}