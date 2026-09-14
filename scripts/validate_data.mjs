// validate_data.mjs - 数据文件验证
// 检查 archetypes/events/endings 数据是否完整、格式正确
import { ARCHETYPES } from "../data/archetypes.js";
import { EVENTS }     from "../data/events.js";
import { ENDINGS }    from "../data/endings.js";

const REQUIRED_ARCHETYPE_FIELDS = ["id", "name", "emoji", "weight", "stats", "backstory", "coreIssue"];
const REQUIRED_EVENT_FIELDS     = ["id", "title", "trigger", "choices"];
const REQUIRED_ENDING_FIELDS    = ["id", "name", "condition", "body", "insight"];

let errors = 0;

function checkArchetypes() {
  console.log("检查 archetypes.js...");
  for (let i = 0; i < ARCHETYPES.length; i++) {
    const a = ARCHETYPES[i];
    for (const f of REQUIRED_ARCHETYPE_FIELDS) {
      if (a[f] === undefined) {
        console.log(`  ❌ [${i}] 缺少字段: ${f}`);
        errors++;
      }
    }
    // stats 必须有 gender/age/cityTier
    const reqStats = ["gender", "age", "cityTier", "assetTier", "eduTier", "looksTier", "incomeTier"];
    for (const s of reqStats) {
      if (!a.stats || a.stats[s] === undefined) {
        console.log(`  ❌ [${i}] ${a.name} 缺少 stats.${s}`);
        errors++;
      }
    }
    // weight 必须是数字
    if (typeof a.weight !== "number" || a.weight <= 0) {
      console.log(`  ⚠️ [${i}] ${a.name} weight=${a.weight} (应为正数)`);
    }
    // gender 必须是 F/M
    if (a.stats?.gender && !["F", "M"].includes(a.stats.gender)) {
      console.log(`  ⚠️ [${i}] ${a.name} gender=${a.stats.gender} (应为 F/M)`);
    }
  }
  if (errors === 0) console.log(`  ✅ ${ARCHETYPES.length} 个角色卡全部合规`);
}

function checkEvents() {
  console.log("检查 events.js...");
  for (let i = 0; i < EVENTS.length; i++) {
    const e = EVENTS[i];
    for (const f of REQUIRED_EVENT_FIELDS) {
      if (e[f] === undefined) {
        console.log(`  ❌ [${i}] ${e.id} 缺少字段: ${f}`);
        errors++;
      }
    }
    if (e.choices?.length) {
      for (let j = 0; j < e.choices.length; j++) {
        const c = e.choices[j];
        if (!c.text) {
          console.log(`  ❌ [${i}] ${e.id} 选项${j+1}缺少 text`);
          errors++;
        }
        if (!c.effects) {
          console.log(`  ⚠️ [${i}] ${e.id} 选项${j+1}缺少 effects`);
        }
      }
    }
    // trigger.gender 必须是 男/女
    if (e.trigger?.gender) {
      const invalid = e.trigger.gender.filter(g => !["男", "女"].includes(g));
      if (invalid.length) {
        console.log(`  ⚠️ [${i}] ${e.id} trigger.gender 含非中文: ${invalid.join(",")}`);
      }
    }
  }
  if (errors === 0) console.log(`  ✅ ${EVENTS.length} 个事件全部合规`);
}

function checkEndings() {
  console.log("检查 endings.js...");
  for (let i = 0; i < ENDINGS.length; i++) {
    const e = ENDINGS[i];
    for (const f of REQUIRED_ENDING_FIELDS) {
      if (e[f] === undefined) {
        console.log(`  ❌ [${i}] ${e.id} 缺少字段: ${f}`);
        errors++;
      }
    }
  }
  if (errors === 0) console.log(`  ✅ ${ENDINGS.length} 个结局全部合规`);
}

console.log("===== 数据验证 =====\n");
checkArchetypes();
console.log("");
checkEvents();
console.log("");
checkEndings();
console.log("");
if (errors === 0) {
  console.log("✅ 全部验证通过");
} else {
  console.log(`❌ 共 ${errors} 个错误`);
  process.exit(1);
}
