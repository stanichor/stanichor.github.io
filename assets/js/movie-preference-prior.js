(() => {
  const root = document.querySelector('[data-preference-prior]');
  if (!root) return;

  const select = root.querySelector('[data-role="dimension-select"]');
  const previous = root.querySelector('[data-role="previous"]');
  const next = root.querySelector('[data-role="next"]');
  const counter = root.querySelector('[data-role="counter"]');
  const title = root.querySelector('[data-role="title"]');
  const chart = root.querySelector('[data-role="chart"]');
  const mean = root.querySelector('[data-role="mean"]');
  const sd = root.querySelector('[data-role="sd"]');
  const positive = root.querySelector('[data-role="positive"]');
  const range = root.querySelector('[data-role="range"]');
  const relatedPositive = root.querySelector('[data-role="related-positive"]');
  const relatedNegative = root.querySelector('[data-role="related-negative"]');
  const content = root.querySelector('[data-role="content"]');
  const status = root.querySelector('[data-role="status"]');
  const svgNamespace = 'http://www.w3.org/2000/svg';
  const syncEvent = 'stanichor:movie-dimension-selected';

  function signed(value, digits = 3) {
    const places = Math.abs(value) < .0005 ? 4 : digits;
    return `${value < 0 ? '−' : '+'}${Math.abs(value).toFixed(places)}`;
  }

  function svgElement(type, attributes) {
    const element = document.createElementNS(svgNamespace, type);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
    return element;
  }

  function drawChart(dimension) {
    const width = 720;
    const leftMargin = 51;
    const rightMargin = 24;
    const baseline = 181;
    const height = 147;
    const mu = dimension.mean;
    const sigma = dimension.sd;
    // Keep coefficients comparable while giving each density curve room to breathe.
    const lower = -.8;
    const upper = .8;
    const peakDensity = 1 / (sigma * Math.sqrt(2 * Math.PI));
    const roughStep = peakDensity * 1.15 / 4;
    const magnitude = 10 ** Math.floor(Math.log10(roughStep));
    const densityStep = [1, 2, 5, 10].map((value) => value * magnitude)
      .find((value) => value >= roughStep);
    const densityMaximum = Math.ceil(peakDensity * 1.15 / densityStep) * densityStep;

    const x = (value) => leftMargin + (value - lower) / (upper - lower)
      * (width - leftMargin - rightMargin);
    const y = (value) => baseline - height / densityMaximum
      * Math.exp(-.5 * ((value - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
    const curve = (start, end, count) => Array.from({ length: count + 1 }, (_, index) => {
      const value = start + (end - start) * index / count;
      return `${index ? 'L' : 'M'}${x(value).toFixed(2)},${y(value).toFixed(2)}`;
    }).join(' ');

    const parts = [];
    const densityDecimals = Math.max(0, -Math.floor(Math.log10(densityStep)));
    const densityTicks = Math.round(densityMaximum / densityStep);
    for (let tick = 0; tick <= densityTicks; tick++) {
      const value = tick * densityStep;
      const position = baseline - height * value / densityMaximum;
      parts.push(svgElement('line', {
        x1: leftMargin, x2: width - rightMargin, y1: position, y2: position,
        stroke: '#e7eef1', 'stroke-width': 1,
      }));
      const label = svgElement('text', {
        x: leftMargin - 10, y: position + 4, 'text-anchor': 'end',
        fill: '#61727c', 'font-size': 11, 'font-family': 'sans-serif',
      });
      label.textContent = tick === 0 ? '0' : value.toFixed(densityDecimals);
      parts.push(label);
    }
    for (let tick = -4; tick <= 4; tick++) {
      const value = tick / 5;
      const position = x(value);
      parts.push(svgElement('line', {
        x1: position, x2: position, y1: 22, y2: baseline,
        stroke: '#e7eef1', 'stroke-width': 1,
      }));
      parts.push(svgElement('line', {
        x1: position, x2: position, y1: baseline, y2: baseline + 5,
        stroke: '#83939c', 'stroke-width': 1,
      }));
      const label = svgElement('text', {
        x: position, y: baseline + 22, 'text-anchor': 'middle',
        fill: '#61727c', 'font-size': 12, 'font-family': 'sans-serif',
      });
      label.textContent = value.toFixed(1).replace('-', '−');
      parts.push(label);
    }
    const densityLabel = svgElement('text', {
      x: leftMargin, y: 20, fill: '#61727c',
      'font-size': 11, 'font-family': 'sans-serif',
    });
    densityLabel.textContent = 'Density';
    parts.push(densityLabel);

    const [low90, high90] = dimension.range_90;
    parts.push(svgElement('path', {
      d: `M${x(low90).toFixed(2)},${baseline} ${curve(low90, high90, 100).replace(/^M/, 'L')} L${x(high90).toFixed(2)},${baseline} Z`,
      fill: '#dceaf0',
    }));
    parts.push(svgElement('line', {
      x1: x(0), x2: x(0), y1: 20, y2: baseline,
      stroke: '#ad745e', 'stroke-width': 1.35, 'stroke-dasharray': '5 5',
    }));
    parts.push(svgElement('path', {
      d: curve(lower, upper, 220), fill: 'none',
      stroke: '#326785', 'stroke-width': 2.5, 'stroke-linejoin': 'round',
    }));
    parts.push(svgElement('line', {
      x1: x(mu), x2: x(mu), y1: y(mu), y2: baseline,
      stroke: '#326785', 'stroke-width': 1.3,
    }));
    parts.push(svgElement('circle', {
      cx: x(mu), cy: y(mu), r: 3.7, fill: '#326785',
    }));
    parts.push(svgElement('line', {
      x1: leftMargin, x2: width - rightMargin, y1: baseline, y2: baseline,
      stroke: '#9cabb3', 'stroke-width': 1,
    }));
    const axisLabel = svgElement('text', {
      x: width / 2, y: 228, 'text-anchor': 'middle',
      fill: '#4d606c', 'font-size': 12, 'font-family': 'sans-serif',
    });
    axisLabel.textContent = 'Preference coefficient';
    parts.push(axisLabel);
    chart.replaceChildren(...parts);
    chart.setAttribute('aria-label',
      `Gaussian preference coefficient distribution for ${dimension.name}; `
      + `mean ${signed(mu)}, standard deviation ${sigma.toFixed(3)}, `
      + `middle 90 percent from ${signed(low90)} to ${signed(high90)}.`);
  }

  fetch(root.dataset.src)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((prior) => {
      const dimensions = prior.dimensions;
      if (!Array.isArray(dimensions) || dimensions.length === 0
        || dimensions.some((dimension, index) =>
          dimension.number !== index + 1 || !Number.isFinite(dimension.mean)
          || !Number.isFinite(dimension.sd)
          || dimension.sd <= 0)) {
        throw new Error('Invalid preference dimensions');
      }

      select.replaceChildren(...dimensions.map((dimension, index) => {
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = `${dimension.name} · ${String(dimension.number).padStart(3, '0')}`;
        return option;
      }));

      function relatedButton(item) {
        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('aria-label', `Explore ${item.name}, correlation ${signed(item.r, 2)}`);
        const name = document.createElement('span');
        name.textContent = item.name;
        const correlation = document.createElement('span');
        correlation.className = 'preference-prior-related-r';
        correlation.textContent = signed(item.r, 2);
        button.append(name, correlation);
        button.addEventListener('click', () => show(item.number - 1));
        return button;
      }

      function show(index, notify = true) {
        const dimension = dimensions[index];
        select.value = String(index);
        counter.textContent = `${dimension.number} / ${dimensions.length}`;
        title.textContent = dimension.name;
        mean.textContent = signed(dimension.mean);
        sd.textContent = dimension.sd.toFixed(3);
        positive.textContent = `${(dimension.positive_probability * 100).toFixed(0)}%`;
        range.textContent = `${signed(dimension.range_90[0])} to ${signed(dimension.range_90[1])}`;
        drawChart(dimension);
        relatedPositive.replaceChildren(...dimension.related_positive.map(relatedButton));
        relatedNegative.replaceChildren(...dimension.related_negative.map(relatedButton));
        previous.disabled = index === 0;
        next.disabled = index === dimensions.length - 1;
        status.textContent = `Showing preference dimension ${dimension.number}: ${dimension.name}`;
        if (notify) {
          document.movieDimensionSelection = index;
          document.dispatchEvent(new CustomEvent(syncEvent, {
            detail: { index, source: 'preference-prior' },
          }));
        }
      }

      select.disabled = false;
      content.hidden = false;
      select.addEventListener('change', () => show(Number(select.value)));
      previous.addEventListener('click', () => show(Number(select.value) - 1));
      next.addEventListener('click', () => show(Number(select.value) + 1));
      document.addEventListener(syncEvent, (event) => {
        const index = event.detail.index;
        if (event.detail.source !== 'preference-prior'
          && Number.isInteger(index) && index >= 0 && index < dimensions.length) {
          show(index, false);
        }
      });
      const initial = document.movieDimensionSelection;
      show(Number.isInteger(initial) && initial >= 0 && initial < dimensions.length ? initial : 0, false);
    })
    .catch(() => {
      select.replaceChildren(new Option('Unable to load preference prior'));
      status.textContent = 'The preference-prior explorer could not be loaded.';
    });
})();
