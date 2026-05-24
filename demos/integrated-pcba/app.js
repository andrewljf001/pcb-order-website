const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

const stages = [
  {
    tag: "File intake",
    title: "Gerber, BOM and CPL are checked together.",
    text: "The order starts as a manufacturing package instead of disconnected emails. Missing files, board outline issues and unsupported parts are flagged before payment.",
    image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=960&q=80"
  },
  {
    tag: "DFM review",
    title: "Board rules and assembly constraints are reviewed early.",
    text: "The platform simulates checks for annular ring, solder mask sliver, component clearance, panel rails and board edge connector spacing.",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=960&q=80"
  },
  {
    tag: "BOM sourcing",
    title: "Turnkey, consigned or hybrid sourcing is visible.",
    text: "Buyers can request factory sourcing, ship their own parts, or mix both approaches while still seeing price and lead-time impact.",
    image: "https://images.unsplash.com/photo-1581093458791-9d26f8b9a005?w=960&q=80"
  },
  {
    tag: "Assembly build",
    title: "SMT and through-hole work stay in the same order.",
    text: "The build combines stencil, placement, reflow, selective solder, manual insertion, AOI, X-ray and functional test into one trackable package.",
    image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=960&q=80"
  },
  {
    tag: "Global shipment",
    title: "Export packing and delivery are part of the quote.",
    text: "The simulated checkout includes DHL, FedEx or air freight options, export invoice details and receiving contacts for overseas buyers.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=960&q=80"
  }
];

const fields = [
  "quantity",
  "layers",
  "size",
  "side",
  "uniqueParts",
  "smtPads",
  "thtPins",
  "lead",
  "sourcing",
  "testing",
  "conformal"
];

const scopeLabels = {
  turnkey: "Turnkey PCBA",
  pcb: "PCB fabrication only",
  smt: "SMT assembly only",
  tht: "THT insertion only"
};

const sizeFactor = {
  small: 0.7,
  medium: 1,
  large: 1.55,
  panel: 2.4
};

const leadFactor = {
  rush: 1.28,
  standard: 1,
  economy: 0.9
};

function selectedScope() {
  return document.querySelector("input[name='scope']:checked").value;
}

function numeric(id) {
  return Number(document.getElementById(id).value || 0);
}

function enabled(id) {
  return document.getElementById(id).checked;
}

function estimateQuote() {
  const scope = selectedScope();
  const quantity = numeric("quantity");
  const layers = numeric("layers");
  const parts = numeric("uniqueParts");
  const pads = numeric("smtPads");
  const pins = numeric("thtPins");
  const board = sizeFactor[document.getElementById("size").value];
  const lead = leadFactor[document.getElementById("lead").value];
  const side = document.getElementById("side").value === "both" ? 1.18 : 1;

  const pcb = (32 + layers * 9 + quantity * board * (0.34 + layers * 0.035)) * lead;
  const smt = (scope === "pcb") ? 0 : (48 + parts * 0.42 + pads * 0.018 + quantity * 0.8) * side * lead;
  const tht = (scope === "pcb" || scope === "smt") ? 0 : (pins * 0.08 + quantity * 0.36) * lead;
  const sourcing = enabled("sourcing") && scope !== "pcb" ? Math.max(18, parts * 0.62) : 0;
  const testing = enabled("testing") && scope !== "pcb" ? 36 + quantity * 0.28 : 0;
  const conformal = enabled("conformal") ? quantity * 1.8 : 0;
  const shipping = 28 + Math.ceil(quantity / 50) * 8;

  let total = shipping;
  if (scope === "turnkey" || scope === "pcb") total += pcb;
  if (scope === "turnkey" || scope === "smt") total += smt + sourcing + testing + conformal;
  if (scope === "turnkey" || scope === "tht") total += tht + testing + conformal;

  return {
    scope,
    quantity,
    total: Math.max(total, 45),
    pcb,
    smt,
    tht,
    sourcing,
    testing,
    conformal,
    shipping
  };
}

function updateQuote() {
  const quote = estimateQuote();
  document.getElementById("totalPrice").textContent = money.format(quote.total);
  const unitLabel = quote.scope === "pcb" ? "per bare board" : "per assembled board";
  document.getElementById("unitPrice").textContent = `${money.format(quote.total / quote.quantity)} ${unitLabel}`;

  const hasGerber = document.getElementById("gerberFile").files.length > 0;
  const hasBom = document.getElementById("bomFile").files.length > 0;
  let status = "Ready";
  if ((quote.scope === "turnkey" || quote.scope === "pcb") && !hasGerber) status = "Gerber needed";
  if ((quote.scope === "turnkey" || quote.scope === "smt" || quote.scope === "tht") && !hasBom) status = "BOM needed";
  document.getElementById("readiness").textContent = status;
}

function updateFileLabel(inputId, labelId) {
  const input = document.getElementById(inputId);
  const label = document.getElementById(labelId);
  label.textContent = input.files.length ? input.files[0].name : label.dataset.defaultText;
  updateQuote();
}

function showReview() {
  const quote = estimateQuote();
  const rows = [
    ["Order scope", scopeLabels[quote.scope]],
    ["Quantity", `${quote.quantity} pcs`],
    ["PCB layers", `${numeric("layers")} layers`],
    ["Assembly side", document.getElementById("side").selectedOptions[0].textContent],
    ["Unique parts", numeric("uniqueParts")],
    ["SMT pads", numeric("smtPads")],
    ["THT pins", numeric("thtPins")],
    ["Estimated total", money.format(quote.total)]
  ];

  document.getElementById("summaryList").innerHTML = rows
    .map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`)
    .join("");

  const modal = document.getElementById("reviewModal");
  if (typeof modal.showModal === "function") {
    modal.showModal();
  }
}

function setStage(index) {
  const stage = stages[index];
  document.getElementById("stageTag").textContent = stage.tag;
  document.getElementById("stageTitle").textContent = stage.title;
  document.getElementById("stageText").textContent = stage.text;
  document.getElementById("stageImage").src = stage.image;

  document.querySelectorAll(".step").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.stage) === index);
  });
}

document.querySelectorAll("input[name='scope']").forEach((input) => {
  input.addEventListener("change", updateQuote);
});

fields.forEach((id) => {
  document.getElementById(id).addEventListener("input", updateQuote);
  document.getElementById(id).addEventListener("change", updateQuote);
});

["gerberName", "bomName"].forEach((id) => {
  const label = document.getElementById(id);
  label.dataset.defaultText = label.textContent;
});

document.getElementById("gerberFile").addEventListener("change", () => updateFileLabel("gerberFile", "gerberName"));
document.getElementById("bomFile").addEventListener("change", () => updateFileLabel("bomFile", "bomName"));
document.getElementById("reviewButton").addEventListener("click", showReview);

document.querySelectorAll(".step").forEach((button) => {
  button.addEventListener("click", () => setStage(Number(button.dataset.stage)));
});

updateQuote();
