// Test the new 15-outcome system
import { OUTCOMES, OUTCOME_CATEGORIES, DEFAULT_OUTCOME } from "./data/outcomes.js";
import { computeStats, determineOutcome, getOutcomePreview } from "./js/engine/outcomeEngine.js";

console.log("===== Test 1: 15 outcomes loaded =====");
const outcomeIds = Object.keys(OUTCOMES);
console.log(`Total outcomes: ${outcomeIds.length}`);
console.log("Outcome IDs:");
outcomeIds.forEach((id) => console.log(`  - ${id}: ${OUTCOMES[id].title} (${OUTCOMES[id].category})`));
console.log("Categories:", OUTCOME_CATEGORIES);

if (outcomeIds.length !== 15) {
  console.error(`❌ Expected 15 outcomes, got ${outcomeIds.length}`);
  process.exit(1);
} else {
  console.log("✅ 15 outcomes loaded successfully");
}

console.log("\n===== Test 2: Each outcome has condition function =====");
let allHaveCondition = true;
for (const [id, outcome] of Object.entries(OUTCOMES)) {
  if (typeof outcome.condition !== "function") {
    console.error(`❌ Outcome ${id} missing condition function`);
    allHaveCondition = false;
  }
  if (!outcome.title || !outcome.emoji || !outcome.description || !outcome.body) {
    console.error(`❌ Outcome ${id} missing required fields (title/emoji/description/body)`);
    allHaveCondition = false;
  }
}
if (allHaveCondition) console.log("✅ All outcomes have condition function and required fields");

console.log("\n===== Test 3: Default outcome =====");
console.log("DEFAULT_OUTCOME:", DEFAULT_OUTCOME.title);

console.log("\n===== Test 4: computeStats =====");
const stats1 = computeStats({
  attributes: {
    family: 80,
    career: 75,
    independence: 85,
    romance: 75,
    resilience: 70,
  },
  npc_mom_affection: 75,
  npc_ex_affection: 85,
  npc_blind_date_affection: 50,
  redPacket: 500,
  flags: { reconciled_ex: false },
});
console.log("Stats1 attributes:", stats1.attributes);
console.log("Stats1 affection:", stats1.affection);
console.log("Stats1 redPacket:", stats1.redPacket);
console.log("Stats1 flags:", stats1.flags);

console.log("\n===== Test 5: determineOutcome - all-win scenario =====");
const outcome1 = determineOutcome({
  attributes: {
    family: 80,
    career: 75,
    independence: 60,
    romance: 75,
    resilience: 70,
  },
  npc_mom_affection: 75,
  npc_ex_affection: 50,
  npc_blind_date_affection: 50,
  redPacket: 1000,
});
console.log("Triggered outcome:", outcome1.title, "(", outcome1.category, ")");
if (outcome1.id === "outcome_mixed_all_win") {
  console.log("✅ All-win outcome triggered correctly");
} else {
  console.log("⚠ Expected outcome_mixed_all_win, got:", outcome1.id);
}

console.log("\n===== Test 6: determineOutcome - family harmony =====");
const outcome2 = determineOutcome({
  attributes: {
    family: 80,
    career: 50,
    independence: 60,
    romance: 50,
    resilience: 60,
  },
  npc_mom_affection: 75,
  npc_ex_affection: 30,
  npc_blind_date_affection: 30,
  redPacket: 1000,
});
console.log("Triggered outcome:", outcome2.title, "(", outcome2.category, ")");
if (outcome2.id === "outcome_family_harmony") {
  console.log("✅ Family harmony outcome triggered correctly");
} else {
  console.log("⚠ Expected outcome_family_harmony, got:", outcome2.id);
}

console.log("\n===== Test 7: determineOutcome - family dependent =====");
const outcome3 = determineOutcome({
  attributes: {
    family: 20,
    career: 30,
    independence: 30,
    romance: 30,
    resilience: 30,
  },
  npc_mom_affection: 30,
  npc_ex_affection: 30,
  npc_blind_date_affection: 30,
  redPacket: 15000,
});
console.log("Triggered outcome:", outcome3.title, "(", outcome3.category, ")");
if (outcome3.id === "outcome_family_dependent") {
  console.log("✅ Family dependent outcome triggered correctly");
} else {
  console.log("⚠ Expected outcome_family_dependent, got:", outcome3.id);
}

