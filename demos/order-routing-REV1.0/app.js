const orders = [
  {
    id: "BF-2407",
    customer: "Apex Robotics",
    scope: "PCB only",
    route: "supplier",
    files: "Gerber ZIP ready",
    status: "Awaiting review",
    risk: "Low",
    amount: "$42.80 supplier quote",
    margin: "$26.20 gross margin",
    action: "Create JLCPCB draft quote",
    payload: {
      supplier: "JLCPCB-compatible PCB API",
      mode: "quote_draft_only",
      submitPayment: false,
      board: { layers: 4, quantity: 25, size: "100 x 80 mm", thickness: "1.6 mm", finish: "ENIG", solderMask: "Green" },
      files: ["gerber_BF-2407.zip"],
      reviewGate: "owner approval required before supplier submission"
    }
  },
  {
    id: "BF-2408",
    customer: "Northstar Labs",
    scope: "Turnkey PCBA",
    route: "split",
    files: "Gerber + BOM + CPL",
    status: "Internal review",
    risk: "Medium",
    amount: "$386.00 customer estimate",
    margin: "PCB draft outside, assembly inside",
    action: "Split PCB quote and assembly review",
    payload: {
      supplier: "JLCPCB-compatible PCB API",
      mode: "pcb_quote_only",
      internalQueue: "SMT document review",
      files: ["gerber_BF-2408.zip", "bom_BF-2408.xlsx", "cpl_BF-2408.csv"],
      reviewGate: "check BOM substitutions and placement notes"
    }
  },
  {
    id: "BF-2409",
    customer: "HelioSense",
    scope: "SMT only",
    route: "internal",
    files: "BOM + CPL ready",
    status: "Internal review",
    risk: "High",
    amount: "$214.00 assembly labor",
    margin: "Manual BOM cleanup needed",
    action: "Route to your SMT document queue",
    payload: {
      supplier: "none",
      mode: "internal_smt_queue",
      files: ["bom_BF-2409.xlsx", "cpl_BF-2409.csv", "assembly_notes.pdf"],
      reviewGate: "verify polarity, feeders, substitutions and stock"
    }
  },
  {
    id: "BF-2410",
    customer: "Vector Audio",
    scope: "PCB only",
    route: "supplier",
    files: "Gerber ZIP ready",
    status: "Draft quote ready",
    risk: "Low",
    amount: "$18.60 supplier quote",
    margin: "$15.40 gross margin",
    action: "Review supplier price",
    payload: {
      supplier: "JLCPCB-compatible PCB API",
      mode: "quote_draft_only",
      submitPayment: false,
      board: { layers: 2, quantity: 10, size: "50 x 50 mm", thickness: "1.6 mm", finish: "HASL LF", solderMask: "Black" },
      files: ["gerber_BF-2410.zip"],
      reviewGate: "owner approval required before supplier submission"
    }
  },
  {
    id: "BF-2411",
    customer: "FieldLink IoT",
    scope: "THT insertion",
    route: "internal",
    files: "BOM + insertion notes",
    status: "Internal review",
    risk: "Medium",
    amount: "$126.00 insertion labor",
    margin: "Connector hand-solder check",
    action: "Route to through-hole workcell",
    payload: {
      supplier: "none",
      mode: "internal_tht_queue",
      files: ["bom_BF-2411.xlsx", "insertion_notes.pdf"],
      reviewGate: "confirm connector orientation and selective solder limits"
    }
  },
  {
    id: "BF-2412",
    customer: "Orbit Metering",
    scope: "PCB only",
    route: "supplier",
    files: "Gerber ZIP ready",
    status: "Awaiting review",
    risk: "Medium",
    amount: "$96.40 supplier quote",
    margin: "$48.60 gross margin",
    action: "Check impedance note before supplier submission",
    payload: {
      supplier: "JLCPCB-compatible PCB API",
      mode: "quote_draft_only",
      submitPayment: false,
      board: { layers: 6, quantity: 50, size: "150 x 120 mm", thickness: "1.6 mm", finish: "ENIG", solderMask: "Blue" },
      files: ["gerber_BF-2412.zip"],
      reviewGate: "manual review because impedance control was requested"
    }
  }
];

let selectedOrder = orders[0];

function routeLabel(order) {
  if (order.route === "supplier") return "// supplier draft";
  if (order.route === "split") return "// split routing";
  return "// internal queue";
}

