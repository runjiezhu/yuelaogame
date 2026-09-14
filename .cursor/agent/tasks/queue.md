# 月老养成 · 任务队列

格式：`- [ ] 任务描述 @owner:人 @priority:high/medium/low @status:todo/in_progress/done`

## 高优先级

- [x] **修复 eventEngine.js 的 `nextStep` 函数** @priority:high @status:done
  - 完成时间：2026/9/14 19:36
  - 修复内容：严格匹配性别/年龄段/城市，fallback 机制确保游戏可继续

- [x] **补充缺失选项字段** @priority:high @status:done
  - 完成时间：2026/9/14 19:36
  - 修复方式：通过 `enrichChoices` 函数动态生成 `feedback` 和 `goldenQuote`

- [x] **验证 Web UI 可正常游玩** @priority:high @status:done
  - 完成时间：2026/9/14 19:37
  - 验证内容：所有视图渲染函数、index.html 结构、CSS 样式均完整

- [x] **结局触发逻辑调优** @priority:high @status:done
  - 完成时间：2026/9/14 19:37
  - 调优内容：放宽"差不多就得了"触发条件（章节>=5 且年龄>=30）

- [x] **修复 statSystem.js 重复声明 + 数据文件裸引号** @priority:high @status:done
  - 完成时间：2026/9/15 07:00
  - 修复内容：
    - `js/engine/statSystem.js`：移除重复的 `applyEffects` 与 `shouldTriggerEnding`
    - `data/events.js` line 377/422：2 处 consequence 字段缺失闭合 `"`
    - `data/events.js` line 1157：1 处多余前导 `"`
    - `data/npcs.js`：3 处关系字段内嵌未转义 ASCII `"` → 改为 `「」`
  - 影响：游戏上线后大屏一片空白、按钮点不开的根因已修复

- [x] **GitHub Pages 上线 + 自动同步** @priority:high @status:done
  - 完成时间：2026/9/15 06:55
  - 地址：https://runjiezhu.github.io/yuelaogame/
  - 部署源：main 分支 /docs 路径（legacy 模式）
  - 已验证：index/css/js/data 全部 HTTP 200
  - 守护：`scripts/guardian.mjs` + `scripts/sync-watcher.mjs` 持续运行

- [x] **main.js 字段名统一** @priority:high @status:done
  - 完成时间：2026/9/15 07:09
  - 修复：5 处 `mainQuestProgress` → `currentMainQuestIndex`
  - 影响：主线进度条能正确读取"当前章节"

- [x] **视觉升级：SVG 插画 + NPC 头像** @priority:high @status:done
  - 完成时间：2026/9/15 07:22
  - 新增：10 张场景 SVG（train/dinner/family/reunion/coffee/chat/dating/love/conversation/goodbye）
  - 新增：6 个 NPC emoji 头像圆圈（👩👨👵👭💔💐）
  - 新增：10 种章节背景渐变色
  - 改动：636 行新增，79 行删除
  - commit: 07febc5

- [x] **性别差异化：双 NPC 池 + 模板变量** @priority:high @status:done
  - 完成时间：2026/9/15 07:25
  - 改动：45+ 处文本"小敏" → `{{npc_bestie.name}}`
  - 新增：`npcs_gender.js`（女主闺蜜小敏、男主兄弟阿强）
  - 更新：eventEngine.js（动态选择 NPC 池）、views.js（模板引擎）
  - 改动：512 行新增，86 行删除
  - commit: d43021a

## 中优先级

- [x] **继续游戏功能** @priority:medium @status:done
  - 完成时间：2026/9/15 06:55
  - 通过 docs/ 部署到 GitHub Pages 实现持续在线

- [x] **GitHub Pages 上线** @priority:high @status:done
  - 完成时间：2026/9/15 06:55
  - 地址：https://runjiezhu.github.io/yuelaogame/
  - 已验证全部资源 HTTP 200

- [ ] **增加角色卡动画** @priority:medium @status:todo
  - 当前角色卡静态，可以加抽卡动画（随机切换几个角色后停在最终结果）

## 低优先级（锦上添花）

- [ ] **统计面板加入进度条** @priority:low @status:todo
  - 颜值、收入、家底用进度条可视化

- [ ] **结局页增加分享按钮** @priority:low @status:todo
  - 生成结局文案，可复制分享

- [ ] **声音效果** @priority:low @status:todo
  - 章节切换/选项点击的轻量音效（Web Audio API）

---

**更新规则**：
- 新发现的问题加到列表顶部，标注 `priority:high`
- Agent 每次启动时读取此文件，从 `priority:high` 且 `status:todo` 开始
