(function () {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";
  const trendRoots = Array.from(document.querySelectorAll("[data-benchmark-dif-chart]"));
  const scatterRoot = document.querySelector("[data-benchmark-dif-scatter]");
  if (!trendRoots.length && !scatterRoot) return;

  let dataset;
  let scatterState;
  const trendStates = [];

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
    const width = domainEnd - domainStart || 1;
    return function (value) {
      return rangeStart + ((value - domainStart) / width) * (rangeEnd - rangeStart);
    };
  }

  function niceStep(span, targetTicks) {
    const rough = Math.max(span / targetTicks, Number.EPSILON);
    const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
    const normalized = rough / magnitude;
    if (normalized <= 1) return magnitude;
    if (normalized <= 2) return 2 * magnitude;
    if (normalized <= 5) return 5 * magnitude;
    return 10 * magnitude;
  }

  function paddedDomain(values, includeZero) {
    let minimum = Math.min.apply(null, values);
    let maximum = Math.max.apply(null, values);
    if (includeZero) {
      minimum = Math.min(minimum, 0);
      maximum = Math.max(maximum, 0);
    }
    const padding = Math.max((maximum - minimum) * 0.08, Math.abs(maximum || 1) * 0.015);
    minimum -= padding;
    maximum += padding;
    const step = niceStep(maximum - minimum, 6);
    return {
      minimum: Math.floor(minimum / step) * step,
      maximum: Math.ceil(maximum / step) * step,
      step: step
    };
  }

  function symmetricDomain(values) {
    const maximum = Math.max.apply(null, values.map(Math.abs));
    const step = niceStep(maximum * 2, 7);
    const limit = Math.max(step, Math.ceil(maximum / step) * step);
    return { minimum: -limit, maximum: limit, step: step };
  }

  function formatValue(value, kind) {
    if (kind === "discrimination-change") return value.toFixed(5);
    if (kind === "discrimination") return value.toFixed(3);
    return value.toFixed(2);
  }

  function formatTick(value) {
    const absolute = Math.abs(value);
    if (absolute > 0 && absolute < 0.01) return value.toFixed(3);
    if (absolute < 1) return value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
    return value.toFixed(1).replace(/\.0$/, "");
  }

  function formatCorrelation(value) {
    const absolute = Math.abs(value).toFixed(3);
    return value < 0 ? "−" + absolute : absolute;
  }

  function correlationInterval(summary) {
    return "90% CI [" + formatCorrelation(summary.lower_90) + ", " +
      formatCorrelation(summary.upper_90) + "]";
  }

  function linePath(series, x, y, valueIndex) {
    return series.map(function (row, index) {
      return (index ? "L" : "M") + x(row[0]) + " " + y(row[valueIndex]);
    }).join(" ");
  }

  function ribbonPath(series, x, y) {
    const lower = series.map(function (row, index) {
      return (index ? "L" : "M") + x(row[0]) + " " + y(row[2]);
    });
    const upper = series.slice().reverse().map(function (row) {
      return "L" + x(row[0]) + " " + y(row[3]);
    });
    return lower.concat(upper, "Z").join(" ");
  }

  function addTooltipRow(tooltip, labelText, valueText) {
    const row = document.createElement("div");
    const label = document.createElement("span");
    const value = document.createElement("span");
    row.className = "benchmark-dif-tooltip-row";
    value.className = "benchmark-dif-tooltip-value";
    label.textContent = labelText;
    value.textContent = valueText;
    row.append(label, value);
    tooltip.appendChild(row);
  }

  function positionTooltip(tooltip, plot, svgX, viewBoxWidth) {
    const plotWidth = plot.getBoundingClientRect().width;
    if ((svgX / viewBoxWidth) * plotWidth > plotWidth / 2) {
      tooltip.style.left = "0.75rem";
      tooltip.style.right = "auto";
    } else {
      tooltip.style.left = "auto";
      tooltip.style.right = "0.75rem";
    }
    tooltip.hidden = false;
  }

  function renderTrendTooltip(state, row, tooltip, hoverLayer, x, y, width) {
    const kind = state.kind;
    hoverLayer.replaceChildren(
      svgElement("line", {
        x1: x(row[0]), x2: x(row[0]), y1: 24, y2: 474,
        class: "benchmark-dif-hover-line"
      }),
      svgElement("circle", {
        cx: x(row[0]), cy: y(row[1]), r: 6,
        class: "benchmark-dif-hover-point"
      })
    );
    tooltip.replaceChildren();
    const heading = document.createElement("strong");
    heading.textContent = dataset.months[row[0]];
    tooltip.appendChild(heading);
    addTooltipRow(
      tooltip,
      kind === "difficulty" ? "Posterior mean EDI" : "Posterior mean",
      formatValue(row[1], kind)
    );
    addTooltipRow(
      tooltip,
      "90% temporal-shape band",
      formatValue(row[2], kind) + " to " + formatValue(row[3], kind)
    );
    addTooltipRow(
      tooltip,
      "Absolute 90% interval",
      formatValue(row[6], kind) + " to " + formatValue(row[7], kind)
    );
    addTooltipRow(
      tooltip,
      "Epoch static estimate",
      formatValue(
        kind === "difficulty"
          ? state.benchmark.epoch_difficulty
          : state.benchmark.epoch_discrimination,
        kind
      )
    );
    addTooltipRow(tooltip, "Observations", String(row[4]));
    positionTooltip(tooltip, state.plot, x(row[0]), width);
    state.readout.textContent = state.benchmark.name + ", " + dataset.months[row[0]] +
      ". Absolute posterior mean " + formatValue(row[1], kind) +
      ", 90 percent temporal-shape band " +
      formatValue(row[2], kind) + " to " + formatValue(row[3], kind) +
      ", absolute 90 percent marginal interval " +
      formatValue(row[6], kind) + " to " + formatValue(row[7], kind) +
      ", " + row[4] + " observations.";
    state.hoverIndex = row[0];
  }

  function renderTrend(state) {
    const series = state.benchmark[state.kind];
    const epochValue = state.kind === "difficulty"
      ? state.benchmark.epoch_difficulty
      : state.benchmark.epoch_discrimination;
    const width = 960;
    const height = 530;
    const margin = { top: 24, right: 20, bottom: 56, left: 78 };
    const innerRight = width - margin.right;
    const innerBottom = height - margin.bottom;
    const allValues = series.flatMap(function (row) { return [row[2], row[3]]; });
    allValues.push(epochValue);
    const domain = paddedDomain(allValues, false);
    const x = linearScale(0, dataset.months.length - 1, margin.left, innerRight);
    const y = linearScale(domain.minimum, domain.maximum, innerBottom, margin.top);
    const svg = svgElement("svg", {
      viewBox: "0 0 " + width + " " + height,
      role: "img",
      tabindex: "0",
      "aria-label": state.benchmark.name + " " + state.kind +
        " by model release month. Use left and right arrow keys to inspect values."
    });
    const grid = svgElement("g");
    const marks = svgElement("g");
    const hoverLayer = svgElement("g");
    const tooltip = document.createElement("div");
    tooltip.className = "benchmark-dif-tooltip";
    tooltip.hidden = true;

    const yTickCount = Math.round((domain.maximum - domain.minimum) / domain.step);
    for (let index = 0; index <= yTickCount; index += 1) {
      const value = domain.minimum + index * domain.step;
      grid.appendChild(svgElement("line", {
        x1: margin.left, x2: innerRight, y1: y(value), y2: y(value),
        class: "benchmark-dif-grid"
      }));
      addText(grid, formatTick(value), {
        x: margin.left - 10, y: y(value) + 4, "text-anchor": "end",
        class: "benchmark-dif-axis-text"
      });
    }

    const monthTicks = [];
    for (let month = 0; month < dataset.months.length; month += 6) monthTicks.push(month);
    if (monthTicks[monthTicks.length - 1] !== dataset.months.length - 1) {
      const lastMonth = dataset.months.length - 1;
      // A final month just one or two positions after the last six-month tick
      // produces overlapping labels (for example, Aug 2026 and Sep 2026).
      // Replace that nearby tick so the endpoint remains explicit and legible.
      if (lastMonth - monthTicks[monthTicks.length - 1] < 3) {
        monthTicks[monthTicks.length - 1] = lastMonth;
      } else {
        monthTicks.push(lastMonth);
      }
    }
    monthTicks.forEach(function (month) {
      grid.appendChild(svgElement("line", {
        x1: x(month), x2: x(month), y1: margin.top, y2: innerBottom,
        class: "benchmark-dif-grid"
      }));
      addText(grid, dataset.months[month], {
        x: x(month), y: innerBottom + 22, "text-anchor": "middle",
        class: "benchmark-dif-axis-text"
      });
    });
    grid.appendChild(svgElement("line", {
      x1: margin.left, x2: innerRight, y1: innerBottom, y2: innerBottom,
      class: "benchmark-dif-axis"
    }));
    grid.appendChild(svgElement("line", {
      x1: margin.left, x2: margin.left, y1: margin.top, y2: innerBottom,
      class: "benchmark-dif-axis"
    }));
    addText(grid, "Model release date", {
      x: (margin.left + innerRight) / 2, y: height - 12,
      "text-anchor": "middle", class: "benchmark-dif-axis-label"
    });
    addText(grid, state.kind === "difficulty" ? "Difficulty (EDI)" : "Discrimination (ECI scale)", {
      x: 18, y: (margin.top + innerBottom) / 2, "text-anchor": "middle",
      transform: "rotate(-90 18 " + ((margin.top + innerBottom) / 2) + ")",
      class: "benchmark-dif-axis-label"
    });

    marks.appendChild(svgElement("line", {
      x1: margin.left, x2: innerRight,
      y1: y(epochValue), y2: y(epochValue),
      class: "benchmark-dif-epoch-line"
    }));
    marks.appendChild(svgElement("path", {
      d: ribbonPath(series, x, y), class: "benchmark-dif-ribbon"
    }));
    marks.appendChild(svgElement("path", {
      d: linePath(series, x, y, 1), class: "benchmark-dif-series-line"
    }));
    series.forEach(function (row) {
      marks.appendChild(svgElement("circle", {
        cx: x(row[0]), cy: y(row[1]), r: 3,
        class: row[4] > 0
          ? "benchmark-dif-series-point"
          : "benchmark-dif-series-point benchmark-dif-series-point-interpolated"
      }));
    });

    function rowFromPointer(event) {
      const bounds = svg.getBoundingClientRect();
      const pointerX = ((event.clientX - bounds.left) / bounds.width) * width;
      const month = Math.round(((pointerX - margin.left) / (innerRight - margin.left)) * (dataset.months.length - 1));
      return series.reduce(function (best, row) {
        return !best || Math.abs(row[0] - month) < Math.abs(best[0] - month) ? row : best;
      }, null);
    }

    const overlay = svgElement("rect", {
      x: margin.left, y: margin.top,
      width: innerRight - margin.left, height: innerBottom - margin.top,
      fill: "transparent"
    });
    overlay.addEventListener("pointermove", function (event) {
      renderTrendTooltip(state, rowFromPointer(event), tooltip, hoverLayer, x, y, width);
    });
    overlay.addEventListener("pointerdown", function (event) {
      renderTrendTooltip(state, rowFromPointer(event), tooltip, hoverLayer, x, y, width);
    });
    overlay.addEventListener("pointerleave", function () {
      if (document.activeElement !== svg) {
        tooltip.hidden = true;
        hoverLayer.replaceChildren();
      }
    });
    svg.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      let index = state.hoverIndex == null ? Math.floor(series.length / 2) :
        series.findIndex(function (row) { return row[0] === state.hoverIndex; });
      index += event.key === "ArrowRight" ? 1 : -1;
      index = Math.max(0, Math.min(series.length - 1, index));
      renderTrendTooltip(state, series[index], tooltip, hoverLayer, x, y, width);
    });
    svg.addEventListener("blur", function () {
      tooltip.hidden = true;
      hoverLayer.replaceChildren();
    });

    svg.append(grid, marks, hoverLayer, overlay);
    state.plot.replaceChildren(svg, tooltip);
    state.title.textContent = state.benchmark.name + " " + state.kind + " over time";
    state.status.hidden = true;
    state.hoverIndex = null;
  }

  function selectBenchmark(state, benchmarkId) {
    state.benchmark = dataset.benchmarks.find(function (benchmark) {
      return benchmark.id === benchmarkId;
    }) || dataset.benchmarks[0];
    state.select.value = state.benchmark.id;
    renderTrend(state);
  }

  function initializeTrend(root) {
    const state = {
      root: root,
      kind: root.dataset.kind,
      select: root.querySelector("[data-role='benchmark-select']"),
      title: root.querySelector("[data-role='title']"),
      plot: root.querySelector("[data-role='plot']"),
      status: root.querySelector("[data-role='status']"),
      readout: root.querySelector("[data-role='readout']"),
      hoverIndex: null
    };
    state.select.replaceChildren();
    dataset.benchmarks.slice().sort(function (left, right) {
      return left.name.localeCompare(right.name);
    }).forEach(function (benchmark) {
      const option = document.createElement("option");
      option.value = benchmark.id;
      option.textContent = benchmark.name;
      state.select.appendChild(option);
    });
    state.select.disabled = false;
    state.select.addEventListener("change", function () {
      selectBenchmark(state, state.select.value);
    });
    trendStates.push(state);
    selectBenchmark(state, root.dataset.defaultBenchmark);
  }

  function renderScatterTooltip(entry, tooltip, hoverLayer, x, y, width) {
    const change = entry.benchmark.change;
    hoverLayer.replaceChildren(svgElement("circle", {
      cx: x(change.discrimination_per_month),
      cy: y(change.difficulty_edi_per_month),
      r: 7,
      class: "benchmark-dif-scatter-hover"
    }));
    tooltip.replaceChildren();
    const heading = document.createElement("strong");
    heading.textContent = entry.benchmark.name;
    tooltip.appendChild(heading);
    addTooltipRow(
      tooltip,
      "Discrimination/month",
      formatValue(change.discrimination_per_month, "discrimination-change")
    );
    addTooltipRow(
      tooltip,
      "EDI/month",
      formatValue(change.difficulty_edi_per_month, "difficulty")
    );
    addTooltipRow(
      tooltip,
      "Period",
      dataset.months[change.first_month] + " to " + dataset.months[change.last_month]
    );
    positionTooltip(tooltip, scatterState.plot, x(change.discrimination_per_month), width);
    scatterState.readout.textContent = entry.benchmark.name + ". Average monthly discrimination change " +
      formatValue(change.discrimination_per_month, "discrimination-change") +
      ", average monthly EDI change " +
      formatValue(change.difficulty_edi_per_month, "difficulty") + ".";
    scatterState.hoverIndex = entry.index;
  }

  function renderScatter() {
    const width = 720;
    const height = 700;
    const margin = { top: 24, right: 28, bottom: 84, left: 92 };
    const innerRight = width - margin.right;
    const innerBottom = height - margin.bottom;
    const plotted = dataset.benchmarks.filter(function (benchmark) {
      return benchmark.change.last_month > benchmark.change.first_month;
    });
    const xDomain = symmetricDomain(plotted.map(function (benchmark) {
      return benchmark.change.discrimination_per_month;
    }));
    const yDomain = symmetricDomain(plotted.map(function (benchmark) {
      return benchmark.change.difficulty_edi_per_month;
    }));
    const x = linearScale(xDomain.minimum, xDomain.maximum, margin.left, innerRight);
    const y = linearScale(yDomain.minimum, yDomain.maximum, innerBottom, margin.top);
    const svg = svgElement("svg", {
      viewBox: "0 0 " + width + " " + height,
      role: "img",
      tabindex: "0",
      "aria-label": "Average monthly discrimination change by average monthly difficulty change across benchmarks. Use arrow keys to inspect points."
    });
    const grid = svgElement("g");
    const points = svgElement("g");
    const hoverLayer = svgElement("g");
    const tooltip = document.createElement("div");
    tooltip.className = "benchmark-dif-tooltip";
    tooltip.hidden = true;

    function addTicks(domain, scale, vertical) {
      const count = Math.round((domain.maximum - domain.minimum) / domain.step);
      for (let index = 0; index <= count; index += 1) {
        const value = domain.minimum + index * domain.step;
        const className = Math.abs(value) < 1e-12 ? "benchmark-dif-zero" : "benchmark-dif-grid";
        if (vertical) {
          grid.appendChild(svgElement("line", {
            x1: scale(value), x2: scale(value), y1: margin.top, y2: innerBottom,
            class: className
          }));
          addText(grid, formatTick(value), {
            x: scale(value), y: innerBottom + 22, "text-anchor": "middle",
            class: "benchmark-dif-axis-text"
          });
        } else {
          grid.appendChild(svgElement("line", {
            x1: margin.left, x2: innerRight, y1: scale(value), y2: scale(value),
            class: className
          }));
          addText(grid, formatTick(value), {
            x: margin.left - 10, y: scale(value) + 4, "text-anchor": "end",
            class: "benchmark-dif-axis-text"
          });
        }
      }
    }
    addTicks(xDomain, x, true);
    addTicks(yDomain, y, false);
    addText(grid, "Average discrimination change per month", {
      x: (margin.left + innerRight) / 2, y: height - 16,
      "text-anchor": "middle", class: "benchmark-dif-axis-label"
    });
    addText(grid, "Average difficulty change (EDI/month)", {
      x: 18, y: (margin.top + innerBottom) / 2, "text-anchor": "middle",
      transform: "rotate(-90 18 " + ((margin.top + innerBottom) / 2) + ")",
      class: "benchmark-dif-axis-label"
    });

    const entries = plotted.map(function (benchmark, index) {
      const entry = {
        benchmark: benchmark,
        index: index,
        x: x(benchmark.change.discrimination_per_month),
        y: y(benchmark.change.difficulty_edi_per_month)
      };
      points.appendChild(svgElement("circle", {
        cx: entry.x, cy: entry.y, r: 4.5,
        class: "benchmark-dif-scatter-point"
      }));
      return entry;
    });

    function nearestEntry(event) {
      const bounds = svg.getBoundingClientRect();
      const pointerX = ((event.clientX - bounds.left) / bounds.width) * width;
      const pointerY = ((event.clientY - bounds.top) / bounds.height) * height;
      return entries.reduce(function (best, entry) {
        const distance = (entry.x - pointerX) ** 2 + (entry.y - pointerY) ** 2;
        return !best || distance < best.distance ? { entry: entry, distance: distance } : best;
      }, null).entry;
    }

    const overlay = svgElement("rect", {
      x: margin.left, y: margin.top,
      width: innerRight - margin.left, height: innerBottom - margin.top,
      fill: "transparent"
    });
    overlay.addEventListener("pointermove", function (event) {
      renderScatterTooltip(nearestEntry(event), tooltip, hoverLayer, x, y, width);
    });
    overlay.addEventListener("pointerdown", function (event) {
      const entry = nearestEntry(event);
      renderScatterTooltip(entry, tooltip, hoverLayer, x, y, width);
      trendStates.forEach(function (state) {
        selectBenchmark(state, entry.benchmark.id);
      });
    });
    overlay.addEventListener("pointerleave", function () {
      if (document.activeElement !== svg) {
        tooltip.hidden = true;
        hoverLayer.replaceChildren();
      }
    });
    svg.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      let index = scatterState.hoverIndex == null ? 0 : scatterState.hoverIndex;
      index += event.key === "ArrowRight" ? 1 : -1;
      index = (index + entries.length) % entries.length;
      renderScatterTooltip(entries[index], tooltip, hoverLayer, x, y, width);
    });
    svg.addEventListener("blur", function () {
      tooltip.hidden = true;
      hoverLayer.replaceChildren();
    });

    svg.append(grid, points, hoverLayer, overlay);
    scatterState.plot.replaceChildren(svg, tooltip);
    if (dataset.change_correlations) {
      const correlations = dataset.change_correlations;
      scatterState.subtitle.textContent =
        "Each point shows one benchmark’s posterior-mean change.";
      scatterState.allEstimate.textContent =
        "Mean r = " + formatCorrelation(correlations.pearson.mean);
      scatterState.allInterval.textContent =
        correlationInterval(correlations.pearson);
      scatterState.restrictedEstimate.textContent =
        "Mean r = " +
        formatCorrelation(correlations.pearson_without_outliers.mean);
      scatterState.restrictedInterval.textContent =
        correlationInterval(correlations.pearson_without_outliers);
      scatterState.correlationSummary.hidden = false;
    } else {
      scatterState.subtitle.textContent = "Each point is one benchmark; Pearson r = " +
        dataset.change_correlation.toFixed(3) + ".";
    }
    scatterState.status.hidden = true;
  }

  function initializeScatter(root) {
    scatterState = {
      root: root,
      plot: root.querySelector("[data-role='plot']"),
      status: root.querySelector("[data-role='status']"),
      subtitle: root.querySelector("[data-role='subtitle']"),
      correlationSummary: root.querySelector("[data-role='correlation-summary']"),
      allEstimate: root.querySelector("[data-role='correlation-all-estimate']"),
      allInterval: root.querySelector("[data-role='correlation-all-interval']"),
      restrictedEstimate: root.querySelector("[data-role='correlation-restricted-estimate']"),
      restrictedInterval: root.querySelector("[data-role='correlation-restricted-interval']"),
      readout: root.querySelector("[data-role='readout']"),
      hoverIndex: null
    };
    renderScatter();
  }

  const dataUrl = (trendRoots[0] || scatterRoot).dataset.dataUrl;
  fetch(dataUrl)
    .then(function (response) {
      if (!response.ok) throw new Error("The benchmark temporal-DIF data could not be loaded.");
      return response.json();
    })
    .then(function (loaded) {
      dataset = loaded;
      trendRoots.forEach(initializeTrend);
      if (scatterRoot) initializeScatter(scatterRoot);
    })
    .catch(function (error) {
      trendRoots.concat(scatterRoot ? [scatterRoot] : []).forEach(function (root) {
        const status = root.querySelector("[data-role='status']");
        if (status) {
          status.textContent = error.message;
          status.classList.add("is-error");
        }
      });
    });
}());
