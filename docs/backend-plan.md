# 后台迁移方案 · pcb-order-website

## 现阶段：纯静态

报价计算器、表单均在前端完成，无需后端。
联系方式通过 WhatsApp / Email 直接对接。

## 迁移目标：Strapi（自托管 Headless CMS）

### 选择理由

| 维度 | 说明 |
|------|------|
| 开源免费 | 自托管无订阅费 |
| 迁移成本 | 极低，数据库 PostgreSQL 标准格式 |
| 前端对接 | REST API / GraphQL，现有前端只需替换 endpoint |
| 管理界面 | 内置后台，可管理订单、报价记录、产品规格 |
| 部署平台 | Railway / Render / VPS 均支持一键部署 |

### 内容模型规划

```
Order（订单）
├── layers: Number
├── width: Number
├── height: Number
├── quantity: Number
├── surface_finish: String
├── solder_mask: String
├── thickness: String
├── lead_time: String
├── total_price: Number
├── customer_email: String
├── customer_whatsapp: String
├── status: Enum [pending / confirmed / in_production / shipped]
└── created_at: DateTime

Quote（报价记录）
├── params: JSON
├── price: Number
└── created_at: DateTime
```

### 前端迁移步骤

**现在（静态）：**
```javascript
function submitOrder(params) {
  // 本地处理，跳转 WhatsApp
  const msg = buildWhatsAppMessage(params);
  window.open(`https://wa.me/NUMBER?text=${msg}`);
}
```

**迁移后（Strapi API）：**
```javascript
async function submitOrder(params) {
  const res = await fetch('https://your-strapi.railway.app/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: params })
  });
  // 同时发送 WhatsApp 通知
}
```

**改动量**：只需修改 `src/js/quote.js` 中的 `submitOrder` 函数，其余前端代码不变。

### 部署参考

```bash
# Railway 一键部署 Strapi
railway login
railway new
railway add --plugin postgresql
npx create-strapi-app@latest my-pcb-backend
railway up
```

### 邮件通知（可选）

Strapi + Nodemailer 插件：
- 新订单 → 自动发邮件给你
- 订单状态变更 → 自动通知客户
