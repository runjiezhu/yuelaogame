# 剧情分支与随机事件插队实现文档

## 概述
本次更新增加了剧情分支系统和随机事件插队机制，消除了"节奏单一"的问题。

## 主要改动

### 1. 第4章分支（前任重逢）

#### 分支结构
- **主线**: `quest_cn_04` - 老同学聚会重逢前任
- **分支A（相亲线）**:
  - `quest_cn_04a_1`: 妈妈加速安排相亲（800字）
  - `quest_cn_04a_2`: 第一次相亲顺利（800字）
- **分支B（复合线）**:
  - `quest_cn_04b_1`: 和前任深夜长谈（900字）
  - `quest_cn_04b_2`: 前任提出复合（900字）

#### 触发逻辑
在 `quest_cn_04` 结束时，玩家面临关键选择：
- **选项A**: "聊几句就走，不给自己添堵" → 进入相亲线 (`nextQuestId: "quest_cn_04a_1"`)
- **选项B**: "和前任单独聊聊，想知道TA过得怎么样" → 进入复合线 (`nextQuestId: "quest_cn_04b_1"`)

#### 汇聚点
两条分支线在 `quest_cn_05`（闺蜜小敏来访）汇聚回主线。

---

### 2. 第7章分支（相亲后续）

#### 分支结构
- **主线**: `quest_cn_07` - 第一次相亲（林晓）
- **分支A（单身线）**:
  - `quest_cn_07a`: 妈妈失望但尊重（700字）

#### 触发逻辑
在 `quest_cn_07` 结束时，玩家面临选择：
- **选项A**: "礼貌拒绝，不想勉强" → 进入单身线 (`nextQuestId: "quest_cn_07a"`)
- **选项B**: "再见一面，观察一下" → 保持原线路 (`nextQuestId: "quest_cn_08"`)

#### 汇聚点
两条线在 `quest_cn_09`（爸妈深夜谈心）汇聚。

---

### 3. 随机事件插队机制

#### 实现位置
`js/engine/eventEngine.js` - `nextStep()` 函数

#### 逻辑说明
```javascript
// 主线进度 < 10 时，40% 概率插入随机事件
const currentMainQuestIndex = stats.currentMainQuestIndex ?? 0;
if (currentMainQuestIndex < 10 && Math.random() < 0.4) {
  const randomEvent = pickRandomEvent(stats, usedEventIds);
  if (randomEvent) {
    console.log(`[eventEngine] 随机事件插队: ${randomEvent.id}`);
    return { type: "event", event: { ...randomEvent, choices: enrichChoices(randomEvent) } };
  }
}
```

#### 特点
- 只在主线进度 < 10 时触发
- 40% 概率插队
- 优先选择有NPC互动的随机事件
- 严格匹配玩家的性别、年龄段、城市层级

---

### 4. 分支跳转系统

#### 数据结构
在 `choices` 中增加 `nextQuestId` 字段：
```javascript
choices: [
  {
    text: '聊几句就走',
    nextQuestId: 'quest_cn_04a_1',
    tone: 'conservative',
    effects: { confidence: 3, social: 0, age: 0 },
    affinityChange: { npc_ex: 0, npc_bestie: 5 },
    consequence: "..."
  }
]
```

#### 实现逻辑

**1. 记录跳转目标** (`js/main.js` - `handleChoice()`)
```javascript
// 如果选项有 nextQuestId，记录下一个要跳转的 quest
if (choice.nextQuestId) {
  game.state.pendingNextQuestId = choice.nextQuestId;
  console.log(`[main] 分支跳转: 下一章将进入 ${choice.nextQuestId}`);
}
```

**2. 执行跳转** (`js/main.js` - `enterChapter()`)
```javascript
if (game.state.pendingNextQuestId) {
  const { QUESTS } = await import("../data/quests.js");
  const targetQuest = QUESTS.find(q => q.id === game.state.pendingNextQuestId);
  if (targetQuest) {
    console.log(`[main] 执行分支跳转: ${game.state.pendingNextQuestId}`);
    result = { type: "event", event: targetQuest };
    game.state.pendingNextQuestId = null; // 清除跳转标记
  }
}
```

---

## 新增剧情统计

| Quest ID | 章节 | 字数 | 类型 |
|----------|------|------|------|
| quest_cn_04a_1 | 4.1 | ~800 | 相亲线-妈妈加速 |
| quest_cn_04a_2 | 4.2 | ~800 | 相亲线-第一次相亲 |
| quest_cn_04b_1 | 4.3 | ~900 | 复合线-深夜长谈 |
| quest_cn_04b_2 | 4.4 | ~900 | 复合线-提出复合 |
| quest_cn_07a | 7.1 | ~700 | 单身线-妈妈失望 |

