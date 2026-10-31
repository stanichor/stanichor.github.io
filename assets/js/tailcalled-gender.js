(() => {
  const roots = [...document.querySelectorAll('[data-tailcalled-factor]')];
  if (!roots.length) return;
  const NS = 'http://www.w3.org/2000/svg';
  let dataPromise;
  const tooltip = document.createElement('div');
  tooltip.className = 'tailcalled-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.hidden = true;
  document.body.append(tooltip);
  const signed = (value) => `${value < 0 ? '−' : '+'}${Math.abs(value).toFixed(2)}`;
  const node = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const svgNode = (tag, attributes) => {
    const element = document.createElementNS(NS, tag);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
    return element;
  };
  function showTooltip(event, text) {
    tooltip.textContent = text;
    tooltip.hidden = false;
    const bounds = tooltip.getBoundingClientRect();
    tooltip.style.left = `${Math.max(8, Math.min(event.clientX + 14, window.innerWidth - bounds.width - 10))}px`;
    tooltip.style.top = `${Math.max(8, Math.min(event.clientY + 14, window.innerHeight - bounds.height - 10))}px`;
  }
  const hideTooltip = () => { tooltip.hidden = true; };
  window.addEventListener('scroll', hideTooltip, { passive: true });

  function validate(data) {
    if (data.minimum !== -4 || data.maximum !== 4 || data.binWidth !== .2 || data.factors.length !== 20) {
      throw new Error('Unexpected chart format');
    }
    data.factors.forEach((factor, index) => {
      if (factor.id !== `F${index + 1}` || factor.binCounts.length !== 40
        || factor.binCounts.reduce((a, b) => a + b, 0) !== factor.participants || !factor.items.length) {
        throw new Error('Incomplete factor data');
      }
    });
    return data;
  }
  function loadData(url) {
    if (!dataPromise) {
      dataPromise = fetch(url).then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      }).then(validate);
    }
    return dataPromise;
  }

  function render(root, factor, data) {
    const { minimum, maximum, binWidth } = data;
    const position = (score) => (score - minimum) / (maximum - minimum) * 100;
    let score = 0;
    let histogramWidth = 500;
    const rows = [];
    root.replaceChildren();
    root.append(node('p', 'tailcalled-help',
      'Use the slider or click the histogram or response bands to explore a score. Hover for labels; click the question text to see its response scale and loading.'));
    const controls = node('div', 'tailcalled-controls');
    const label = node('label', '', 'Explore a score');
    const slider = node('input');
    slider.type = 'range'; slider.min = minimum; slider.max = maximum; slider.step = '.01'; slider.value = '0';
    slider.id = `tailcalled-${factor.id}-score`;
    label.htmlFor = slider.id;
    const output = node('output', '', '0.00 SD');
    output.htmlFor = slider.id;
    output.setAttribute('aria-live', 'off');
    output.dataset.role = 'score';
    const reset = node('button', '', 'Reset'); reset.type = 'button';
    controls.append(label, output, slider, reset);
    root.append(controls);

    const histogramRow = node('div', 'tailcalled-row tailcalled-histogram-row');
    const histogramLabel = node('div', 'tailcalled-histogram-label');
    histogramLabel.append(node('strong', '', 'Participants'), node('span', '', `n = ${factor.participants} · ${factor.items.length} items`));
    const histogram = node('div', 'tailcalled-histogram');
    const svg = svgNode('svg', { role: 'img', 'aria-label': `Distribution of ${factor.name} scores; 40 bins, ${factor.participants} participants` });
    const ticks = node('div', 'tailcalled-ticks');
    for (let value = minimum; value <= maximum; value += 1) ticks.append(node('span', '', String(value).replace('-', '−')));
    histogram.append(svg, ticks, node('div', 'tailcalled-axis-label', 'Factor score (population SD units)'));
    histogramRow.append(histogramLabel, histogram);
    root.append(histogramRow);
    let histogramMarker;

    const categoryAt = (item, value) => item.categories.find((category) =>
      (category.lower === null || value >= category.lower)
      && (category.upper === null || value < category.upper));
    function selectScore(value) {
      score = Math.max(minimum, Math.min(maximum, value));
      slider.value = score.toFixed(2);
      output.value = `${signed(score)} SD`;
      slider.setAttribute('aria-valuetext', `${signed(score)} population standard deviations`);
      root.style.setProperty('--tailcalled-score', `${position(score)}%`);
      if (histogramMarker) {
        const x = position(score) / 100 * histogramWidth;
        histogramMarker.setAttribute('x1', x); histogramMarker.setAttribute('x2', x);
      }
      rows.forEach((row) => {
        const selected = categoryAt(row.item, score);
        row.current.textContent = `At ${signed(score)} SD: ${selected.label}`;
        row.band.setAttribute('aria-label', `${row.item.name}. At ${signed(score)} SD: ${selected.label}. Click to select a score; use the slider for keyboard adjustment.`);
        row.keyRows.forEach(([category, element]) => element.classList.toggle('is-current', category === selected));
      });
    }
    function scoreFromPointer(event, track) {
      const bounds = track.getBoundingClientRect();
      return minimum + (event.clientX - bounds.left) / bounds.width * (maximum - minimum);
    }
    function drawHistogram() {
      histogramWidth = Math.max(100, histogram.getBoundingClientRect().width);
      const height = 150;
      const top = Math.max(5, Math.ceil(Math.max(...factor.binCounts) / 5) * 5);
      svg.setAttribute('viewBox', `0 0 ${histogramWidth} ${height}`);
      svg.replaceChildren();
      for (let value = 0; value <= top; value += 5) {
        const y = height - 8 - value / top * (height - 20);
        svg.append(svgNode('line', { x1: 0, x2: histogramWidth, y1: y, y2: y, stroke: '#e1e8ec', 'stroke-width': 1 }));
        const tick = svgNode('text', { x: 3, y: y - 3, 'font-size': 10, fill: '#647783' });
        tick.textContent = value;
        svg.append(tick);
      }
      factor.binCounts.forEach((count, index) => {
        const barHeight = count / top * (height - 20);
        svg.append(svgNode('rect', { x: index / 40 * histogramWidth, y: height - 8 - barHeight,
          width: histogramWidth / 40, height: barHeight, fill: '#247eb3', 'data-bin': index }));
      });
      for (let value = minimum + 1; value < maximum; value += 1) {
        const x = position(value) / 100 * histogramWidth;
        svg.append(svgNode('line', { x1: x, x2: x, y1: 0, y2: height - 8, stroke: '#bdcbd4', 'stroke-dasharray': '3 4', 'pointer-events': 'none' }));
      }
      histogramMarker = svgNode('line', { y1: 0, y2: height - 8, stroke: '#172d3d', 'stroke-width': 2, 'pointer-events': 'none' });
      svg.append(histogramMarker);
      selectScore(score);
    }
    svg.addEventListener('pointerover', (event) => {
      if (!event.target.hasAttribute('data-bin')) { hideTooltip(); return; }
      const index = Number(event.target.getAttribute('data-bin'));
      showTooltip(event, `${factor.binCounts[index]} of ${factor.participants} participants\n`
        + `${(minimum + index * binWidth).toFixed(1)} to ${(minimum + (index + 1) * binWidth).toFixed(1)} SD`);
    });
    svg.addEventListener('pointerleave', hideTooltip);
    svg.addEventListener('click', (event) => selectScore(scoreFromPointer(event, svg)));

    factor.items.forEach((item, index) => {
      const row = node('div', 'tailcalled-row tailcalled-item');
      const question = node('button', 'tailcalled-question'); question.type = 'button';
      question.append(node('span', 'tailcalled-question-text', `${item.name}${item.repeated ? ' †' : ''}`),
        node('span', 'tailcalled-loading', `λ = ${signed(item.loading.mean)} · 90% CI [${item.loading.low.toFixed(2)}, ${item.loading.high.toFixed(2)}]`));
      const band = node('button', 'tailcalled-band'); band.type = 'button';
      item.categories.forEach((category) => {
        const left = Math.max(minimum, category.lower === null ? minimum : category.lower);
        const right = Math.min(maximum, category.upper === null ? maximum : category.upper);
        if (right <= left) return;
        const segment = node('span', 'tailcalled-segment');
        segment.style.left = `${position(left)}%`;
        segment.style.width = `${position(right) - position(left)}%`;
        segment.style.backgroundColor = category.color;
        segment.setAttribute('aria-hidden', 'true');
        segment.dataset.response = category.label;
        band.append(segment);
      });
      for (let value = minimum + 1; value < maximum; value += 1) {
        const guide = node('span', 'tailcalled-guide'); guide.style.left = `${position(value)}%`; band.append(guide);
      }
      band.append(node('span', 'tailcalled-marker'));
      const details = node('div', 'tailcalled-item-details'); details.hidden = true;
      details.id = `tailcalled-${factor.id}-item-${index}`;
      question.setAttribute('aria-expanded', 'false'); question.setAttribute('aria-controls', details.id);
      const current = node('strong');
      details.append(node('strong', '', 'Response scale'), node('p', '',
        `Pattern loading: ${signed(item.loading.mean)}; 90% credible interval [${item.loading.low.toFixed(2)}, ${item.loading.high.toFixed(2)}].`), current);
      if (item.repeated) details.append(node('p', 'tailcalled-note', '† Asked in both surveys; the two fitted cutpoint sets are averaged.'));
      const key = node('ul', 'tailcalled-response-key');
      const keyRows = item.categories.map((category) => {
        const entry = node('li'); const swatch = node('i'); swatch.style.backgroundColor = category.color;
        swatch.setAttribute('aria-hidden', 'true');
        entry.append(swatch, node('span', '', category.label)); key.append(entry);
        return [category, entry];
      });
      details.append(key);
      function toggleDetails() {
        details.hidden = !details.hidden;
        question.setAttribute('aria-expanded', String(!details.hidden));
        hideTooltip();
      }
      question.addEventListener('click', toggleDetails);
      band.addEventListener('click', (event) => {
        if (event.detail) selectScore(scoreFromPointer(event, band));
        hideTooltip();
      });
      band.addEventListener('pointerover', (event) => {
        const response = event.target.dataset.response;
        if (response === undefined) { hideTooltip(); return; }
        showTooltip(event, `${response}\nλ = ${signed(item.loading.mean)}; 90% CI [${item.loading.low.toFixed(2)}, ${item.loading.high.toFixed(2)}]`);
      });
      band.addEventListener('pointerleave', hideTooltip);
      row.append(question, band, details); root.append(row);
      rows.push({ item, band, current, keyRows });
    });
    root.append(node('p', 'tailcalled-note',
      'Colors follow the displayed response order; negative-loading items run in reverse. Bands use fitted response cutpoints.'
      + (factor.items.some((item) => item.repeated) ? ' † Repeated questions appear once.' : '')));
    slider.addEventListener('input', () => { hideTooltip(); selectScore(Number(slider.value)); });
    reset.addEventListener('click', () => { hideTooltip(); selectScore(0); });
    const observer = new ResizeObserver(drawHistogram); observer.observe(histogram);
    drawHistogram();
    root.dataset.ready = 'true';
  }

  roots.forEach((root) => {
    const disclosure = root.closest('details');
    let loading = false;
    async function initialize() {
      if (!disclosure.open || root.dataset.ready || loading) return;
      loading = true;
      root.querySelector('[role="status"]').textContent = 'Loading diagram…';
      try {
        const data = await loadData(root.dataset.src);
        const factor = data.factors.find((entry) => entry.id === root.dataset.tailcalledFactor);
        if (!factor) throw new Error('Factor not found');
        render(root, factor, data);
      } catch (error) {
        root.replaceChildren(node('p', 'tailcalled-status', 'The diagram could not load. Close and reopen this section to retry.'));
        root.firstChild.setAttribute('role', 'status');
        dataPromise = undefined;
        console.error('Tailcalled diagram:', error);
      } finally { loading = false; }
    }
    disclosure.addEventListener('toggle', initialize);
    initialize();
  });
  function openLinkedFactor() {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    const disclosure = target && target.closest('.tailcalled-factor');
    if (disclosure) disclosure.open = true;
  }
  window.addEventListener('hashchange', openLinkedFactor);
  openLinkedFactor();
})();