console.log("\n===== Test 8: determineOutcome - reconcile =====");
const outcome4 = determineOutcome({
  attributes: {
    family: 50,
    career: 30, // low career to avoid mixed_love_sacrifice
    independence: 50,
    romance: 75,
    resilience: 60,
  },
  npc_mom_affection: 50,
  npc_ex_affection: 85,
  npc_blind_date_affection: 30,
  redPacket: 1000,
  flags: { reconciled_ex: true },
});
console.log("Triggered outcome:", outcome4.title, "(", outcome4.category, ")");
if (outcome4.id === "outcome_romance_reconcile") {
  console.log("✅ Romance reconcile outcome triggered correctly");
} else {
  console.log("⚠ Expected outcome_romance_reconcile, got:", outcome4.id);
}

console.log("\n===== Test 9: determineOutcome - career quit dream =====");
const outcome5 = determineOutcome({
  attributes: {
    family: 50,
    career: 50,
    independence: 90,
    romance: 50,
    resilience: 80,
  },
  npc_mom_affection: 50,
  npc_ex_affection: 30,
  npc_blind_date_affection: 30,
  redPacket: 1000,
});
console.log("Triggered outcome:", outcome5.title, "(", outcome5.category, ")");
if (outcome5.id === "outcome_career_quit_dream") {
  console.log("✅ Career quit dream outcome triggered correctly");
} else {
  console.log("⚠ Expected outcome_career_quit_dream, got:", outcome5.id);
}

console.log("\n===== Test 10: determineOutcome - career lie flat =====");
const outcome6 = determineOutcome({
  attributes: {
    family: 50,
    career: 30,
    independence: 30,
    romance: 30,
    resilience: 20,
  },
  npc_mom_affection: 30,
  npc_ex_affection: 30,
  npc_blind_date_affection: 30,
  redPacket: 100,
});
console.log("Triggered outcome:", outcome6.title, "(", outcome6.category, ")");
if (outcome6.id === "outcome_career_lie_flat") {
  console.log("✅ Career lie flat outcome triggered correctly");
} else {
  console.log("⚠ Expected outcome_career_lie_flat, got:", outcome6.id);
}

console.log("\n===== Test 11: determineOutcome - blind date success =====");
const outcome7 = determineOutcome({
  attributes: {
    family: 50,
    career: 60,
    independence: 60,
    romance: 65,
    resilience: 60,
  },
  npc_mom_affection: 50,
  npc_ex_affection: 30,
  npc_blind_date_affection: 85,
  redPacket: 1000,
});
console.log("Triggered outcome:", outcome7.title, "(", outcome7.category, ")");
if (outcome7.id === "outcome_romance_blind_date_success") {
  console.log("✅ Blind date success outcome triggered correctly");
} else {
  console.log("⚠ Expected outcome_romance_blind_date_success, got:", outcome7.id);
}

console.log("\n===== Test 12: determineOutcome - single happy =====");
const outcome8 = determineOutcome({
  attributes: {
    family: 50,
    career: 50,
    independence: 80,
    romance: 40,
    resilience: 60,
  },
  npc_mom_affection: 50,
  npc_ex_affection: 30,
  npc_blind_date_affection: 30,
  redPacket: 1000,
});
console.log("Triggered outcome:", outcome8.title, "(", outcome8.category, ")");
if (outcome8.id === "outcome_romance_single_happy") {
  console.log("✅ Single happy outcome triggered correctly");
} else {
  console.log("⚠ Expected outcome_romance_single_happy, got:", outcome8.id);
}

console.log("\n===== Test 13: determineOutcome - career promotion =====");
const outcome9 = determineOutcome({
  attributes: {
    family: 50,
    career: 85,
    independence: 50,
    romance: 50,
    resilience: 60,
  },
  npc_mom_affection: 60,
  npc_ex_affection: 30,
  npc_blind_date_affection: 30,
  redPacket: 1000,
});
console.log("Triggered outcome:", outcome9.title, "(", outcome9.category, ")");
if (outcome9.id === "outcome_career_promotion") {
  console.log("✅ Career promotion outcome triggered correctly");
} else {
  console.log("⚠ Expected outcome_career_promotion, got:", outcome9.id);
}

