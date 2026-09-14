# 月老养成 · 引擎开发规则

## 文件禁止为空

以下文件写入后必须验证非空（> 10 字节），否则禁止保存：

- `js/engine/statSystem.js`
- `js/engine/eventEngine.js`
- `js/engine/gameState.js`
- `js/engine/randomProfile.js`
- `js/ui/dom.js`
- `js/ui/views.js`
- `css/style.css`
- `scripts/e2e_test.mjs`
- `scripts/serve.mjs`

验证命令：`Get-Content <file> | Measure-Object -Line`

## 性别归一化（必须遵守）

archetype 的 `stats.gender` 用 `F`/`M`，event 的 `trigger.gender` 用 `男`/`女`。

任何引擎代码中必须做双向映射：

```js
const GENDER_MAP = { F: "女", M: "男", 男: "男", 女: "女" };
function normGender(g) { return GENDER_MAP[g] || g; }
```

**禁止**：直接用 `stats.gender` 和 `event.gender` 做 `includes` 比较而不做归一化。

## 城市层级

`statSystem.js` 的 `TIERS.cityTier` 必须包含 `"二线"`。

`eventEngine.js` 必须对城市做归一化（因为事件数据中用了"二线"但 UI 可能用"新一线"）。

## 引擎变更后必须跑测试

修改以下文件后必须执行 `node scripts/e2e_test.mjs` 并确认通过：
- `js/engine/statSystem.js`
- `js/engine/eventEngine.js`
- `js/engine/gameState.js`
- `js/engine/randomProfile.js`
- `data/archetypes.js`
- `data/events.js`
- `data/endings.js`

## 模块格式

所有 `js/engine/` 和 `js/ui/` 文件必须使用 ES Module 格式（`import`/`export`），文件后缀 `.js`，且 `package.json` 必须设置 `"type": "module"`。

## applyEffects 规则

`statSystem.js` 的 `applyEffects` 必须支持以下字段：

| 字段 | 行为 |
|------|------|
| `age` | 数值增量（加到当前年龄） |
| `confidence` | 数值增量，范围 0-100 |
| `social` | 数值增量，范围 0-100 |
| `incomeTier` | 提升一档（向高端移动一格） |
| `assetTier` | 提升一档 |
| `looksTier` | 提升一档 |

## shouldTriggerEnding 规则

必须返回 `{ trigger: true/false, id: string, reason: string }`。
