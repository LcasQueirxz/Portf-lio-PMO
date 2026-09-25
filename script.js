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

const THROUGHPUT = [
  // tickets per week, last 12 weeks
  { w: "W1", created: 9, resolved: 4 }, { w: "W2", created: 14, resolved: 6 }, { w: "W3", created: 8, resolved: 17 },
  { w: "W4", created: 10, resolved: 9 }, { w: "W5", created: 11, resolved: 7 }, { w: "W6", created: 12, resolved: 13 },
  { w: "W7", created: 9, resolved: 15 }, { w: "W8", created: 13, resolved: 10 }, { w: "W9", created: 10, resolved: 9 },
  { w: "W10", created: 16, resolved: 12 }, { w: "W11", created: 12, resolved: 14 }, { w: "W12", created: 8, resolved: 16 },
];

const STATES = [
  { id: "work", name: "Working now" },
  { id: "review", name: "Test / review" },
  { id: "blocked", name: "Blocked outside the team" },
  { id: "queue", name: "In the queue" },
];
const WORKLOAD = [
  // story points per state
  { name: "Dev A", work: 3, review: 15, blocked: 0, queue: 6 },
  { name: "Dev B", work: 4, review: 5, blocked: 4, queue: 5 },
  { name: "Dev C", work: 3, review: 2, blocked: 7, queue: 1 },
  { name: "Dev D", work: 0, review: 6, blocked: 0, queue: 0 },
  { name: "Dev E", work: 0, review: 0, blocked: 0, queue: 6 },
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

// ---------------------------------------------------------------- support throughput (created vs resolved)
function throughput(el) {
  if (!el) return;
  const W = 540, H = 210, L = 32, R = 520, T = 12, B = 176, max = 20;
  const x = (i) => L + (i * (R - L)) / (THROUGHPUT.length - 1);
  const y = (v) => B - (v / max) * (B - T);
  const pts = (k) => THROUGHPUT.map((d, i) => `${x(i).toFixed(1)},${y(d[k]).toFixed(1)}`).join(" ");
  const grid = [0, 5, 10, 15, 20].map((v) => `<line x1="${L}" y1="${y(v)}" x2="${R}" y2="${y(v)}" /><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${v}</text>`).join("");
  const labels = THROUGHPUT.map((d, i) => (i % 2 ? "" : `<text x="${x(i)}" y="${B + 20}" text-anchor="middle">${d.w}</text>`)).join("");
  el.innerHTML = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Line chart over 12 weeks: resolved tickets overtake created tickets in most of the recent weeks.">
    <g class="grid">${[0, 5, 10, 15, 20].map((v) => `<line x1="${L}" y1="${y(v)}" x2="${R}" y2="${y(v)}" />`).join("")}</g>
    <g class="axis">${[0, 5, 10, 15, 20].map((v) => `<text x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${v}</text>`).join("")}${labels}</g>
    <polygon class="s-area" points="${x(0)},${B} ${pts("resolved")} ${x(THROUGHPUT.length - 1)},${B}" />
    <polyline class="s-created" points="${pts("created")}" />
    <polyline class="s-actual" points="${pts("resolved")}" />
  </svg>`;
}

// ---------------------------------------------------------------- workload per person (stacked by state)
function workload(el, legendEl) {
  if (!el) return;
  const max = 30;
  el.innerHTML = WORKLOAD.map((p) => {
    const total = STATES.reduce((s, st) => s + p[st.id], 0);
    return `<div class="wl-row">
      <span class="wl-name">${p.name}</span>
      <div class="wl-bar" aria-label="${p.name}: ${STATES.map((st) => `${p[st.id]} SP ${st.name.toLowerCase()}`).join(", ")}">
        ${STATES.filter((st) => p[st.id]).map((st) => `<i class="wl-${st.id}" style="width:${(p[st.id] / max) * 100}%">${p[st.id]}</i>`).join("")}
      </div>
      <span class="wl-total">${total} SP</span>
    </div>`;
  }).join("");
  if (legendEl) legendEl.innerHTML = STATES.map((st) => `<span><i class="sq wl-${st.id}"></i>${st.name}</span>`).join("");
}

// ---------------------------------------------------------------- jira workflow (swimlanes by role)
const LANES = ["Developer", "Tech lead", "Designer", "QA"];
const WF_NODES = [
  // id, label, lane, column, kind (wait | work | done | "")
  { id: "backlog", label: "Backlog", lane: 1, col: 0, kind: "wait" },
  { id: "todo", label: "To do", lane: 0, col: 1, kind: "" },
  { id: "prog", label: "In\nprogress", lane: 0, col: 2, kind: "work" },
  { id: "wcr", label: "Waiting\nreview", lane: 0, col: 3, kind: "wait" },
  { id: "cr", label: "Code\nreview", lane: 1, col: 4, kind: "work" },
  { id: "wdr", label: "Waiting\ndesign", lane: 2, col: 5, kind: "wait" },
  { id: "dr", label: "Design\nreview", lane: 2, col: 6, kind: "work" },
  { id: "rqa", label: "Ready\nfor QA", lane: 3, col: 7, kind: "wait" },
  { id: "qat", label: "QA\ntesting", lane: 3, col: 8, kind: "work" },
  { id: "done", label: "Done", lane: 3, col: 9, kind: "done" },
];
const WF_EDGES = [
  ["backlog", "todo"], ["todo", "prog"], ["prog", "wcr"], ["wcr", "cr"], ["cr", "wdr"],
  ["cr", "rqa", "no UI change"], ["wdr", "dr"], ["dr", "rqa"], ["rqa", "qat"], ["qat", "done"],
];
const WF_REWORK = ["cr", "dr", "qat"]; // each can send the ticket back to In progress

function workflow(el) {
  if (!el) return;
  const L = 78, CW = 74, NW = 66, NH = 38, TOP = 34, LH = 70;
  const W = L + CW * 10, H = TOP + LH * LANES.length + 4;
  const nodes = Object.fromEntries(WF_NODES.map((n) => [n.id, { ...n, cx: L + CW * n.col + CW / 2, cy: TOP + LH * n.lane + LH / 2 }]));
  const arrow = 'marker-end="url(#wf-arrow)"';

  const lanes = LANES.map((name, i) => `
    <rect class="wf-lane${i % 2 ? " alt" : ""}" x="0" y="${TOP + LH * i}" width="${W}" height="${LH}" rx="8" />
    <text class="wf-lane-name" x="12" y="${TOP + LH * i + LH / 2 + 4}">${name}</text>`).join("");

  // forward edges: straight when on the same lane, otherwise right-then-vertical elbow
  const edges = WF_EDGES.map(([a, b, note]) => {
    const s = nodes[a], t = nodes[b];
    if (s.lane === t.lane) return `<path class="wf-edge" d="M${s.cx + NW / 2} ${s.cy} H${t.cx - NW / 2 - 3}" ${arrow} />`;
    const down = t.lane > s.lane;
    const ty = down ? t.cy - NH / 2 - 3 : t.cy + NH / 2 + 3;
    const label = note ? `<text class="wf-note" x="${(s.cx + t.cx) / 2 + 20}" y="${s.cy - 6}" text-anchor="middle">${note}</text>` : "";
    return `<path class="wf-edge" d="M${s.cx + NW / 2} ${s.cy} H${t.cx} V${ty}" ${arrow} />${label}`;
  }).join("");

  // rework: up to a shared rail above the lanes, then back into In progress
  const back = nodes.prog, railY = 16;
  const rework = WF_REWORK.map((id) => {
    const n = nodes[id], x = n.cx + 20;
    return `<path class="wf-back" d="M${x} ${n.cy - NH / 2} V${railY} H${back.cx + 18} V${back.cy - NH / 2 - 3}" ${arrow.replace("wf-arrow", "wf-arrow-back")} />`;
  }).join("");

  const boxes = WF_NODES.map((n) => {
    const { cx, cy } = nodes[n.id];
    const lines = n.label.split("\n");
    const text = lines.map((ln, i) => `<tspan x="${cx}" dy="${i ? 12 : lines.length > 1 ? -2 : 4}">${ln}</tspan>`).join("");
    return `<g class="wf-node ${n.kind}"><rect x="${cx - NW / 2}" y="${cy - NH / 2}" width="${NW}" height="${NH}" rx="7" /><text x="${cx}" y="${cy}" text-anchor="middle">${text}</text></g>`;
  }).join("");

  const n0 = nodes.backlog;
  el.innerHTML = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Development workflow in four role lanes. Developer: To do, In progress, Waiting code review. Tech lead: Backlog and Code review. Designer: Waiting design review, Design review. QA: Ready for QA, QA testing, Done. Code review goes to design review, or straight to QA when there is no UI change. Code review, design review and QA testing can each send the ticket back to In progress.">
    <defs>
      <marker id="wf-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L8 4 L0 8 z" /></marker>
      <marker id="wf-arrow-back" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L8 4 L0 8 z" /></marker>
    </defs>
    ${lanes}
    <text class="wf-note back" x="${nodes.cr.cx + 30}" y="${railY - 6}">rework</text>
    ${rework}${edges}${boxes}
    <text class="wf-note" x="${n0.cx}" y="${n0.cy + NH / 2 + 13}" text-anchor="middle">↺ from any status</text>
  </svg>`;
}

// ---------------------------------------------------------------- one visual at a time inside each slide
// Every direct child of .case-visual becomes a tab; data-tab overrides the name taken from its caption.
function visualTabs() {
  document.querySelectorAll(".case-visual").forEach((v, k) => {
    const items = [...v.children];
    if (items.length < 2) return;
    const name = (c) => c.dataset.tab || (c.classList.contains("shot") ? "Photo" : (c.querySelector("figcaption b")?.textContent || "More").split(" · ")[0]);
    const bar = document.createElement("div");
    bar.className = "v-tabs";
    bar.setAttribute("role", "tablist");
    const show = (i) => items.forEach((c, j) => { c.hidden = j !== i; bar.children[j].setAttribute("aria-selected", j === i); bar.children[j].tabIndex = j === i ? 0 : -1; });
    items.forEach((c, i) => {
      c.id ||= `v${k}-${i}`;
      c.setAttribute("role", "tabpanel");
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-controls", c.id);
      b.textContent = name(c);
      b.addEventListener("click", () => show(i));
      bar.appendChild(b);
    });
    v.prepend(bar);
    v.classList.add("tabbed");
    show(0);
  });
}

// ---------------------------------------------------------------- projects timeline (drag, swipe, arrows, rail)
// Each <article class="slide"> becomes one stop; its data-date / data-label feed the rail.
function timeline() {
  const track = document.getElementById("tl-track");
  const rail = document.getElementById("tl-rail");
  const prev = document.getElementById("tl-prev");
  const next = document.getElementById("tl-next");
  const count = document.getElementById("tl-count");
  if (!track || !rail) return;
  const slides = [...track.querySelectorAll(".slide")];
  const n = slides.length;
  const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  slides.forEach((s, i) => { s.setAttribute("role", "group"); s.setAttribute("aria-roledescription", "slide"); s.setAttribute("aria-label", `${i + 1} of ${n}`); });
  rail.style.setProperty("--n", n);
  rail.innerHTML = slides.map((s) => `<li><button type="button" title="${s.dataset.label}"><i></i><span class="tl-date">${s.dataset.date}</span><span class="tl-label">${s.dataset.label}</span></button></li>`).join("");
  const stops = [...rail.querySelectorAll("button")];
  const bar = track.parentElement.querySelector(".tl-bar");

  // prev / next at the end of every slide, so nobody has to scroll back up to move on
  slides.forEach((s, i) => {
    const p = slides[i - 1], x = slides[i + 1];
    const nav = document.createElement("nav");
    nav.className = "slide-nav";
    nav.setAttribute("aria-label", "Project navigation");
    nav.innerHTML =
      (p ? `<button type="button" class="sn-prev" data-go="${i - 1}"><small>← Previous</small>${p.dataset.label}</button>` : "<span></span>") +
      (x ? `<button type="button" class="sn-next" data-go="${i + 1}"><small>Next →</small>${x.dataset.label}</button>` : "");
    s.appendChild(nav);
  });

  let active = 0;
  // when the reader is deep inside a long slide, bring the top of the next one into view
  const toTop = (animate) => {
    const navH = document.getElementById("nav")?.offsetHeight || 0;
    const y = track.getBoundingClientRect().top + window.scrollY - navH - (bar?.offsetHeight || 0) - 8;
    if (window.scrollY > y + 4) window.scrollTo({ top: y, behavior: animate ? "smooth" : "auto" });
  };
  const go = (i, animate = smooth) => {
    i = Math.max(0, Math.min(n - 1, i));
    track.scrollTo({ left: slides[i].offsetLeft, behavior: animate ? "smooth" : "auto" });
    toTop(animate);
  };
  track.addEventListener("click", (e) => {
    const b = e.target.closest("[data-go]");
    if (b) go(+b.dataset.go);
    if (e.target.closest('[role="tab"]')) requestAnimationFrame(update); // mobile: height follows the open tab
  });
  const nearest = () => {
    if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 2) return n - 1;
    let best = 0;
    slides.forEach((s, i) => { if (Math.abs(s.offsetLeft - track.scrollLeft) < Math.abs(slides[best].offsetLeft - track.scrollLeft)) best = i; });
    return best;
  };
  const update = () => {
    active = nearest();
    stops.forEach((b, i) => { b.setAttribute("aria-current", i === active); b.classList.toggle("past", i < active); });
    rail.style.setProperty("--p", n > 1 ? active / (n - 1) : 0);
    if (count) count.textContent = `${active + 1} / ${n}`;
    if (prev) prev.disabled = active === 0;
    if (next) next.disabled = active === n - 1;
    // track follows the active slide's height, so short slides don't leave a gap
    track.style.height = `${slides[active].offsetHeight}px`;
  };

  stops.forEach((b, i) => b.addEventListener("click", () => go(i)));
  prev?.addEventListener("click", () => go(active - 1));
  next?.addEventListener("click", () => go(active + 1));
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(active + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(active - 1); }
  });
  let raf = 0;
  track.addEventListener("scroll", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
  window.addEventListener("resize", () => { go(active, false); update(); });
  document.fonts?.ready.then(update);
  track.querySelectorAll("img").forEach((img) => { img.addEventListener("load", update); img.addEventListener("error", () => setTimeout(update)); });

  // mouse drag (touch already swipes natively through scroll-snap)
  let drag = null;
  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag = { x: e.clientX, left: track.scrollLeft, start: active, moved: false };
  });
  window.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved) {
      if (Math.abs(dx) < 6) return;
      drag.moved = true;
      track.classList.add("dragging");
      window.getSelection()?.removeAllRanges();
    }
    track.scrollLeft = drag.left - dx;
  });
  window.addEventListener("pointerup", (e) => {
    if (!drag) return;
    const d = drag;
    drag = null;
    if (!d.moved) return;
    track.classList.remove("dragging");
    const dx = e.clientX - d.x;
    go(Math.abs(dx) > 60 ? d.start + (dx < 0 ? 1 : -1) : d.start);
  });

  update();
}

dumbbell(document.getElementById("dumbbell"));
contracts(document.getElementById("contracts"));
gantt(document.getElementById("gantt"), document.getElementById("phase-legend"));
throughput(document.getElementById("throughput"));
workload(document.getElementById("workload"), document.getElementById("workload-legend"));
workflow(document.getElementById("workflow"));
visualTabs();
timeline();

// nav: solid background once the dark hero scrolls away
const nav = document.getElementById("nav");
const hero = document.getElementById("top");
if (nav && hero && "IntersectionObserver" in window) {
  new IntersectionObserver(([e]) => nav.classList.toggle("solid", !e.isIntersecting), { rootMargin: "-64px 0px 0px 0px" }).observe(hero);
}
