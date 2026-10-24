(() => {
  const root = document.querySelector('[data-anime-rankings]');
  if (!root) return;

  const pageSize = 20;
  const modes = root.querySelector('[data-role="modes"]');
  const search = root.querySelector('[data-role="search"]');
  const summary = root.querySelector('[data-role="summary"]');
  const list = root.querySelector('[data-role="list"]');
  const previous = root.querySelector('[data-role="previous"]');
  const next = root.querySelector('[data-role="next"]');
  const pageLabel = root.querySelector('[data-role="page"]');
  const error = root.querySelector('[data-role="error"]');
  const number = new Intl.NumberFormat('en-US');
  let anime = [];
  let consensusOrder = [];
  let matches = [];
  let breakdown;
  let mode = 'consensus';
  let page = 0;

  function normalize(value) {
    return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
  }

  function fixed(value) {
    return (Math.abs(value) < 0.005 ? 0 : value).toFixed(2);
  }

  function signed(value) {
    const rounded = Math.abs(value) < 0.005 ? 0 : value;
    return `${rounded > 0 ? '+' : ''}${rounded.toFixed(2)}`;
  }

  function normalCdf(value) {
    const t = 1 / (1 + 0.2316419 * Math.abs(value));
    const tail = Math.exp(-value * value / 2) / Math.sqrt(2 * Math.PI) * t *
      (0.319381530 + t * (-0.356563782 + t *
      (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
    return value < 0 ? tail : 1 - tail;
  }

  function selectedScore(item) {
    return mode === 'consensus' ? item.smoothed_mean : item.genre_adjusted_mean;
  }

  function outOfTen(value) {
    return `${(10 * normalCdf(value)).toFixed(2)}/10`;
  }

  function addTerm(list, label, value, total = false) {
    const name = document.createElement('dt');
    const amount = document.createElement('dd');
    name.textContent = label;
    amount.textContent = value;
    if (total) {
      name.className = 'anime-rankings-total';
      amount.className = 'anime-rankings-total';
    }
    list.append(name, amount);
  }

  function makeBreakdown(item) {
    const panel = document.createElement('div');
    panel.className = 'anime-rankings-breakdown';
    panel.id = `anime-rankings-breakdown-${item.id}`;
    panel.hidden = true;

    const columns = document.createElement('div');
    columns.className = 'anime-rankings-breakdown-columns';
    const genreSection = document.createElement('section');
    const genreHeading = document.createElement('h3');
    genreHeading.textContent = 'Genre expectation (within-user SDs)';
    const genreTerms = document.createElement('dl');
    addTerm(genreTerms, 'Base score', fixed(breakdown.base_rating));
    item.genres.forEach((genre) => {
      addTerm(genreTerms, genre, signed(breakdown.genre_effects[genre]));
    });
    addTerm(genreTerms, 'Expected from genres', fixed(item.genre_mean), true);
    genreSection.append(genreHeading, genreTerms);

    const ratingSection = document.createElement('section');
    const ratingHeading = document.createElement('h3');
    ratingHeading.textContent = 'Consensus (within-user SDs)';
    const ratingTerms = document.createElement('dl');
    addTerm(ratingTerms, 'Observed average', fixed(item.observed_mean));
    addTerm(ratingTerms, 'Ratings', number.format(item.rating_count));
    addTerm(ratingTerms, 'Smoothed consensus', fixed(item.smoothed_mean), true);
    ratingSection.append(ratingHeading, ratingTerms);
    columns.append(genreSection, ratingSection);

    panel.append(columns);
    return panel;
  }

  function draw() {
    const start = page * pageSize;
    const visible = matches.slice(start, start + pageSize);
    list.replaceChildren(...visible.map((item) => {
      const row = document.createElement('li');
      const rank = document.createElement('span');
      rank.className = 'anime-rankings-rank';
      rank.textContent = number.format(mode === 'consensus' ? item.consensusRank : item.rank);

      const identity = document.createElement('span');
      identity.className = 'anime-rankings-identity';
      const link = document.createElement('a');
      link.href = `https://myanimelist.net/anime/${item.id}`;
      link.textContent = item.title;
      identity.append(link);
      if (item.type && item.type !== 'Unknown') {
        const kind = document.createElement('span');
        kind.className = 'anime-rankings-type';
        kind.textContent = item.type;
        identity.append(kind);
      }

      const score = document.createElement('strong');
      score.className = 'anime-rankings-score';
      score.textContent = outOfTen(selectedScore(item));
      score.setAttribute('aria-label', `${mode === 'consensus' ? 'Consensus' : 'Genre-adjusted'} score: ${score.textContent}`);
      const toggle = document.createElement('button');
      toggle.className = 'anime-rankings-toggle';
      toggle.type = 'button';
      toggle.textContent = '⌄';
      toggle.setAttribute('aria-controls', `anime-rankings-breakdown-${item.id}`);
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', `Show score details for ${item.title}`);
      const panel = makeBreakdown(item);
      row.append(rank, identity, score, toggle, panel);
      row.addEventListener('click', (event) => {
        if (event.target.closest('a, .anime-rankings-breakdown')) return;
        panel.hidden = !panel.hidden;
        toggle.setAttribute('aria-expanded', String(!panel.hidden));
        toggle.setAttribute('aria-label', `${panel.hidden ? 'Show' : 'Hide'} score details for ${item.title}`);
      });
      return row;
    }));

    if (matches.length) {
      summary.textContent = `Showing ${number.format(start + 1)}–${number.format(start + visible.length)} of ${number.format(matches.length)} anime${matches.length !== anime.length ? ' matching your search' : ''}.`;
      pageLabel.textContent = `Page ${number.format(page + 1)} of ${number.format(Math.ceil(matches.length / pageSize))}`;
    } else {
      summary.textContent = 'No anime match that search.';
      pageLabel.textContent = '';
    }
    previous.disabled = page === 0;
    next.disabled = start + pageSize >= matches.length;
  }

  function filter() {
    const terms = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    const ordered = mode === 'consensus' ? consensusOrder : anime;
    matches = terms.length
      ? ordered.filter((item) => terms.every((term) => item.searchText.includes(term)))
      : ordered;
    page = 0;
    draw();
  }

  search.addEventListener('input', filter);
  modes.addEventListener('change', (event) => {
    if (event.target.name !== 'anime-rankings-mode') return;
    mode = event.target.value;
    filter();
  });
  previous.addEventListener('click', () => { page -= 1; draw(); });
  next.addEventListener('click', () => { page += 1; draw(); });

  fetch(root.dataset.src)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data.anime) || !data.breakdown) throw new Error('Unexpected rankings data');
      breakdown = data.breakdown;
      anime = data.anime.map((item) => ({
        ...item,
        searchText: normalize([item.title, ...item.aliases, String(item.id)].join(' ')),
      }));
      consensusOrder = [...anime].sort((left, right) =>
        right.smoothed_mean - left.smoothed_mean ||
        left.title.localeCompare(right.title) || left.id - right.id);
      consensusOrder.forEach((item, index) => { item.consensusRank = index + 1; });
      modes.disabled = false;
      search.disabled = false;
      filter();
    })
    .catch(() => {
      summary.textContent = '';
      error.hidden = false;
      error.textContent = 'The rankings could not be loaded. Please try refreshing the page.';
    });
})();
