(() => {
  const root = document.querySelector('[data-tailcalled-implications]');
  if (!root) return;
  const find = (role) => root.querySelector(`[data-role="${role}"]`);
  const status = find('implication-status');
  const plot = find('implication-plot');
  const tableBody = find('implication-rankings');
  const rankingSelect = find('ranking-mode');
  const rankingNote = find('ranking-note');
  const rankingRegion = find('ranking-region');
  const xSelect = find('implication-x');
  const ySelect = find('implication-y');
  const typeSelect = find('implication-type');
  const forwardRadio = find('direction-forward');
  const contrapositiveRadio = find('direction-contrapositive');
  const selectedLabel = find('selected-implication');
  const forwardValue = find('forward-strength');
  const converseValue = find('converse-strength');
  const forwardInterval = find('forward-interval');
  const converseInterval = find('converse-interval');
  const ns = 'http://www.w3.org/2000/svg';
  const number = (value, places = 2) => (Math.abs(value) < .5 * 10 ** -places ? 0 : value)
    .toFixed(places).replace('-', '−');
  const pole = (sign) => sign === 1 ? 'High' : 'Low';
  const node = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const svgNode = (tag, attributes, text) => {
    const element = document.createElementNS(ns, tag);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const pairKey = (x, y) => [x, y].sort((a, b) => Number(a.slice(1)) - Number(b.slice(1))).join('/');
  function validate(data) {
    if (data.version !== 1 || data.minimum !== -4 || data.maximum !== 4 || data.factors.length !== 19
      || data.pairs.length !== 171 || data.ranking.length !== 10) throw new Error('Unexpected implication data');
    const ids = data.factors.map((factor, index) => {
      if (factor.id !== `F${index + 1}` || !factor.name) throw new Error('Invalid factor labels');
      return factor.id;
    });
    const seen = new Set();
    data.pairs.forEach((pair) => {
      const key = pairKey(...pair.factorIds);
      if (pair.factorIds.length !== 2 || pair.factorIds[0] === pair.factorIds[1]
        || pair.factorIds.some((id) => !ids.includes(id)) || seen.has(key)
        || pair.points.length !== data.participants || pair.scores.length !== 4) throw new Error('Invalid factor pair');
      seen.add(key);
      if (pair.points.some((point) => point.length !== 2 || point.some((value) => !Number.isFinite(value)
        || Math.abs(value) > 4))) throw new Error('Invalid scatterplot points');
      const signs = new Set();
      pair.scores.forEach((score) => {
        if (![1, -1].includes(score.s) || ![1, -1].includes(score.t)
          || ['strength', 'severity', 'low', 'high'].some((key) => !Number.isFinite(score[key]))
          || score.severity < 0 || score.strength > 1 + 1e-10 || score.low > score.high
          || Math.abs(score.strength - (1 - score.severity / data.source.baseline)) > 1e-9) {
          throw new Error('Invalid implication scores');
        }
        signs.add(`${score.s}/${score.t}`);
      });
      if (signs.size !== 4) throw new Error('Missing implication directions');
    });
    return data;
  }

  fetch(root.dataset.src).then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }).then(validate).then((data) => {
    const names = new Map(data.factors.map((factor) => [factor.id, `${factor.id}: ${factor.name}`]));
    const pairs = new Map(data.pairs.map((pair) => [pairKey(...pair.factorIds), pair]));
    let state = { ...data.ranking[0], contrapositive: false };
    let rankingMode = 'asymmetry';
    const rowButtons = [];
    const rankings = {
      asymmetry: data.ranking,
      strength: data.pairs.map((pair) => {
        const best = pair.scores.reduce((current, score) => score.strength > current.strength ? score : current);
        let [x, y] = pair.factorIds;
        let { s, t } = best;
        if (s === -1 && t === -1) { [x, y] = [y, x]; s = 1; t = 1; }
        return { x, y, s, t, strength: best.strength };
      }).sort((a, b) => b.strength - a.strength).slice(0, 10)
        .map((entry, index) => ({ ...entry, rank: index + 1 })),
    };
    function description(selection, contrapositive = false) {
      const first = `${pole(selection.s)} ${names.get(selection.x)}`;
      const second = `${pole(selection.t)} ${names.get(selection.y)}`;
      return contrapositive
        ? `${pole(-selection.t)} ${names.get(selection.y)} ⇒ ${pole(-selection.s)} ${names.get(selection.x)}`
        : `${first} ⇒ ${second}`;
    }
    function scores(selection, converse = false) {
      const pair = pairs.get(pairKey(selection.x, selection.y));
      const sign = converse ? -1 : 1;
      const s = sign * selection.s; const t = sign * selection.t;
      // Reversed axes require the contrapositive in the stored axis order.
      const [storedS, storedT] = pair.factorIds[0] === selection.x ? [s, t] : [-t, -s];
      return pair.scores.find((entry) => entry.s === storedS && entry.t === storedT);
    }
    function displayedSelection() {
      return state.contrapositive
        ? { x: state.y, y: state.x, s: -state.t, t: -state.s }
        : state;
    }
    function draw() {
      const shown = displayedSelection();
      const L = 110; const T = 28; const size = 560;
      const positionX = (value) => L + (value + 4) / 8 * size;
      const positionY = (value) => T + (4 - value) / 8 * size;
      const svg = svgNode('svg', { viewBox: '0 0 740 690', role: 'img',
        'aria-label': `${description(state, state.contrapositive)}. ${data.participants} participants. The shaded quadrant violates this implication.` });
      svg.append(svgNode('title', {}, description(state, state.contrapositive)));
      svg.append(svgNode('rect', { x: 0, y: 0, width: 740, height: 690, fill: '#fff' }));
      svg.append(svgNode('rect', { x: L, y: T, width: size, height: size, fill: '#fbfcfd', stroke: '#ccd7de' }));
      // Keep the antecedent on X and consequent on Y. Transposing the axes
      // preserves the violating participants and their individual severities.
      const badX = shown.s;
      const badY = -shown.t;
      const shaded = svgNode('rect', { x: L + (badX === 1 ? size / 2 : 0),
        y: T + (badY === -1 ? size / 2 : 0), width: size / 2, height: size / 2,
        fill: '#fcebe6', 'data-role': 'violating-quadrant' });
      svg.append(shaded);
      for (let value = -4; value <= 4; value += 1) {
        const color = value === 0 ? '#899fae' : '#e2e8ec';
        const width = value === 0 ? 1.4 : .8;
        svg.append(svgNode('line', { x1: positionX(value), x2: positionX(value), y1: T, y2: T + size, stroke: color, 'stroke-width': width }));
        svg.append(svgNode('line', { x1: L, x2: L + size, y1: positionY(value), y2: positionY(value), stroke: color, 'stroke-width': width }));
        svg.append(svgNode('text', { x: positionX(value), y: T + size + 24, 'text-anchor': 'middle', class: 'tailcalled-implication-tick' }, String(value).replace('-', '−')));
        svg.append(svgNode('text', { x: L - 13, y: positionY(value) + 4, 'text-anchor': 'end', class: 'tailcalled-implication-tick' }, String(value).replace('-', '−')));
      }
      const pair = pairs.get(pairKey(shown.x, shown.y));
      const swapped = pair.factorIds[0] !== shown.x;
      const group = svgNode('g', { 'data-role': 'scatter-points' });
      pair.points.forEach((point) => {
        const [x, y] = swapped ? [point[1], point[0]] : point;
        const distance = Math.max(0, Math.min(badX * x, badY * y));
        const circle = svgNode('circle', { cx: positionX(x), cy: positionY(y), r: 3.3,
          fill: distance > 0 ? '#bb5943' : '#287d9b', 'fill-opacity': .65,
          stroke: '#fff', 'stroke-width': .5, 'data-violates': String(distance > 0) });
        circle.append(svgNode('title', {}, `${names.get(shown.x)}: ${number(x)} SD\n${names.get(shown.y)}: ${number(y)} SD\nViolation severity at these estimated scores: ${number(distance, 3)}`));
        group.append(circle);
      });
      svg.append(group);
      svg.append(svgNode('text', { x: L + size / 2, y: T + size + 57, 'text-anchor': 'middle', class: 'tailcalled-implication-axis' }, names.get(shown.x)));
      svg.append(svgNode('text', { x: 29, y: T + size / 2, transform: `rotate(-90 29 ${T + size / 2})`,
        'text-anchor': 'middle', class: 'tailcalled-implication-axis' }, names.get(shown.y)));
      svg.append(svgNode('text', { x: L + size / 2, y: T + size + 81, 'text-anchor': 'middle', class: 'tailcalled-implication-tick' }, 'F20-adjusted scores · population SD units'));
      plot.replaceChildren(svg);
    }
    function render() {
      const shown = displayedSelection();
      xSelect.value = shown.x; ySelect.value = shown.y;
      typeSelect.value = `${shown.s}/${shown.t}`;
      forwardRadio.checked = !state.contrapositive; contrapositiveRadio.checked = state.contrapositive;
      selectedLabel.textContent = description(state, state.contrapositive);
      const forward = scores(state); const converse = scores(state, true);
      forwardValue.textContent = number(forward.strength);
      converseValue.textContent = number(converse.strength);
      forwardInterval.textContent = `90% CI [${number(forward.low)}, ${number(forward.high)}]`;
      converseInterval.textContent = `90% CI [${number(converse.low)}, ${number(converse.high)}]`;
      find('forward-card').classList.toggle('is-current', true);
      find('converse-card').classList.toggle('is-current', false);
      rowButtons.forEach(([row, button, entry]) => {
        const active = pairKey(entry.x, entry.y) === pairKey(state.x, state.y);
        row.classList.toggle('is-selected', active);
        button.setAttribute('aria-pressed', String(active));
      });
      draw();
    }
    function renderRankings() {
      tableBody.replaceChildren(); rowButtons.length = 0;
      for (const entry of rankings[rankingMode]) {
        const row = node('tr');
        row.append(node('td', '', String(entry.rank)));
        const cell = node('th'); cell.scope = 'row';
        const button = node('button', 'tailcalled-implication-pair', description(entry));
        button.type = 'button';
        button.addEventListener('click', () => { state = { ...entry, contrapositive: false }; render(); });
        cell.append(button); row.append(cell);
        row.append(node('td', '', number(scores(entry).strength)), node('td', '', number(scores(entry, true).strength)));
        tableBody.append(row); rowButtons.push([row, button, entry]);
      }
      rankingSelect.value = rankingMode;
      rankingNote.textContent = rankingMode === 'strength'
        ? 'Strongest implication for each pair, including pairs that are strong in both directions.'
        : 'Positive implication strength minus positive converse strength, favoring asymmetric relationships.';
      rankingRegion.setAttribute('aria-label', rankingMode === 'strength'
        ? 'Top ten implications ranked by strength' : 'Top ten implications ranked by asymmetry');
    }
    for (const factor of data.factors) {
      for (const select of [xSelect, ySelect]) {
        const option = node('option', '', names.get(factor.id)); option.value = factor.id; select.append(option);
      }
    }
    function changeAxes(side) {
      const previous = displayedSelection();
      let x = xSelect.value; let y = ySelect.value;
      if (x === y) {
        if (side === 'x') y = previous.x;
        else x = previous.y;
      }
      state = { ...state, x, y, s: previous.s, t: previous.t, contrapositive: false }; render();
    }
    xSelect.addEventListener('change', () => changeAxes('x'));
    ySelect.addEventListener('change', () => changeAxes('y'));
    typeSelect.addEventListener('change', () => {
      const [s, t] = typeSelect.value.split('/').map(Number);
      state = { ...state, x: xSelect.value, y: ySelect.value, s, t, contrapositive: false }; render();
    });
    forwardRadio.addEventListener('change', () => { if (forwardRadio.checked) { state.contrapositive = false; render(); } });
    contrapositiveRadio.addEventListener('change', () => { if (contrapositiveRadio.checked) { state.contrapositive = true; render(); } });
    rankingSelect.addEventListener('change', () => {
      rankingMode = rankingSelect.value;
      renderRankings(); render();
    });
    root.querySelectorAll('select, input').forEach((control) => { control.disabled = false; });
    renderRankings();
    render();
    status.textContent = 'Select a ranked pair or choose two factors. Display the implication or its equivalent contrapositive using the controls below.';
    root.dataset.ready = 'true';
  }).catch((error) => {
    status.textContent = 'The implication plots could not load. Refresh the page to retry.';
    console.error('Tailcalled implications:', error);
  });
})();
