<sub>🌐 <a href="README.md">English</a> · <b>中文</b> · <a href="README.fr.md">Français</a> · <a href="README.de.md">Deutsch</a> · <a href="README.ru.md">Русский</a> · <a href="README.ja.md">日本語</a> · <a href="README.it.md">Italiano</a> · <a href="README.es.md">Español</a></sub>

<div align="center">

# MyClaw Design

> *「打字。回车。一份能交付的设计。」*

[![Powered by MyClaw.ai](https://img.shields.io/badge/Powered%20by-MyClaw.ai-blue?style=flat-square)](https://myclaw.ai)
[![OpenClaw Skill](https://img.shields.io/badge/OpenClaw-Skill-blueviolet?style=flat-square)](https://github.com/openclaw/openclaw)
[![License](https://img.shields.io/badge/License-Personal%20Use-orange?style=flat-square)](LICENSE)

<br>

**在你的 Agent 里打一句话，拿回一份能交付的设计。**

3 到 30 分钟，你能 ship 一段**产品发布动画**、一个能点击的 App 原型、一套能编辑的 PPT、一份印刷级的信息图。不是「AI 做的还行」那种水平——是看起来像大厂设计团队做的。

给 skill 你的品牌资产（logo、色板、UI 截图），它会读懂你的品牌气质；什么都不给，内置的 20 种设计语汇也能兜底到不出 AI slop。

</div>

---

<p align="center">
  <a href="https://github.com/LeoYeAI/myclaw-design/releases/download/v1.0.0/hero-animation-v10-en.gif"><img src="docs/hero-preview.jpg" alt="MyClaw Design Hero" width="100%"></a>
</p>

<p align="center"><sub>
  ▲ 25 秒 · Terminal → 4 方向 → Gallery ripple → 4 次 Focus → Brand reveal<br>
  👉 <a href="https://github.com/LeoYeAI/myclaw-design/releases/download/v1.0.0/hero-animation-v10-en.mp4">下载 MP4（含 BGM+SFX · 10MB）</a>
</sub></p>

---

## 安装

```bash
# 克隆到 OpenClaw skills 目录
git clone https://github.com/LeoYeAI/myclaw-design.git ~/.openclaw/skills/myclaw-design
```

然后直接跟 Agent 说话：

```
「做一份 AI 心理学的演讲 PPT，推荐 3 个风格方向让我选」
「做个 AI 番茄钟 iOS 原型，4 个核心屏幕要真能点击」
「把这段逻辑做成 60 秒动画，导出 MP4 和 GIF」
「帮我对这个设计做一个 5 维度评审」
```

没有按钮、没有面板、没有 Figma 插件。

---

## 能做什么

| 能力 | 交付物 | 典型耗时 |
|---|---|---|
| **交互原型**（App / Web） | 单文件 HTML · 真 iPhone bezel · 可点击 · Playwright 验证 | 10–15 min |
| **演讲幻灯片** | HTML deck（浏览器演讲）+ 可编辑 PPTX（文本框保留） | 15–25 min |
| **时间轴动画** | MP4（25fps / 60fps 插帧）+ GIF（palette 优化）+ BGM + SFX | 8–12 min |
| **设计变体** | 3+ 并排对比 · Tweaks 实时调参 · 跨维度探索 | 10 min |
| **信息图 / 可视化** | 印刷级排版 · 可导 PDF/PNG/SVG | 10 min |
| **设计方向顾问** | 5 流派 × 20 种设计哲学 · 推荐 3 方向 · 并行生成 Demo | 5 min |
| **5 维度专家评审** | 雷达图 + Keep/Fix/Quick Wins · 可操作修复清单 | 3 min |

---

## Demo 画廊

### 设计方向顾问

需求模糊时的 fallback：从 5 流派 × 20 种设计哲学里挑 3 个差异化方向，并行生成 3 个 Demo 让你选。

<p align="center"><img src="docs/w3-fallback-advisor-en.gif" width="100%"></p>

### iOS App 原型

iPhone 15 Pro 精确机身（灵动岛 / 状态栏 / Home Indicator）· 状态驱动多屏切换 · 真图从 Wikimedia/Met/Unsplash 取 · Playwright 自动点击测试。

<p align="center"><img src="docs/c1-ios-prototype-en.gif" width="100%"></p>

### Motion Design 引擎

Stage + Sprite 时间片段模型 · `useTime` / `useSprite` / `interpolate` / `Easing` 四 API 覆盖所有动画需求 · 一条命令导出 MP4 / GIF / 60fps 插帧 / 带 BGM+SFX 的成片。

<p align="center"><img src="docs/c3-motion-design-en.gif" width="100%"></p>

### 幻灯片 + 可编辑 PPTX

HTML-first 幻灯片，自动缩放 + 键盘导航 + Speaker Notes。导出可编辑 PPTX——原生文本框，不是截图贴底。

<p align="center"><img src="docs/c2-slides-pptx-en.gif" width="100%"></p>

### 实时 Tweaks

实时调参——切换配色、布局、字体、密度，不用重新生成。修改通过 localStorage 持久化。

<p align="center"><img src="docs/c4-tweaks-en.gif" width="100%"></p>

### 信息图

印刷级排版，数据驱动，精确到像素。可导出 PDF/PNG/SVG。

<p align="center"><img src="docs/c5-infographic-en.gif" width="100%"></p>

### 5 维度专家评审

哲学一致性 / 视觉层级 / 细节执行 / 功能性 / 创新性——各打 0–10 分，雷达图 + Keep 清单 + Fix 清单（按严重度排序）+ Quick Wins。

<p align="center"><img src="docs/c6-expert-review-en.gif" width="100%"></p>

---

## 核心机制

### 品牌资产协议

Skill 不猜你的品牌。它遵循严格的 5 步协议：

1. **问** — 逐项索要 logo、产品图、UI 截图、色板、字体
2. **搜** — 爬官网、press kit、应用商店找资产
3. **下载** — 获取真实文件（logo SVG、产品 hero 图、UI 截图）
4. **验证** — 检查分辨率、透明度、版本新鲜度
5. **锁定** — 写入 `brand-spec.md`，CSS 变量强制一致性

<p align="center"><img src="docs/w1-brand-protocol-en.gif" width="100%"></p>

> **为什么重要：** 没有真实品牌资产，所有 AI 生成的设计看起来都一样——通用渐变、占位图标、零品牌识别度。协议前期投入 30 分钟，省下 1–2 小时返工。

### Junior Designer 工作流

Skill 像一个向你汇报的初级设计师：

1. **先展示假设** — 写下推理 + 占位符，不急着写代码
2. **等你确认** — 方向对了再填充细节
3. **中途展示** — 做到一半就给你看，不是做完才交
4. **验证** — 交付前跑 Playwright 截图 + 控制台错误检查

<p align="center"><img src="docs/w2-junior-designer-en.gif" width="100%"></p>

### 反 AI Slop

每个设计决策都经过严格的反 slop 清单检查：

| 避免 | 替代方案 |
|---|---|
| 紫色渐变 | 品牌色 / `oklch()` 和谐色 |
| Emoji 当图标 | 诚实占位符或真实素材 |
| 圆角卡片 + 左 border accent | 由内容决定的干净边界 |
| SVG 画人画物 | 真实图片或诚实占位符 |
| CSS 剪影代替产品图 | 品牌协议获取的真实产品图 |
| Inter/Roboto/系统字体做 display | 有特点的 display + body 字体配对 |

---

## 起手组件

开箱即用的预制组件：

| 组件 | 用途 |
|---|---|
| `assets/ios_frame.jsx` | iPhone 15 Pro 机身（灵动岛 + 状态栏 + Home Indicator） |
| `assets/android_frame.jsx` | Android 设备框 |
| `assets/macos_window.jsx` | macOS 窗口（红绿灯） |
| `assets/browser_window.jsx` | 浏览器窗口（URL 栏 + 标签页） |
| `assets/animations.jsx` | Stage + Sprite + useTime + Easing 动画引擎 |
| `assets/deck_index.html` | 多文件幻灯片拼接器 |
| `assets/deck_stage.js` | 单文件幻灯片 Web Component |
| `assets/design_canvas.jsx` | 并排变体对比网格 |

## 音频资产

6 首场景化 BGM + 37 个分类 SFX，让动画产出达到成片级：

- **BGM**：tech / ad / educational / tutorial（+ alt 变体）
- **SFX**：keyboard、terminal、transition、impact、magic、feedback、UI、container、progress

---

## 环境要求

- [OpenClaw](https://github.com/openclaw/openclaw)（任意近期版本）
- Node.js ≥ 18（脚本运行）
- [Playwright](https://playwright.dev/)（验证 + 视频导出）
- ffmpeg（视频格式转换 + 音频混合）

---

## 许可证

个人使用免费。商业使用需授权。详见 [LICENSE](LICENSE)。

---

<div align="center">

**[MyClaw.ai](https://myclaw.ai)** — 给每个用户一台完整服务器的 AI 个人助理平台。

</div>
