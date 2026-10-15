/* Interactive movie rating-system information functions. */
(() => {
  "use strict";

  const root = document.querySelector("[data-star-rating-information]");
  if (!root) return;
  const viewport = root.querySelector(".rating-information-viewport");
  const status = root.querySelector(".rating-information-status");
  const NS = "http://www.w3.org/2000/svg";

  function add(parent, tag, attributes = {}, content) {
    const element = document.createElementNS(NS, tag);
    for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, String(value));
    if (content !== undefined) element.textContent = content;
    parent.appendChild(element);
    return element;
  }

  function render(data) {
    if (!Array.isArray(data.theta) || data.theta.length < 2 || !Array.isArray(data.series) || data.series.length !== 8 ||
        !data.theta.every(Number.isFinite)) throw new Error("Invalid information-curve data");
    for (const series of data.series) {
      if (!Array.isArray(series.information) || series.information.length !== data.theta.length ||
          !series.information.every(Number.isFinite)) throw new Error(`Invalid curve: ${series.id}`);
    }
    const maximum = Math.ceil(Math.max(...data.series.flatMap((series) => series.information)) / 5) * 5;
    const controls = document.createElement("div");
    controls.className = "rating-information-controls";
    controls.setAttribute("role", "group");
    controls.setAttribute("aria-label", "Highlight a rating system");
    const buttons = new Map();
    const selected = new Set();
    let entries = new Map();
    let lineLayer;
    let hitLayer;
    let drawnWidth = 0;

    function updateSelection() {
      for (const [id, entry] of entries) {
        entry.line.classList.toggle("is-selected", selected.has(id));
        entry.line.classList.toggle("is-muted", selected.size > 0 && !selected.has(id));
        entry.hit.setAttribute("aria-pressed", String(selected.has(id)));
        buttons.get(id).setAttribute("aria-pressed", String(selected.has(id)));
      }
      for (const id of selected) {
        lineLayer.appendChild(entries.get(id).line);
        hitLayer.appendChild(entries.get(id).hit);
      }
      const active = data.series.filter((series) => selected.has(series.id));
      status.textContent = active.length ? `${active.map((series) => series.label).join(" and ")} highlighted.` : "All rating systems shown equally.";
    }

    function select(id) {
      if (selected.has(id)) selected.delete(id);
      else selected.add(id);
      updateSelection();
    }

    for (const series of data.series) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "rating-information-label";
      button.setAttribute("aria-pressed", "false");
      button.style.setProperty("--series-color", series.color);
      const swatch = document.createElement("span");
      swatch.className = `rating-information-swatch${series.comparison ? " is-comparison" : ""}`;
      swatch.setAttribute("aria-hidden", "true");
      button.append(swatch, document.createTextNode(series.label));
      button.addEventListener("click", () => select(series.id));
      controls.appendChild(button);
      buttons.set(series.id, button);
    }
    root.insertBefore(controls, viewport);

    function draw() {
      const width = Math.round(viewport.clientWidth);
      if (!width || width === drawnWidth) return;
      drawnWidth = width;
      const height = Math.round(Math.min(480, Math.max(340, width * 0.56)));
      const frame = { left: width < 520 ? 51 : 61, right: width - 15, top: 18, bottom: height - 56 };
      const x = (value) => frame.left + (value + 3) * (frame.right - frame.left) / 6;
      const y = (value) => frame.bottom - value / maximum * (frame.bottom - frame.top);
      const svg = document.createElementNS(NS, "svg");
      svg.setAttribute("class", "rating-information-svg");
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.setAttribute("aria-labelledby", "rating-information-svg-title rating-information-svg-desc");
      add(svg, "title", { id: "rating-information-svg-title" }, "Movie Rating Information Functions");
      add(svg, "desc", { id: "rating-information-svg-desc" }, "Fisher information across latent movie quality for six star-rating scales, Openskill, and BT. Select a curve or its label to emphasize it.");

      for (let value = 0; value <= maximum; value += 5) {
        const position = y(value);
        add(svg, "line", { x1: frame.left, x2: frame.right, y1: position, y2: position, class: "rating-information-grid" });
        add(svg, "text", { x: frame.left - 10, y: position + 4, "text-anchor": "end", class: "rating-information-axis" }, String(value));
      }
      for (const value of [-3, -2, -1, 0, 1, 2, 3]) {
        const position = x(value);
        add(svg, "line", { x1: position, x2: position, y1: frame.top, y2: frame.bottom, class: "rating-information-grid" });
        add(svg, "text", { x: position, y: frame.bottom + 23, "text-anchor": "middle", class: "rating-information-axis" }, String(value));
      }
      add(svg, "text", { x: (frame.left + frame.right) / 2, y: height - 10, "text-anchor": "middle", class: "rating-information-axis-title" }, "Latent movie quality (standard deviations)");
      add(svg, "text", { x: 17, y: (frame.top + frame.bottom) / 2, transform: `rotate(-90 17 ${(frame.top + frame.bottom) / 2})`, "text-anchor": "middle", class: "rating-information-axis-title" }, "Fisher information");

      lineLayer = add(svg, "g");
      hitLayer = add(svg, "g");
      entries = new Map();
      for (const series of data.series) {
        const d = data.theta.map((theta, index) => `${index ? "L" : "M"}${x(theta).toFixed(2)},${y(series.information[index]).toFixed(2)}`).join(" ");
        const line = add(lineLayer, "path", { d, class: `rating-information-curve${series.comparison ? " is-comparison" : ""}`, stroke: series.color });
        const hit = add(hitLayer, "path", { d, class: "rating-information-curve-hit", role: "button", tabindex: "0", "aria-label": `Highlight ${series.label}`, "aria-pressed": "false" });
        hit.addEventListener("click", () => select(series.id));
        hit.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            select(series.id);
          }
        });
        entries.set(series.id, { line, hit });
      }
      viewport.replaceChildren(svg);
      updateSelection();
    }

    draw();
    if (typeof ResizeObserver !== "undefined") new ResizeObserver(draw).observe(viewport);
  }

  fetch(root.dataset.src, { cache: "no-store" })
    .then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
    .then(render)
    .catch((error) => {
      console.warn("Could not load movie rating information chart", error);
      status.textContent = "Interactive chart unavailable; the static graph is shown instead.";
    });
})();