console.log("\n===== Test 14: determineOutcome - hometown startup =====");
const outcome10 = determineOutcome({
  attributes: {
    family: 50,
    career: 70,
    independence: 50,
    romance: 50,
    resilience: 60,
  },
  npc_mom_affection: 70,
  npc_ex_affection: 30,
  npc_blind_date_affection: 30,
  redPacket: 1000,
  flags: { completed_grandma_wish: true },
});
console.log("Triggered outcome:", outcome10.title, "(", outcome10.category, ")");
if (outcome10.id === "outcome_career_hometown_startup") {
  console.log("✅ Hometown startup outcome triggered correctly");
} else {
  console.log("⚠ Expected outcome_career_hometown_startup, got:", outcome10.id);
}

console.log("\n===== Test 15: determineOutcome - family escape =====");
const outcome11 = determineOutcome({
  attributes: {
    family: 30,
    career: 75,
    independence: 85,
    romance: 40,
    resilience: 60,
  },
  npc_mom_affection: 30,
  npc_ex_affection: 30,
  npc_blind_date_affection: 30,
  redPacket: 1000,
});
console.log("Triggered outcome:", outcome11.title, "(", outcome11.category, ")");
if (outcome11.id === "outcome_family_escape") {
  console.log("✅ Family escape outcome triggered correctly");
} else {
  console.log("⚠ Expected outcome_family_escape, got:", outcome11.id);
}

console.log("\n===== Test 16: determineOutcome - flash marriage regret =====");
const outcome12 = determineOutcome({
  attributes: {
    family: 50,
    career: 50,
    independence: 50,
    romance: 60,
    resilience: 30,
  },
  npc_mom_affection: 50,
  npc_ex_affection: 30,
  npc_blind_date_affection: 95,
  redPacket: 1000,
});
console.log("Triggered outcome:", outcome12.title, "(", outcome12.category, ")");
if (outcome12.id === "outcome_romance_flash_marriage_regret") {
  console.log("✅ Flash marriage regret outcome triggered correctly");
} else {
  console.log("⚠ Expected outcome_romance_flash_marriage_regret, got:", outcome12.id);
}

console.log("\n===== Test 17: determineOutcome - long distance =====");
const outcome13 = determineOutcome({
  attributes: {
    family: 50,
    career: 70,
    independence: 50,
    romance: 60,
    resilience: 60,
  },
  npc_mom_affection: 50,
  npc_ex_affection: 30,
  npc_blind_date_affection: 70,
  redPacket: 1000,
});
console.log("Triggered outcome:", outcome13.title, "(", outcome13.category, ")");
if (outcome13.id === "outcome_romance_long_distance") {
  console.log("✅ Long distance outcome triggered correctly");
} else {
  console.log("⚠ Expected outcome_romance_long_distance, got:", outcome13.id);
}

console.log("\n===== Test 18: getOutcomePreview =====");
const previews = getOutcomePreview({
  attributes: {
    family: 60,
    career: 70,
    independence: 75,
    romance: 60,
    resilience: 65,
  },
  npc_mom_affection: 60,
  npc_ex_affection: 30,
  npc_blind_date_affection: 30,
  redPacket: 1000,
}, 3);
console.log("Top 3 outcomes:");
previews.forEach((p) => console.log(`  - ${p.emoji} ${p.title} (${p.category}) [${p.triggered ? "已触发" : p.probability + "%"}]`));

console.log("\n===== Test 19: redPacket top-level access =====");
const stats14 = computeStats({
  attributes: { family: 50 },
  redPacket: 15000,
});
console.log("stats.redPacket:", stats14.redPacket);
if (stats14.redPacket === 15000) {
  console.log("✅ Top-level redPacket access works");
} else {
  console.log("❌ Top-level redPacket access failed");
}

console.log("\n===== Test 20: forced outcomes =====");
const outcome15 = determineOutcome({
  attributes: {
    family: 50,
    career: 50,
    independence: 80,
    romance: 40,
    resilience: 60,
  },
  npc_mom_affection: 50,
  npc_ex_affection: 30,
  npc_blind_date_affection: 30,
  redPacket: 1000,
  flags: { _forcedOutcomes: ["outcome_career_hometown_startup"] },
});
console.log("Forced outcome:", outcome15.title);

console.log("\n===== All tests completed =====");
