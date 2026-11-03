/* MovieLens release-year charts. All curve fitting is done in the analysis. */
(() => {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";
  const requests = new Map();
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  function svgNode(parent, tag, attributes = {}, text) {
    const node = document.createElementNS(NS, tag);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, String(value));
    if (text !== undefined) node.textContent = text;
    parent.appendChild(node);
    return node;
  }

  function htmlNode(parent, tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    parent.appendChild(node);
    return node;
  }

  function wrapText(context, text, width) {
    const lines = [];
    let line = "";
    for (const word of text.split(/\s+/).filter(Boolean)) {
      const candidate = line ? `${line} ${word}` : word;
      if (line && context.measureText(candidate).width > width) {
        lines.push(line);
        line = word;
      } else line = candidate;
    }
    if (line) lines.push(line);
    return lines;
  }

  async function chartPng(root) {
    const source = root.querySelector(".media-taste-svg");
    if (!source) throw new Error("Chart not ready");
    const width = source.viewBox.baseVal.width;
    const height = source.viewBox.baseVal.height;
    const font = getComputedStyle(root).fontFamily;
    const copy = source.cloneNode(true);
    copy.setAttribute("xmlns", NS);
    copy.setAttribute("width", String(width));
    copy.setAttribute("height", String(height));
    // Resolve the chart's CSS in an offscreen copy. This retains intentional
    // selection styles, without capturing hover/focus UI or tooltips.
    copy.querySelectorAll(".media-taste-bar.is-selected").forEach((node) => node.classList.remove("is-selected"));
    const host = htmlNode(document.body, "div", "media-taste media-taste-export-host");
    Object.assign(host.style, { position: "fixed", left: "-10000px", top: "0", width: `${width}px`, padding: "0", border: "0", opacity: "0", pointerEvents: "none", fontFamily: font });
    host.setAttribute("aria-hidden", "true");
    host.appendChild(copy);
    let markup;
    try {
      const properties = ["fill", "fill-opacity", "stroke", "stroke-width", "stroke-opacity", "stroke-dasharray", "stroke-linecap", "stroke-linejoin", "opacity", "display", "visibility", "font-family", "font-size", "font-weight", "font-style", "text-anchor", "dominant-baseline", "paint-order"];
      for (const node of [copy, ...copy.querySelectorAll("*")]) {
        const style = getComputedStyle(node);
        for (const property of properties) node.style.setProperty(property, style.getPropertyValue(property));
      }
      markup = new XMLSerializer().serializeToString(copy);
    } finally {
      host.remove();
    }
    const svgUrl = URL.createObjectURL(new Blob([markup], { type: "image/svg+xml;charset=utf-8" }));
    try {
      const image = new Image();
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = () => reject(new Error("Could not render chart image"));
        image.src = svgUrl;
      });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Image export unavailable");
      const padding = 24;
      context.font = `700 20px ${font}`;
      const title = wrapText(context, root.querySelector(".media-taste-title").textContent.trim(), width);
      let caption = root.querySelector("figcaption").textContent.trim().replace(/\s+/g, " ");
      context.font = `12px ${font}`;
      const notes = wrapText(context, caption, width);
      const chartTop = padding + title.length * 26 + 12;
      const logicalWidth = width + padding * 2;
      const logicalHeight = chartTop + height + 12 + notes.length * 18 + padding;
      const scale = Math.max(2, 1600 / logicalWidth);
      canvas.width = Math.ceil(logicalWidth * scale);
      canvas.height = Math.ceil(logicalHeight * scale);
      context.scale(scale, scale);
      context.fillStyle = "#fff";
      context.fillRect(0, 0, logicalWidth, logicalHeight);
      context.textBaseline = "top";
      context.font = `700 20px ${font}`;
      context.fillStyle = "#172f3d";
      title.forEach((line, i) => context.fillText(line, padding, padding + i * 26));
      context.drawImage(image, padding, chartTop, width, height);
      context.font = `12px ${font}`;
      context.fillStyle = "#536773";
      notes.forEach((line, i) => context.fillText(line, padding, chartTop + height + 12 + i * 18));
      return await new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Could not encode PNG")), "image/png"));
    } finally {
      URL.revokeObjectURL(svgUrl);
    }
  }

  function addDownload(root) {
    const status = root.querySelector(".media-taste-status");
    const footer = document.createElement("div");
    footer.className = "media-taste-footer";
    root.insertBefore(footer, status);
    footer.appendChild(status);
    const button = htmlNode(footer, "button", "media-taste-download", "Download image");
    button.type = "button";
    button.addEventListener("click", async () => {
      button.disabled = true;
      button.textContent = "Preparing…";
      try {
        const blob = await chartPng(root);
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = root.dataset.mediaTaste === "age-groups" ? "movielens-1m-ratings-by-viewer-age.png" : "movielens-1m-movies-by-release-year.png";
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        root.querySelector(".media-taste-download-error")?.remove();
      } catch (error) {
        console.warn("MovieLens image download failed", error);
        if (!root.querySelector(".media-taste-download-error")) {
          const message = htmlNode(root, "p", "media-taste-download-error", "Could not download the image. Please try again.");
          message.setAttribute("role", "alert");
        }
      } finally {
        button.disabled = false;
        button.textContent = "Download image";
      }
    });
  }

  function frame(viewport, options, id) {
    const width = Math.round(viewport.clientWidth);
    const height = Math.round(Math.min(450, Math.max(340, width * .59))) - 14;
    const box = { left: width < 480 ? 49 : 58, right: width - (options.labelSpace || 15), top: 20, bottom: height - 72 };
    const x = (year) => box.left + (year - options.xMin) / (options.xMax - options.xMin) * (box.right - box.left);
    const y = (value) => box.bottom - (value - options.yMin) / (options.yMax - options.yMin) * (box.bottom - box.top);
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "media-taste-svg");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-labelledby", `${id}-svg-title ${id}-svg-description`);
    svgNode(svg, "title", { id: `${id}-svg-title` }, options.title);
    svgNode(svg, "desc", { id: `${id}-svg-description` }, options.description);
    for (let value = Math.ceil(options.yMin / options.yStep) * options.yStep; value <= options.yMax + 1e-8; value += options.yStep) {
      svgNode(svg, "line", { x1: box.left, x2: box.right, y1: y(value), y2: y(value), class: "media-taste-grid" });
      svgNode(svg, "text", { x: box.left - 9, y: y(value) + 4, "text-anchor": "end" }, options.decimals ? value.toFixed(options.decimals) : String(Math.round(value)));
    }
    const yearTicks = [];
    const yearStep = box.right - box.left < 250 ? 20 : 10;
    for (let year = Math.ceil(options.xMin / 10) * 10; year <= options.xMax; year += yearStep) yearTicks.push(year);
    const finalDecade = Math.floor(options.xMax / 10) * 10;
    if (yearTicks[yearTicks.length - 1] !== finalDecade) {
      if (x(finalDecade) - x(yearTicks[yearTicks.length - 1]) < 36) yearTicks.pop();
      yearTicks.push(finalDecade);
    }
    for (const year of yearTicks) {
      svgNode(svg, "line", { x1: x(year), x2: x(year), y1: box.bottom, y2: box.bottom + 5, class: "media-taste-axis" });
      svgNode(svg, "text", { x: x(year), y: box.bottom + 22, "text-anchor": "middle", class: "media-taste-x-tick" }, String(year));
    }
    svgNode(svg, "line", { x1: box.left, x2: box.right, y1: box.bottom, y2: box.bottom, class: "media-taste-axis" });
    svgNode(svg, "text", { x: (box.left + box.right) / 2, y: height - 29, "text-anchor": "middle", class: "media-taste-axis-title" }, "Release year");
    svgNode(svg, "text", { x: 15, y: (box.top + box.bottom) / 2, transform: `rotate(-90 15 ${(box.top + box.bottom) / 2})`, "text-anchor": "middle", class: "media-taste-axis-title" }, options.yLabel);
    svgNode(svg, "text", { x: 8, y: height - 4, class: "media-taste-credit" }, "Source: GroupLens MovieLens 1M · Stanichor");
    const clip = svgNode(svgNode(svg, "defs"), "clipPath", { id: `${id}-clip` });
    svgNode(clip, "rect", { x: box.left, y: box.top, width: box.right - box.left, height: box.bottom - box.top });
    const plot = svgNode(svg, "g", { "clip-path": `url(#${id}-clip)` });
    const overlay = svgNode(svg, "rect", { x: box.left, y: box.top, width: box.right - box.left, height: box.bottom - box.top, fill: "transparent" });
    return { width, svg, plot, overlay, box, x, y };
  }

  function linePath(years, values, x, y) {
    let path = "", previous = false;
    years.forEach((year, index) => {
      const valid = Number.isFinite(values[index]);
      if (valid) path += `${previous ? "L" : "M"}${x(year)},${y(values[index])} `;
      previous = valid;
    });
    return path;
  }

  function ageChart(root, data) {
    const viewport = root.querySelector(".media-taste-viewport");
    const groups = data.ageGroups;
    let selectedAge = null;
    const buttons = new Map();
    let chart, series, lastWidth = 0;

    function update() {
      groups.forEach((group) => {
        const selected = selectedAge === group.id;
        const muted = selectedAge !== null && !selected;
        const button = buttons.get(group.id);
        button.setAttribute("aria-pressed", String(selected));
        button.classList.toggle("is-selected", selected);
        button.classList.toggle("is-muted", muted);
        const nodes = series?.get(group.id);
        if (nodes) {
          nodes.line.classList.toggle("is-selected", selected);
          nodes.line.classList.toggle("is-muted", muted);
          nodes.leader.classList.toggle("is-muted", muted);
          if (selected) {
            chart.plot.appendChild(nodes.line);
          }
        }
      });
    }

    function selectAge(id) {
      selectedAge = selectedAge === id ? null : id;
      update();
    }

    function draw() {
      const width = Math.round(viewport.clientWidth);
      if (!width || width === lastWidth) return;
      lastWidth = width;
      const options = { xMin: data.startYear, xMax: data.endYear, yMin: 2.7, yMax: 4.2, yStep: .2, decimals: 1,
        labelSpace: 82, yLabel: "Average movie rating", title: "The decline steepens around 1970 across age groups",
        description: "Smoothed average movie ratings for seven viewer age groups. Select an age group to highlight its curve." };
      chart = frame(viewport, options, root.id);
      chart.options = options;
      chart.svg.setAttribute("role", "group");
      series = new Map();
      buttons.clear();
      groups.forEach((group) => {
        const line = svgNode(chart.plot, "path", { d: linePath(group.years, group.mean, chart.x, chart.y), stroke: group.color, class: "media-taste-curve", "data-age-group": group.id });
        if (group.id === "18") line.setAttribute("stroke-dasharray", "6 4");
        series.set(group.id, { line });
      });
      const labels = groups.map((group) => ({ group, desired: chart.y(group.mean[group.mean.length - 1]) })).sort((a, b) => a.desired - b.desired);
      labels.forEach((entry, i) => { entry.position = i ? Math.max(entry.desired, labels[i - 1].position + 18) : entry.desired; });
      const overflow = Math.max(0, labels[labels.length - 1].position - (chart.box.bottom - 8));
      labels.forEach((entry) => {
        const { group } = entry;
        const labelY = entry.position - overflow;
        const leader = svgNode(chart.svg, "path", { d: `M${chart.box.right},${entry.desired} L${chart.box.right + 7},${labelY} L${chart.box.right + 12},${labelY}`,
          stroke: group.color, class: "media-taste-leader" });
        series.get(group.id).leader = leader;
        const button = svgNode(chart.svg, "g", { role: "button", tabindex: "0", "aria-label": group.label,
          "aria-pressed": "false", "data-age-label": group.id, class: "media-taste-direct-label" });
        svgNode(button, "rect", { x: chart.box.right + 11, y: labelY - 10, width: 63, height: 20, rx: 3 });
        svgNode(button, "text", { x: chart.box.right + 15, y: labelY + 4, class: "media-taste-direct-text" }, group.label);
        button.addEventListener("click", () => selectAge(group.id));
        button.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectAge(group.id); } });
        buttons.set(group.id, button);
      });
      const note = svgNode(chart.svg, "g", { class: "media-taste-annotation" });
      svgNode(note, "line", { x1: chart.x(1948), y1: chart.y(3.10), x2: chart.x(1948), y2: chart.y(3.3) - 8 });
      svgNode(note, "text", { x: chart.x(1939), y: chart.y(3.03) }, "18–24-year-olds differ");
      viewport.replaceChildren(chart.svg);
      chart.overlay.addEventListener("click", (event) => {
        const rect = chart.svg.getBoundingClientRect();
        const positionX = (event.clientX - rect.left) / rect.width * chart.width;
        const fraction = (positionX - chart.box.left) / (chart.box.right - chart.box.left);
        const year = clamp(Math.round(data.startYear + fraction * (data.endYear - data.startYear)), data.startYear, data.endYear);
        const positionY = (event.clientY - rect.top) / rect.height * chart.svg.viewBox.baseVal.height;
        const nearby = groups.map((group) => {
          const value = group.mean[group.years.indexOf(year)];
          return { id: group.id, distance: Number.isFinite(value) ? Math.abs(chart.y(value) - positionY) : Infinity };
        }).sort((a, b) => a.distance - b.distance);
        if (nearby[0].distance <= 12) selectAge(nearby[0].id);
      });
      update();
    }
    draw();
    new ResizeObserver(draw).observe(viewport);
  }

  function histogram(root, data) {
    const viewport = root.querySelector(".media-taste-viewport");
    const { years, counts } = data.histogram;
    const tooltip = htmlNode(viewport, "div", "media-taste-tooltip");
    tooltip.id = `${root.id}-tooltip`;
    tooltip.setAttribute("role", "tooltip");
    tooltip.hidden = true;
    let chart, bars = [], lastWidth = 0;

    function hide() {
      tooltip.hidden = true;
      bars.forEach((bar) => bar.classList.remove("is-selected"));
    }

    function show(index, event) {
      tooltip.textContent = `${years[index]}: ${counts[index].toLocaleString()} movies`;
      tooltip.hidden = false;
      bars.forEach((bar, i) => bar.classList.toggle("is-selected", i === index));
      const bounds = viewport.getBoundingClientRect();
      const bar = bars[index].getBoundingClientRect();
      const x = event ? event.clientX : bar.left + bar.width / 2;
      const y = event ? event.clientY : bar.top;
      tooltip.style.left = `${clamp(x - bounds.left + 12, 8, bounds.width - tooltip.offsetWidth - 8)}px`;
      tooltip.style.top = `${clamp(y - bounds.top - tooltip.offsetHeight - 10, 8, bounds.height - tooltip.offsetHeight - 8)}px`;
    }

    function draw() {
      const width = Math.round(viewport.clientWidth);
      if (!width || width === lastWidth) return;
      lastWidth = width;
      const maximum = Math.ceil(Math.max(...counts) / 50) * 50;
      const options = { xMin: data.startYear - .5, xMax: data.endYear + .5, yMin: 0, yMax: maximum, yStep: 50,
        yLabel: "Number of movies", title: "Most ML-1M movies were released after 1989",
        description: "Movie counts by release year. Hover over or focus a bar for its count." };
      chart = frame(viewport, options, root.id);
      chart.overlay.remove();
      chart.svg.setAttribute("role", "group");
      const barWidth = (chart.box.right - chart.box.left) / years.length * .85;
      bars = years.map((value, index) => {
        const bar = svgNode(chart.plot, "rect", { x: chart.x(value) - barWidth / 2, y: chart.y(counts[index]), width: barWidth,
          height: chart.box.bottom - chart.y(counts[index]), class: `media-taste-bar${value >= 1990 ? " is-recent" : ""}`, "data-year": value, "data-count": counts[index],
          tabindex: index === 0 ? "0" : "-1", role: "img", "aria-label": `${value}: ${counts[index]} movies`, "aria-describedby": tooltip.id });
        bar.addEventListener("pointerenter", (event) => show(index, event));
        bar.addEventListener("pointermove", (event) => show(index, event));
        bar.addEventListener("pointerdown", (event) => show(index, event));
        bar.addEventListener("pointerleave", (event) => { if (event.pointerType !== "touch") hide(); });
        bar.addEventListener("focus", () => show(index));
        bar.addEventListener("blur", hide);
        bar.addEventListener("keydown", (event) => {
          const next = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: years.length - 1 };
          if (event.key in next) {
            event.preventDefault();
            const target = clamp(next[event.key], 0, years.length - 1);
            bars.forEach((node, i) => node.setAttribute("tabindex", i === target ? "0" : "-1"));
            bars[target].focus();
          } else if (event.key === "Escape") hide();
        });
        return bar;
      });
      const note = svgNode(chart.svg, "g", { class: "media-taste-annotation" });
      const early = counts.slice(0, 20).reduce((sum, count) => sum + count, 0) / 20;
      const recent = counts.reduce((sum, count, i) => sum + (years[i] >= 1990 ? count : 0), 0) / data.histogram.total;
      svgNode(note, "line", { x1: chart.x(1940), y1: chart.y(125), x2: chart.x(1940), y2: chart.y(counts[10]) - 7 });
      svgNode(note, "text", { x: chart.x(1932), y: chart.y(160) }, "1930–1949:");
      svgNode(note, "text", { x: chart.x(1932), y: chart.y(160) + 15 }, `~${Math.round(early)} movies/year`);
      svgNode(note, "line", { x1: chart.x(1981), y1: chart.y(278), x2: chart.x(1994), y2: chart.y(counts[64]) - 7 });
      svgNode(note, "text", { x: chart.x(1973), y: chart.y(310) }, `${Math.round(recent * 100)}% released`);
      svgNode(note, "text", { x: chart.x(1973), y: chart.y(310) + 15 }, "1990–2000");
      chart.svg.addEventListener("pointerdown", (event) => { if (!event.target.classList.contains("media-taste-bar")) hide(); });
      viewport.replaceChildren(chart.svg, tooltip);
      hide();
    }
    draw();
    new ResizeObserver(draw).observe(viewport);
  }

  function validate(data) {
    if (data.startYear !== 1930 || data.endYear !== 2000 || data.ageGroups?.length !== 7) throw new Error("Unexpected MovieLens chart metadata");
    for (const group of data.ageGroups) {
      if (group.years.length !== 71 || ![group.mean, group.lower, group.upper, group.coverage].every((values) => values.length === group.years.length)) throw new Error("Invalid age-group curve");
      for (let index = 0; index < group.years.length; index++) {
        const shown = group.coverage[index] > 30;
        if (![group.mean, group.lower, group.upper].every((values) => shown ? Number.isFinite(values[index]) : values[index] === null)) throw new Error("Invalid movie coverage mask");
      }
    }
    if (data.histogram.years.length !== 71 || data.histogram.counts.length !== 71 ||
        !data.histogram.counts.every((count) => Number.isInteger(count) && count >= 0) ||
        data.histogram.counts.reduce((sum, count) => sum + count, 0) !== data.histogram.total) throw new Error("Invalid histogram counts");
    return data;
  }

  document.querySelectorAll("[data-media-taste]").forEach((root) => {
    const src = root.dataset.src;
    if (!requests.has(src)) requests.set(src, fetch(src).then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    }).then(validate));
    requests.get(src).then((data) => {
      if (root.dataset.mediaTaste === "age-groups") ageChart(root, data);
      else histogram(root, data);
      root.dataset.mediaLoaded = "true";
      root.querySelector(".media-taste-status").textContent = root.dataset.mediaTaste === "age-groups"
        ? "Click an age group to highlight it."
        : "Hover for counts.";
      addDownload(root);
    }).catch((error) => {
      console.warn("MovieLens interactive unavailable", error);
      root.querySelector(".media-taste-status").textContent = "Interactive unavailable; static chart shown.";
    });
  });
})();
