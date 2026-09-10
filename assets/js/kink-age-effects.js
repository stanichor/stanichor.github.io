(function () {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";
  const root = document.querySelector("[data-kink-age-effects]");
  if (!root) return;

  const picker = root.querySelector("[data-role='item-picker']");
  const itemButton = root.querySelector("[data-role='item-button']");
  const itemButtonLabel = root.querySelector("[data-role='item-button-label']");
  const itemMenu = root.querySelector("[data-role='item-menu']");
  const contrastItemPicker = root.querySelector("[data-role='contrast-item-picker']");
  const contrastItemButton = root.querySelector("[data-role='contrast-item-button']");
  const contrastItemButtonLabel = root.querySelector("[data-role='contrast-item-button-label']");
  const contrastItemMenu = root.querySelector("[data-role='contrast-item-menu']");
  const title = root.querySelector("[data-role='chart-title']");
  const legend = root.querySelector("[data-role='legend']");
  const plot = root.querySelector("[data-role='plot']");
  const status = root.querySelector("[data-role='status']");
  const hoverReadout = root.querySelector("[data-role='hover-readout']");
  const contrastPlot = root.querySelector("[data-role='contrast-plot']");
  const contrastStatus = root.querySelector("[data-role='contrast-status']");
  const contrastReadout = root.querySelector("[data-role='contrast-readout']");
  const contrastButtons = Array.from(root.querySelectorAll("[data-role='contrast-views'] button"));

  const CONTRASTS = {
    assigned_sex: {
      label: "Assigned sex",
      negative: "AFAB",
      positive: "AMAB"
    },
    cis_trans: {
      label: "Cis vs. trans",
      negative: "trans",
      positive: "cis"
    },
    gender_identity: {
      label: "Gender identity",
      negative: "women",
      positive: "men"
    }
  };
  const CONTRAST_VIEWS = {
    "assigned-cis": { x: "assigned_sex", y: "cis_trans" },
    "assigned-gender": { x: "assigned_sex", y: "gender_identity" },
    "cis-gender": { x: "cis_trans", y: "gender_identity" }
  };
  const itemPickerControls = [
    {
      root: picker,
      button: itemButton,
      label: itemButtonLabel,
      menu: itemMenu,
      optionButtons: []
    },
    {
      root: contrastItemPicker,
      button: contrastItemButton,
      label: contrastItemButtonLabel,
      menu: contrastItemMenu,
      optionButtons: []
    }
  ];

  let dataset;
  let selectedItem;
  let currentHoverAge;
  let selectedContrastView = "assigned-cis";
  let currentContrastItemIndex;
  const visibleGroups = new Set();

  function svgElement(name, attributes) {
    const element = document.createElementNS(SVG_NS, name);
    Object.keys(attributes || {}).forEach(function (key) {
      element.setAttribute(key, attributes[key]);
    });
    return element;
  }

  function addText(parent, text, attributes) {
    const element = svgElement("text", attributes);
    element.textContent = text;
    parent.appendChild(element);
    return element;
  }

  function linearScale(domainStart, domainEnd, rangeStart, rangeEnd) {
    const domainWidth = domainEnd - domainStart;
    return function (value) {
      return rangeStart + ((value - domainStart) / domainWidth) * (rangeEnd - rangeStart);
    };
  }

  function niceStep(span, targetTicks) {
    const rough = span / targetTicks;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
    const normalized = rough / magnitude;
    if (normalized <= 1) return magnitude;
    if (normalized <= 2) return 2 * magnitude;
    if (normalized <= 5) return 5 * magnitude;
    return 10 * magnitude;
  }

  function yDomain(item) {
    const values = [];
    dataset.groups.forEach(function (group) {
      item.series[group.id].forEach(function (row) {
        values.push(row[2], row[3]);
      });
    });
    let minimum = Math.min.apply(null, values.concat(0));
    let maximum = Math.max.apply(null, values.concat(0));
    const padding = Math.max((maximum - minimum) * 0.07, 0.04);
    minimum -= padding;
    maximum += padding;
    const step = niceStep(maximum - minimum, 6);
    return {
      minimum: Math.floor(minimum / step) * step,
      maximum: Math.ceil(maximum / step) * step,
      step: step
    };
  }

  function formatEstimate(value) {
    const rounded = Math.abs(value) < 0.0005 ? 0 : value;
    return rounded.toFixed(3);
  }

  function formatTick(value) {
    const rounded = Math.abs(value) < 1e-9 ? 0 : value;
    if (Math.abs(rounded) >= 1) return rounded.toFixed(1);
    return rounded.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  }

  function splitAtAgeGaps(series) {
    const segments = [];
    let segment = [];
    series.forEach(function (row) {
      if (segment.length && row[0] !== segment[segment.length - 1][0] + 1) {
        segments.push(segment);
        segment = [];
      }
      segment.push(row);
    });
    if (segment.length) segments.push(segment);
    return segments;
  }

  function ribbonPath(segment, x, y) {
    const lower = segment.map(function (row, index) {
      return (index === 0 ? "M" : "L") + x(row[0]) + " " + y(row[2]);
    });
    const upper = segment.slice().reverse().map(function (row) {
      return "L" + x(row[0]) + " " + y(row[3]);
    });
    return lower.concat(upper, "Z").join(" ");
  }

  function linePath(segment, x, y) {
    return segment.map(function (row, index) {
      return (index === 0 ? "M" : "L") + x(row[0]) + " " + y(row[1]);
    }).join(" ");
  }

  function nearestValue(values, target) {
    return values.reduce(function (best, value) {
      return Math.abs(value - target) < Math.abs(best - target) ? value : best;
    });
  }

  function rowsAtAge(item, age) {
    return dataset.groups.map(function (group) {
      if (!visibleGroups.has(group.id)) return null;
      const row = item.series[group.id].find(function (candidate) {
        return candidate[0] === age;
      });
      return row ? { group: group, row: row } : null;
    }).filter(Boolean);
  }

  function renderLegend() {
    legend.replaceChildren();
    dataset.groups.forEach(function (group) {
      const button = document.createElement("button");
      const swatch = document.createElement("span");
      button.type = "button";
      button.setAttribute("aria-pressed", String(visibleGroups.has(group.id)));
      button.setAttribute("aria-label", "Toggle " + group.id);
      swatch.className = "kink-age-swatch";
      swatch.style.setProperty("--group-color", group.color);
      button.appendChild(swatch);
      button.appendChild(document.createTextNode(group.id));
      button.addEventListener("click", function () {
        if (visibleGroups.has(group.id)) {
          visibleGroups.delete(group.id);
        } else {
          visibleGroups.add(group.id);
        }
        renderLegend();
        renderChart();
      });
      legend.appendChild(button);
    });
  }

  function renderTooltip(tooltip, hoverLayer, item, age, x, y, width) {
    const rows = rowsAtAge(item, age);
    hoverLayer.replaceChildren();
    tooltip.replaceChildren();
    currentHoverAge = age;

    if (!rows.length) {
      tooltip.hidden = true;
      hoverReadout.textContent = "";
      return;
    }

    hoverLayer.appendChild(svgElement("line", {
      x1: x(age),
      x2: x(age),
      y1: 24,
      y2: 484,
      class: "kink-age-hover-line"
    }));

    const heading = document.createElement("strong");
    heading.textContent = "Age " + age;
    tooltip.appendChild(heading);

    const spoken = ["Age " + age + "."];
    rows.forEach(function (entry) {
      const rowElement = document.createElement("div");
      const swatch = document.createElement("span");
      const groupName = document.createElement("span");
      const value = document.createElement("span");
      rowElement.className = "kink-age-tooltip-row";
      swatch.className = "kink-age-swatch";
      swatch.style.setProperty("--group-color", entry.group.color);
      groupName.textContent = entry.group.id;
      value.className = "kink-age-tooltip-value";
      value.textContent = formatEstimate(entry.row[1]) + " [" +
        formatEstimate(entry.row[2]) + ", " + formatEstimate(entry.row[3]) + "]";
      rowElement.append(swatch, groupName, value);
      tooltip.appendChild(rowElement);

      hoverLayer.appendChild(svgElement("circle", {
        cx: x(age),
        cy: y(entry.row[1]),
        r: 5,
        fill: entry.group.color,
        class: "kink-age-hover-point"
      }));
      spoken.push(entry.group.id + ", mean " + formatEstimate(entry.row[1]) +
        ", 90 percent credible interval " + formatEstimate(entry.row[2]) +
        " to " + formatEstimate(entry.row[3]) + ".");
    });

    tooltip.hidden = false;
    const plotWidth = plot.getBoundingClientRect().width;
    const scaledX = (x(age) / width) * plotWidth;
    if (scaledX > plotWidth / 2) {
      tooltip.style.left = "auto";
      tooltip.style.right = "0.75rem";
    } else {
      tooltip.style.left = "0.75rem";
      tooltip.style.right = "auto";
    }
    hoverReadout.textContent = spoken.join(" ");
  }

  function renderChart() {
    if (!selectedItem) return;

    const width = 960;
    const height = 540;
    const margin = { top: 24, right: 20, bottom: 56, left: 76 };
    const innerRight = width - margin.right;
    const innerBottom = height - margin.bottom;
    const x = linearScale(20, 60, margin.left, innerRight);
    const domain = yDomain(selectedItem);
    const y = linearScale(domain.minimum, domain.maximum, innerBottom, margin.top);
    const svg = svgElement("svg", {
      viewBox: "0 0 " + width + " " + height,
      role: "img",
      tabindex: "0",
      "aria-label": selectedItem.label + ". Age effects by gender group. Use left and right arrow keys to inspect values."
    });
    const grid = svgElement("g");
    const ribbons = svgElement("g");
    const lines = svgElement("g");
    const hoverLayer = svgElement("g");
    const tooltip = document.createElement("div");
    tooltip.className = "kink-age-tooltip";
    tooltip.hidden = true;

    for (let age = 20; age <= 60; age += 1) {
      const major = age % 5 === 0;
      grid.appendChild(svgElement("line", {
        x1: x(age),
        x2: x(age),
        y1: margin.top,
        y2: innerBottom,
        class: major ? "kink-age-grid-major" : "kink-age-grid-minor"
      }));
      if (major) {
        addText(grid, String(age), {
          x: x(age),
          y: innerBottom + 22,
          "text-anchor": "middle",
          class: "kink-age-axis-text"
        });
      }
    }

    const halfStep = domain.step / 2;
    const yTickCount = Math.round((domain.maximum - domain.minimum) / halfStep);
    for (let index = 0; index <= yTickCount; index += 1) {
      const value = domain.minimum + index * halfStep;
      const major = index % 2 === 0;
      const isZero = Math.abs(value) < 1e-9;
      grid.appendChild(svgElement("line", {
        x1: margin.left,
        x2: innerRight,
        y1: y(value),
        y2: y(value),
        class: isZero ? "kink-age-zero" : (major ? "kink-age-grid-major" : "kink-age-grid-minor")
      }));
      if (major) {
        addText(grid, formatTick(value), {
          x: margin.left - 10,
          y: y(value) + 4,
          "text-anchor": "end",
          class: "kink-age-axis-text"
        });
      }
    }

    grid.appendChild(svgElement("line", {
      x1: margin.left,
      x2: innerRight,
      y1: innerBottom,
      y2: innerBottom,
      class: "kink-age-axis"
    }));
    grid.appendChild(svgElement("line", {
      x1: margin.left,
      x2: margin.left,
      y1: margin.top,
      y2: innerBottom,
      class: "kink-age-axis"
    }));
    addText(grid, "Age", {
      x: (margin.left + innerRight) / 2,
      y: height - 13,
      "text-anchor": "middle",
      class: "kink-age-axis-label"
    });
    addText(grid, "Item effect (latent-response SDs)", {
      x: 18,
      y: (margin.top + innerBottom) / 2,
      "text-anchor": "middle",
      transform: "rotate(-90 18 " + ((margin.top + innerBottom) / 2) + ")",
      class: "kink-age-axis-label"
    });

    dataset.groups.forEach(function (group) {
      if (!visibleGroups.has(group.id)) return;
      splitAtAgeGaps(selectedItem.series[group.id]).forEach(function (segment) {
        ribbons.appendChild(svgElement("path", {
          d: ribbonPath(segment, x, y),
          fill: group.color,
          class: "kink-age-ribbon"
        }));
        lines.appendChild(svgElement("path", {
          d: linePath(segment, x, y),
          stroke: group.color,
          class: "kink-age-series-line"
        }));
        segment.forEach(function (row) {
          lines.appendChild(svgElement("circle", {
            cx: x(row[0]),
            cy: y(row[1]),
            r: 3.1,
            fill: group.color,
            class: "kink-age-series-point"
          }));
        });
      });
    });

    const overlay = svgElement("rect", {
      x: margin.left,
      y: margin.top,
      width: innerRight - margin.left,
      height: innerBottom - margin.top,
      fill: "transparent"
    });
    const availableAges = Array.from(new Set(dataset.groups.flatMap(function (group) {
      if (!visibleGroups.has(group.id)) return [];
      return selectedItem.series[group.id].map(function (row) { return row[0]; });
    }))).sort(function (left, right) { return left - right; });

    function showFromPointer(event) {
      if (!availableAges.length) return;
      const bounds = svg.getBoundingClientRect();
      const svgX = ((event.clientX - bounds.left) / bounds.width) * width;
      const estimatedAge = 20 + ((svgX - margin.left) / (innerRight - margin.left)) * 40;
      renderTooltip(tooltip, hoverLayer, selectedItem, nearestValue(availableAges, estimatedAge), x, y, width);
    }

    overlay.addEventListener("pointermove", showFromPointer);
    overlay.addEventListener("pointerdown", showFromPointer);
    overlay.addEventListener("pointerleave", function () {
      if (document.activeElement !== svg) {
        tooltip.hidden = true;
        hoverLayer.replaceChildren();
      }
    });
    svg.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      if (!availableAges.length) return;
      let index = currentHoverAge == null ? Math.floor(availableAges.length / 2) : availableAges.indexOf(currentHoverAge);
      if (event.key === "ArrowLeft") index = Math.max(0, index - 1);
      if (event.key === "ArrowRight") index = Math.min(availableAges.length - 1, index + 1);
      renderTooltip(tooltip, hoverLayer, selectedItem, availableAges[index], x, y, width);
    });
    svg.addEventListener("blur", function () {
      tooltip.hidden = true;
      hoverLayer.replaceChildren();
    });

    svg.append(grid, ribbons, lines, hoverLayer, overlay);
    plot.replaceChildren(svg, tooltip);
    title.textContent = selectedItem.label;
    status.hidden = true;
    currentHoverAge = null;
  }

  function itemContrasts(item) {
    const cisMan = item.group_effects[0];
    const cisWoman = item.group_effects[1];
    const transWoman = item.group_effects[2];
    const transMan = item.group_effects[3];
    return {
      assigned_sex: (cisMan - cisWoman + transWoman - transMan) / 2,
      cis_trans: (cisMan + cisWoman - transWoman - transMan) / 2,
      gender_identity: (cisMan - cisWoman - transWoman + transMan) / 2
    };
  }

  function contrastDomain() {
    const maximum = Math.max.apply(null, dataset.items.flatMap(function (item) {
      return Object.values(itemContrasts(item)).map(Math.abs);
    }));
    const step = niceStep(maximum * 2, 7);
    const limit = Math.ceil(maximum / step) * step;
    return { minimum: -limit, maximum: limit, step: step };
  }

  function contrastAxisLabel(key) {
    const definition = CONTRASTS[key];
    return definition.negative + "  ←  " + definition.label + "  →  " + definition.positive;
  }

  function contrastDirection(key, value) {
    if (Math.abs(value) < 0.0005) return "balanced";
    return CONTRASTS[key][value > 0 ? "positive" : "negative"] + " higher";
  }

  function renderContrastTooltip(tooltip, hoverLayer, item, values, view, x, y, width) {
    hoverLayer.replaceChildren(svgElement("circle", {
      cx: x(values[view.x]),
      cy: y(values[view.y]),
      r: 7,
      class: "kink-contrast-hover-point"
    }));
    tooltip.replaceChildren();

    const heading = document.createElement("strong");
    heading.textContent = item.label;
    tooltip.appendChild(heading);

    const spoken = [item.label + "."];
    Object.keys(CONTRASTS).forEach(function (key) {
      const row = document.createElement("div");
      const label = document.createElement("span");
      const value = document.createElement("span");
      const axis = key === view.x ? " (x)" : (key === view.y ? " (y)" : "");
      row.className = "kink-contrast-tooltip-row";
      label.textContent = CONTRASTS[key].label + axis;
      value.className = "kink-contrast-tooltip-value";
      value.textContent = formatEstimate(values[key]) + " (" + contrastDirection(key, values[key]) + ")";
      row.append(label, value);
      tooltip.appendChild(row);
      spoken.push(CONTRASTS[key].label + ", " + formatEstimate(values[key]) +
        ", " + contrastDirection(key, values[key]) + ".");
    });

    const groupHeading = document.createElement("div");
    groupHeading.className = "kink-contrast-tooltip-subheading";
    groupHeading.textContent = "Underlying group effects";
    tooltip.appendChild(groupHeading);
    dataset.groups.forEach(function (group, index) {
      const row = document.createElement("div");
      const label = document.createElement("span");
      const value = document.createElement("span");
      row.className = "kink-contrast-tooltip-row";
      label.textContent = group.id;
      value.className = "kink-contrast-tooltip-value";
      value.textContent = formatEstimate(item.group_effects[index]);
      row.append(label, value);
      tooltip.appendChild(row);
      spoken.push(group.id + " group effect, " + formatEstimate(item.group_effects[index]) + ".");
    });

    tooltip.hidden = false;
    const plotWidth = contrastPlot.getBoundingClientRect().width;
    const scaledX = (x(values[view.x]) / width) * plotWidth;
    if (scaledX > plotWidth / 2) {
      tooltip.style.left = "0.75rem";
      tooltip.style.right = "auto";
    } else {
      tooltip.style.left = "auto";
      tooltip.style.right = "0.75rem";
    }
    contrastReadout.textContent = spoken.join(" ");
  }

  function renderContrastChart() {
    if (!dataset) return;

    const width = 700;
    const height = 700;
    const margin = { top: 24, right: 28, bottom: 86, left: 86 };
    const innerRight = width - margin.right;
    const innerBottom = height - margin.bottom;
    const view = CONTRAST_VIEWS[selectedContrastView];
    const domain = contrastDomain();
    const x = linearScale(domain.minimum, domain.maximum, margin.left, innerRight);
    const y = linearScale(domain.minimum, domain.maximum, innerBottom, margin.top);
    const svg = svgElement("svg", {
      viewBox: "0 0 " + width + " " + height,
      role: "img",
      tabindex: "0",
      "aria-label": CONTRASTS[view.x].label + " by " + CONTRASTS[view.y].label +
        " across kink items. Use left and right arrow keys to inspect items."
    });
    const grid = svgElement("g");
    const points = svgElement("g");
    const hoverLayer = svgElement("g");
    const tooltip = document.createElement("div");
    tooltip.className = "kink-age-tooltip";
    tooltip.hidden = true;

    const halfStep = domain.step / 2;
    const tickCount = Math.round((domain.maximum - domain.minimum) / halfStep);
    for (let index = 0; index <= tickCount; index += 1) {
      const value = domain.minimum + index * halfStep;
      const major = index % 2 === 0;
      const isZero = Math.abs(value) < 1e-9;
      grid.appendChild(svgElement("line", {
        x1: x(value),
        x2: x(value),
        y1: margin.top,
        y2: innerBottom,
        class: isZero ? "kink-age-zero" : (major ? "kink-age-grid-major" : "kink-age-grid-minor")
      }));
      grid.appendChild(svgElement("line", {
        x1: margin.left,
        x2: innerRight,
        y1: y(value),
        y2: y(value),
        class: isZero ? "kink-age-zero" : (major ? "kink-age-grid-major" : "kink-age-grid-minor")
      }));
      if (major) {
        addText(grid, formatTick(value), {
          x: x(value),
          y: innerBottom + 22,
          "text-anchor": "middle",
          class: "kink-age-axis-text"
        });
        addText(grid, formatTick(value), {
          x: margin.left - 10,
          y: y(value) + 4,
          "text-anchor": "end",
          class: "kink-age-axis-text"
        });
      }
    }

    grid.appendChild(svgElement("line", {
      x1: margin.left,
      x2: innerRight,
      y1: innerBottom,
      y2: innerBottom,
      class: "kink-age-axis"
    }));
    grid.appendChild(svgElement("line", {
      x1: margin.left,
      x2: margin.left,
      y1: margin.top,
      y2: innerBottom,
      class: "kink-age-axis"
    }));
    addText(grid, contrastAxisLabel(view.x), {
      x: (margin.left + innerRight) / 2,
      y: height - 18,
      "text-anchor": "middle",
      class: "kink-age-axis-label"
    });
    addText(grid, contrastAxisLabel(view.y), {
      x: 19,
      y: (margin.top + innerBottom) / 2,
      "text-anchor": "middle",
      transform: "rotate(-90 19 " + ((margin.top + innerBottom) / 2) + ")",
      class: "kink-age-axis-label"
    });

    const plottedItems = dataset.items.map(function (item) {
      const values = itemContrasts(item);
      points.appendChild(svgElement("circle", {
        cx: x(values[view.x]),
        cy: y(values[view.y]),
        r: 4.5,
        class: "kink-contrast-point"
      }));
      return {
        item: item,
        values: values,
        x: x(values[view.x]),
        y: y(values[view.y])
      };
    });
    const selectedEntry = plottedItems.find(function (entry) {
      return entry.item === selectedItem;
    });
    if (selectedEntry) {
      points.appendChild(svgElement("circle", {
        cx: selectedEntry.x,
        cy: selectedEntry.y,
        r: 7,
        class: "kink-contrast-selected-point"
      }));
    }

    function showItem(entry) {
      currentContrastItemIndex = plottedItems.indexOf(entry);
      renderContrastTooltip(tooltip, hoverLayer, entry.item, entry.values, view, x, y, width);
    }

    function itemFromPointer(event) {
      const bounds = svg.getBoundingClientRect();
      const pointerX = ((event.clientX - bounds.left) / bounds.width) * width;
      const pointerY = ((event.clientY - bounds.top) / bounds.height) * height;
      const nearest = plottedItems.reduce(function (best, entry) {
        const distance = (entry.x - pointerX) ** 2 + (entry.y - pointerY) ** 2;
        return !best || distance < best.distance ? { entry: entry, distance: distance } : best;
      }, null);
      return nearest.entry;
    }

    function showSelectedItem() {
      if (selectedEntry) showItem(selectedEntry);
    }

    const overlay = svgElement("rect", {
      x: margin.left,
      y: margin.top,
      width: innerRight - margin.left,
      height: innerBottom - margin.top,
      fill: "transparent"
    });
    overlay.addEventListener("pointermove", function (event) {
      showItem(itemFromPointer(event));
    });
    overlay.addEventListener("pointerdown", function (event) {
      chooseItem(itemFromPointer(event).item);
    });
    overlay.addEventListener("pointerleave", function () {
      if (document.activeElement !== svg) {
        showSelectedItem();
      }
    });
    svg.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      let index = currentContrastItemIndex == null ? 0 : currentContrastItemIndex;
      index += event.key === "ArrowRight" ? 1 : -1;
      index = (index + plottedItems.length) % plottedItems.length;
      showItem(plottedItems[index]);
    });
    svg.addEventListener("blur", function () {
      showSelectedItem();
    });

    svg.append(grid, points, overlay, hoverLayer);
    contrastPlot.replaceChildren(svg, tooltip);
    contrastStatus.hidden = true;
    currentContrastItemIndex = null;
    showSelectedItem();
  }

  function chooseItem(item) {
    selectedItem = item;
    itemPickerControls.forEach(function (control) {
      control.label.textContent = item.label;
      control.optionButtons.forEach(function (button) {
        button.setAttribute("aria-selected", button.dataset.itemId === item.id ? "true" : "false");
      });
    });
    renderChart();
    renderContrastChart();
    updateUrlState();
  }

  function updateUrlState() {
    if (!selectedItem) return;
    const url = new URL(window.location.href);
    url.searchParams.set("item", selectedItem.id);
    url.searchParams.set("view", selectedContrastView);
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }

  function closeItemMenu(control, returnFocus) {
    control.menu.hidden = true;
    control.button.setAttribute("aria-expanded", "false");
    if (returnFocus) control.button.focus();
  }

  function openItemMenu(control) {
    if (control.button.disabled) return;
    itemPickerControls.forEach(function (candidate) {
      if (candidate !== control) closeItemMenu(candidate, false);
    });
    control.menu.hidden = false;
    control.button.setAttribute("aria-expanded", "true");
    const selected = control.optionButtons.find(function (button) {
      return button.getAttribute("aria-selected") === "true";
    }) || control.optionButtons[0];
    if (selected) {
      selected.focus();
      selected.scrollIntoView({ block: "nearest" });
    }
  }

  function moveItemMenuFocus(control, button, offset) {
    const index = control.optionButtons.indexOf(button);
    const nextIndex = (index + offset + control.optionButtons.length) % control.optionButtons.length;
    control.optionButtons[nextIndex].focus();
  }

  function populateItemPicker(control) {
    control.menu.replaceChildren();
    control.optionButtons = dataset.items.slice().sort(function (left, right) {
      return left.label.localeCompare(right.label);
    }).map(function (item) {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "kink-age-picker-option";
      option.dataset.itemId = item.id;
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", "false");
      option.textContent = item.label;
      option.addEventListener("click", function () {
        chooseItem(item);
        closeItemMenu(control, true);
      });
      option.addEventListener("keydown", function (event) {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          moveItemMenuFocus(control, option, event.key === "ArrowDown" ? 1 : -1);
        } else if (event.key === "Home" || event.key === "End") {
          event.preventDefault();
          control.optionButtons[event.key === "Home" ? 0 : control.optionButtons.length - 1].focus();
        } else if (event.key === "Escape") {
          event.preventDefault();
          closeItemMenu(control, true);
        }
      });
      control.menu.appendChild(option);
      return option;
    });
    control.button.disabled = false;
  }

  fetch(root.dataset.dataUrl)
    .then(function (response) {
      if (!response.ok) throw new Error("The age-effect data could not be loaded.");
      return response.json();
    })
    .then(function (loaded) {
      dataset = loaded;
      if (dataset.items.some(function (item) { return !item.group_effects; })) {
        throw new Error("The gender-group contrast data are incomplete.");
      }
      dataset.groups.forEach(function (group) { visibleGroups.add(group.id); });
      itemPickerControls.forEach(populateItemPicker);
      renderLegend();
      const parameters = new URLSearchParams(window.location.search);
      const requestedView = parameters.get("view");
      if (requestedView && CONTRAST_VIEWS[requestedView]) {
        selectedContrastView = requestedView;
      }
      contrastButtons.forEach(function (button) {
        button.setAttribute("aria-pressed", String(button.dataset.view === selectedContrastView));
      });
      const requestedItem = parameters.get("item");
      chooseItem(dataset.items.find(function (item) {
        return item.id === requestedItem;
      }) || dataset.items.find(function (item) {
        return item.id === root.dataset.defaultItem;
      }) || dataset.items[0]);
    })
    .catch(function (error) {
      status.textContent = error.message;
      status.classList.add("is-error");
      contrastStatus.textContent = error.message;
      contrastStatus.classList.add("is-error");
      title.textContent = "Age effects unavailable";
    });

  itemPickerControls.forEach(function (control) {
    control.button.addEventListener("click", function () {
      if (control.menu.hidden) openItemMenu(control);
      else closeItemMenu(control, false);
    });
    control.button.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        openItemMenu(control);
      }
    });
    control.root.addEventListener("focusout", function () {
      window.setTimeout(function () {
        if (!control.root.contains(document.activeElement)) closeItemMenu(control, false);
      }, 0);
    });
  });

  document.addEventListener("pointerdown", function (event) {
    itemPickerControls.forEach(function (control) {
      if (!control.root.contains(event.target)) closeItemMenu(control, false);
    });
  });

  contrastButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      selectedContrastView = button.dataset.view;
      contrastButtons.forEach(function (candidate) {
        candidate.setAttribute("aria-pressed", String(candidate === button));
      });
      renderContrastChart();
      updateUrlState();
    });
  });
}());