function renderOrders() {
  const filter = document.getElementById("filterScope").value;
  const visibleOrders = orders.filter((order) => {
    if (filter === "pcb") return order.route === "supplier";
    if (filter === "assembly") return order.route !== "supplier";
    return true;
  });

  document.getElementById("orderList").innerHTML = visibleOrders.map((order) => `
    <button class="order-item ${order.id === selectedOrder.id ? "active" : ""}" type="button" data-id="${order.id}">
      <strong>${order.id} - ${order.customer}</strong>
      <span>${order.scope} / ${order.files}</span>
      <small>${order.route === "supplier" ? "auto supplier draft" : order.route === "split" ? "split job" : "internal only"}</small>
    </button>
  `).join("");

  document.querySelectorAll(".order-item").forEach((button) => {
    button.addEventListener("click", () => {
      selectedOrder = orders.find((order) => order.id === button.dataset.id);
      renderOrders();
      renderDetail();
    });
  });
}

function renderDetail() {
  document.getElementById("detailRoute").textContent = routeLabel(selectedOrder);
  document.getElementById("detailTitle").textContent = `Order ${selectedOrder.id}`;
  document.getElementById("detailStatus").textContent = selectedOrder.status;
  document.getElementById("customerName").textContent = selectedOrder.customer;
  document.getElementById("orderScope").textContent = selectedOrder.scope;
  document.getElementById("fileStatus").textContent = selectedOrder.files;
  document.getElementById("riskLevel").textContent = selectedOrder.risk;

  const supplierStep = document.getElementById("supplierStep");
  supplierStep.textContent = "";
  supplierStep.innerHTML = selectedOrder.route === "internal"
    ? "<span>03</span>Send to internal queue"
    : selectedOrder.route === "split"
      ? "<span>03</span>Split supplier and internal work"
      : "<span>03</span>Prepare supplier draft";

  document.getElementById("payloadPreview").textContent = JSON.stringify(selectedOrder.payload, null, 2);
  document.getElementById("reviewLines").innerHTML = [
    ["Routing decision", selectedOrder.action],
    ["Commercial view", selectedOrder.amount],
    ["Margin / handling", selectedOrder.margin],
    ["Safety gate", "No supplier payment before owner approval"]
  ].map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("");
}

function updateMetrics() {
  const auto = orders.filter((order) => order.route === "supplier").length;
  const internal = orders.filter((order) => order.route !== "supplier").length;
  const review = orders.filter((order) => order.status.includes("review") || order.status.includes("Awaiting")).length;
  document.getElementById("metricAuto").textContent = auto;
  document.getElementById("metricInternal").textContent = internal;
  document.getElementById("metricReview").textContent = review;
}

function showDecision(title, text) {
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalText").textContent = text;
  const modal = document.getElementById("decisionModal");
  if (typeof modal.showModal === "function") {
    modal.showModal();
  }
}

document.getElementById("filterScope").addEventListener("change", renderOrders);

document.getElementById("syncButton").addEventListener("click", () => {
  showDecision("Sync simulation complete", "New website orders were classified. PCB-only jobs received supplier draft payloads; assembly jobs stayed in your internal review queue.");
});

document.getElementById("requoteButton").addEventListener("click", () => {
  showDecision("Draft quote refreshed", `${selectedOrder.id} was re-priced in simulation. The order is still blocked behind your review gate.`);
});

document.getElementById("holdButton").addEventListener("click", () => {
  selectedOrder.status = "Manual hold";
  renderOrders();
  renderDetail();
  updateMetrics();
  showDecision("Manual hold added", `${selectedOrder.id} will not be sent forward until you clear the document or parameter issue.`);
});

document.getElementById("approveButton").addEventListener("click", () => {
  const message = selectedOrder.route === "supplier"
    ? `${selectedOrder.id} is approved for supplier submission simulation. Payment is still a separate explicit action.`
    : `${selectedOrder.id} is approved for your internal SMT/THT processing queue.`;
  selectedOrder.status = selectedOrder.route === "supplier" ? "Approved supplier draft" : "Approved internal queue";
  renderOrders();
  renderDetail();
  updateMetrics();
  showDecision("Next step approved", message);
});

renderOrders();
renderDetail();
updateMetrics();
