/* Interactive task-factor information chart for the LiveBench post. */
(() => {
  "use strict";

  const NS = "http://www.w3.org/2000/svg";
  const chart = document.querySelector("[data-livebench-task-information]");
  if (!chart) return;
  const viewport = chart.querySelector(".task-information-viewport");
  const detail = chart.querySelector(".task-information-detail");
  const colors = {
    LCB_generation: "#2563eb",
    coding_completion: "#e67700",
    connections: "#16a34a",
    plot_unscrambling: "#9333ea",
    typos: "#c2410c",
    paraphrase: "#0891b2",
    story_generation: "#be185d",
  };
  const layout = { left: 94, right: 960, top: 38, bottom: 355, markerY: 408 };
  const x = (theta) => layout.left + (theta + 4) * (layout.right - layout.left) / 8;
  const format = (value) => Number(value).toFixed(2).replace("-0.00", "0.00");

  function add(parent, name, attributes = {}, content) {
    const node = document.createElementNS(NS, name);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, String(value));
    if (content !== undefined) node.textContent = content;
    parent.appendChild(node);
    return node;
  }

  function render(data) {
    if (!Array.isArray(data.tasks) || data.tasks.length !== 7) throw new Error("Expected seven tasks");
    const informationMax = Math.ceil(Math.max(...data.tasks.map((task) => task.peak)) / 10) * 10;
    if (!Number.isFinite(informationMax) || informationMax <= 0) throw new Error("Invalid information scale");
    for (const task of data.tasks) {
      if (!Array.isArray(task.theta) || task.theta.length !== task.information.length || !task.markers.length || task.peak <= 0 || !colors[task.id]) {
        throw new Error(`Invalid curve or markers for ${task.id}`);
      }
    }
    const y = (information) => layout.bottom - information / informationMax * (layout.bottom - layout.top);
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 1040 478");
    svg.setAttribute("class", "task-information-svg");
    svg.setAttribute("aria-label", "Overlaid task information curves with selectable tasks and model markers");
    add(svg, "title", {}, "Task information across seven LiveBench tasks");
    add(svg, "desc", {}, `All task curves share a score axis and an information axis from zero to ${informationMax}. Select a task to emphasize its curve and show model markers.`);

    for (let value = 0; value <= informationMax; value += informationMax / 4) {
      const position = y(value);
      add(svg, "line", { x1: layout.left, x2: layout.right, y1: position, y2: position, class: "task-information-grid" });
      add(svg, "text", { x: layout.left - 13, y: position + 4, "text-anchor": "end", class: "task-information-axis-label" }, String(Math.round(value)));
    }
    for (const value of [-4, -2, 0, 2, 4]) {
      const position = x(value);
      add(svg, "line", { x1: position, x2: position, y1: layout.top, y2: layout.bottom, class: value === 0 ? "task-information-grid-zero" : "task-information-grid" });
      add(svg, "text", { x: position, y: layout.bottom + 24, "text-anchor": "middle", class: "task-information-axis-label" }, String(value));
    }
    add(svg, "text", { x: 16, y: 18, class: "task-information-axis-title" }, "Test information (same scale for every task)");
    add(svg, "text", { x: (layout.left + layout.right) / 2, y: 466, "text-anchor": "middle", class: "task-information-axis-title" }, "Task-factor score (SD units)");
    add(svg, "text", { x: layout.left, y: layout.markerY - 22, class: "task-information-strip-label" }, "Example models · median and 90% interval for selected task");
    add(svg, "line", { x1: layout.left, x2: layout.right, y1: layout.markerY, y2: layout.markerY, class: "task-information-strip-baseline" });

    const curves = add(svg, "g", { class: "task-information-curves" });
    const selectedFill = add(curves, "path", { class: "task-information-fill" });
    const curveNodes = new Map();
    const markerLayer = add(svg, "g", { class: "task-information-markers" });
    const buttons = new Map();

    function showModel(task, marker, markerGroup, guide, point) {
      markerLayer.querySelectorAll(".task-information-marker.is-selected").forEach((node) => node.classList.remove("is-selected"));
      markerGroup.classList.add("is-selected");
      const position = x(marker.median);
      const curveY = y(marker.information_at_median);
      for (const [key, value] of Object.entries({ x1: position, x2: position, y1: curveY, y2: layout.markerY })) guide.setAttribute(key, String(value));
      guide.style.display = "";
      point.setAttribute("cx", String(position));
      point.setAttribute("cy", String(curveY));
      point.setAttribute("fill", colors[task.id]);
      point.style.display = "";
      detail.replaceChildren();
      const heading = document.createElement("strong");
      heading.textContent = `${task.label}: ${marker.label}`;
      const modelId = document.createElement("span");
      modelId.className = "task-information-model-id";
      modelId.textContent = marker.model;
      const values = document.createElement("span");
      values.textContent = `Task-factor score ${format(marker.median)} (90% interval ${format(marker.q05)} to ${format(marker.q95)}); test information at that score ${format(marker.information_at_median)}. Based on ${marker.responses} retained item responses.`;
      detail.append(heading, modelId, values);
    }

    function activateTask(task) {
      for (const [id, entry] of curveNodes) {
        entry.line.classList.toggle("is-active", id === task.id);
        entry.hit.setAttribute("aria-pressed", id === task.id ? "true" : "false");
        buttons.get(id).setAttribute("aria-pressed", id === task.id ? "true" : "false");
      }
      const activeCurve = curveNodes.get(task.id);
      curves.appendChild(activeCurve.line);
      curves.appendChild(activeCurve.hit);
      selectedFill.setAttribute("d", `${activeCurve.d} L${x(task.theta[task.theta.length - 1])},${layout.bottom} L${x(task.theta[0])},${layout.bottom} Z`);
      selectedFill.setAttribute("fill", colors[task.id]);
      markerLayer.replaceChildren();
      const guide = add(markerLayer, "line", { class: "task-information-selected-guide" });
      const point = add(markerLayer, "circle", { r: 5, class: "task-information-selected-point" });
      guide.style.display = "none";
      point.style.display = "none";
      const markerNodes = [];
      for (const marker of task.markers) {
        const position = x(marker.median);
        const group = add(markerLayer, "g", { class: "task-information-marker", tabindex: "0", role: "button", "aria-label": `${task.label}, ${marker.label}; score ${format(marker.median)}, 90 percent interval ${format(marker.q05)} to ${format(marker.q95)}` });
        add(group, "title", {}, `${marker.label} · ${task.label} · score ${format(marker.median)} [${format(marker.q05)}, ${format(marker.q95)}]`);
        add(group, "line", { x1: x(marker.q05), x2: x(marker.q95), y1: layout.markerY, y2: layout.markerY, class: "task-information-interval" });
        add(group, "line", { x1: position, x2: position, y1: layout.markerY - 11, y2: layout.markerY + 11, class: "task-information-tick" });
        add(group, "rect", { x: position - 9, y: layout.markerY - 16, width: 18, height: 32, class: "task-information-hitbox" });
        const select = () => showModel(task, marker, group, guide, point);
        group.addEventListener("pointerenter", select);
        group.addEventListener("pointerdown", select);
        group.addEventListener("focus", select);
        group.addEventListener("click", select);
        group.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(); } });
        markerNodes.push(group);
      }
      const middle = Math.floor(markerNodes.length / 2);
      showModel(task, task.markers[middle], markerNodes[middle], guide, point);
    }

    for (const task of data.tasks) {
      const d = task.theta.map((theta, index) => `${index ? "L" : "M"}${x(theta).toFixed(2)},${y(task.information[index]).toFixed(2)}`).join(" ");
      const line = add(curves, "path", { d, class: "task-information-curve", stroke: colors[task.id] });
      const hit = add(curves, "path", { d, class: "task-information-curve-hit", tabindex: "0", role: "button", "aria-label": `Highlight ${task.label} information curve` });
      curveNodes.set(task.id, { line, hit, d });
      hit.addEventListener("pointerdown", () => activateTask(task));
      hit.addEventListener("click", () => activateTask(task));
      hit.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); activateTask(task); } });
    }

    const controls = document.createElement("div");
    controls.className = "task-information-controls";
    controls.setAttribute("role", "group");
    controls.setAttribute("aria-label", "Choose a task information curve to emphasize");
    for (const task of data.tasks) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "task-information-task-button";
      button.style.setProperty("--task-color", colors[task.id]);
      button.textContent = `${task.label} · peak ${format(task.peak)}`;
      button.addEventListener("click", () => activateTask(task));
      controls.appendChild(button);
      buttons.set(task.id, button);
    }
    chart.insertBefore(controls, viewport);
    viewport.replaceChildren(svg);
    activateTask(data.tasks.find((task) => task.id === "connections") || data.tasks[0]);
  }

  fetch(chart.dataset.src)
    .then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
    .then(render)
    .catch((error) => {
      console.warn("Could not load interactive LiveBench information chart", error);
      detail.textContent = "The interactive chart is unavailable; use the overview image and full-size task plots below.";
    });
})();
