// itemSystem.js - 道具系统
// 提供道具定义、获取、使用和管理功能

// ===== 道具定义 =====
export const ITEMS = {
  grandma_charm: {
    id: "grandma_charm",
    name: "奶奶的平安符",
    desc: "一次检定必定成功",
    emoji: "🔮",
    type: "consumable",
    effect: (engine) => {
      engine.forceNextSkillCheckSuccess = true;
    },
    consumeOnUse: true,
  },
  bestie_badge: {
    id: "bestie_badge",
    name: "友谊徽章",
    desc: "好感度提升效果×1.5",
    emoji: "🏅",
    type: "passive",
    effect: (engine) => {
      engine.affectionMultiplier = 1.5;
    },
  },
  dad_cigarette_case: {
    id: "dad_cigarette_case",
    name: "爸爸的旧烟盒",
    desc: "增加所有NPC初始好感+5",
    emoji: "🚬",
    type: "passive",
    effect: (engine) => {
      engine.initAffectionBonus = 5;
    },
  },
  toy_car: {
    id: "toy_car",
    name: "童年玩具车",
    desc: "回忆杀的钥匙道具",
    emoji: "🚗",
    type: "key_item",
  },
  pet_dog: {
    id: "pet_dog",
    name: "小黄",
    desc: "每天给你+5精力",
    emoji: "🐕",
    type: "companion",
    dailyEffect: { type: "energy", delta: 5 },
  },
  house_key: {
    id: "house_key",
    name: "祖屋钥匙",
    desc: "解锁隐藏结局",
    emoji: "🔑",
    type: "key_item",
  },
};

// ===== 道具系统类 =====
export class ItemSystem {
  constructor() {
    this.items = [];
    this.equipped = new Set();
    this.appliedEffects = false;
    // 引擎级变量（由道具效果修改）
    this.forceNextSkillCheckSuccess = false;
    this.affectionMultiplier = 1.0;
    this.initAffectionBonus = 0;
    this.energyBonus = 0;
  }

  // 添加道具到背包
  addItem(itemId) {
    const item = ITEMS[itemId];
    if (!item) {
      console.warn(`[ItemSystem] Unknown item: ${itemId}`);
      return false;
    }

    // 消耗品可以重复添加（带唯一ID）
    if (item.type === "consumable") {
      this.items.push({ ...item, uid: Date.now() + Math.random() });
      console.log(`[ItemSystem] Added consumable: ${item.name}`);
      return true;
    }

    // 非消耗品只能有一个
    if (!this.items.find((i) => i.id === itemId)) {
      this.items.push({ ...item, uid: Date.now() + Math.random() });
      console.log(`[ItemSystem] Added item: ${item.name}`);
      return true;
    }

    console.log(`[ItemSystem] Already have: ${item.name}`);
    return false;
  }

  // 使用道具
  useItem(uid) {
    const idx = this.items.findIndex((i) => i.uid === uid);
    if (idx < 0) return { success: false, message: "道具不存在" };

    const item = this.items[idx];

    // 触发效果
    if (item.effect) {
      item.effect(this);
    }

    // 消耗品使用后删除
    if (item.consumeOnUse) {
      this.items.splice(idx, 1);
      return { success: true, message: `使用了「${item.name}」`, consumed: true };
    }

    return { success: true, message: `装备了「${item.name}」` };
  }

  // 检查是否有某道具
  hasItem(id) {
    return this.items.some((i) => i.id === id);
  }

  // 获取所有道具
  getItems() {
    return this.items;
  }

  // 获取某类型的所有道具
  getItemsByType(type) {
    return this.items.filter((i) => i.type === type);
  }

  // 应用每日效果（如宠物加成）
  applyDailyEffects() {
    const companions = this.getItemsByType("companion");
    companions.forEach((item) => {
      if (item.dailyEffect) {
        if (item.dailyEffect.type === "energy") {
          this.energyBonus += item.dailyEffect.delta;
          console.log(`[ItemSystem] ${item.name} gave +${item.dailyEffect.delta} energy`);
        }
      }
    });
  }

  // 应用被动效果（游戏开始时调用一次）
  applyPassiveEffects() {
    if (this.appliedEffects) return;
    this.appliedEffects = true;

    const passives = this.getItemsByType("passive");
    passives.forEach((item) => {
      if (item.effect) {
        item.effect(this);
        console.log(`[ItemSystem] Applied passive: ${item.name}`);
      }
    });
  }

  // 重置一次性效果标记（如每次检定后重置强制成功）
  resetPerActionFlags() {
    this.forceNextSkillCheckSuccess = false;
  }

  // 获取精力加成
  getEnergyBonus() {
    return this.energyBonus;
  }

  // 获取好感度倍率
  getAffectionMultiplier() {
    return this.affectionMultiplier;
  }

  // 获取初始好感度加成
  getInitAffectionBonus() {
    return this.initAffectionBonus;
  }

  // 获取强制成功标记并重置
  consumeForceSuccess() {
    if (this.forceNextSkillCheckSuccess) {
      this.forceNextSkillCheckSuccess = false;
      return true;
    }
    return false;
  }
}
