/* Movie matching and the Gaussian preference-factor posterior. No network calls. */
(() => {
  'use strict';

  function parseDelimited(text, filename = '') {
    const firstLine = text.replace(/^\uFEFF/, '').split(/\r?\n/, 1)[0];
    const tabs = (firstLine.match(/\t/g) || []).length;
    const commas = (firstLine.match(/,/g) || []).length;
    const delimiter = tabs && (/\.tsv$/i.test(filename) || tabs >= commas) ? '\t' : ',';
    const rows = [];
    let row = [], field = '', quoted = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        if (quoted && text[i + 1] === '"') { field += '"'; i++; }
        else quoted = !quoted;
      } else if (!quoted && (char === delimiter || char === '\n' || char === '\r')) {
        row.push(field); field = '';
        if (char !== delimiter) {
          if (row.some((cell) => cell.trim())) rows.push(row);
          row = [];
          if (char === '\r' && text[i + 1] === '\n') i++;
        }
      } else field += char;
    }
    if (quoted) throw new Error('The CSV has an unclosed quoted field.');
    row.push(field);
    if (row.some((cell) => cell.trim())) rows.push(row);
    if (!rows.length) throw new Error('The file has no ratings.');
    const headers = rows[0].map((cell) => cell.trim().replace(/^\uFEFF/, ''));
    const recognizable = headers.some((cell) => /^(title|name|movie|film|rating|score|year|imdb\s*id|tmdb\s*id|movie\s*id)$/i.test(cell));
    return recognizable
      ? { headers, rows: rows.slice(1) }
      : { headers: headers.map((_, index) => `Column ${index + 1}`), rows };
  }

  function normalizeTitle(value) {
    return String(value || '').normalize('NFKD').replace(/\p{M}/gu, '')
      .toLowerCase().replace(/&/g, ' and ').replace(/[^\p{L}\p{N}]+/gu, ' ')
      .trim().replace(/\s+/g, ' ').replace(/^(the|a|an) /, '');
  }

  function splitTitle(value) {
    const raw = String(value || '').trim();
    const match = raw.match(/\s*\((\d{4})\)\s*$/);
    return { title: match ? raw.slice(0, match.index).trim() : raw,
      year: match ? Number(match[1]) : null };
  }

  function titleVariants(value) {
    const variants = new Set();
    const add = (title) => {
      if (!title) return;
      variants.add(title);
      const article = title.match(/^(.*), (The|A|An)$/i);
      if (article) variants.add(`${article[2]} ${article[1]}`);
    };
    add(value);
    add(value.replace(/\s*\([^)]*\)/g, '').trim());
    for (const match of value.matchAll(/\(([^)]+)\)/g)) {
      let alias = match[1].replace(/^a\.?k\.?a\.?\s*/i, '').trim();
      if (alias && !/^\d{4}$/.test(alias)) add(alias);
    }
    return [...variants].map(normalizeTitle).filter(Boolean);
  }

  function makeMatcher(data) {
    const byTitle = new Map(), byTitleYear = new Map(), byToken = new Map();
    const titles = data.titles;
    const years = new Array(titles.length);
    const normalized = new Array(titles.length);
    const add = (map, key, index) => {
      if (!map.has(key)) map.set(key, new Set());
      map.get(key).add(index);
    };
    titles.forEach((fullTitle, index) => {
      const parts = splitTitle(fullTitle);
      years[index] = parts.year;
      const base = parts.title.replace(/\s*\([^)]*\)/g, '').trim();
      const article = base.match(/^(.*), (The|A|An)$/i);
      normalized[index] = normalizeTitle(article ? `${article[2]} ${article[1]}` : base);
      for (const alias of titleVariants(parts.title)) {
        add(byTitle, alias, index);
        if (parts.year) add(byTitleYear, `${alias}|${parts.year}`, index);
        for (const token of alias.split(' ')) if (token.length >= 3) add(byToken, token, index);
      }
    });
    const latestYear = years.reduce((latest, year) => Math.max(latest, year || 0), 0);
    const array = (set) => set ? [...set] : [];
    const ids = data.ids;
    const idCandidates = (kind, raw) => {
      if (!raw || !ids[kind]) return [];
      let key = String(raw).trim();
      if (kind === 'imdb') {
        key = key.replace(/^https?:\/\/[^/]+\/title\//, '').replace(/\/$/, '');
        key = key.replace(/^tt/i, '');
        if (!/^\d+$/.test(key)) return [];
        key = `tt${key.padStart(7, '0')}`;
      } else {
        key = key.replace(/\.0$/, '');
        if (!/^\d+$/.test(key)) return [];
      }
      const found = ids[kind][key];
      return found === undefined ? [] : Array.isArray(found) ? found : [found];
    };

    function dice(a, b) {
      if (a === b) return 1;
      if (a.length < 2 || b.length < 2) return 0;
      const counts = new Map();
      for (let i = 0; i < a.length - 1; i++) {
        const pair = a.slice(i, i + 2);
        counts.set(pair, (counts.get(pair) || 0) + 1);
      }
      let shared = 0;
      for (let i = 0; i < b.length - 1; i++) {
        const pair = b.slice(i, i + 2);
        const count = counts.get(pair) || 0;
        if (count) { shared++; counts.set(pair, count - 1); }
      }
      return 2 * shared / (a.length + b.length - 2);
    }

    function search(query, year = null, limit = 8) {
      if (latestYear && year > latestYear) return [];
      const name = normalizeTitle(splitTitle(query).title);
      if (!name) return [];
      const pool = new Set();
      for (const token of name.split(' ')) {
        if (token.length >= 3 && byToken.has(token)) {
          for (const index of byToken.get(token)) pool.add(index);
        }
      }
      if (!pool.size) for (let i = 0; i < titles.length; i++) pool.add(i);
      const ranked = [];
      for (const index of pool) {
        const candidate = normalized[index];
        const similarity = dice(name, candidate);
        const yearGap = year && years[index] ? Math.abs(year - years[index]) : 0;
        const score = similarity - (yearGap ? Math.min(.35, yearGap * .12) : 0);
        if (score >= .38 || similarity === 1) ranked.push({ index, score });
      }
      ranked.sort((a, b) => b.score - a.score || titles[a.index].localeCompare(titles[b.index]));
      return ranked.slice(0, limit).map((item) => item.index);
    }

    function match(row) {
      const parts = splitTitle(row.title);
      const year = Number(row.year) || parts.year;
      if (latestYear && year > latestYear) {
        return { selected: null, candidates: [], reason: `After ${latestYear} coverage`,
          review: false, unavailable: true };
      }
      const name = normalizeTitle(parts.title);
      const exact = name ? array(year ? byTitleYear.get(`${name}|${year}`) : byTitle.get(name)) : [];
      const idMatches = new Set();
      for (const kind of ['movielens', 'imdb', 'tmdb']) {
        for (const index of idCandidates(kind, row[kind])) idMatches.add(index);
      }
      const fuzzy = exact.length === 1 && idMatches.size <= 1
        ? [] : search(parts.title, year);
      const candidates = [...new Set([...idMatches, ...exact, ...fuzzy])].slice(0, 8);
      if (idMatches.size === 1) {
        const selected = [...idMatches][0];
        const titleAgrees = !name || titleVariants(splitTitle(titles[selected]).title).includes(name);
        const yearAgrees = !year || !years[selected] || year === years[selected];
        if ((!exact.length || exact.includes(selected)) && titleAgrees && yearAgrees) {
          return { selected, candidates, reason: 'ID match', review: false };
        }
        return { selected: null, candidates, reason: 'ID, title, or year disagree', review: true };
      }
      if (idMatches.size > 1) {
        return { selected: null, candidates, reason: 'Conflicting or shared IDs', review: true };
      }
      if (exact.length === 1) {
        return { selected: exact[0], candidates, reason: year ? 'Title + year' : 'Unique title', review: false };
      }
      return { selected: null, candidates,
        reason: exact.length > 1 ? 'Ambiguous title' : 'Needs review', review: true };
    }
    return { match, search, titles, latestYear };
  }

  function cholesky(matrix, size) {
    const lower = new Float64Array(matrix.length);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j <= i; j++) {
        let sum = matrix[i * size + j];
        for (let k = 0; k < j; k++) sum -= lower[i * size + k] * lower[j * size + k];
        if (i === j) {
          if (!(sum > 0)) throw new Error('The posterior matrix is not positive definite.');
          lower[i * size + j] = Math.sqrt(sum);
        } else lower[i * size + j] = sum / lower[j * size + j];
      }
    }
    return lower;
  }

  function solve(lower, rhs, size) {
    const output = Float64Array.from(rhs);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < i; j++) output[i] -= lower[i * size + j] * output[j];
      output[i] /= lower[i * size + i];
    }
    for (let i = size - 1; i >= 0; i--) {
      for (let j = i + 1; j < size; j++) output[i] -= lower[j * size + i] * output[j];
      output[i] /= lower[i * size + i];
    }
    return output;
  }

  function infer(data, embeddings, ratings) {
    const p = data.dimensions, factors = data.factor_count;
    if (embeddings.length !== data.titles.length * p) throw new Error('Movie data are incomplete.');
    if (ratings.length < 3 || new Set(ratings.map((row) => row.rating)).size < 3) {
      throw new Error('At least three distinct ratings of matched movies are needed.');
    }
    const n = ratings.length;
    const xMean = new Float64Array(p);
    let yMean = 0;
    for (const row of ratings) {
      yMean += row.rating;
      for (let j = 0; j < p; j++) xMean[j] += embeddings[row.index * p + j];
    }
    yMean /= n;
    for (let j = 0; j < p; j++) xMean[j] /= n;
    let yVariance = 0;
    for (const row of ratings) yVariance += (row.rating - yMean) ** 2;
    const ySd = Math.sqrt(yVariance / n);
    if (!(ySd > 0)) throw new Error('The matched ratings have no variation.');

    const precision = data.precision, projection = data.factor_projection;
    const matrix = Float64Array.from(precision.flat());
    const right = new Float64Array(p);
    const centered = new Float64Array(p);
    const noise = data.residual_variance;
    for (const row of ratings) {
      let expected = 0;
      for (let j = 0; j < p; j++) {
        centered[j] = embeddings[row.index * p + j] - xMean[j];
        expected += centered[j] * data.mean[j];
      }
      const residual = (row.rating - yMean) / ySd - expected;
      for (let j = 0; j < p; j++) {
        right[j] += centered[j] * residual / noise;
        for (let k = 0; k <= j; k++) matrix[j * p + k] += centered[j] * centered[k] / noise;
      }
    }
    const lower = cholesky(matrix, p);
    const solvedMean = solve(lower, right, p);
    const means = new Array(factors), sds = new Array(factors);
    for (let factor = 0; factor < factors; factor++) {
      const vector = projection[factor];
      const solved = solve(lower, vector, p);
      let mean = 0, variance = data.conditional_factor_variances[factor];
      for (let j = 0; j < p; j++) {
        mean += vector[j] * solvedMean[j];
        variance += vector[j] * solved[j];
      }
      if (!Number.isFinite(mean) || !Number.isFinite(variance) || variance < -1e-8) {
        throw new Error('The factor posterior could not be calculated.');
      }
      means[factor] = mean;
      sds[factor] = Math.sqrt(Math.max(0, variance));
    }
    const coefficients = data.mean.map((value, index) => value + solvedMean[index]);
    return { means, sds, coefficients, matchedMovies: n };
  }

  function suggestMovies(data, embeddings, coefficients, excludedIndices, count = 5) {
    const p = data.dimensions;
    if (coefficients.length !== p || embeddings.length !== data.titles.length * p) {
      throw new Error('The movie data are incomplete.');
    }
    const excluded = new Set(excludedIndices);
    const ranked = [];
    for (let index = 0; index < data.titles.length; index++) {
      if (excluded.has(index)) continue;
      let score = 0;
      for (let j = 0; j < p; j++) score += embeddings[index * p + j] * coefficients[j];
      if (Number.isFinite(score)) ranked.push({ index, score });
    }
    ranked.sort((a, b) => b.score - a.score || a.index - b.index);
    return {
      love: ranked.slice(0, count),
      hate: ranked.slice(-count).reverse(),
    };
  }

  const api = { parseDelimited, normalizeTitle, splitTitle, makeMatcher, infer, suggestMovies };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.MoviePreferenceUploadCore = api;
})();
