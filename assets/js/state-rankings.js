(() => {
  "use strict";

  const root = document.querySelector("[data-state-rankings]");
  if (!root) return;
  const byRole = (name) => root.querySelector(`[data-role="${name}"]`);
  const SVG_NS = "http://www.w3.org/2000/svg";
  const controls = byRole("controls");
  const status = byRole("status");
  const scoreMap = byRole("desirability-map");
  const affinityMap = byRole("affinity-map");
  const tooltip = byRole("tooltip");
  const networkTooltip = byRole("network-tooltip");
  const focusSelect = byRole("focus-state");
  const ranking = byRole("ranking");
  const rankingTitle = byRole("ranking-title");
  const rankingNote = byRole("ranking-note");
  const pairHeadings = byRole("pair-column-headings");
  const connections = byRole("connections");
  const affinityRankingTitle = byRole("affinity-ranking-title");
  const affinityRankingNote = byRole("affinity-ranking-note");
  const highlights = byRole("highlights");
  const sampleCount = byRole("sample-count");
  const legend = byRole("legend");
  const affinityLegend = byRole("affinity-legend");
  let baseline;
  let geometry;
  let worker;
  let current;
  let selected = null;
  let requestId = 0;
  let pairRequestId = 0;
  let pendingPairKey = null;
  let pairResult = null;
  let debounce;
  const scorePaths = [];
  const affinityPaths = [];
  const selectionOutlines = [];
  let networkTypical = 1;
  let lastAffinityFocus = null;
  let lastRankingFocus = null;

  const formatNumber = (value) => Math.round(value).toLocaleString("en-US");
  const formatScore = (theta) => `${Math.exp(theta).toFixed(2)}×`;
  const formatRatio = (value) => {
    if (value === null || Number.isNaN(value)) return "—";
    if (value === Infinity) return "∞";
    if (value === 0) return "0×";
    if (value < .01) return "<0.01×";
    return `${value.toLocaleString("en-US", {
      minimumFractionDigits: value < 10 ? 2 : 1,
      maximumFractionDigits: value < 10 ? 2 : 1,
    })}×`;
  };
  const makeSvg = (tag, attributes = {}) => {
    const element = document.createElementNS(SVG_NS, tag);
    for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, String(value));
    return element;
  };

  function setStatus(message, kind = "normal") {
    status.textContent = message;
    status.dataset.kind = kind;
  }

  function readFilters() {
    const data = new FormData(controls);
    const ageMin = Math.max(1, Math.min(99, Number(data.get("ageMin"))));
    const ageMax = Math.max(1, Math.min(99, Number(data.get("ageMax"))));
    const education = Number(data.get("education"));
    if (ageMin > ageMax) throw new Error("The minimum age must be no greater than the maximum age.");
    if (education && ageMax < 25) throw new Error("Education groups require ages 25 or older.");
    return {
      year: String(data.get("year")),
      ageMin: education ? Math.max(25, ageMin) : ageMin,
      ageMax,
      sex: Number(data.get("sex")),
      race: Number(data.get("race")),
      education,
      nativity: Number(data.get("nativity")),
    };
  }

  function requestFit() {
    if (!worker) return;
    let filters;
    try {
      filters = readFilters();
    } catch (error) {
      setStatus(error.message, "error");
      return;
    }
    const id = ++requestId;
    setStatus("Combining fitted subgroup effects…");
    worker.postMessage({type: "compute", id, filters});
  }

  function scheduleFit() {
    clearTimeout(debounce);
    debounce = setTimeout(requestFit, 180);
  }

  function placeTooltip(event, element) {
    const wrap = element.parentElement;
    const bounds = wrap.getBoundingClientRect();
    const left = Math.max(8, Math.min(bounds.width - 175, event.clientX - bounds.left + 12));
    const top = Math.max(8, Math.min(bounds.height - 65, event.clientY - bounds.top + 12));
    element.style.left = `${left}px`;
    element.style.top = `${top}px`;
    element.hidden = false;
  }

  function selectState(index) {
    selected = selected === index ? null : index;
    focusSelect.value = selected === null ? "" : String(selected);
    if (current) renderCurrent();
  }

  function setupMap(svg, collection, isScore) {
    const stateLayer = makeSvg("g", {class: "sr-state-layer"});
    svg.appendChild(stateLayer);
    baseline.states.forEach((state, index) => {
      const feature = geometry.states[String(state.fips)];
      if (!feature) return;
      const path = makeSvg("path", {
        d: feature.path, class: "sr-state", tabindex: "0", role: "button",
        "aria-label": state.name,
        ...(!isScore ? {fill: "#dae7e3"} : {}),
      });
      path.addEventListener("click", () => selectState(index));
      path.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectState(index);
        }
      });
      if (isScore) {
        path.addEventListener("mousemove", (event) => showStateTooltip(event, index));
        path.addEventListener("mouseleave", () => { tooltip.hidden = true; });
      } else {
        path.addEventListener("mousemove", (event) => showAffinityTooltip(event, index));
        path.addEventListener("mouseleave", () => { networkTooltip.hidden = true; });
      }
      stateLayer.appendChild(path);
      collection[index] = path;
    });
    stateLayer.appendChild(makeSvg("path", {
      d: geometry.borders, class: "sr-map-borders", "aria-hidden": "true",
    }));
    const dc = baseline.states.findIndex((state) => state.abbr === "DC");
    const [x, y] = geometry.states["11"].center;
    const dot = makeSvg("circle", {cx: x, cy: y, r: 5, class: "sr-state sr-dc-dot",
                                  tabindex: "0", role: "button", "aria-label": "District of Columbia"});
    dot.addEventListener("click", () => selectState(dc));
    dot.addEventListener("mousemove", (event) =>
      isScore ? showStateTooltip(event, dc) : showAffinityTooltip(event, dc));
    dot.addEventListener("mouseleave", () => { (isScore ? tooltip : networkTooltip).hidden = true; });
    dot.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectState(dc); }
    });
    stateLayer.appendChild(dot);
    collection.dcDot = dot;
    const selectionOutline = makeSvg("path", {
      class: "sr-selection-outline", visibility: "hidden", "aria-hidden": "true",
    });
    stateLayer.appendChild(selectionOutline);
    selectionOutlines.push(selectionOutline);
    for (const [label, x, y] of [["AK", 65, 510], ["HI", 325, 510]]) {
      svg.appendChild(makeSvg("text", {x, y, class: "sr-map-inset-label"})).textContent = label;
    }
  }

  function showStateTooltip(event, index) {
    if (!current) return;
    const ranks = [...current.theta.keys()].sort((a, b) => current.theta[b] - current.theta[a]);
    tooltip.innerHTML = `<strong>${baseline.states[index].name}</strong>` +
      `${formatScore(current.theta[index])} relative desirability · rank ${ranks.indexOf(index) + 1} of 51`;
    placeTooltip(event, tooltip);
  }

  function hexToRgb(hex) {
    return [1, 3, 5].map((position) => parseInt(hex.slice(position, position + 2), 16));
  }

  function interpolateColor(from, to, fraction) {
    const a = hexToRgb(from), b = hexToRgb(to);
    const channels = a.map((value, index) => Math.round(value + (b[index] - value) * fraction));
    return `rgb(${channels.join(",")})`;
  }

  function scoreColor(theta, limit) {
    const fraction = Math.min(1, Math.abs(theta) / limit);
    return theta < 0 ? interpolateColor("#f6f2e9", "#b34655", fraction) :
                       interpolateColor("#f6f2e9", "#24756a", fraction);
  }

  function affinityColor(value, typical) {
    if (value <= 0) return "#d5dadc";
    const ratio = value / typical;
    if (ratio <= 1) {
      const fraction = Math.max(0, Math.min(1, Math.log(ratio / .1) / Math.log(10)));
      return interpolateColor("#e2edf7", "#a9cce3", fraction);
    }
    const fraction = Math.max(0, Math.min(1, Math.log(ratio) / Math.log(100)));
    return interpolateColor("#a9cce3", "#205986", fraction);
  }

  function affinityDescription(index) {
    if (selected === null) return "Select to view affinities with this state";
    if (selected === index) return "Selected state";
    const value = current.affinity[selected][index];
    if (value <= 0) return "No estimated pair affinity";
    return `With ${baseline.states[selected].name} · ${(value / networkTypical).toFixed(1)}× median pair affinity`;
  }

  function showAffinityTooltip(event, index) {
    if (!current) return;
    networkTooltip.innerHTML = `<strong>${baseline.states[index].name}</strong>${affinityDescription(index)}`;
    placeTooltip(event, networkTooltip);
  }

  function renderScoreMap() {
    const limit = Math.max(.4, ...current.theta.map(Math.abs));
    current.theta.forEach((theta, index) => {
      const path = scorePaths[index];
      if (!path) return;
      path.setAttribute("fill", scoreColor(theta, limit));
      path.setAttribute("aria-label", `${baseline.states[index].name}: ${formatScore(theta)} relative desirability`);
      path.setAttribute("aria-pressed", selected === index ? "true" : "false");
      path.classList.toggle("is-selected", selected === index);
    });
    const dc = baseline.states.findIndex((state) => state.abbr === "DC");
    scorePaths.dcDot.setAttribute("fill", scoreColor(current.theta[dc], limit));
    scorePaths.dcDot.setAttribute("aria-label", scorePaths[dc].getAttribute("aria-label"));
    scorePaths.dcDot.setAttribute("aria-pressed", selected === dc ? "true" : "false");
    scorePaths.dcDot.classList.toggle("is-selected", selected === dc);
    legend.innerHTML = `<span class="sr-legend-bar" aria-hidden="true"></span>
      <span class="sr-legend-ticks"><span>${Math.exp(-limit).toFixed(2)}×</span><span>1×</span><span>${Math.exp(limit).toFixed(2)}×</span></span>`;
    const order = [...current.theta.keys()].sort((a, b) => current.theta[b] - current.theta[a]);
    if (selected === null) {
      highlights.hidden = false;
      highlights.classList.add("is-overview");
      highlights.innerHTML = [["Highest", order[0]], ["Lowest", order[order.length - 1]]]
        .map(([label, index]) => `<div class="sr-extreme"><span>${label}</span><strong>${baseline.states[index].name}</strong><b>${formatScore(current.theta[index])}</b></div>`)
        .join("");
      return;
    }
    highlights.hidden = false;
    highlights.classList.remove("is-overview");
    const rank = order.indexOf(selected);
    const strongest = current.affinity[selected]
      .map((value, index) => ({value, index}))
      .filter(({value, index}) => index !== selected && value > 0)
      .sort((a, b) => b.value - a.value)[0];
    const state = (index) => baseline.states[index].name;
    const score = (index) => formatScore(current.theta[index]);
    const flowDetail = current.arrivals && current.departures ?
      `${formatNumber(current.arrivals[selected])} in · ${formatNumber(current.departures[selected])} out` :
      "Estimated arrivals per departure";
    highlights.innerHTML = `
      <div class="sr-detail-heading">
        <h3>${state(selected)}</h3>
        <strong>#${rank + 1} of ${order.length}</strong>
      </div>
      <div class="sr-detail-metrics">
        <div><span>Revealed desirability</span><strong>${score(selected)}</strong></div>
        <div><span>Inflow / outflow</span><strong>${current.inoutRatio[selected].toFixed(2)}×</strong><small>${flowDetail}</small></div>
        <div><span>Strongest pair affinity</span><strong>${strongest ? state(strongest.index) : "No estimate"}</strong><small>${strongest ? `${(strongest.value / networkTypical).toFixed(1)}× median pair affinity` : ""}</small></div>
      </div>`;
  }

  function allEdges() {
    const edges = [];
    for (let i = 0; i < 51; i++) {
      for (let j = i + 1; j < 51; j++) {
        const value = current.affinity[i][j];
        if (value > 0) edges.push({i, j, value});
      }
    }
    return edges.sort((a, b) => b.value - a.value);
  }

  function renderNetwork() {
    networkTooltip.hidden = true;
    const edges = allEdges();
    const typical = edges[Math.floor(edges.length / 2)]?.value || 1;
    networkTypical = typical;
    affinityPaths.forEach((path, index) => {
      if (!path) return;
      const fill = selected === null ? "#dae7e3" :
        selected === index ? "#f6f2e9" : affinityColor(current.affinity[selected][index], typical);
      path.setAttribute("fill", fill);
      path.setAttribute("aria-label", `${baseline.states[index].name}: ${affinityDescription(index)}`);
      path.setAttribute("aria-pressed", selected === index ? "true" : "false");
      path.classList.toggle("is-selected", selected === index);
    });
    const dc = baseline.states.findIndex((state) => state.abbr === "DC");
    affinityPaths.dcDot.setAttribute("fill", affinityPaths[dc].getAttribute("fill"));
    affinityPaths.dcDot.setAttribute("aria-label", affinityPaths[dc].getAttribute("aria-label"));
    affinityPaths.dcDot.setAttribute("aria-pressed", selected === dc ? "true" : "false");
    affinityPaths.dcDot.classList.toggle("is-selected", selected === dc);
    affinityLegend.hidden = selected === null;
    if (selected !== null) affinityLegend.innerHTML = `
      <span class="sr-affinity-legend-title">Affinity with ${baseline.states[selected].name}</span>
      <span class="sr-affinity-legend-bar" aria-hidden="true"></span>
      <span class="sr-affinity-legend-ticks"><span>≤0.1×</span><span>1×</span><span>100×</span></span>
      <span class="sr-affinity-legend-caption">Relative to median pair affinity · gray means no estimate</span>`;
    const isOverall = selected === null;
    const shown = isOverall ? edges.slice(0, 50).map((edge) => ({
      name: `${baseline.states[edge.i].abbr}–${baseline.states[edge.j].abbr}`,
      title: `${baseline.states[edge.i].name}–${baseline.states[edge.j].name}`,
      value: edge.value,
    })) : baseline.states.map((state, index) => ({
      name: state.abbr === "DC" ? "DC" : state.name,
      title: state.name, value: current.affinity[selected][index], index,
    })).filter((row) => row.index !== selected).sort((a, b) => b.value - a.value);
    affinityRankingTitle.textContent = isOverall ? "Strongest pairs" : "State connections";
    affinityRankingNote.textContent = isOverall ?
      `Top ${shown.length} estimated pairs` : "Click a state to refocus the map.";
    connections.replaceChildren();
    shown.forEach((item, rank) => {
      const li = document.createElement("li");
      const row = document.createElement(isOverall ? "div" : "button");
      row.className = "sr-affinity-row";
      row.title = item.title;
      if (!isOverall) {
        row.type = "button";
        row.addEventListener("click", () => selectState(item.index));
      }
      const number = document.createElement("span");
      number.className = "sr-rank-number";
      number.textContent = `${rank + 1}.`;
      const name = document.createElement("span");
      name.className = "sr-rank-name";
      name.textContent = item.name;
      const score = document.createElement("span");
      score.className = "sr-rank-score";
      const ratio = item.value / typical;
      score.textContent = item.value <= 0 ? "—" : ratio < .1 ? "<0.1×" : `${ratio.toFixed(1)}×`;
      row.append(number, name, score);
      li.appendChild(row);
      connections.appendChild(li);
    });
    if (lastAffinityFocus !== selected) connections.scrollTop = 0;
    lastAffinityFocus = selected;
  }

  function renderRanking() {
    ranking.replaceChildren();
    const isPairList = selected !== null;
    ranking.classList.toggle("is-pair-list", isPairList);
    pairHeadings.hidden = !isPairList;
    if (!isPairList) {
      rankingTitle.textContent = "All state scores";
      rankingNote.textContent = "Click a state to connect the ranking to both maps.";
      const order = [...current.theta.keys()].sort((a, b) => current.theta[b] - current.theta[a]);
      order.forEach((index, rank) => {
        const state = baseline.states[index];
        const button = document.createElement("button");
        button.type = "button";
        button.className = "sr-rank-button";
        button.innerHTML = `<span class="sr-rank-number">${rank + 1}.</span><span class="sr-rank-name">${state.name}</span><span class="sr-rank-score">${formatScore(current.theta[index])}</span>`;
        button.addEventListener("click", () => selectState(index));
        ranking.appendChild(button);
      });
    } else {
      const selectedName = baseline.states[selected].name;
      rankingTitle.textContent = `Migration with ${selectedName}`;
      const pairKey = `${current.fitId}:${selected}`;
      if (!current.pairFlows && (!pairResult || pairResult.key !== pairKey)) {
        rankingNote.textContent = "Loading direct pair comparisons for these filters…";
        pairHeadings.hidden = true;
        if (pendingPairKey !== pairKey) {
          pendingPairKey = pairKey;
          worker.postMessage({type: "pairs", id: ++pairRequestId, selected,
                              filters: current.filters});
        }
        return;
      }
      if (pairResult?.key === pairKey && pairResult.error) {
        rankingNote.textContent = pairResult.error;
        pairHeadings.hidden = true;
        return;
      }
      rankingNote.textContent = `Moves into ${selectedName} / moves out to each state. Ranked by population-adjusted ratio; — means too few movers or no departures.`;
      pairHeadings.hidden = false;
      const pairs = current.pairFlows ? baseline.states.map((state, index) => {
        if (index === selected) return null;
        const incoming = current.pairFlows[index][selected];
        const outgoing = current.pairFlows[selected][index];
        const sampled = current.pairSamples[index][selected] + current.pairSamples[selected][index];
        const raw = sampled < 20 || outgoing === 0 ? null : incoming / outgoing;
        const adjusted = raw === null ? null :
          raw * current.population[selected] / current.population[index];
        return {index, raw, adjusted, samples: sampled};
      }).filter(Boolean).sort((a, b) =>
        (b.adjusted ?? -1) - (a.adjusted ?? -1) ||
          baseline.states[a.index].name.localeCompare(baseline.states[b.index].name)) :
        pairResult.rows;
      pairs.forEach(({index, raw, adjusted, samples}, rank) => {
        const state = baseline.states[index];
        const button = document.createElement("button");
        button.type = "button";
        button.className = "sr-rank-button sr-pair-row";
        button.title = `${state.name}: raw ${formatRatio(raw)}; population-adjusted ${formatRatio(adjusted)}` +
          (samples === undefined ? "" : ` · ${formatNumber(samples)} sampled movers in this pair`);
        button.innerHTML = `<span class="sr-rank-number">${adjusted === null ? "—" : `${rank + 1}.`}</span><span class="sr-rank-name">${state.name}</span><span class="sr-pair-value">${formatRatio(raw)}</span><span class="sr-pair-value sr-pair-adjusted">${formatRatio(adjusted)}</span>`;
        button.addEventListener("click", () => selectState(index));
        ranking.appendChild(button);
      });
    }
    if (lastRankingFocus !== selected) ranking.scrollTop = 0;
    lastRankingFocus = selected;
  }

  function renderCurrent() {
    for (const outline of selectionOutlines) {
      if (selected === null) outline.setAttribute("visibility", "hidden");
      else {
        outline.setAttribute("d", geometry.states[String(baseline.states[selected].fips)].path);
        outline.setAttribute("visibility", "visible");
      }
    }
    renderNetwork();
    renderScoreMap();
    renderRanking();
    sampleCount.textContent = current.exactCount ?
      `${formatNumber(current.sampledMovers)} sampled interstate movers` :
      `≥${formatNumber(current.sampledMovers)} sampled movers nationally`;
  }

  async function initialize() {
    try {
      const [baseResponse, geoResponse] = await Promise.all([
        fetch(root.dataset.baseline), fetch(root.dataset.geometry),
      ]);
      if (!baseResponse.ok || !geoResponse.ok) throw new Error("Could not load the map data.");
      [baseline, geometry] = await Promise.all([baseResponse.json(), geoResponse.json()]);
      setupMap(scoreMap, scorePaths, true);
      setupMap(affinityMap, affinityPaths, false);
      baseline.states.forEach((state, index) => {
        const option = document.createElement("option");
        option.value = String(index);
        option.textContent = state.name;
        focusSelect.appendChild(option);
      });
      focusSelect.addEventListener("change", () => {
        selected = focusSelect.value === "" ? null : Number(focusSelect.value);
        if (current) renderCurrent();
      });
      controls.addEventListener("input", scheduleFit);
      controls.addEventListener("change", scheduleFit);
      controls.addEventListener("reset", () => setTimeout(scheduleFit, 0));
      worker = new Worker(root.dataset.worker);
      worker.onmessage = (event) => {
        const message = event.data;
        if (message.type === "ready") { requestFit(); return; }
        if (message.type === "pairs" || message.type === "pair-error") {
          if (message.id !== pairRequestId) return;
          pairResult = {key: pendingPairKey, rows: message.rows,
                        error: message.type === "pair-error" ? message.message : null};
          if (current && selected !== null) renderRanking();
          return;
        }
        if (message.type === "error" && message.id === 0) {
          setStatus(message.message, "error");
          return;
        }
        if (message.id !== requestId) return;
        if (message.type === "error") {
          setStatus(message.message, "error");
          return;
        }
        if (message.insufficient) {
          current = null;
          setStatus(`Fewer than 300 reportable sampled movers match these filters. Choose a broader group to show a state ranking.`, "warning");
          sampleCount.textContent = `≥${formatNumber(message.sampledMovers)} reportable sampled movers`;
          ranking.replaceChildren();
          rankingTitle.textContent = selected === null ? "All state scores" :
            `Migration with ${baseline.states[selected].name}`;
          rankingNote.textContent = "Choose a broader group to see pair comparisons.";
          pairHeadings.hidden = true;
          connections.replaceChildren();
          highlights.replaceChildren();
          highlights.hidden = true;
          selectionOutlines.forEach((outline) => outline.setAttribute("visibility", "hidden"));
          scorePaths.forEach((path) => path?.setAttribute("fill", "#dfe8e5"));
          scorePaths.dcDot.setAttribute("fill", "#dfe8e5");
          affinityPaths.forEach((path) => path?.setAttribute("fill", "#dfe8e5"));
          affinityLegend.hidden = true;
          networkTooltip.hidden = true;
          return;
        }
        current = message;
        current.fitId = message.id;
        renderCurrent();
        const yearLabel = controls.elements.year.selectedOptions[0].textContent;
        if (message.exactCount) setStatus(`${yearLabel}: estimated from ${formatNumber(message.sampledMovers)} sampled interstate movers.`);
        else if (message.lowSample) setStatus(`${yearLabel}: model-based subgroup estimate with fewer than 2,000 reportable sampled movers; interpret cautiously.`, "warning");
        else setStatus(`${yearLabel}: model-based combination of fitted subgroup effects.`);
      };
      worker.onerror = (event) => setStatus(`The model could not run: ${event.message}`, "error");
      worker.postMessage({type: "init", baseline, effectsUrl: root.dataset.effects,
                          pairFlowsUrl: root.dataset.pairFlows,
                          pairDetailBase: root.dataset.pairDetailBase});
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error), "error");
    }
  }

  initialize();
})();
