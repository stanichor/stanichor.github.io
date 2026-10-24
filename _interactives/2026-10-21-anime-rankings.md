---
layout: post
title: "Anime Rankings"
date: 2026-10-21
permalink: /anime-rankings/
categories:
---

Rank anime by their consensus scores or by how much they exceed what their genres would predict. Scores are displayed on a 10-point scale[^star]. For the preference model behind these scores, see [The Structure of Anime Preferences](/anime-preferences/).

<link rel="stylesheet" href="/assets/css/anime-rankings.css">
<section class="anime-rankings" data-anime-rankings data-src="/assets/jsons/anime-genre-neutral-rankings.json" aria-label="Anime rankings">
  <fieldset class="anime-rankings-modes" data-role="modes" disabled>
    <legend>Rank by</legend>
    <label><input type="radio" name="anime-rankings-mode" value="consensus" checked><span>Consensus</span></label>
    <label><input type="radio" name="anime-rankings-mode" value="adjusted"><span>Genre-adjusted</span></label>
  </fieldset>
  <div class="anime-rankings-controls">
    <label for="anime-rankings-search">Find an anime</label>
    <input id="anime-rankings-search" type="search" data-role="search" placeholder="Search English or Japanese titles" autocomplete="off" disabled>
  </div>
  <p class="anime-rankings-summary" data-role="summary" aria-live="polite">Loading rankings…</p>
  <div class="anime-rankings-head" aria-hidden="true"><span>Rank</span><span>Anime</span><span>Score</span><span></span></div>
  <ol class="anime-rankings-list" data-role="list"></ol>
  <nav class="anime-rankings-pages" aria-label="Ranking pages">
    <button type="button" data-role="previous" disabled>Previous</button>
    <span data-role="page" aria-live="polite"></span>
    <button type="button" data-role="next" disabled>Next</button>
  </nav>
  <p class="anime-rankings-error" data-role="error" role="alert" hidden></p>
</section>
<script src="/assets/js/anime-rankings.js" defer></script>

[^star]: These aren't actually star ratings. The underlying scores are in within-user SD units. I apply the standard normal CDF to each score, then multiply by 10.
