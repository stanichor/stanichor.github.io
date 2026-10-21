(() => {
  const root = document.querySelector('[data-anime-rankings]');
  if (!root) return;

  const pageSize = 20;
  const search = root.querySelector('[data-role="search"]');
  const summary = root.querySelector('[data-role="summary"]');
  const list = root.querySelector('[data-role="list"]');
  const previous = root.querySelector('[data-role="previous"]');
  const next = root.querySelector('[data-role="next"]');
  const pageLabel = root.querySelector('[data-role="page"]');
  const error = root.querySelector('[data-role="error"]');
  const number = new Intl.NumberFormat('en-US');
  let anime = [];
  let matches = [];
  let page = 0;

  function normalize(value) {
    return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
  }

  function draw() {
    const start = page * pageSize;
    const visible = matches.slice(start, start + pageSize);
    list.replaceChildren(...visible.map((item) => {
      const row = document.createElement('li');
      const rank = document.createElement('span');
      rank.className = 'anime-rankings-rank';
      rank.textContent = number.format(item.rank);

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
      const roundedScore = Math.abs(item.score_sd) < 0.005 ? 0 : item.score_sd;
      score.textContent = `${roundedScore > 0 ? '+' : ''}${roundedScore.toFixed(2)} SD`;
      row.append(rank, identity, score);
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
    matches = terms.length
      ? anime.filter((item) => terms.every((term) => item.searchText.includes(term)))
      : anime;
    page = 0;
    draw();
  }

  search.addEventListener('input', filter);
  previous.addEventListener('click', () => { page -= 1; draw(); });
  next.addEventListener('click', () => { page += 1; draw(); });

  fetch(root.dataset.src)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data.anime)) throw new Error('Unexpected rankings data');
      anime = data.anime.map((item) => ({
        ...item,
        searchText: normalize([item.title, ...item.aliases, String(item.id)].join(' ')),
      }));
      search.disabled = false;
      filter();
    })
    .catch(() => {
      summary.textContent = '';
      error.hidden = false;
      error.textContent = 'The rankings could not be loaded. Please try refreshing the page.';
    });
})();
