---
layout: post
title: "The Structure of Anime Preferences"
date: 2026-10-21
permalink: /anime-preferences/
category: media-taste
related:
---

I'm on a roll, so now we're going to look at the structure of anime preferences: how people differ in the anime genres they like and dislike.

## How Do Anime Genre Preferences Vary?

We already have the genres, so we can use them to predict people's tastes in anime. We'll do the same thing we did in [The Structure of Movie Preferences](/movie-preferences/), where we (well, Sol) calculated the preference coefficient prior.

I standardized each person's ratings in the [MyAnimeList dataset](https://www.kaggle.com/datasets/hernan4444/anime-recommendation-database-2020), then estimated a population distribution of genre preferences from 223,160 users who had used at least three distinct ratings. Together, they rated 13,738 anime nearly 45 million times.

The interactive below shows the estimated distribution of preference coefficients for each anime genre: how much people tend to like or dislike it on average, and how much tastes vary between users.

<link rel="stylesheet" href="/assets/css/movie-preference-prior.css">
<section class="preference-prior" data-preference-prior data-src="/assets/jsons/anime-preference-prior.json" data-sync-event="stanichor:anime-genre-selected" data-selection-key="animeGenreSelection" data-display-digits="2" aria-label="Explore anime preference coefficients">
  <div class="preference-prior-head">
    <div>
      <h3>Explore the preference prior</h3>
      <p class="preference-prior-subtitle">How preferences for anime genres vary across users.</p>
    </div>
    <span class="preference-prior-counter" data-role="counter">1 / 44</span>
  </div>
  <div class="preference-prior-controls">
    <label for="anime-preference-prior-select">Preference coefficient</label>
    <select id="anime-preference-prior-select" data-role="dimension-select" disabled><option>Loading preferences…</option></select>
    <button type="button" data-role="previous" aria-label="Previous anime feature" disabled>‹</button>
    <button type="button" data-role="next" aria-label="Next anime feature" disabled>›</button>
  </div>
  <div data-role="content" hidden>
    <div class="preference-prior-distribution">
      <div class="preference-prior-chart-wrap">
        <h4 data-role="title"></h4>
        <p class="preference-prior-label">Population distribution of preference coefficients</p>
        <svg data-role="chart" viewBox="0 0 720 232" role="img"></svg>
        <div class="preference-prior-legend"><span class="preference-prior-key preference-prior-key-mean">Mean</span><span class="preference-prior-key preference-prior-key-zero">Zero</span><span class="preference-prior-key preference-prior-key-range">Middle 90%</span></div>
      </div>
      <div class="preference-prior-stats">
        <div><span>Mean</span><strong data-role="mean"></strong></div>
        <div><span>SD between users</span><strong data-role="sd"></strong></div>
        <div><span>Positive coefficient</span><strong data-role="positive"></strong></div>
        <div><span>Middle 90% of users</span><strong data-role="range"></strong></div>
      </div>
    </div>
    <p class="preference-prior-units">Coefficient units: change in a user's standardized rating when a genre (or the unknown-genre indicator) is present rather than absent, holding the other model features fixed.</p>
    <div class="preference-prior-related">
      <p class="preference-prior-section-title">Related tastes</p>
      <p class="preference-prior-related-note">Correlation between users' preference coefficients</p>
      <div class="preference-prior-related-columns">
        <div><span class="preference-prior-small-title">Move together</span><div data-role="related-positive"></div></div>
        <div><span class="preference-prior-small-title">Move in opposite directions</span><div data-role="related-negative"></div></div>
      </div>
    </div>
  </div>
  <span class="preference-prior-status" data-role="status" aria-live="polite"></span>
</section>
<script src="/assets/js/movie-preference-prior.js" defer></script>

## Which Genre Preferences Go Together?

We can also observe correlations between anime genre preferences. People who especially like Shounen Ai also tend to like Yaoi; the same goes for Josei and Shoujo, or Drama and Mystery. I used factor analysis to look for broader patterns in these correlations. Parallel analysis for common factors suggested 16, using the genre preferences but not the genre-adjusted consensus we'll get to below.

The interactive below lets you explore the preference factors, see which anime genres contribute to each one, find anime that distinguish each factor, and examine how the factors correlate with one another.

