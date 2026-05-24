# pcb-order-website

## 项目概述

面向海外工程师与采购商的 **PCB 小批量接单网站**，对标 JLCPCB / 华秋 PCB 国际版。
核心功能：在线即时报价计算器 + Gerber 文件上传 + WhatsApp / Email 直接对接。

## 网站信息

| 字段 | 内容 |
|------|------|
| 项目类型 | B2B 静态接单网站 |
| 目标受众 | 海外工程师、电子创客、小批量采购商 |
| 最小起订量 | 5 pcs |
| 对接方式 | WhatsApp + Email + 在线报价表单 |
| 成交方式 | T/T 电汇 · PayPal · Wise |
| 视觉风格 | 极客风 · 深色 · PCB 绿 |
| 仓库地址 | https://github.com/andrewljf001/pcb-order-website |

## 文件索引

| 文件 / 目录 | 说明 |
|------------|------|
| `index.html` | 根目录 DEMO（深色科技风，带真实图片模块）|
| `src/index.html` | 首页（Hero + 即时报价计算器 + 服务 + 流程）|
| `demos/integrated-pcba/index.html` | 综合小批量 PCB + SMT + THT + 整包下单 DEMO |
| `src/capabilities.html` | 工艺能力页（详细规格参数表）|
| `src/quote.html` | 完整报价配置页 |
| `src/assembly.html` | PCB 贴片组装服务页 |
| `src/contact.html` | 联系页（WhatsApp + Email + 表单）|
| `src/css/style.css` | 全局样式（极客绿深色系）|
| `src/js/main.js` | 全局交互逻辑 |
| `src/js/quote.js` | 报价计算器（可迁移至后端 API）|
| `docs/design.md` | 设计规范 |
| `docs/progress.md` | 项目进度 |
| `docs/backend-plan.md` | 后台迁移方案（Strapi）|

## 页面架构

```
首页 (index.html)
├── Nav               Logo + 导航 + Order Now CTA
├── Ticker            实时滚动参数（层数/交期/材料/工艺）
├── Hero              主标题 + PCB Spec Card 预览
├── Quote Calculator  在线即时报价计算器
├── Services          6大产品线（刚性/柔性/组装/HDI/铝基/高频）
├── Process           5步流程（上传→报价→付款→生产→发货）
├── Spec Table        工艺规格参数表
├── Why Us            4个核心优势
└── Footer            联系方式

capabilities.html    详细工艺规格
quote.html           完整报价页
assembly.html        SMT贴片服务
contact.html         联系/WhatsApp/表单
```

## DEMO 预览路径

GitHub Pages 启用后，可通过以下路径预览：

| DEMO | 路径 |
|------|------|
| 根目录深色科技风 DEMO | `https://andrewljf001.github.io/pcb-order-website/` |
| Claude 源码版 DEMO | `https://andrewljf001.github.io/pcb-order-website/src/` |
| 综合 PCB + SMT + THT 整包下单 DEMO | `https://andrewljf001.github.io/pcb-order-website/demos/integrated-pcba/` |

## 后台规划

**现阶段**：纯静态，前端报价计算器
**迁移方案**：Strapi（自托管 Headless CMS）
详见 `docs/backend-plan.md`

## 里程碑

| 里程碑 | 目标 | 状态 |
|--------|------|------|
| v1.0 | 首页 DEMO + 报价计算器上线 | ⏳ 进行中 |
| v1.1 | 全部页面完成 + GitHub Pages 部署 | ⏳ 待开始 |
| v2.0 | Strapi 后台接入 + 订单管理 | ⏳ 规划中 |

## 更新记录

| 日期 | 更新人 | 描述 |
|------|--------|------|
| 2026-05-24 | Claude (Anthropic) | 初始化仓库结构 |

---
**最后更新**：2026-05-24 by Claude (Anthropic)
