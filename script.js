// Charts for the portfolio. All figures below are ILLUSTRATIVE (not real company data).
// Edit the data objects to change what the charts show.

const MATURITY = [
  // name, May 2026, today, target (0–5)
  { name: "Demand intake", before: 1, now: 4, target: 5 },
  { name: "Ticket standards", before: 1, now: 4.5, target: 4.5 },
  { name: "Cadence & rituals", before: 1, now: 3, target: 4 },
  { name: "Contracts & hours", before: 1.5, now: 4, target: 5 },
  { name: "Indicators", before: 0.5, now: 4, target: 5 },
  { name: "Quality", before: 1, now: 2.5, target: 4 },
  { name: "Documentation", before: 1, now: 3.5, target: 4 },
  { name: "Risk & continuity", before: 0.5, now: 2.5, target: 4 },
];

const CONTRACTS = [
  // type, client, used % of cap, elapsed % of term, cap label
  { type: "Development", client: "Client A", used: 96, elapsed: 88, cap: "800 h" },
  { type: "Development", client: "Client B", used: 62, elapsed: 50, cap: "1,200 h" },
  { type: "Support", client: "Client C", used: 35, elapsed: 70, cap: "20 h / month" },
  { type: "Support", client: "Client D", used: 74, elapsed: 70, cap: "40 h / month" },
  { type: "Development", client: "Client E", used: 30, elapsed: 34, cap: "600 h" },
];

const PHASES = [
  { id: "imm", name: "Immersion" },
  { id: "con", name: "Concept" },
  { id: "map", name: "Mapping" },
  { id: "ui", name: "Interface" },
  { id: "dev", name: "Development" },
  { id: "dep", name: "Deploy" },
  { id: "sup", name: "Support" },
];
const MONTHS = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const TODAY = 2.8; // position in months from Jul 1 (≈ Sep 24)
const PROJECTS = [
  // segments: [phase, start, end] in months from Jul 1
  { name: "Product A", status: ["ok", "On track"], seg: [["imm", 0, 0.5], ["con", 0.5, 1.2], ["map", 1.2, 1.8], ["ui", 1.8, 2.7], ["dev", 2.7, 4.7], ["dep", 4.7, 5]] },
  { name: "Product B", status: ["warn", "Forecast overrun"], seg: [["imm", 1, 1.4], ["con", 1.4, 2], ["map", 2, 2.6], ["ui", 2.6, 3.4], ["dev", 3.4, 5.6], ["dep", 5.6, 6]] },
  { name: "Platform C", status: ["ok", "Delivered"], seg: [["dev", 0, 1.6], ["dep", 1.6, 2]] },
  { name: "Service D", status: ["info", "Continuous"], seg: [["sup", 0, 6]] },
  { name: "Product E", status: ["info", "Discovery"], seg: [["imm", 3.2, 3.8], ["con", 3.8, 4.6], ["map", 4.6, 5.3], ["ui", 5.3, 6]] },
];

// ---------------------------------------------------------------- helpers
const NS = "http://www.w3.org/2000/svg";
const f1 = (n) => n.toFixed(1);
function svg(w, h, label) {
  const s = document.createElementNS(NS, "svg");
  s.setAttribute("viewBox", `0 0 ${w} ${h}`);
  s.setAttribute("role", "img");
  if (label) s.setAttribute("aria-label", label);
  return s;
}
function add(parent, tag, attrs, text) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text != null) e.textContent = text;
  parent.appendChild(e);
  return e;
}

// ---------------------------------------------------------------- radar (hero)
function radar(el) {
  if (!el) return;
  const W = 600, H = 480, cx = W / 2, cy = H / 2, R = 178, n = MATURITY.length;
  const s = svg(W, H);
  const ang = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (i, v) => [cx + Math.cos(ang(i)) * R * (v / 5), cy + Math.sin(ang(i)) * R * (v / 5)];
  const poly = (key) => MATURITY.map((d, i) => pt(i, d[key]).map(f1).join(",")).join(" ");
  for (let l = 1; l <= 5; l++) add(s, "polygon", { class: "r-ring", points: MATURITY.map((_, i) => pt(i, l).map(f1).join(",")).join(" ") });
  MATURITY.forEach((_, i) => { const [x, y] = pt(i, 5); add(s, "line", { class: "r-axis", x1: cx, y1: cy, x2: f1(x), y2: f1(y) }); });
  add(s, "polygon", { class: "r-before", points: poly("before") });
  add(s, "polygon", { class: "r-target", points: poly("target") });
  add(s, "polygon", { class: "r-now", points: poly("now") });
  MATURITY.forEach((d, i) => { const [x, y] = pt(i, d.now); add(s, "circle", { class: "r-dot", cx: f1(x), cy: f1(y), r: 3.5 }); });
  MATURITY.forEach((d, i) => {
    const c = Math.cos(ang(i)), sn = Math.sin(ang(i));
    const x = cx + c * (R + 20), y = cy + sn * (R + 20);
    const anchor = Math.abs(c) < 0.2 ? "middle" : c > 0 ? "start" : "end";
    const words = d.name.split(" ");
    const lines = d.name.length > 12 && words.length > 1 ? [words.slice(0, Math.ceil(words.length / 2)).join(" "), words.slice(Math.ceil(words.length / 2)).join(" ")] : [d.name];
    const y0 = sn < -0.5 ? y - (lines.length - 1) * 15 : sn > 0.5 ? y + 8 : y - ((lines.length - 1) * 15) / 2 + 4;
    const t = add(s, "text", { class: "r-label", x: f1(x), y: f1(y0), "text-anchor": anchor });
    lines.forEach((ln, k) => add(t, "tspan", { x: f1(x), dy: k ? 15 : 0 }, ln));
  });
  el.appendChild(s);
}

