(() => {
  const root = document.querySelector('[data-tailcalled-correlations]');
  if (!root) return;
  const toggle = root.querySelector('[data-role="adjust-f20"]');
  const container = root.querySelector('[data-role="matrix"]');
  const status = root.querySelector('[data-role="matrix-status"]');
  const readout = root.querySelector('[data-role="correlation-readout"]');
  const pair = root.querySelector('[data-role="correlation-pair"]');
  const estimate = root.querySelector('[data-role="correlation-estimate"]');
  const interval = root.querySelector('[data-role="correlation-interval"]');
  const stops = [
    [-1, [103, 0, 31]], [-.8, [176, 0, 32]], [-.5, [239, 59, 44]], [-.3, [251, 138, 128]],
    [0, [255, 255, 255]], [.3, [143, 240, 143]], [.5, [56, 217, 56]], [.8, [0, 160, 0]], [1, [0, 100, 0]],
  ];
  const number = (value) => (Math.abs(value) < .005 ? '0.00' : value.toFixed(2).replace('-', '−'));
  const create = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  function color(value) {
    const high = stops.findIndex((entry) => entry[0] >= value);
    if (high <= 0) return stops[0][1];
    const [a, first] = stops[high - 1];
    const [b, second] = stops[high];
    const weight = (value - a) / (b - a);
    return first.map((component, index) => Math.round(component + weight * (second[index] - component)));
  }
  function validate(data) {
    if (data.version !== 1 || data.factors.length !== 20) throw new Error('Unexpected correlation data');
    for (const [key, m] of Object.entries(data.matrices)) {
      const count = key === 'adjustedF20' ? 19 : 20;
      if (m.factorIds.length !== count || m.factorIds.some((id, index) => id !== `F${index + 1}`)) {
        throw new Error('Unexpected factor order');
      }
      for (const field of ['mean', 'q05', 'q95']) {
        if (m[field].length !== count || m[field].some((row) => row.length !== count
          || row.some((value) => !Number.isFinite(value) || Math.abs(value) > 1 + 1e-10))) {
          throw new Error('Invalid correlation matrix');
        }
      }
    }
    return data;
  }

  fetch(root.dataset.src).then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }).then(validate).then((data) => {
    const names = new Map(data.factors.map((factor) => [factor.id, `${factor.id}: ${factor.name}`]));
    let selectedIds = ['F1', 'F2'];
    function render() {
      const matrix = data.matrices[toggle.checked ? 'adjustedF20' : 'unadjusted'];
      const ids = matrix.factorIds;
      const count = ids.length;
      if (selectedIds.some((id) => !ids.includes(id))) selectedIds = ['F1', 'F2'];
      const table = create('table', 'tailcalled-correlation-table');
      table.setAttribute('aria-label', toggle.checked ? 'Factor correlations adjusted for F20 only' : 'Unadjusted factor correlations');
      const head = create('thead'); const headings = create('tr');
      const corner = create('th', 'tailcalled-correlation-corner', 'Factor'); corner.scope = 'col';
      headings.append(corner);
      const columns = ids.map((id) => {
        const heading = create('th', 'tailcalled-correlation-column', id);
        heading.scope = 'col'; heading.title = names.get(id); headings.append(heading);
        return heading;
      });
      head.append(headings); table.append(head);
      const body = create('tbody'); const buttons = []; const rowLabels = [];
      ids.forEach((id, row) => {
        const tr = create('tr'); const heading = create('th', 'tailcalled-correlation-row', names.get(id));
        heading.scope = 'row'; tr.append(heading); rowLabels.push(heading);
        const cells = [];
        ids.forEach((other, column) => {
          const cell = create('td');
          const value = matrix.mean[row][column];
          const button = create('button', 'tailcalled-correlation-cell', number(value)); button.type = 'button';
          const rgb = color(Math.max(-1, Math.min(1, value)));
          button.style.backgroundColor = `rgb(${rgb.join(',')})`;
          button.style.color = (.2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2]) / 255 < .46 ? '#fff' : '#172d3d';
          const label = `${names.get(id)} × ${names.get(other)}: r = ${number(value)}; `
            + `90% credible interval [${number(matrix.q05[row][column])}, ${number(matrix.q95[row][column])}]`;
          button.title = label; button.setAttribute('aria-label', label); button.tabIndex = -1;
          button.dataset.row = row; button.dataset.column = column;
          button.addEventListener('click', () => select(row, column));
          button.addEventListener('focus', () => select(row, column));
          button.addEventListener('keydown', (event) => {
            const offsets = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
            if (!offsets[event.key]) return;
            event.preventDefault();
            const [dy, dx] = offsets[event.key];
            buttons[Math.max(0, Math.min(count - 1, row + dy))][Math.max(0, Math.min(count - 1, column + dx))].focus();
          });
          cell.append(button); tr.append(cell); cells.push(button);
        });
        buttons.push(cells); body.append(tr);
      });
      table.append(body); container.replaceChildren(table);
      function factorLink(id) {
        const link = create('a', '', names.get(id)); link.href = `#${id.toLowerCase()}`;
        return link;
      }
      function select(row, column) {
        selectedIds = [ids[row], ids[column]];
        buttons.forEach((cells, i) => cells.forEach((button, j) => {
          button.classList.toggle('is-selected', (i === row && j === column) || (i === column && j === row));
          button.tabIndex = i === row && j === column ? 0 : -1;
          button.setAttribute('aria-pressed', String(i === row && j === column));
        }));
        rowLabels.forEach((label, i) => label.classList.toggle('is-selected', i === row || i === column));
        columns.forEach((label, i) => label.classList.toggle('is-selected', i === row || i === column));
        pair.replaceChildren(factorLink(ids[row]), document.createTextNode(' × '), factorLink(ids[column]));
        estimate.textContent = `r = ${number(matrix.mean[row][column])}`;
        interval.textContent = `90% credible interval: [${number(matrix.q05[row][column])}, ${number(matrix.q95[row][column])}]`;
        readout.hidden = false;
      }
      select(ids.indexOf(selectedIds[0]), ids.indexOf(selectedIds[1]));
      status.textContent = toggle.checked
        ? 'F1–F19, adjusted for F20: General Sexual Interest.'
        : 'All 20 factors, with unadjusted correlations.';
      root.dataset.ready = 'true';
    }
    toggle.disabled = false;
    toggle.addEventListener('change', render);
    render();
  }).catch((error) => {
    status.textContent = 'The correlation matrix could not load. Refresh the page to retry.';
    console.error('Tailcalled correlation matrix:', error);
  });
})();
