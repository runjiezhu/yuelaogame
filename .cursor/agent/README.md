# 月老养成 · Cursor Agent 使用指南

## 这套体系是什么

`.cursor/agent/` 是一套自动化开发体系，Agent 在每次启动时自动读取项目上下文、规则、任务队列，无需你一个一个 `run`。

## 目录结构

```
.cursor/agent/
  agent.json         ← Agent 主配置（描述、规则、监控路径）
  status.md          ← 项目实时状态（自动更新）
  rules/
    engine-development.md   ← 引擎开发规则（禁止空文件、归一化）
    ui-views.md             ← UI/视图开发规则
  tasks/
    queue.md        ← 任务队列（高/中/低优先级）

scripts/
  monitor.mjs      ← 后台监控脚本（空文件检查 + e2e）
  serve.mjs        ← 静态服务器（端口 8765）
  e2e_test.mjs     ← 端到端测试

package.json        ← npm scripts
```

## 日常用法

### 启动游戏
```bash
npm start
# 或
node scripts/serve.mjs
# 浏览器打开 http://localhost:8765/
```

### 手动运行监控
```bash
npm run monitor
```
会自动检查：空文件 → e2e 测试 → 更新 status.md

### 手动运行测试
```bash
npm test
```

## Agent 工作方式

每次你打开 Cursor 并切换到本项目，Agent 会：
1. 读取 `agent.json` 了解项目上下文
2. 读取 `status.md` 看当前状态
3. 读取 `tasks/queue.md` 从最高优先级的待办开始
4. 修改文件后自动跑 `monitor` 验证

## 添加新任务

在 `.cursor/agent/tasks/queue.md` 顶部添加，格式：
```markdown
- [ ] 你的任务描述 @priority:high @status:todo
```

## 添加规则

在 `.cursor/agent/rules/` 添加 `.md` 文件，Agent 启动时自动加载。

## 当前最高优先级任务

见 `tasks/queue.md`，高优先级项为：
1. 验证 Web UI 可正常游玩（浏览器测试）
2. 修复 eventEngine.js nextStep 筛选逻辑
3. 补充 events.js 选项的 feedback/goldenQuote

## 游戏正常流程（验收标准）

1. 打开 `http://localhost:8765/`
2. 标题页 → 点「新开一局」
3. 看到角色卡（emoji + 画像）→ 点「就是我了，开始」
4. 看到属性面板 → 点「进入本章」
5. 看到章节剧情 + 3 个选项
6. 点一个选项 → 看到结果反馈 + 金句 + 属性变化
7. 点「进入下一章」→ 回到属性面板（年龄变化）→ 再进下一章
8. 重复直到出现结局页
9. 点「再来一局」回到标题页
