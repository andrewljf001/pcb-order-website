/**
 * quote.js — PCB 报价计算器
 * 纯前端实现，迁移 Strapi 后只需替换 submitOrder() 函数
 */

// ============================================================
// PRICING CONFIG — 修改这里调整报价逻辑
// ============================================================
const PRICING = {
  // 基础板费（按层数 × 面积系数）
  layerBase: { 1: 8, 2: 12, 4: 28, 6: 55, 8: 90, 10: 160, 12: 220, 16: 320 },

  // 数量折扣系数（数量越多越便宜）
  qtyFactor: {
    5: 1.0, 10: 1.0, 25: 0.85, 50: 0.72,
    100: 0.6, 200: 0.5, 500: 0.42, 1000: 0.35
  },

  // 面积系数（100×100mm = 1.0 基准）
  areaBase: 100 * 100,

  // 工艺附加费
  finishExtra: { hasl: 0, enig: 8, osp: 2, hardgold: 25, enepig: 18 },
  copperExtra: { 1: 0, 2: 10 },
  leadtimeExtra: { '24h': 15, '3d': 5, '5d': 0, '7d': -3 },
  ipcExtra: { 2: 0, 3: 12 },
  etestExtra: { flying: 0, fixture: 20 },

  // 运费（USD）
  shipping: { dhl: 12, fedex: 14, ems: 8 },

  // 交期文字说明
  leadtimeLabel: {
    '24h': '24 hours',
    '3d':  '3 business days',
    '5d':  '5 business days',
    '7d':  '7 business days'
  }
};

// ============================================================
// CALCULATE
// ============================================================
function calcPrice() {
  const layers    = parseInt(document.getElementById('layers').value);
  const qty       = parseInt(document.getElementById('qty').value);
  const width     = parseFloat(document.getElementById('width').value) || 100;
  const height    = parseFloat(document.getElementById('height').value) || 100;
  const finish    = document.getElementById('finish').value;
  const copper    = parseInt(document.getElementById('copper').value);
  const leadtime  = document.getElementById('leadtime').value;
  const ipc       = parseInt(document.getElementById('ipc').value);
  const etest     = document.getElementById('etest').value;
  const shipping  = document.getElementById('shipping').value;

  // 面积系数（相对 100×100mm）
  const areaFactor = (width * height) / PRICING.areaBase;

  // 基础板费 × 面积 × 数量折扣
  const basePrice = PRICING.layerBase[layers] ?? 12;
  const qtyFactor = PRICING.qtyFactor[qty] ?? 0.35;
  const fabCost   = basePrice * Math.max(0.5, areaFactor) * qtyFactor * (qty / 10);

  // 附加费
  const finishCost  = PRICING.finishExtra[finish]   ?? 0;
  const copperCost  = PRICING.copperExtra[copper]   ?? 0;
  const ltCost      = PRICING.leadtimeExtra[leadtime] ?? 0;
  const ipcCost     = PRICING.ipcExtra[ipc]         ?? 0;
  const etestCost   = PRICING.etestExtra[etest]     ?? 0;
  const shipCost    = PRICING.shipping[shipping]    ?? 12;

  const total = fabCost + finishCost + copperCost + ltCost + ipcCost + etestCost + shipCost;
  const perBoard = total / qty;

  // Update UI
  document.getElementById('total-price').textContent = '$' + total.toFixed(2);
  document.getElementById('price-per').textContent =
    '$' + perBoard.toFixed(2) + ' per board · ' + qty + ' pcs';

  document.getElementById('r-fab').textContent     = '$' + fabCost.toFixed(2);
  document.getElementById('r-finish').textContent  = finishCost > 0 ? '$' + finishCost.toFixed(2) : 'Included';
  document.getElementById('r-copper').textContent  = copperCost > 0 ? '$' + copperCost.toFixed(2) : 'Included';
  document.getElementById('r-leadtime').textContent = PRICING.leadtimeLabel[leadtime];
  document.getElementById('r-lt-price').textContent = ltCost >= 0
    ? (ltCost > 0 ? '+$' + ltCost.toFixed(2) : '$0.00')
    : '-$' + Math.abs(ltCost).toFixed(2);
  document.getElementById('r-ship').textContent    = '$' + shipCost.toFixed(2);

  // Update shipping label
  const shipLabels = { dhl: 'DHL Express', fedex: 'FedEx Intl', ems: 'EMS Post' };
  const shipRow = document.getElementById('r-ship').previousElementSibling;
  if (shipRow) shipRow.textContent = 'Shipping (' + (shipLabels[shipping] ?? 'DHL') + ')';

  return { total, qty, layers, width, height, finish, copper, leadtime, ipc, etest, shipping };
}

// ============================================================
// SUBMIT ORDER → WhatsApp message (迁移时替换此函数)
// ============================================================
function submitOrder(params) {
  const WA_NUMBER = 'YOUR_NUMBER'; // TODO: 替换为真实号码

  const msg = [
    'Hello, I would like to place a PCB order:',
    '---',
    'Layers: ' + params.layers,
    'Size: ' + params.width + 'x' + params.height + 'mm',
    'Quantity: ' + params.qty + ' pcs',
    'Finish: ' + params.finish.toUpperCase(),
    'Copper: ' + params.copper + 'oz',
    'Lead time: ' + PRICING.leadtimeLabel[params.leadtime],
    'IPC Class: ' + params.ipc,
    'Shipping: ' + params.shipping.toUpperCase(),
    '---',
    'Total: $' + params.total.toFixed(2),
    'Please confirm availability and payment details.'
  ].join('\n');

  const url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
  window.open(url, '_blank');

  /* === FUTURE STRAPI MIGRATION ===
  return fetch('https://your-strapi.railway.app/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: params })
  }).then(res => res.json()).then(data => {
    window.location.href = '/order-confirmed?id=' + data.data.id;
  });
  */
}

// ============================================================
// EVENT LISTENERS
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const inputs = ['layers', 'qty', 'width', 'height', 'finish', 'copper', 'leadtime', 'ipc', 'etest', 'shipping'];

  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', calcPrice);
    if (el && el.tagName === 'INPUT') el.addEventListener('input', calcPrice);
  });

  // Order button
  const orderBtn = document.getElementById('order-btn');
  if (orderBtn) {
    orderBtn.addEventListener('click', () => {
      const params = calcPrice();
      submitOrder(params);
    });
  }

  // Initial calculation
  calcPrice();
});