**总计**: 5条新剧情，约 4100 字

---

## 验证步骤

### 测试1: 第4章相亲线分支
1. 开始新游戏
2. 推进到 `quest_cn_04`（老同学聚会）
3. 选择"聊几句就走，不给自己添堵"
4. **预期结果**: 进入 `quest_cn_04a_1`（妈妈加速安排相亲）
5. 继续推进，确认进入 `quest_cn_04a_2`（第一次相亲顺利）
6. 最终应该汇聚到 `quest_cn_05`（闺蜜小敏来访）

### 测试2: 第4章复合线分支
1. 开始新游戏
2. 推进到 `quest_cn_04`
3. 选择"和前任单独聊聊"
4. **预期结果**: 进入 `quest_cn_04b_1`（和前任深夜长谈）
5. 继续推进，确认进入 `quest_cn_04b_2`（前任提出复合）
6. 最终应该汇聚到 `quest_cn_05`

### 测试3: 第7章单身线分支
1. 推进到 `quest_cn_07`（第一次相亲）
2. 选择"礼貌拒绝，不想勉强"
3. **预期结果**: 进入 `quest_cn_07a`（妈妈失望但尊重）
4. 最终应该汇聚到 `quest_cn_09`

### 测试4: 随机事件插队
1. 开始新游戏
2. 推进主线，观察控制台日志
3. **预期结果**: 在主线进度 < 10 时，偶尔会看到日志 `[eventEngine] 随机事件插队: event_xxx`
4. 确认随机事件会打断主线，增加游戏节奏变化

---

## 文件改动清单

### 修改文件
1. **`data/quests.js`** (约 +400 行)
   - 修改 `quest_cn_04` 的 choices，增加 `nextQuestId` 字段
   - 新增 `quest_cn_04a_1`, `quest_cn_04a_2`, `quest_cn_04b_1`, `quest_cn_04b_2`
   - 修改 `quest_cn_07` 的 choices，增加分支选项
   - 新增 `quest_cn_07a`

2. **`js/engine/eventEngine.js`** (约 +15 行)
   - 修改 `nextStep()` 函数，增加随机事件插队逻辑
   - 在主线进度 < 10 时，40% 概率触发随机事件

3. **`js/main.js`** (约 +20 行)
   - 修改 `handleChoice()` 函数，处理 `nextQuestId` 字段
   - 修改 `enterChapter()` 函数，支持分支跳转
   - 增加 `game.state.pendingNextQuestId` 状态管理

### 新增文件
- **`BRANCH_IMPLEMENTATION.md`**: 本文档

---

## 技术细节

### 分支跳转优先级
1. **最高优先级**: `pendingNextQuestId`（分支跳转）
2. **次优先级**: 随机事件插队（40% 概率）
3. **正常流程**: 主线 quest 按顺序推进

### 状态管理
- `game.state.pendingNextQuestId`: 记录下一个要跳转的 quest ID
- 跳转执行后立即清除，避免重复跳转
- 如果目标 quest 不存在，降级为正常流程

### 随机事件匹配策略
1. **严格匹配**: 性别 + 年龄段 + 城市层级
2. **宽松匹配**: 性别 + 年龄段前后3档
3. **降级匹配**: 仅性别
4. **优先级**: 有 NPC 互动 > 无 NPC 互动

---

## 后续优化建议

1. **增加更多分支点**
   - 在第6章（妈妈的相亲安排）可以增加分支
   - 在第8章（和林晓再见面）可以增加分支

2. **动态调整插队概率**
   - 根据玩家的游戏时长动态调整
   - 主线推进过快时提高插队概率

3. **分支记录与追踪**
   - 记录玩家走过的分支路径
   - 在结局页展示分支选择统计

4. **分支互斥逻辑**
   - 避免某些分支同时出现（如相亲线和复合线）
   - 增加条件判断，让分支更合理

---

## 注意事项

1. **存档兼容性**: 旧存档可能不包含 `pendingNextQuestId`，需要做兼容处理
2. **事件去重**: 确保分支 quest 也会加入 `triggeredEventIds`，避免重复触发
3. **调试日志**: 保留 `console.log` 便于追踪分支跳转和随机插队
4. **性能影响**: 动态 import 可能有轻微延迟，但不影响用户体验

---

## 版本信息
- **实现日期**: 2026-09-15
- **版本**: v2.1
- **作者**: Kiro (Claude Code)
