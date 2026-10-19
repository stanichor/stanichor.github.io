(() => {
  const root = document.querySelector('[data-movie-dimensions]');
  if (!root) return;

  const select = root.querySelector('[data-role="dimension-select"]');
  const previous = root.querySelector('[data-role="previous"]');
  const next = root.querySelector('[data-role="next"]');
  const counter = root.querySelector('[data-role="counter"]');
  const title = root.querySelector('[data-role="title"]');
  const tags = root.querySelector('[data-role="tags"]');
  const high = root.querySelector('[data-role="high"]');
  const low = root.querySelector('[data-role="low"]');
  const content = root.querySelector('[data-role="content"]');
  const status = root.querySelector('[data-role="status"]');
  const syncEvent = 'stanichor:movie-dimension-selected';

  function tagRow(tag) {
    const row = document.createElement('div');
    row.className = 'movie-dimensions-tag';
    row.style.setProperty('--tag-width', `${Math.max(0, Math.min(100, tag.r * 100))}%`);

    const name = document.createElement('span');
    name.className = 'movie-dimensions-tag-name';
    name.textContent = tag.name;
    const correlation = document.createElement('span');
    correlation.className = 'movie-dimensions-tag-r';
    correlation.textContent = tag.r.toFixed(2);
    row.append(name, correlation);
    return row;
  }

  function movieRow(movie) {
    const row = document.createElement('li');
    const name = document.createElement('span');
    name.className = 'movie-dimensions-movie-title';
    name.textContent = movie.title;
    const score = document.createElement('span');
    score.className = 'movie-dimensions-movie-score';
    score.textContent = `${movie.score >= 0 ? '+' : ''}${movie.score.toFixed(1)} SD`;
    row.append(name, score);
    return row;
  }

  fetch(root.dataset.src)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      const dimensions = data.dimensions;
      if (!Array.isArray(dimensions) || dimensions.length === 0) {
        throw new Error('No movie dimensions were found');
      }
      select.replaceChildren(...dimensions.map((dimension, index) => {
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = `${dimension.name} · ${String(dimension.number).padStart(3, '0')}`;
        return option;
      }));

      function show(index, notify = true) {
        const dimension = dimensions[index];
        select.value = String(index);
        counter.textContent = `${dimension.number} / ${dimensions.length}`;
        title.textContent = dimension.name;
        tags.replaceChildren(...dimension.tags.map(tagRow));
        high.replaceChildren(...dimension.high.map(movieRow));
        low.replaceChildren(...dimension.low.map(movieRow));
        previous.disabled = index === 0;
        next.disabled = index === dimensions.length - 1;
        status.textContent = `Showing dimension ${dimension.number}: ${dimension.name}`;
        if (notify) {
          document.movieDimensionSelection = index;
          document.dispatchEvent(new CustomEvent(syncEvent, {
            detail: { index, source: 'movie-dimensions' },
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
        if (event.detail.source !== 'movie-dimensions'
          && Number.isInteger(index) && index >= 0 && index < dimensions.length) {
          show(index, false);
        }
      });
      const initial = document.movieDimensionSelection;
      show(Number.isInteger(initial) && initial >= 0 && initial < dimensions.length ? initial : 0, false);
    })
    .catch(() => {
      select.replaceChildren(new Option('Unable to load dimensions'));
      status.textContent = 'The movie-dimension explorer could not be loaded.';
    });
})();
