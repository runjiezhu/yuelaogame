// gameState.js - 本地存档管理（localStorage）
const SAVE_KEY = "yuelao_save_v1";

export function createNewGameState(profile) {
  return {
    profile,
    currentStats: {
      gender:     profile.stats.gender,
      age:        profile.stats.age ?? 25,
      cityTier:   profile.stats.cityTier ?? "新一线",
      assetTier:  profile.stats.assetTier ?? "普通",
      eduTier:    profile.stats.eduTier ?? "普通本科",
      looksTier:  profile.stats.looksTier ?? "普通",
      incomeTier: profile.stats.incomeTier ?? "10-30万",
      confidence: profile.stats.confidence ?? 50,
      social:     profile.stats.social ?? 50,
      triggeredEventIds: [],
    },
    chaptersPlayed: 0,
    currentView: "stats",
    pendingEvent: null,
  };
}

export function saveGame(state) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("[yuelao] 存档失败", e);
  }
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function hasSave() {
  return localStorage.getItem(SAVE_KEY) !== null;
}

export function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (e) {}
}
