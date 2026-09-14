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
