---
layout: post
title: "Genre-Neutral Anime Rankings"
date: 2026-10-21
permalink: /anime-rankings/
categories:
---

These rankings show which anime people liked more or less than their genres would predict. The genre-adjusted scores are shown in SDs across the 13,738 anime. For the preference model behind this idea, see [The Structure of Anime Preferences](/anime-preferences/).

<link rel="stylesheet" href="/assets/css/anime-rankings.css">
<section class="anime-rankings" data-anime-rankings data-src="/assets/jsons/anime-genre-neutral-rankings.json" aria-label="Genre-neutral anime rankings">
  <div class="anime-rankings-controls">
    <label for="anime-rankings-search">Find an anime</label>
    <input id="anime-rankings-search" type="search" data-role="search" placeholder="Search English or Japanese titles" autocomplete="off" disabled>
  </div>
  <p class="anime-rankings-summary" data-role="summary" aria-live="polite">Loading rankings…</p>
  <div class="anime-rankings-head" aria-hidden="true"><span>Rank</span><span>Anime</span><span>Score (SD)</span></div>
  <ol class="anime-rankings-list" data-role="list"></ol>
  <nav class="anime-rankings-pages" aria-label="Ranking pages">
    <button type="button" data-role="previous" disabled>Previous</button>
    <span data-role="page" aria-live="polite"></span>
    <button type="button" data-role="next" disabled>Next</button>
  </nav>
  <p class="anime-rankings-error" data-role="error" role="alert" hidden></p>
</section>
<script src="/assets/js/anime-rankings.js" defer></script>