<link rel="stylesheet" href="/assets/css/movie-preference-factors.css">
<section class="preference-factors" data-preference-factors data-src="/assets/jsons/anime-preference-factors.json" data-expected-count="16" data-sync-event="stanichor:anime-genre-selected" data-selection-key="animeGenreSelection" aria-label="Explore anime preference factors">
  <div class="preference-factors-head">
    <div>
      <h3>Explore the preference factors</h3>
      <p class="preference-factors-subtitle">How anime-genre preferences vary together across users.</p>
    </div>
    <span class="preference-factors-counter" data-role="counter">1 / 16</span>
  </div>
  <div class="preference-factors-controls">
    <label for="anime-preference-factor-select">Factor</label>
    <select id="anime-preference-factor-select" data-role="factor-select" disabled><option>Loading factors…</option></select>
    <button type="button" data-role="previous" aria-label="Previous anime preference factor" disabled>‹</button>
    <button type="button" data-role="next" aria-label="Next anime preference factor" disabled>›</button>
  </div>
  <div data-role="content" hidden>
    <h4 data-role="title"></h4>
    <p class="preference-factors-section-title">Genre-preference coefficient loadings</p>
    <p class="preference-factors-note">Standardized pattern loadings · click a coefficient to explore it above</p>
    <div class="preference-factors-axis"><span></span><div class="preference-factors-axis-track"><span>−1.2</span><span>0</span><span>+1.2</span></div><span></span></div>
    <div class="preference-factors-loading-list" data-role="loadings"></div>
    <div class="preference-factors-bottom">
      <div class="preference-factors-examples">
        <p class="preference-factors-section-title">Anime that distinguish this factor</p>
        <p class="preference-factors-note">Change in predicted standardized rating for +1 SD on this preference factor, holding the others fixed</p>
        <div class="preference-factors-movie-columns">
          <div><span class="preference-factors-small-title">Ratings rise</span><ol data-role="positive-movies"></ol></div>
          <div><span class="preference-factors-small-title">Ratings fall</span><ol data-role="negative-movies"></ol></div>
        </div>
      </div>
      <div class="preference-factors-related">
        <p class="preference-factors-section-title">Related factors</p>
        <p class="preference-factors-note">Correlation between preference factors</p>
        <div class="preference-factors-related-columns">
          <div><span class="preference-factors-small-title">Move together</span><div data-role="related-positive"></div></div>
          <div><span class="preference-factors-small-title">Move in opposite directions</span><div data-role="related-negative"></div></div>
        </div>
      </div>
    </div>
  </div>
  <span class="preference-factors-status" data-role="status" aria-live="polite"></span>
</section>
<script src="/assets/js/movie-preference-factors.js" defer></script>

## Who Likes "Good" Anime?

Modeling genre preferences allows us to do something interesting: estimate how 'good' various anime are after accounting for their genres. For example, we might suspect [people are unfairly prejudiced against yaoi](/anime-quality/). So we might want to see how 'good' a particular yaoi anime is after accounting for people's general dislike of the genre.

For each anime, I took its smoothed average rating, subtracted the rating predicted by its genres, and standardized the difference across anime. This *genre-adjusted consensus* tells us which anime people like more or less than we'd expect from their genres. Here are selected examples with at least 100,000 MyAnimeList members and 5,000 training-user ratings each. The scores are in SDs across anime.

<div class="anime-consensus-examples">
  <section aria-label="Anime liked more than their genres predict">
    <h3>More liked than their genres suggest</h3>
    <ol>
      <li><span>Perfect Blue</span><strong>+3.95 SD</strong></li>
      <li><span>Steins;Gate</span><strong>+3.73 SD</strong></li>
      <li><span>Devilman Crybaby</span><strong>+3.59 SD</strong></li>
      <li><span>Legend of the Galactic Heroes</span><strong>+3.29 SD</strong></li>
      <li><span>Princess Mononoke</span><strong>+3.01 SD</strong></li>
      <li><span>Wolf Children</span><strong>+3.00 SD</strong></li>
      <li><span>Hunter x Hunter (2011)</span><strong>+2.90 SD</strong></li>
      <li><span>Neon Genesis Evangelion</span><strong>+2.87 SD</strong></li>
      <li><span>Gurren Lagann</span><strong>+2.85 SD</strong></li>
      <li><span>I Want to Eat Your Pancreas</span><strong>+2.83 SD</strong></li>
    </ol>
  </section>
  <section aria-label="Anime liked less than their genres predict">
    <h3>Less liked than their genres suggest</h3>
    <ol>
      <li><span>Pupa</span><strong>−3.88 SD</strong></li>
      <li><span>Taboo Tattoo</span><strong>−2.52 SD</strong></li>
      <li><span>Boku no Pico</span><strong>−2.23 SD</strong></li>
      <li><span>The Lost Village</span><strong>−2.04 SD</strong></li>
      <li><span>Diabolik Lovers</span><strong>−1.98 SD</strong></li>
      <li><span>Tokyo Ghoul:re (second season)</span><strong>−1.96 SD</strong></li>
      <li><span>King's Game</span><strong>−1.84 SD</strong></li>
      <li><span>Berserk (2016)</span><strong>−1.76 SD</strong></li>
      <li><span>Dragon Ball GT</span><strong>−1.49 SD</strong></li>
      <li><span>School Days</span><strong>−1.43 SD</strong></li>
    </ol>
  </section>
</div>

We might also wonder what kinds of users have 'good taste.' If we use agreement with other viewers as a rough definition, which genre preferences go along with it? The chart shows the strongest correlations between users' genre-preference coefficients and their genre-adjusted consensus coefficients. People who especially like Drama, Mystery, and Slice of Life tend to agree more with the consensus; Horror enjoyers tend to agree less.

<link rel="stylesheet" href="/assets/css/anime-consensus.css">
<figure class="anime-consensus-chart">
  <img src="/assets/images/anime-preferences/genre-consensus-correlations.png" width="840" height="680" alt="Bar chart of correlations between users' genre preferences and their preference for genre-adjusted consensus. Drama, Mystery, and Slice of Life have the strongest positive correlations, around 0.6 to 0.7; Horror has the strongest negative correlation, minus 0.41.">
  <figcaption>The ten strongest positive and four strongest negative correlations in the fitted preference prior.</figcaption>
</figure>