// ---------------------------------------------------------------- dumbbell (maturity before → now)
function dumbbell(el) {
  if (!el) return;
  const rows = MATURITY.map((d) => `
    <div class="db-row">
      <span class="db-name">${d.name}</span>
      <div class="db-track" aria-label="${d.name}: ${d.before} in May, ${d.now} today, target ${d.target}">
        <i class="db-line" style="left:${(d.before / 5) * 100}%;width:${((d.now - d.before) / 5) * 100}%"></i>
        <i class="db-target" style="left:${(d.target / 5) * 100}%" title="target ${d.target}"></i>
        <i class="db-dot before" style="left:${(d.before / 5) * 100}%"></i>
        <i class="db-dot now" style="left:${(d.now / 5) * 100}%"></i>
      </div>
      <span class="db-val">${d.before} → <b>${d.now}</b></span>
    </div>`).join("");
  el.innerHTML = `<div class="db-scale" aria-hidden="true"><span></span><div>${[0, 1, 2, 3, 4, 5].map((v) => `<span style="left:${v * 20}%">${v}</span>`).join("")}</div><span></span></div>${rows}
    <p class="db-note">Vertical tick = target for the dimension.</p>`;
}

// ---------------------------------------------------------------- contracts (bullet bars)
function contracts(el) {
  if (!el) return;
  const state = (c) => {
    const diff = c.used - c.elapsed;
    if (c.used >= 95) return ["bad", "Exhausting"];
    if (diff > 10) return ["warn", "Accelerated"];
    if (diff < -15) return ["info", "Slow pace"];
    return ["ok", "Healthy"];
  };
  el.innerHTML = `<div class="ct-head" aria-hidden="true"><span>Contract</span><span>Hours used vs. time elapsed</span><span>Status</span></div>` +
    CONTRACTS.map((c) => {
      const [k, label] = state(c);
      return `<div class="ct-row">
        <div class="ct-name"><b>${c.client}</b><span>${c.type} · ${c.cap}</span></div>
        <div class="ct-bar" aria-label="${c.client}: ${c.used}% of hours used, ${c.elapsed}% of time elapsed">
          <i class="ct-fill ${k}" style="width:${Math.min(c.used, 100)}%"></i>
          <i class="ct-mark" style="left:${c.elapsed}%"></i>
          <span class="ct-num">${c.used}%</span>
        </div>
        <span class="pill ${k}">${label}</span>
      </div>`;
    }).join("");
}

// ---------------------------------------------------------------- portfolio gantt
function gantt(el, legendEl) {
  if (!el) return;
  const pct = (m) => (m / MONTHS.length) * 100;
  el.innerHTML = `
    <div class="g-head"><span></span><div class="g-months">${MONTHS.map((m) => `<span>${m}</span>`).join("")}</div><span></span></div>
    ${PROJECTS.map((p) => `
      <div class="g-row">
        <span class="g-name">${p.name}</span>
        <div class="g-track">
          ${p.seg.map(([ph, a, b]) => `<i class="g-seg ph-${ph}" style="left:${pct(a)}%;width:${pct(b - a)}%" title="${PHASES.find((x) => x.id === ph).name}"></i>`).join("")}
          <i class="g-today" style="left:${pct(TODAY)}%"></i>
        </div>
        <span class="pill ${p.status[0]}">${p.status[1]}</span>
      </div>`).join("")}
    <div class="g-foot"><span></span><div><span class="g-today-label" style="left:${pct(TODAY)}%">today</span></div><span></span></div>`;
  if (legendEl) legendEl.innerHTML = PHASES.map((ph) => `<span><i class="sq ph-${ph.id}"></i>${ph.name}</span>`).join("");
}

radar(document.getElementById("radar"));
dumbbell(document.getElementById("dumbbell"));
contracts(document.getElementById("contracts"));
gantt(document.getElementById("gantt"), document.getElementById("phase-legend"));

// nav: solid background once the dark hero scrolls away
const nav = document.getElementById("nav");
const hero = document.getElementById("top");
if (nav && hero && "IntersectionObserver" in window) {
  new IntersectionObserver(([e]) => nav.classList.toggle("solid", !e.isIntersecting), { rootMargin: "-64px 0px 0px 0px" }).observe(hero);
}
