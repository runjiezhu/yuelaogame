# 月老养成 · 婚恋模拟器

一个基于真实婚恋经验的文字冒险游戏。

**在线游玩：https://zhuru-yuelao.github.io/yuelaogame/**

（游戏部署在 GitHub Pages，打开即可玩，不需要本地服务器）

---

## 游戏简介

你的开局画像、剧情分支、经验金句，全部来自 980 条真实红娘连麦案例。

每局随机生成一个角色卡（12种原型），然后在真实婚恋场景中做选择，最终走向 9 种结局之一。

适合婚期 23-35 岁，一局 15-25 分钟。

## 快速开始

### 在线玩（推荐）
打开 https://zhuru-yuelao.github.io/yuelaogame/ 即可游玩，无需安装任何东西。

### 本地运行
```bash
# 安装依赖
npm install

# 启动本地服务器
node scripts/serve.mjs
# 打开 http://localhost:8765/

# 运行测试
node scripts/e2e_test.mjs
```

## 项目结构

```
yuelaogame/
├── index.html          # 游戏主页面
├── css/style.css       # 全部样式
├── js/
│   ├── main.js        # 游戏主入口
│   ├── ui/
│   │   ├── dom.js     # DOM 工具函数
│   │   └── views.js   # 各视图渲染器
│   └── engine/
│       ├── eventEngine.js   # 事件引擎
│       ├── statSystem.js    # 属性系统 + 结局判定
│       ├── gameState.js     # 存档管理
│       └── randomProfile.js # 随机角色生成
└── data/
    ├── archetypes.js  # 12 种角色原型
    ├── events.js      # 50 个剧情事件
    ├── endings.js     # 9 种结局
    └── insights.js    # 洞察金句库
```

## 技术栈

- 纯原生 HTML/CSS/JavaScript（ES Module）
- 无框架依赖
- 零依赖静态文件，部署到任意静态托管服务
- GitHub Pages 自动部署

## 部署说明

推送到 GitHub 后，在仓库 Settings → Pages → Source，选择 `main` branch 即可自动上线。

## 灵感来源

婚恋红娘连麦真实案例，由 AI 提炼为游戏剧情。
