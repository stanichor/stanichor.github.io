---
layout: post
title: "Describing Your Movie Preferences"
date: 2026-10-19
permalink: /your-movie-preferences/
categories:
---

Upload your ratings to see where you fall along the 28 factors described in [The Structure of Movie Preferences](/movie-preferences/). Use a CSV or TSV with movie titles and numeric ratings; year or movie-ID columns can help with matching. You can review or correct the matches after seeing your results.

<link rel="stylesheet" href="/assets/css/movie-preference-upload.css">
<section class="preference-upload" data-preference-upload data-meta-src="/assets/jsons/movie-preference-upload.json" data-embeddings-src="/assets/data/movie-preference-embeddings.f32" aria-label="Find your movie preference factors">
  <div class="preference-upload-head">
    <h3>Find your preference factors</h3>
    <p data-role="coverage" hidden></p>
  </div>
  <label class="preference-upload-file">
    <span class="preference-upload-file-label">Ratings CSV or TSV</span>
    <span class="preference-upload-file-button">Choose file</span>
    <span class="preference-upload-file-name" data-role="file-name" aria-live="polite">No file selected</span>
    <input type="file" accept=".csv,.tsv,text/csv,text/tab-separated-values" data-role="file" aria-label="Choose a ratings CSV or TSV">
  </label>
  <button type="button" class="preference-upload-review-toggle" data-role="review-toggle" aria-expanded="false" hidden>Review movie matches</button>
  <div data-role="columns" class="preference-upload-columns" hidden>
    <p>If the columns were identified incorrectly, change them here and apply your choices.</p>
    <div class="preference-upload-column-grid">
      <label>Title <select data-column="title"></select></label>
      <label>Rating <select data-column="rating"></select></label>
      <label>Year <select data-column="year"></select></label>
      <label>IMDb ID <select data-column="imdb"></select></label>
      <label>TMDb ID <select data-column="tmdb"></select></label>
      <label>MovieLens ID <select data-column="movielens"></select></label>
    </div>
    <button type="button" data-role="match">Apply columns</button>
  </div>
  <div data-role="review" class="preference-upload-review" hidden>
    <h4>Review movie matches</h4>
    <p data-role="match-summary"></p>
    <label class="preference-upload-toggle"><input type="checkbox" data-role="show-all"> Show automatically matched movies too</label>
    <div class="preference-upload-table-wrap"><table><thead><tr><th>Your movie</th><th>Rating</th><th>MovieLens match</th></tr></thead><tbody data-role="matches"></tbody></table></div>
    <button type="button" class="preference-upload-more" data-role="more" hidden>Show more rows</button>
    <div class="preference-upload-search" data-role="search-panel" hidden>
      <label>Find the right movie <input type="search" data-role="search-input" placeholder="Search title"></label>
      <div data-role="search-results"></div>
      <button type="button" data-role="close-search">Close search</button>
    </div>
    <button type="button" class="preference-upload-close-review" data-role="close-review">Close review</button>
  </div>
  <div data-role="results" class="preference-upload-results" hidden>
    <h4>Your preferences</h4>
    <p data-role="results-note"></p>
    <div class="preference-upload-result-tabs" role="tablist" aria-label="Preference results">
      <button type="button" id="preference-upload-factors-tab" data-role="factors-tab" role="tab" aria-controls="preference-upload-factors-panel" aria-selected="true">Preference factors</button>
      <button type="button" id="preference-upload-dimensions-tab" data-role="dimensions-tab" role="tab" aria-controls="preference-upload-dimensions-panel" aria-selected="false" tabindex="-1">Movie dimensions</button>
    </div>
    <div id="preference-upload-factors-panel" data-role="factors-panel" role="tabpanel" aria-labelledby="preference-upload-factors-tab">
      <p class="preference-upload-result-note">Sorted by the size of your estimated preference, strongest first.</p>
      <div class="preference-upload-scale" data-role="scale"></div>
      <div data-role="factor-results"></div>
      <p class="preference-upload-caveat">Points are posterior mean scores. Zero is the MovieLens population average, and one unit is one population SD.</p>
    </div>
    <div id="preference-upload-dimensions-panel" data-role="dimensions-panel" role="tabpanel" aria-labelledby="preference-upload-dimensions-tab" hidden>
      <p class="preference-upload-result-note">All 115 movie dimensions. Click a column heading to sort.</p>
      <label class="preference-upload-dimension-sort-mode"><input type="checkbox" data-role="dimension-magnitude" checked> Sort numeric columns by magnitude</label>
      <div data-role="dimension-results"></div>
      <p class="preference-upload-caveat">“From average” uses the MovieLens-user coefficient SD. One coefficient unit is one standardized-rating SD per +1 movie-dimension SD.</p>
    </div>
    <div class="preference-upload-suggestions">
      <h4>Movies you might love or hate</h4>
      <p>Among movies with embeddings that weren't matched to your upload, these have the highest and lowest predicted ratings.</p>
      <div class="preference-upload-suggestion-columns">
        <section><h5>Likely to love</h5><ol data-role="love-suggestions"></ol></section>
        <section><h5>Likely to hate</h5><ol data-role="hate-suggestions"></ol></section>
      </div>
    </div>
    <div class="preference-upload-suggestions">
      <h4>Movies you might like differently from others</h4>
      <p>These have the largest gaps between your predicted rating and the average MovieLens user's predicted rating.</p>
      <div class="preference-upload-suggestion-columns">
        <section><h5>More than average</h5><ol data-role="relative-love-suggestions"></ol></section>
        <section><h5>Less than average</h5><ol data-role="relative-hate-suggestions"></ol></section>
      </div>
    </div>
  </div>
  <p class="preference-upload-status" data-role="status" aria-live="polite"></p>
</section>
<script src="/assets/js/movie-preference-upload-core.js" defer></script>
<script src="/assets/js/movie-preference-upload.js" defer></script>
