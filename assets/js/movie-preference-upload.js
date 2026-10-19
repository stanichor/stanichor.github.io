(() => {
  'use strict';
  const root = document.querySelector('[data-preference-upload]');
  if (!root) return;
  const core = window.MoviePreferenceUploadCore;
  const get = (role) => root.querySelector(`[data-role="${role}"]`);
  const fileInput = get('file'), columnsPanel = get('columns'), review = get('review');
  const reviewToggle = get('review-toggle'), results = get('results'), status = get('status');
  const columnNames = ['title', 'rating', 'year', 'imdb', 'tmdb', 'movielens'];
  const columnSelects = Object.fromEntries(columnNames.map((name) =>
    [name, root.querySelector(`[data-column="${name}"]`)]));
  let parsed = null, data = null, embeddings = null, matcher = null;
  let entries = [], visibleCount = 200, activeSearch = null, skippedRows = 0;
  const dimensionSort = { column: 'standardDeviations', direction: 'descending' };

  const printTitle = (title) => title.replace(/^(.*), (The|A|An)( \(.*\))$/, '$2 $1$3');
  const signed = (value) => {
    const rounded = Number(value.toFixed(2));
    return rounded === 0 ? '0.00' : `${rounded < 0 ? '−' : '+'}${Math.abs(rounded).toFixed(2)}`;
  };
  const showStatus = (message, error = false) => {
    status.textContent = message;
    status.classList.toggle('is-error', error);
  };

  async function loadData() {
    if (data) return;
    const [metadataResponse, vectorResponse] = await Promise.all([
      fetch(root.dataset.metaSrc), fetch(root.dataset.embeddingsSrc),
    ]);
    if (!metadataResponse.ok || !vectorResponse.ok) throw new Error('Could not load the movie model.');
    const metadata = await metadataResponse.json();
    const buffer = await vectorResponse.arrayBuffer();
    if (metadata.version !== 2 || metadata.dimensions !== 115 || metadata.factor_count !== 28
        || !Array.isArray(metadata.titles) || buffer.byteLength !== metadata.titles.length * 115 * 4
        || metadata.dimension_names?.length !== 115
        || metadata.coefficient_population_sds?.length !== 115) {
      throw new Error('The movie data files do not match.');
    }
    data = metadata;
    embeddings = new Float32Array(buffer);
    matcher = core.makeMatcher(data);
    get('coverage').textContent = `This MovieLens set ends in ${matcher.latestYear}. Movies with a supplied later release year are skipped.`;
    get('coverage').hidden = false;
  }

  function guessColumn(name, headers) {
    const patterns = {
      title: /^(title|name|movie|movie title|film|film title)$/i,
      rating: /^(rating|score|your rating|my rating|user rating|stars)$/i,
      year: /^(year|release year|release_year)$/i,
      imdb: /^(imdb|imdb id|imdbid)$/i,
      tmdb: /^(tmdb|tmdb id|tmdbid)$/i,
      movielens: /^(movieid|movie id|movielens id|movielensid)$/i,
    };
    const found = headers.findIndex((header) => patterns[name].test(header.trim()));
    if (found >= 0) return found;
    if (headers.length === 2 && /^Column /.test(headers[0])) {
      if (name === 'title') return 0;
      if (name === 'rating') return 1;
    }
    return -1;
  }

  function populateColumns() {
    for (const name of columnNames) {
      const select = columnSelects[name];
      select.replaceChildren(new Option('Not in file', '-1'), ...parsed.headers.map((header, index) =>
        new Option(header || `Column ${index + 1}`, String(index))));
      select.value = String(guessColumn(name, parsed.headers));
    }
  }

  function hasColumns() {
    return Number(columnSelects.rating.value) >= 0 &&
      (Number(columnSelects.title.value) >= 0 ||
       ['imdb', 'tmdb', 'movielens'].some((name) => Number(columnSelects[name].value) >= 0));
  }

  function setReview(open) {
    reviewToggle.hidden = !parsed;
    reviewToggle.setAttribute('aria-expanded', String(open));
    columnsPanel.hidden = !open;
    review.hidden = !open || !entries.length;
    if (!open) get('search-panel').hidden = true;
    if (parsed && matcher) updateSummary();
  }

  function setResultTab(name, focus = false) {
    for (const tabName of ['factors', 'dimensions']) {
      const tab = get(`${tabName}-tab`);
      const selected = tabName === name;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      get(`${tabName}-panel`).hidden = !selected;
      if (selected && focus) tab.focus();
    }
  }

  function numeric(value) {
    const text = String(value || '').trim();
    if (!text) return null;
    const adjusted = /^[-+]?\d+,\d+$/.test(text) ? text.replace(',', '.') : text;
    const number = Number(adjusted);
    return Number.isFinite(number) ? number : null;
  }

  function selectedColumn(name, row) {
    const index = Number(columnSelects[name].value);
    return index >= 0 ? String(row[index] || '').trim() : '';
  }

  function selectedRatings() {
    const grouped = new Map();
    for (const entry of entries) {
      if (entry.selected === null) continue;
      if (!grouped.has(entry.selected)) grouped.set(entry.selected, []);
      grouped.get(entry.selected).push(entry.rating);
    }
    return [...grouped].map(([index, values]) => ({
      index, rating: values.reduce((sum, value) => sum + value, 0) / values.length,
    }));
  }

  function updateSummary() {
    const selected = entries.filter((entry) => entry.selected !== null).length;
    const unresolved = entries.filter((entry) => entry.review && entry.selected === null).length;
    const unavailable = entries.filter((entry) => entry.unavailable).length;
    const ratings = selectedRatings();
    const unique = ratings.length;
    const distinctRatings = new Set(ratings.map((row) => row.rating)).size;
    const duplicates = selected - unique;
    const parts = [`${unique} matched movies`, `${unresolved} need review`];
    if (unavailable) parts.push(`${unavailable} after ${matcher.latestYear} excluded`);
    if (duplicates) parts.push(`${duplicates} duplicate ratings averaged`);
    if (skippedRows) parts.push(`${skippedRows} rows without a numeric rating skipped`);
    if (unique >= 3 && distinctRatings < 3) parts.push('at least three distinct ratings needed');
    get('match-summary').textContent = `${parts.join(' · ')}. Unmatched rows are not used.`;
    reviewToggle.textContent = reviewToggle.getAttribute('aria-expanded') === 'true'
      ? 'Hide match review'
      : unresolved ? `Review movie matches (${unresolved} need attention)` : 'Review movie matches';
  }

  function option(value, label, selected = false) {
    const item = new Option(label, value);
    item.selected = selected;
    return item;
  }

  function renderMatches() {
    const showAll = get('show-all').checked;
    const visible = entries.filter((entry) => showAll || entry.review);
    const body = get('matches');
    const rows = visible.slice(0, visibleCount).map((entry) => {
      const tr = document.createElement('tr');
      const movie = document.createElement('td');
      movie.textContent = entry.title
        ? `${entry.title}${entry.year && !/\(\d{4}\)\s*$/.test(entry.title) ? ` (${entry.year})` : ''}`
        : `ID: ${entry.imdb || entry.tmdb || entry.movielens}`;
      const note = document.createElement('small');
      note.textContent = entry.reason;
      movie.append(note);
      const rating = document.createElement('td');
      rating.textContent = String(entry.rating);
      const match = document.createElement('td');
      const select = document.createElement('select');
      select.setAttribute('aria-label', `MovieLens match for ${entry.title || 'movie ID'}`);
      const candidates = [...new Set([entry.selected, ...entry.candidates].filter((index) => index !== null))];
      if (entry.review && entry.selected === null) {
        const pending = option('', 'Needs review — choose a match or exclude', true);
        pending.disabled = true;
        select.append(pending);
      }
      select.append(option('exclude', 'Exclude / unmatched', entry.selected === null && !entry.review));
      for (const index of candidates) {
        select.append(option(String(index), printTitle(data.titles[index]), entry.selected === index));
      }
      select.append(option('search', 'Search for another movie…'));
      select.addEventListener('change', () => {
        if (select.value === 'search') {
          select.value = entry.selected === null ? (entry.review ? '' : 'exclude') : String(entry.selected);
          openSearch(entry);
          return;
        }
        entry.selected = select.value === 'exclude' ? null : Number(select.value);
        entry.reason = entry.selected === null ? 'Excluded' : 'Chosen by you';
        entry.review = false;
        entry.unavailable = false;
        if (select.options[0].value === '') select.remove(0);
        updateSummary();
        if (!showAll) renderMatches();
        else note.textContent = entry.reason;
        calculateFactors();
      });
      match.append(select);
      tr.append(movie, rating, match);
      return tr;
    });
    body.replaceChildren(...rows);
    get('more').hidden = visible.length <= visibleCount;
    if (!visible.length) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 3;
      cell.textContent = 'No uncertain matches. Check “Show automatically matched movies too” to inspect all rows, including excluded releases.';
      row.append(cell);
      body.append(row);
    }
    updateSummary();
  }

  function renderSearch() {
    const panel = get('search-panel');
    const query = get('search-input').value;
    const choices = matcher.search(query, Number(activeSearch.year) || null, 12);
    const list = get('search-results');
    list.replaceChildren(...choices.map((index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = printTitle(data.titles[index]);
      button.addEventListener('click', () => {
        activeSearch.selected = index;
        activeSearch.candidates.unshift(index);
        activeSearch.reason = 'Chosen by you';
        activeSearch.review = false;
        activeSearch.unavailable = false;
        panel.hidden = true;
        activeSearch = null;
        renderMatches();
        calculateFactors();
      });
      return button;
    }));
    if (!choices.length) list.textContent = 'No close titles found. Try another spelling or fewer words.';
  }

  function openSearch(entry) {
    activeSearch = entry;
    const panel = get('search-panel');
    panel.hidden = false;
    get('search-input').value = entry.title;
    renderSearch();
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    get('search-input').focus();
  }

  function factorResults(posterior) {
    const list = get('factor-results');
    const extent = 2;
    const scale = get('scale');
    scale.replaceChildren();
    for (const value of [-extent, 0, extent]) {
      const tick = document.createElement('span');
      tick.textContent = value > 0 ? `+${value}` : String(value).replace('-', '−');
      scale.append(tick);
    }
    const order = posterior.means.map((_, index) => index)
      .sort((a, b) => Math.abs(posterior.means[b]) - Math.abs(posterior.means[a]) || a - b);
    list.replaceChildren(...order.map((index) => {
      const mean = posterior.means[index];
      const row = document.createElement('div');
      row.className = 'preference-upload-factor-row';
      row.setAttribute('role', 'img');
      row.setAttribute('aria-label', `${data.factor_names[index]}: ${signed(mean)}.`);
      const name = document.createElement('span');
      name.className = 'preference-upload-factor-name';
      name.textContent = `${String(index + 1).padStart(2, '0')} · ${data.factor_names[index]}`;
      const track = document.createElement('span');
      track.className = 'preference-upload-factor-track';
      const point = document.createElement('span');
      point.className = 'preference-upload-factor-point';
      point.style.left = `${Math.max(0, Math.min(100, 50 + mean / extent * 50))}%`;
      track.append(point);
      const value = document.createElement('span');
      value.className = 'preference-upload-factor-value';
      value.textContent = signed(mean);
      row.append(name, track, value);
      return row;
    }));
  }

  function dimensionResults(posterior) {
    const items = data.dimension_names.map((name, index) => ({
      index, name, coefficient: posterior.coefficients[index],
      standardDeviations: (posterior.coefficients[index] - data.mean[index])
        / data.coefficient_population_sds[index],
    }));
    const table = document.createElement('table');
    table.className = 'preference-upload-dimension-table';
    const head = document.createElement('thead');
    const header = document.createElement('tr');
    const headings = new Map();
    for (const [key, label] of [
      ['name', 'Movie dimension'],
      ['standardDeviations', 'From average'],
      ['coefficient', 'Coefficient'],
    ]) {
      const cell = document.createElement('th');
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      const arrow = document.createElement('span');
      arrow.className = 'preference-upload-sort-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      button.append(arrow);
      button.addEventListener('click', () => {
        if (dimensionSort.column === key) {
          dimensionSort.direction = dimensionSort.direction === 'descending' ? 'ascending' : 'descending';
        } else {
          dimensionSort.column = key;
          dimensionSort.direction = key === 'name' ? 'ascending' : 'descending';
        }
        sortRows();
      });
      cell.append(button);
      headings.set(key, { cell, arrow });
      header.append(cell);
    }
    head.append(header);
    const body = document.createElement('tbody');
    const rows = items.map((item) => {
      const row = document.createElement('tr');
      for (const value of [item.name, `${signed(item.standardDeviations)} SD`, signed(item.coefficient)]) {
        const cell = document.createElement('td');
        cell.textContent = value;
        row.append(cell);
      }
      return row;
    });
    const magnitude = get('dimension-magnitude');
    function sortRows() {
      const { column, direction } = dimensionSort;
      const order = [...items].sort((a, b) => {
        let comparison;
        if (column === 'name') {
          comparison = a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
        } else {
          const first = magnitude.checked ? Math.abs(a[column]) : a[column];
          const second = magnitude.checked ? Math.abs(b[column]) : b[column];
          comparison = first - second;
        }
        return (direction === 'ascending' ? comparison : -comparison) || a.index - b.index;
      });
      body.replaceChildren(...order.map((item) => rows[item.index]));
      for (const [key, { cell, arrow }] of headings) {
        if (key === column) {
          cell.setAttribute('aria-sort', direction);
          arrow.textContent = direction === 'ascending' ? ' ↑' : ' ↓';
        } else {
          cell.removeAttribute('aria-sort');
          arrow.textContent = '';
        }
      }
    }
    table.append(head, body);
    get('dimension-results').replaceChildren(table);
    magnitude.onchange = sortRows;
    sortRows();
  }

  function showResults(posterior) {
    factorResults(posterior);
    dimensionResults(posterior);
    const excluded = selectedRatings().map((row) => row.index);
    const relativeCoefficients = posterior.coefficients.map((value, index) => value - data.mean[index]);
    for (const [prefix, coefficients] of [['', posterior.coefficients], ['relative-', relativeCoefficients]]) {
      const recommendations = core.suggestMovies(data, embeddings, coefficients, excluded);
      for (const [kind, movies] of Object.entries(recommendations)) {
        const list = get(`${prefix}${kind}-suggestions`);
        list.replaceChildren(...movies.map(({ index }) => {
          const item = document.createElement('li');
          item.textContent = printTitle(data.titles[index]);
          return item;
        }));
      }
    }
    const unresolved = entries.filter((entry) => entry.review && entry.selected === null).length;
    const unavailable = entries.filter((entry) => entry.unavailable).length;
    const coverage = [unresolved && `${unresolved} need review`,
      unavailable && `${unavailable} after ${matcher.latestYear} excluded`].filter(Boolean);
    get('results-note').textContent = `${posterior.matchedMovies} distinct matched movies used${coverage.length ? `; ${coverage.join(', ')}` : ''}.`;
    results.hidden = false;
  }

  function calculateFactors() {
    const ratings = selectedRatings();
    if (ratings.length < 3 || new Set(ratings.map((row) => row.rating)).size < 3) {
      results.hidden = true;
      showStatus('At least three distinct ratings of matched movies are needed. Review the matches or add more ratings.', true);
      return false;
    }
    try {
      showResults(core.infer(data, embeddings, ratings));
      showStatus('');
      return true;
    } catch (error) {
      results.hidden = true;
      showStatus(error.message, true);
      return false;
    }
  }

  function matchMovies(keepReview = false) {
    if (!parsed || !matcher) return;
    if (!hasColumns()) {
      setReview(true);
      showStatus('Choose a rating column and a title or movie-ID column.', true);
      return;
    }
    entries = [];
    skippedRows = 0;
    for (const row of parsed.rows) {
      const rating = numeric(selectedColumn('rating', row));
      if (rating === null) { skippedRows++; continue; }
      const entry = { title: selectedColumn('title', row), year: selectedColumn('year', row),
        imdb: selectedColumn('imdb', row), tmdb: selectedColumn('tmdb', row),
        movielens: selectedColumn('movielens', row), rating };
      if (!entry.title && !entry.imdb && !entry.tmdb && !entry.movielens) {
        skippedRows++;
        continue;
      }
      Object.assign(entry, matcher.match(entry));
      entries.push(entry);
    }
    visibleCount = 200;
    get('show-all').checked = false;
    get('search-panel').hidden = true;
    activeSearch = null;
    renderMatches();
    const calculated = calculateFactors();
    setReview(keepReview || !calculated);
  }

  fileInput.addEventListener('change', async () => {
    parsed = null;
    entries = [];
    reviewToggle.hidden = true;
    columnsPanel.hidden = true;
    review.hidden = true;
    results.hidden = true;
    setResultTab('factors');
    const file = fileInput.files[0];
    get('file-name').textContent = file?.name || 'No file selected';
    if (!file) return;
    if (file.size > 10_000_000) { showStatus('Please choose a file smaller than 10 MB.', true); return; }
    showStatus('Reading your file and loading the movie index…');
    try {
      parsed = core.parseDelimited(await file.text(), file.name);
      if (parsed.rows.length > 10_000) throw new Error('This file has more than 10,000 rows. Please use a smaller ratings export.');
      await loadData();
      populateColumns();
      matchMovies();
    } catch (error) { showStatus(error.message, true); }
  });

  reviewToggle.addEventListener('click', () =>
    setReview(reviewToggle.getAttribute('aria-expanded') !== 'true'));
  get('close-review').addEventListener('click', () => {
    setReview(false);
    reviewToggle.focus();
  });
  for (const name of ['factors', 'dimensions']) {
    const tab = get(`${name}-tab`);
    tab.addEventListener('click', () => setResultTab(name));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 'factors' : event.key === 'End' ? 'dimensions'
        : name === 'factors' ? 'dimensions' : 'factors';
      setResultTab(next, true);
    });
  }
  for (const select of Object.values(columnSelects)) {
    select.addEventListener('change', () => {
      results.hidden = true;
      showStatus('Apply the column choices to update your preference factors.');
    });
  }
  get('match').addEventListener('click', () => matchMovies(true));

  get('show-all').addEventListener('change', () => { visibleCount = 200; renderMatches(); });
  get('more').addEventListener('click', () => { visibleCount += 200; renderMatches(); });
  get('search-input').addEventListener('input', () => { if (activeSearch) renderSearch(); });
  get('close-search').addEventListener('click', () => { activeSearch = null; get('search-panel').hidden = true; });
})();
