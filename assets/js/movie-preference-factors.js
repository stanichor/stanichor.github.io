(() => {
  const root = document.querySelector('[data-preference-factors]');
  if (!root) return;

  const select = root.querySelector('[data-role="factor-select"]');
  const previous = root.querySelector('[data-role="previous"]');
  const next = root.querySelector('[data-role="next"]');
  const counter = root.querySelector('[data-role="counter"]');
  const title = root.querySelector('[data-role="title"]');
  const loadingList = root.querySelector('[data-role="loadings"]');
  const positiveMovies = root.querySelector('[data-role="positive-movies"]');
  const negativeMovies = root.querySelector('[data-role="negative-movies"]');
  const relatedPositive = root.querySelector('[data-role="related-positive"]');
  const relatedNegative = root.querySelector('[data-role="related-negative"]');
  const content = root.querySelector('[data-role="content"]');
  const status = root.querySelector('[data-role="status"]');
  const dimensionEvent = 'stanichor:movie-dimension-selected';
  const loadingLimit = 1.2;

  function signed(value, digits = 2) {
    return `${value < 0 ? '−' : '+'}${Math.abs(value).toFixed(digits)}`;
  }

  function displayTitle(movieTitle) {
    return movieTitle.replace(/^(.*), (The|A|An)( \(.*\))$/, '$2 $1$3');
  }

  function loadingRow(loading) {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'preference-factors-loading-row';
    row.setAttribute('aria-label',
      `Explore ${loading.name}, standardized pattern loading ${signed(loading.pattern)}`);

    const name = document.createElement('span');
    name.className = 'preference-factors-loading-name';
    name.textContent = loading.name;
    const track = document.createElement('span');
    track.className = 'preference-factors-loading-track';
    const bar = document.createElement('span');
    bar.className = 'preference-factors-loading-bar';
    const width = Math.min(50, Math.abs(loading.pattern) / loadingLimit * 50);
    bar.style.setProperty('--bar-left', `${loading.pattern < 0 ? 50 - width : 50}%`);
    bar.style.setProperty('--bar-width', `${width}%`);
    bar.style.setProperty('--bar-color', loading.pattern < 0 ? '#ae735b' : '#326785');
    track.append(bar);
    const value = document.createElement('span');
    value.className = 'preference-factors-loading-value';
    value.textContent = signed(loading.pattern);
    row.append(name, track, value);

    row.addEventListener('click', () => {
      const index = loading.dimension_number - 1;
      document.movieDimensionSelection = index;
      document.dispatchEvent(new CustomEvent(dimensionEvent, {
        detail: { index, source: 'preference-factors' },
      }));
      const target = document.querySelector('[data-preference-prior]');
      if (target && typeof target.scrollIntoView === 'function') {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    return row;
  }

  function movieRow(movie) {
    const row = document.createElement('li');
    const name = document.createElement('span');
    name.className = 'preference-factors-movie-title';
    name.textContent = displayTitle(movie.title);
    const effect = document.createElement('span');
    effect.className = 'preference-factors-movie-effect';
    effect.textContent = signed(movie.effect);
    row.append(name, effect);
    return row;
  }

  fetch(root.dataset.src)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      const factors = data.factors;
      if (!Array.isArray(factors) || factors.length !== 28
        || factors.some((factor, index) => factor.number !== index + 1)) {
        throw new Error('Invalid preference factors');
      }

      select.replaceChildren(...factors.map((factor, index) => {
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = `${factor.name} · ${String(factor.number).padStart(2, '0')}`;
        return option;
      }));

      function relatedButton(item) {
        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('aria-label', `Explore ${item.name}, factor correlation ${signed(item.r)}`);
        const name = document.createElement('span');
        name.textContent = item.name;
        const correlation = document.createElement('span');
        correlation.className = 'preference-factors-related-r';
        correlation.textContent = signed(item.r);
        button.append(name, correlation);
        button.addEventListener('click', () => show(item.number - 1));
        return button;
      }

      function show(index) {
        const factor = factors[index];
        select.value = String(index);
        counter.textContent = `${factor.number} / ${factors.length}`;
        title.textContent = factor.name;
        const loadings = [...factor.positive_loadings, ...factor.negative_loadings]
          .sort((a, b) => Math.abs(b.pattern) - Math.abs(a.pattern));
        loadingList.replaceChildren(...loadings.map(loadingRow));
        positiveMovies.replaceChildren(...factor.positive_movies.map(movieRow));
        negativeMovies.replaceChildren(...factor.negative_movies.map(movieRow));
        relatedPositive.replaceChildren(...factor.related_positive.map(relatedButton));
        relatedNegative.replaceChildren(...factor.related_negative.map(relatedButton));
        previous.disabled = index === 0;
        next.disabled = index === factors.length - 1;
        status.textContent = `Showing preference factor ${factor.number}: ${factor.name}`;
      }

      select.disabled = false;
      content.hidden = false;
      select.addEventListener('change', () => show(Number(select.value)));
      previous.addEventListener('click', () => show(Number(select.value) - 1));
      next.addEventListener('click', () => show(Number(select.value) + 1));
      show(0);
    })
    .catch(() => {
      select.replaceChildren(new Option('Unable to load preference factors'));
      status.textContent = 'The preference-factor explorer could not be loaded.';
    });
})();
