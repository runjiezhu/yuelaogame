# 月老养成 · UI 视图规则

## 5 个视图及其 ID

| 视图 | HTML ID | 激活类 |
|------|---------|--------|
| 标题页 | `view-title` | `view--active` |
| 角色卡 | `view-card` | `view--active` |
| 属性面板 | `view-stats` | `view--active` |
| 章节剧情 | `view-novel` | `view--active` |
| 结局 | `view-ending` | `view--active` |

## showView 逻辑

切换视图时，先移除所有 `.view--active`，再给目标元素加 `view--active`。禁止用 `display: block/none` 硬切（会破坏 CSS 动画）。

## 按钮绑定规则

所有 `<button>` 必须有 `onclick` 处理器。禁止留无绑定的按钮。

## 章节流程

1. `renderChapter(event)` 渲染选项列表
2. 用户点击选项 → `onChoice(choice)`
3. `applyEffects(stats, choice.effects)` 更新状态
4. `renderChoiceResult(choice)` 追加结果到 `.chapter-choices` 下方
5. 用户点"进入下一章" → `document.dispatchEvent(new CustomEvent('yuelao:next-chapter'))`
6. 全局监听器捕获事件，决定是 `enterStats()` 还是 `triggerEnding()`

## 存档时机

- 确认角色卡后：`saveGame(state)`
- 每次选项选择后：`saveGame(state)`
- `pendingEvent` 必须在存档中保存，用于"继续"功能恢复章节

## Loading 规则

- 任何异步/延迟操作前后必须配对调用 `showLoading()` / `hideLoading()`
- Loading 不能卡死：必须有 `try/finally` 确保 `hideLoading()` 总是执行

## 错误展示

`main.js` 中的 `showFatalError` 是最后防线，任何未捕获错误都显示在页面底部红色浮窗，不应让页面完全白屏。
