---
layout: post
title: "The Structure of Movie Preferences"
date: 2026-10-19
permalink: /movie-preferences/
category: media-taste
related:
  - /simple-recsys/
  - /predicting-movie-ratings/
  - /factor-scores/
---

We're going to look at the structure of movie preferences: how people vary in which characteristics of movies they like and dislike.

## Movie Dimensions

Our first problem is that we have 1,128 tags describing movies, which is a bit much. These came from user-created tags that were filtered to retain the widely used, higher-quality ones, but even after this filtering, there's still a lot of redundancy. For example, "vampire" and "vampires" are both tags, and they have a Pearson correlation of 0.99 across movies, making them basically duplicates. [Having too many tags](https://en.wikipedia.org/wiki/Curse_of_dimensionality), especially when [many are highly correlated with each other](https://en.wikipedia.org/wiki/Multicollinearity), can lead to problems. So, I use factor analysis with varimax rotation to reduce the tags to 115 underlying dimensions along which movies vary.

The interactive below lets you explore these dimensions and the tags most strongly associated with each one, giving an idea of what aspects of movies each dimension captures.

<link rel="stylesheet" href="/assets/css/movie-dimensions.css">
<section class="movie-dimensions" data-movie-dimensions data-src="/assets/jsons/movie-dimensions.json" aria-label="Explore movie dimensions">
  <div class="movie-dimensions-head">
    <div>
      <h3>Explore the movie dimensions</h3>
      <p class="movie-dimensions-subtitle">See which tags and films align with each dimension.</p>
    </div>
    <span class="movie-dimensions-counter" data-role="counter">1 / 115</span>
  </div>
  <div class="movie-dimensions-controls">
    <label for="movie-dimension-select">Dimension</label>
    <select id="movie-dimension-select" data-role="dimension-select" disabled><option>Loading dimensions…</option></select>
    <button type="button" data-role="previous" aria-label="Previous dimension" disabled>‹</button>
    <button type="button" data-role="next" aria-label="Next dimension" disabled>›</button>
  </div>
  <div data-role="content" hidden>
    <h4 data-role="title"></h4>
    <p class="movie-dimensions-section-title">Most positively correlated tags · Pearson r</p>
    <div class="movie-dimensions-tags" data-role="tags"></div>
    <div class="movie-dimensions-movies">
      <div class="movie-dimensions-high">
        <p class="movie-dimensions-section-title">High-scoring movies</p>
        <ol class="movie-dimensions-movie-list" data-role="high"></ol>
      </div>
      <div class="movie-dimensions-low">
        <p class="movie-dimensions-section-title">Low-scoring movies</p>
        <ol class="movie-dimensions-movie-list" data-role="low"></ol>
      </div>
    </div>
  </div>
  <span class="movie-dimensions-status" data-role="status" aria-live="polite"></span>
</section>
<script src="/assets/js/movie-dimensions.js" defer></script>

## Coefficient Preference Prior

Now that we have the movie dimensions, we can use them to predict people's tastes in movies. The problem is that most people haven't rated enough movies for ordinary linear regression to give reliable estimates of their preferences. Ridge regression solves this by applying an L2 penalty to the coefficients, discouraging large estimates. In Bayesian terms, that's equivalent to placing an isotropic Gaussian prior on the coefficients: $\mathbf{\beta} \sim \mathcal{N}(\mathbf{0}, \tau^2 I)$.

In our case, though, we have reason to believe this isn't the best prior. For example, one of our dimensions is "Awful Films," and you'd expect that, on average, people don't like awful films. So, rather than assuming all preference coefficients are centered on zero and have the same variance, we'd like a prior that reflects how people's preferences actually vary. Sol has estimated such a prior for us.

The interactive below shows this estimated distribution of preferences across movie dimensions: which characteristics people tend to like or dislike on average, and how much people's preferences differ from one another.

<link rel="stylesheet" href="/assets/css/movie-preference-prior.css">
<section class="preference-prior" data-preference-prior data-src="/assets/jsons/movie-preference-prior.json" aria-label="Explore movie preference coefficients">
  <div class="preference-prior-head">
    <div>
      <h3>Explore the preference prior</h3>
      <p class="preference-prior-subtitle">How preferences for each movie dimension vary across users.</p>
    </div>
    <span class="preference-prior-counter" data-role="counter">1 / 115</span>
  </div>
  <div class="preference-prior-controls">
    <label for="preference-prior-select">Dimension</label>
    <select id="preference-prior-select" data-role="dimension-select" disabled><option>Loading dimensions…</option></select>
    <button type="button" data-role="previous" aria-label="Previous dimension" disabled>‹</button>
    <button type="button" data-role="next" aria-label="Next dimension" disabled>›</button>
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
    <p class="preference-prior-units">Coefficient units: change in a user's standardized rating per +1 SD on the movie dimension, holding the other dimensions fixed.</p>
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

## Preference Factors

Still, 115 dimensions of movie preferences is kind of a lot. Many of these preferences are pretty correlated, for example Gore and Haunted House Horror (r = +0.54), or Sequels and Awful Films (r = +0.58). Perhaps there are a smaller number of underlying factors that explain how people's preferences tend to covary? Let's take a look.

The interactive below lets you explore the preference factors, see which movie dimensions contribute to each one, find movies that distinguish each factor, and examine how the factors correlate with one another.

<link rel="stylesheet" href="/assets/css/movie-preference-factors.css">
<section class="preference-factors" data-preference-factors data-src="/assets/jsons/movie-preference-factors.json" aria-label="Explore movie preference factors">
  <div class="preference-factors-head">
    <div>
      <h3>Explore the preference factors</h3>
      <p class="preference-factors-subtitle">How movie preferences vary together across users.</p>
    </div>
    <span class="preference-factors-counter" data-role="counter">1 / 28</span>
  </div>
  <div class="preference-factors-controls">
    <label for="preference-factor-select">Factor</label>
    <select id="preference-factor-select" data-role="factor-select" disabled><option>Loading factors…</option></select>
    <button type="button" data-role="previous" aria-label="Previous preference factor" disabled>‹</button>
    <button type="button" data-role="next" aria-label="Next preference factor" disabled>›</button>
  </div>
  <div data-role="content" hidden>
    <h4 data-role="title"></h4>
    <p class="preference-factors-section-title">Preference-coefficient loadings</p>
    <p class="preference-factors-note">Standardized pattern loadings · click a dimension to explore it above</p>
    <div class="preference-factors-axis"><span></span><div class="preference-factors-axis-track"><span>−1.2</span><span>0</span><span>+1.2</span></div><span></span></div>
    <div class="preference-factors-loading-list" data-role="loadings"></div>
    <div class="preference-factors-bottom">
      <div class="preference-factors-examples">
        <p class="preference-factors-section-title">Movies that distinguish this factor</p>
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

To see where your own ratings place you along these factors, go to [Describing Your Movie Preferences](/your-movie-preferences/).
