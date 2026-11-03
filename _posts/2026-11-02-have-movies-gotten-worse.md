---
layout: post
title: "Have Movies Gotten Worse?"
date: 2026-11-02
permalink: /have-movies-gotten-worse/
category: media-taste
related:
  - /recent-media/
  - /predicting-movie-ratings/
  - /anime-quality/
---

People keep saying movies have gotten worse. I have my doubts, but let's see what the MovieLens ratings say.

![Average movie rating by release year in MovieLens 1M, with a LOESS curve and 90% confidence interval.]({{ '/assets/images/have-movies-gotten-worse/loess_rating_by_release_year_with_90ci_zoomed.png' | relative_url }})

Recent movies do have lower average ratings. But this could be a selection effect. Perhaps when people watch old movies, they focus on the *good* ones, while taking more chances on new releases. That could raise the average rating of old movies without a difference in quality between old movies and new movies.

For example, someone born in 2000 might be more selective about which movies released between 1950 and 2000 they watch than someone born in 1950, who could have watched many of them as new releases. If viewers are less discriminating about movies released in their own time, the drop in ratings should begin later for younger viewers.

<link rel="stylesheet" href="{{ '/assets/css/have-movies-gotten-worse.css' | relative_url }}">
<figure class="media-taste" id="media-taste-ages" data-media-taste="age-groups" data-src="{{ '/assets/jsons/have-movies-gotten-worse.json' | relative_url }}" aria-label="Explore movie ratings by viewer age group">
  <div class="media-taste-title">The decline steepens around 1970 across age groups</div>
  <div class="media-taste-viewport">
    <img src="{{ '/assets/images/have-movies-gotten-worse/loess_ratings_by_age_group.png' | relative_url }}" alt="LOESS movie-rating curves for seven viewer age groups, from under 18 to 56 and older.">
  </div>
  <p class="media-taste-status"></p>
  <figcaption>
    <p>Movies receive equal weight. Age groups rated different sets of movies; years with too few movies are omitted.</p>
  </figcaption>
</figure>

The data doesn't reflect this pattern. Aside from the 18-24-year-olds, every age group shows a similar downward trend, which gets steeper around 1970. Maybe older movies really are better?

But look at how many movies from each year are in the dataset.

<figure class="media-taste" id="media-taste-histogram" data-media-taste="histogram" data-src="{{ '/assets/jsons/have-movies-gotten-worse.json' | relative_url }}" aria-label="Explore the number of MovieLens 1M movies by release year">
  <div class="media-taste-title">Most ML-1M movies were released after 1989</div>
  <div class="media-taste-viewport">
    <img src="{{ '/assets/images/have-movies-gotten-worse/movies_by_release_year.png' | relative_url }}" alt="MovieLens 1M catalog histogram with one bar per release year from 1930 to 2000.">
  </div>
  <p class="media-taste-status"></p>
  <figcaption>Full catalog, including unrated movies.</figcaption>
</figure>

There are only ~10 movies per year from the 1930s and 1940s, compared with hundreds per year from the 1990s. The few older movies may have been included because they were especially good. The larger MovieLens 25M dataset covers many more older movies. We can compare its full catalog with the movies also included in ML-1M.

![Average movie ratings by release year for the full ML-25M catalog and the movies also included in ML-1M, using ML-25M ratings for both.]({{ '/assets/images/have-movies-gotten-worse/ml25m_selection_and_full_catalog.png' | relative_url }})

The full catalog's average ratings are much flatter across release years, while the older movies included in ML-1M still score higher. The apparent decline in ML-1M seems to be an example of [Berkson's paradox](https://en.wikipedia.org/wiki/Berkson%27s_paradox): movies enter the dataset by being either good or recent, so the old movies will tend to be good and the bad movies will tend to be recent, even though quality hasn't actually declined. I suspect the same pattern occurs when people discuss or think about movies: people usually think of either good movies or recent movies, causing a negative correlation between quality and recency in the movies we discuss that doesn't reflect the true correlation between the two.

<script src="{{ '/assets/js/have-movies-gotten-worse.js' | relative_url }}" defer></script>
