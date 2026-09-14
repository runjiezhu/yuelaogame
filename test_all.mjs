// Test by importing all modules
async function test() {
  try {
    const dom = await import("./js/ui/dom.js");
    console.log("dom.js OK");
    const views = await import("./js/ui/views.js");
    console.log("views.js OK");
    const randomProfile = await import("./js/engine/randomProfile.js");
    console.log("randomProfile.js OK");
    const statSystem = await import("./js/engine/statSystem.js");
    console.log("statSystem.js OK");
    const eventEngine = await import("./js/engine/eventEngine.js");
    console.log("eventEngine.js OK");
    const crisisEngine = await import("./js/engine/crisisEngine.js");
    console.log("crisisEngine.js OK");
    const sideQuestEngine = await import("./js/engine/sideQuestEngine.js");
    console.log("sideQuestEngine.js OK");
    const itemSystem = await import("./js/engine/itemSystem.js");
    console.log("itemSystem.js OK");
    const outcomeEngine = await import("./js/engine/outcomeEngine.js");
    console.log("outcomeEngine.js OK");
    const gameState = await import("./js/engine/gameState.js");
    console.log("gameState.js OK");
    const playerStats = await import("./data/player_stats.js");
    console.log("player_stats.js OK");
    const dailyActivities = await import("./data/daily_activities.js");
    console.log("daily_activities.js OK");
    console.log("ALL IMPORTS OK");
  } catch (e) {
    console.error("Error:", e.message);
    console.error(e.stack);
  }
}
test();