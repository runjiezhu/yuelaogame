// randomProfile.js - 随机生成开局画像
import { ARCHETYPES } from "../../data/archetypes.js";

function weightedRandom(items) {
  const total = items.reduce((s, i) => s + (i.weight ?? 1), 0);
  let r = Math.random() * total;
  for (const item of items) {
    r -= (item.weight ?? 1);
    if (r <= 0) return item;
  }
  return items[items.length - 1];
}

export function generateOpeningProfile(exclude = null) {
  const pool = exclude ? ARCHETYPES.filter(a => a.id !== exclude.id) : ARCHETYPES;
  const arch = weightedRandom(pool);
  return {
    id: arch.id,
    name: arch.name,
    emoji: arch.emoji,
    tags: arch.tags ?? [],
    backstory: arch.backstory,
    coreIssue: arch.coreIssue,
    stats: {
      ...arch.stats,
      confidence: arch.stats.confidence ?? 50,
      social: arch.stats.social ?? 50,
    },
  };
}

export function rerollProfile(current) {
  return generateOpeningProfile(current);
}
