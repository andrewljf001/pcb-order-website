# 设计规范 · pcb-order-website

## 品牌定位

**关键词**：极客、专业、高效、工程师友好
**核心隐喻**：你就是那块 PCB 工厂的直连终端

## 色彩系统

| 用途 | 色值 |
|------|------|
| 主背景 | `#0A0F0A`（深夜绿黑）|
| 次背景 | `#0F1A0F`（深绿黑）|
| 卡片背景 | `#162116`（墨绿）|
| 主色（PCB绿）| `#00FF41` |
| 次绿 | `#00C832` |
| 暗绿（边框）| `#1E3A1E` |
| 正文 | `#C8E6C9` |
| 辅助文字 | `#5A7A5A` |
| 警告色 | `#FFB300`（琥珀，用于价格）|
| 错误色 | `#FF3D00` |

## 字体

- 标题/Logo：`Orbitron`（科幻等宽感）
- 代码/数字/标签：`Share Tech Mono`
- 正文/UI：`DM Sans`

## 关键设计元素

### 电路板网格背景
- 细网格线 `rgba(0,255,65,0.03)`
- 装饰性 PCB 走线（SVG，极低透明度）

### 顶部 Ticker 滚动条
- 持续滚动关键参数：层数 / 交期 / 材料 / 工艺 / 认证
- 背景 `#1A2E1A`，字体 Share Tech Mono

### 报价计算器
- 左：参数配置表单（下拉选择为主）
- 右：实时报价结果（即时计算）
- 价格大字用 Orbitron，绿色高亮

### 流程步骤
- 数字圆圈 + 连接线，Hover 变绿色填充
- 5步：上传 → 报价 → 付款 → 生产 → 发货

## 响应式

| 断点 | 布局 |
|------|------|
| Desktop >1024px | 双栏 Hero，3列服务，5列流程 |
| Tablet 768–1024px | 单栏 Hero，2列服务 |
| Mobile <768px | 全单栏，导航收起 |

## SEO 关键词

- `PCB manufacturing small batch`
- `prototype PCB online quote`
- `cheap PCB fabrication`
- `Gerber file PCB order`
- `PCB assembly PCBA service`
- `custom PCB 5 pcs minimum`
