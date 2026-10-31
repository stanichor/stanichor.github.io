(() => {
  const root = document.querySelector('[data-tailcalled-appraisals]');
  if (!root) return;
  const find = (role) => root.querySelector(`[data-role="${role}"]`);
  const status = find('appraisal-status');
  const chart = find('appraisal-chart');
  const heading = find('appraisal-heading');
  const scale = find('appraisal-response-scale');
  const responses = find('appraisal-responses');
  const readout = find('appraisal-readout');
  const estimate = find('appraisal-estimate');
  const interval = find('appraisal-interval');
  const description = find('appraisal-description');
  const number = (value) => (Math.abs(value) < .005 ? 0 : value).toFixed(2).replace('-', '−');
  const ci = (value) => `90% CI [${number(value.low)}, ${number(value.high)}]`;
  const node = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  function validate(data) {
    if (data.version !== 1 || data.factors.length !== 20 || data.appraisals.length !== 17
      || data.groups.length !== 4 || data.appraisals[0].id !== 'overall') throw new Error('Unexpected appraisal data');
    data.factors.forEach((f, index) => { if (f.id !== `F${index + 1}` || !f.name) throw new Error('Invalid factor order'); });
    data.appraisals.forEach((a) => {
      if (a.coefficients.length !== 20 || !data.groups.some((g) => g.id === a.group)
        || a.responses.length !== (a.id === 'overall' ? 0 : 5)
        || typeof a.description !== 'string' || (a.id !== 'overall' && !a.description.trim())) throw new Error('Invalid appraisal');
      a.coefficients.forEach((record) => {
        const value = record.total;
        if (!value || ['mean', 'low', 'high'].some((key) => !Number.isFinite(value[key]))
          || value.low > value.mean || value.mean > value.high) {
          throw new Error('Invalid coefficient or interval');
        }
      });
    });
    return data;
  }
  fetch(root.dataset.src).then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }).then(validate).then((data) => {
    const state = { factor: 0, outcome: 'overall' };
    const names = data.factors.map((f) => `${f.id}: ${f.name}`);
    const appraisalMap = new Map(data.appraisals.map((a) => [a.id, a]));
    function color(value, limit) {
      const weight = Math.min(1, Math.abs(value)/limit);
      const end = value >= 0 ? [0, 138, 0] : [176, 0, 32];
      return end.map((component) => Math.round(255+(component-255)*weight));
    }
    function render() {
      const visible = data.appraisals;
      const maximum = Math.max(...visible.flatMap((a) => a.coefficients.map((record) => Math.abs(record.total.mean))));
      const limit = Math.max(.5, Math.ceil(maximum*10)/10);
      find('appraisal-color-low').textContent = number(-limit);
      find('appraisal-color-high').textContent = number(limit);
      find('appraisal-color-label').textContent = 'Coefficient';
      const table = node('table', 'tailcalled-appraisal-matrix');
      table.setAttribute('aria-label', 'Appraisal regression coefficients by factor');
      const head = node('thead'); const headings = node('tr');
      const corner = node('th', 'tailcalled-appraisal-row-label', 'Appraisal'); corner.scope = 'col'; headings.append(corner);
      const columns = data.factors.map((f, index) => {
        const header = node('th', 'tailcalled-appraisal-factor-label', f.id); header.scope = 'col'; header.title = names[index]; headings.append(header);
        return header;
      });
      head.append(headings); table.append(head);
      const buttons = []; const rowLabels = [];
      for (const group of data.groups) {
        const appraisals = visible.filter((a) => a.group === group.id);
        if (!appraisals.length) continue;
        const body = node('tbody');
        const section = node('tr', `tailcalled-appraisal-section is-${group.id}`);
        const label = node('th'); label.colSpan = data.factors.length+1; label.scope = 'rowgroup';
        label.append(node('strong', '', group.name));
        if (group.direction) label.append(node('span', '', group.direction));
        section.append(label); body.append(section);
        for (const appraisal of appraisals) {
          const rowIndex = buttons.length; const row = node('tr'); row.dataset.appraisal = appraisal.id;
          const label = node('th', 'tailcalled-appraisal-row-label', appraisal.name); label.scope = 'row'; row.append(label); rowLabels.push(label);
          const cells = [];
          data.factors.forEach((f, index) => {
            const value = appraisal.coefficients[index].total;
            const cell = node('td');
            const button = node('button', 'tailcalled-appraisal-cell', number(value.mean)); button.type = 'button';
            button.dataset.appraisal = appraisal.id; button.dataset.factor = f.id;
            const rgb = color(value.mean, limit);
            button.style.backgroundColor = `rgb(${rgb.join(',')})`;
            button.style.color = .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2] < 118 ? '#fff' : '#172d3d';
            const label = `${names[index]} × ${appraisal.name}: ${number(value.mean)}; ${ci(value)}`;
            button.title = label; button.setAttribute('aria-label', label); button.tabIndex = -1;
            button.addEventListener('click', () => select(rowIndex, index));
            button.addEventListener('focus', () => select(rowIndex, index));
            button.addEventListener('keydown', (event) => {
              const offsets = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
              if (!offsets[event.key]) return;
              event.preventDefault(); const [dy, dx] = offsets[event.key];
              buttons[Math.max(0, Math.min(buttons.length-1, rowIndex+dy))][Math.max(0, Math.min(data.factors.length-1, index+dx))].focus();
            });
            cell.append(button); row.append(cell); cells.push(button);
          });
          body.append(row); buttons.push(cells);
        }
        table.append(body);
      }
      chart.replaceChildren(table);
      function select(row, column) {
        const button = buttons[row][column];
        state.outcome = button.dataset.appraisal; state.factor = column;
        const appraisal = appraisalMap.get(state.outcome);
        const value = appraisal.coefficients[column].total;
        heading.textContent = `${names[column]} × ${appraisal.name}`;
        estimate.textContent = `Coefficient = ${number(value.mean)}`;
        interval.textContent = ci(value);
        description.textContent = appraisal.description;
        description.hidden = !appraisal.description;
        buttons.forEach((cells, i) => cells.forEach((button, j) => {
          const active = i === row && j === column;
          button.classList.toggle('is-selected', active); button.tabIndex = active ? 0 : -1;
          button.setAttribute('aria-pressed', String(active));
        }));
        rowLabels.forEach((label, i) => label.classList.toggle('is-selected', i === row));
        columns.forEach((label, j) => label.classList.toggle('is-selected', j === column));
        scale.hidden = state.outcome === 'overall';
        responses.replaceChildren();
        for (const text of appraisal.responses) responses.append(node('li', '', text));
        find('appraisal-overall-note').hidden = state.outcome !== 'overall';
        readout.hidden = false;
      }
      select(visible.findIndex((a) => a.id === state.outcome), state.factor);
      root.dataset.ready = 'true';
    }
    render();
    status.hidden = true;
  }).catch((error) => {
    status.textContent = 'The benefits/harms results could not load. Refresh the page to retry.';
    console.error('Tailcalled appraisals:', error);
  });
})();
