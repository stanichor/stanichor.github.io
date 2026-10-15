---
layout: post
title: "Gwern Was Wrong About Star Ratings"
date: 2026-10-15
permalink: /star-ratings/
category: media-taste
related:
  - /movie-recs/
  - /simple-recsys/
  - /factor-scores/
---

Gwern says that [star ratings suck](https://gwern.net/resorter). And everyone else seems to agree with him.

<div style="text-align: center;">
    <figure>
        <a href="https://xkcd.com/1098/">
            <img src="/assets/images/star-ratings/star_ratings_2x.png" width="299" height="311" alt="xkcd comic about how online star ratings cluster at five, four and a half, and four stars" title="I got lost and wandered into the world's creepiest cemetery, where the headstones just had names and star ratings. Freaked me out. When I got home I tried to leave the cemetery a bad review on Yelp, but as my hand hovered over the 'one star' button I felt this distant chill ...">
        </a>
        <figcaption><a href="https://xkcd.com/1098/">XKCD #1098</a></figcaption>
    </figure>
</div>

The main criticism is that star ratings suffer from rating inflation: ratings tend to cluster at the high end of the scale, making it hard to distinguish between items. When everything is 5 stars, nothing is. I used to think this made them inferior to comparison-based ratings. Now I have data to put that idea to the test: I've rated a couple hundred movies I've seen using both systems to see which works better.

<style>
.rating-systems { margin: 1.5rem 0; border: 1px solid #d0d7de; border-radius: 12px; overflow: hidden; }
.rating-systems > summary { padding: 1rem 1.25rem; background: #f6f8fa; cursor: pointer; font-weight: 600; }
.rating-systems > summary:hover { background: #edf2f7; }
.rating-systems[open] > summary { border-bottom: 1px solid #d0d7de; }
.rating-systems-summary-note { float: right; color: #57606a; font-size: .85rem; font-weight: 400; }
.rating-systems-body { padding: 1.25rem; }
.rating-systems h3 { margin: 0 0 .75rem; border: 0; font-size: 1.05rem; }
.rating-systems h3:not(:first-child) { margin-top: 1.5rem; }
.rating-system-entry { border-top: 1px solid #eaeef2; }
.rating-system-entry > summary { padding: .75rem .25rem; cursor: pointer; font-weight: 600; }
.rating-system-entry > summary:hover { color: #0969da; }
.rating-system-entry-body { padding: .25rem .25rem 1rem; }
.rating-system-entry-body p { margin: .25rem 0 0; }
.rating-system-entry figure { margin: .75rem 0 0; text-align: center; }
.rating-system-entry img { display: block; width: 100%; max-width: 760px; height: auto; margin: 0 auto; }
.rating-label-key { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .45rem; margin: .5rem 0 .75rem; }
.rating-label-key--two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.rating-label-key > div { display: flex; align-items: baseline; padding: .45rem .6rem; border: 1px solid #eaeef2; border-radius: 6px; background: #fbfcfd; }
.rating-label-key dt { color: var(--rating-key-color, #9a6700); font-weight: 700; }
.rating-label-key dd { margin: 0; }
.rating-label-key dd::before { content: "→"; padding: 0 .4rem; color: #8c959f; }
.markdown-body .rating-systems ol { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .6rem; padding: 0; margin: .5rem 0 0; list-style: none; counter-reset: rating; }
.rating-systems ol li { position: relative; min-width: 0; padding: .7rem .8rem .7rem 2.8rem; border: 1px solid #eaeef2; border-radius: 8px; background: #fbfcfd; counter-increment: rating; }
.rating-systems ol li::before { content: counter(rating); position: absolute; top: .7rem; left: .75rem; width: 1.35rem; line-height: 1.35rem; border-radius: 50%; background: #f8dddc; color: #a83230; font-size: .8rem; font-weight: 700; text-align: center; }
@media (max-width: 650px) {
  .rating-systems-summary-note { display: block; float: none; margin-top: .2rem; }
  .rating-label-key, .rating-label-key--two { grid-template-columns: 1fr; }
  .markdown-body .rating-systems ol { display: grid; grid-auto-flow: row; grid-template-rows: none; grid-template-columns: 1fr; }
}
</style>

<details class="rating-systems" markdown="1">
<summary><span>Rating systems</span><span class="rating-systems-summary-note">6 star scales · 2 comparison methods</span></summary>
<div class="rating-systems-body" markdown="1">

### Star ratings

The labels run from 1 to the maximum for each scale.

<details class="rating-system-entry" markdown="1">
<summary>2 stars</summary>
<div class="rating-system-entry-body" markdown="1">

<dl class="rating-label-key rating-label-key--two" style="--rating-key-color: #61359b;">
  <div><dt>1</dt><dd>Didn’t like it</dd></div>
  <div><dt>2</dt><dd>Liked it</dd></div>
</dl>

<figure><a href="/assets/images/star-ratings/distributions/2-stars.png"><img src="/assets/images/star-ratings/distributions/2-stars.png" width="1007" height="630" loading="lazy" alt="2-star ratings: 123 movies received 1 star and 159 received 2 stars."></a></figure>

</div>
</details>

<details class="rating-system-entry" markdown="1">
<summary>3 stars</summary>
<div class="rating-system-entry-body" markdown="1">

<dl class="rating-label-key" style="--rating-key-color: #2459b8;">
  <div><dt>1</dt><dd>Bad</dd></div>
  <div><dt>2</dt><dd>Meh</dd></div>
  <div><dt>3</dt><dd>Good</dd></div>
</dl>

<figure><a href="/assets/images/star-ratings/distributions/3-stars.png"><img src="/assets/images/star-ratings/distributions/3-stars.png" width="1007" height="630" loading="lazy" alt="3-star ratings: 67 movies received 1 star, 76 received 2, and 139 received 3."></a></figure>

</div>
</details>

<details class="rating-system-entry" markdown="1">
<summary>5 stars</summary>
<div class="rating-system-entry-body" markdown="1">

<dl class="rating-label-key" style="--rating-key-color: #007c9e;">
  <div><dt>1</dt><dd>Strongly dislike</dd></div>
  <div><dt>2</dt><dd>Dislike</dd></div>
  <div><dt>3</dt><dd>Meh</dd></div>
  <div><dt>4</dt><dd>Like</dd></div>
  <div><dt>5</dt><dd>Strongly like</dd></div>
</dl>

<figure><a href="/assets/images/star-ratings/distributions/5-stars.png"><img src="/assets/images/star-ratings/distributions/5-stars.png" width="1007" height="630" loading="lazy" alt="Histogram of 261 five-star-scale ratings, with 4 stars the most common response."></a></figure>

</div>
</details>

<details class="rating-system-entry" markdown="1">
<summary>7 stars</summary>
<div class="rating-system-entry-body" markdown="1">

<dl class="rating-label-key" style="--rating-key-color: #257a3c;">
  <div><dt>1</dt><dd>Strongly dislike</dd></div>
  <div><dt>2</dt><dd>Dislike</dd></div>
  <div><dt>3</dt><dd>Slightly dislike</dd></div>
  <div><dt>4</dt><dd>Meh</dd></div>
  <div><dt>5</dt><dd>Slightly like</dd></div>
  <div><dt>6</dt><dd>Like</dd></div>
  <div><dt>7</dt><dd>Strongly like</dd></div>
</dl>

<figure><a href="/assets/images/star-ratings/distributions/7-stars.png"><img src="/assets/images/star-ratings/distributions/7-stars.png" width="1007" height="630" loading="lazy" alt="Histogram of 280 seven-star-scale ratings, spread across the scale with 6 stars most common."></a></figure>

</div>
</details>

<details class="rating-system-entry" markdown="1">
<summary>9 stars</summary>
<div class="rating-system-entry-body" markdown="1">

<dl class="rating-label-key">
  <div><dt>1</dt><dd>Extremely bad</dd></div>
  <div><dt>2</dt><dd>Quite bad</dd></div>
  <div><dt>3</dt><dd>Moderately bad</dd></div>
  <div><dt>4</dt><dd>Slightly bad</dd></div>
  <div><dt>5</dt><dd>Meh</dd></div>
  <div><dt>6</dt><dd>Slightly good</dd></div>
  <div><dt>7</dt><dd>Moderately good</dd></div>
  <div><dt>8</dt><dd>Quite good</dd></div>
  <div><dt>9</dt><dd>Extremely good</dd></div>
</dl>

<figure><a href="/assets/images/star-ratings/distributions/9-stars.png"><img src="/assets/images/star-ratings/distributions/9-stars.png" width="1007" height="630" loading="lazy" alt="Histogram of 280 nine-star-scale ratings, with 7 stars most common."></a></figure>

</div>
</details>

<details class="rating-system-entry" markdown="1">
<summary>10 stars</summary>
<div class="rating-system-entry-body" markdown="1">

1. **An Abomination:** Shouldn’t exist; I find it repulsive, deeply offensive, and/or a complete waste of time and resources.
2. **Hated It:** Self-explanatory.
3. **Plain Bad:** Glaringly amateur or lazy in all the worst ways. Has bad acting, cheesy visual effects, cringy dialogue, and/or a ridiculous story.
4. **Poor:** Some things are done well in a technical sense, but just not very entertaining.
5. **Meh:** Wasn’t completely bored to tears, but it didn’t exactly captivate me.
6. **Watchable:** Not exactly a ‘good’ movie, but easy to watch and enjoy with the right mindset.
7. **Good:** A solid, well-made movie. It didn’t just hold my attention, it also provided me with a good time.
8. **Great:** Intrigued by and invested in the story. Would recommend to my friends.
9. **Outstanding:** Instant classic.
10. **Riveting:** Absolute cinema.

<figure><a href="/assets/images/star-ratings/distributions/10-stars.png"><img src="/assets/images/star-ratings/distributions/10-stars.png" width="1007" height="630" loading="lazy" alt="Histogram of 196 ten-star-scale ratings, with 7 and 8 stars most common."></a></figure>

</div>
</details>

### Comparison-based ratings

OpenSkill and BT produce continuous rather than discrete scores. Both scales have been standardized to N(0, 1).

<details class="rating-system-entry" markdown="1">
<summary>OpenSkill</summary>
<div class="rating-system-entry-body" markdown="1">

I compared pairs of movies using [OpenSkill](https://openskill.me/en/stable/), which was modeled after Microsoft's TrueSkill system. For each pair, I chose the better movie or declared a tie. After each comparison, the ratings were normalized to have a mean of 50 and a standard deviation of 50/3.

<figure><a href="/assets/images/star-ratings/distributions/openskill-kde.png"><img src="/assets/images/star-ratings/distributions/openskill-kde.png" width="1007" height="630" loading="lazy" alt="KDE of standardized OpenSkill rating means for 282 movies, with two visible peaks."></a></figure>

</div>
</details>

<details class="rating-system-entry" markdown="1">
<summary>Bradley–Terry</summary>
<div class="rating-system-entry-body" markdown="1">

This uses the same comparisons (choosing the better movie or declaring a tie). However, it uses the Bradley–Terry–Davidson model, which differs from the standard BT model by allowing ties.

<figure><a href="/assets/images/star-ratings/distributions/bt-kde.png"><img src="/assets/images/star-ratings/distributions/bt-kde.png" width="1007" height="630" loading="lazy" alt="KDE of standardized BT rating means for 282 movies, with a broad central peak."></a></figure>

</div>
</details>

</div>
</details>

First, let's take a look at the correlations between the rating systems.

<style>
.correlation-tabs { margin: 1.5rem 0; }
.correlation-tabs > input { position: absolute; width: 1px; height: 1px; opacity: 0; clip-path: inset(50%); }
.correlation-tab-labels { display: flex; gap: .25rem; border-bottom: 1px solid #d0d7de; }
.correlation-tab-labels label { padding: .7rem 1rem; border-radius: 8px 8px 0 0; color: #57606a; cursor: pointer; }
.correlation-tab-labels label:hover { background: #f6f8fa; }
#correlation-latent:checked ~ .correlation-tab-labels label[for="correlation-latent"],
#correlation-raw:checked ~ .correlation-tab-labels label[for="correlation-raw"] { background: #f6f8fa; color: #24292f; font-weight: 600; box-shadow: inset 0 -2px #0969da; }
#correlation-latent:focus-visible ~ .correlation-tab-labels label[for="correlation-latent"],
#correlation-raw:focus-visible ~ .correlation-tab-labels label[for="correlation-raw"] { outline: 2px solid #0969da; outline-offset: -2px; }
.correlation-panel { display: none; margin: 0; padding-top: 1rem; }
#correlation-latent:checked ~ .correlation-latent-panel,
#correlation-raw:checked ~ .correlation-raw-panel { display: block; }
.correlation-panel img { display: block; width: 100%; height: auto; }
.correlation-panel figcaption { margin-top: .4rem; color: #57606a; font-size: .9rem; text-align: center; }
</style>

<div class="correlation-tabs" role="group" aria-label="Rating-system correlation matrices">
    <input type="radio" name="correlation-matrix" id="correlation-latent" checked>
    <input type="radio" name="correlation-matrix" id="correlation-raw">
    <div class="correlation-tab-labels">
        <label for="correlation-latent">Latent correlations</label>
        <label for="correlation-raw">Raw correlations</label>
    </div>
    <figure class="correlation-panel correlation-latent-panel">
        <a href="/assets/images/star-ratings/latent-rating-system-correlations.png"><img src="/assets/images/star-ratings/latent-rating-system-correlations.png" alt="Pairwise latent correlations among Openskill, BT, and the six star-rating systems, with 90% credible intervals."></a>
        <figcaption><a href="/assets/images/star-ratings/latent-rating-system-correlations.png">View full-size image</a></figcaption>
    </figure>
    <figure class="correlation-panel correlation-raw-panel">
        <a href="/assets/images/star-ratings/raw-rating-system-correlations.png"><img src="/assets/images/star-ratings/raw-rating-system-correlations.png" alt="Raw Pearson correlations among Openskill, BT, and the six star-rating systems, with 90% bootstrap intervals."></a>
        <figcaption><a href="/assets/images/star-ratings/raw-rating-system-correlations.png">View full-size image</a></figcaption>
    </figure>
</div>

These are some pretty high correlations. In fact, the first principal component accounts for 93% of the variance in the latent correlation matrix. I had previously thought there might be separate method factors for star ratings and comparison-based ratings, but that wasn't borne out by the data[^method]. So it seems there really is only one factor.

Looking at the factor loadings, the weakest loadings (though still quite strong) belong to the comparison-based rating systems.

<figure style="margin: 1.5rem 0; text-align: center;">
    <a href="/assets/images/star-ratings/one-factor-hierarchical-loadings.png"><img src="/assets/images/star-ratings/one-factor-hierarchical-loadings.png" style="width: 100%; height: auto;" alt="Movie Rating Loadings: posterior mean and 90% interval for each rating system's loading on the one-factor movie-quality model."></a>
</figure>

Why is this? I suspect there's simply more noise in the comparison-based ratings. I find it pretty easy to rate movies using stars. Determining whether I liked a movie or not takes practically no effort. Even determining whether a movie is a 7 vs. 8 on a 10-point scale isn't that hard. But comparison-based rating systems require more fine-grained judgments than simply placing movies into one of 10 buckets, and that's harder. Sure, if I'm having a hard time choosing between two movies, I can declare a tie. But looking back, it seems that while sometimes I do declare a tie, other times I pick one movie over the other. This inconsistency introduces noise, weakening the relationship between the ratings and my underlying evaluation of movie quality.

So, star ratings seem to be better than comparison-based ratings, but which star ratings are best? For this, we'll look at the [information functions](https://en.wikipedia.org/wiki/Item_response_theory#Information) for each rating system.

<style>
.rating-information { margin: 1.5rem 0; }
.rating-information figcaption { margin-bottom: .25rem; text-align: center; font-size: 1.1rem; font-weight: 600; }
.rating-information-help { margin: 0 0 .65rem; text-align: center; color: #57606a; font-size: .88rem; }
.rating-information-controls { display: flex; flex-wrap: wrap; justify-content: center; gap: .25rem .65rem; margin: 0 0 .6rem; }
.rating-information-label { display: inline-flex; align-items: center; border: 0; border-bottom: 2px solid transparent; background: transparent; color: #344054; cursor: pointer; font: inherit; font-size: .88rem; padding: .25rem .3rem; }
.rating-information-label:hover, .rating-information-label:focus-visible { color: #111827; }
.rating-information-label[aria-pressed="true"] { border-bottom-color: var(--series-color); color: #111827; font-weight: 700; }
.rating-information-swatch { display: inline-block; width: 1.55rem; margin-right: .4rem; border-top: 3px solid var(--series-color); }
.rating-information-swatch.is-comparison { border-top-style: dashed; }
.rating-information-viewport { width: 100%; }
.rating-information-viewport img { display: block; width: 100%; height: auto; }
.rating-information-svg { display: block; width: 100%; height: auto; }
.rating-information-grid { stroke: #e3e8ed; stroke-width: 1; }
.rating-information-axis, .rating-information-axis-title { fill: #344054; font-size: 13px; }
.rating-information-curve { fill: none; stroke-width: 2.5; transition: opacity .15s, stroke-width .15s; }
.rating-information-curve.is-comparison { stroke-dasharray: 11 6; }
.rating-information-curve.is-selected { stroke-width: 5; opacity: 1; }
.rating-information-curve.is-muted { opacity: .22; }
.rating-information-curve-hit { fill: none; stroke: transparent; stroke-width: 16; cursor: pointer; }
.rating-information-curve-hit:focus { outline: none; }
.rating-information-curve-hit:focus-visible { stroke: #344054; stroke-width: 2; stroke-dasharray: 4 4; }
.rating-information-status { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.markdown-body .rating-mi-table { display: table; width: min(100%, 32rem); margin: 1rem auto 1.5rem; border-collapse: collapse; }
.markdown-body .rating-mi-table tr, .markdown-body .rating-mi-table tr:nth-child(2n) { background: transparent; }
.markdown-body .rating-mi-table th, .markdown-body .rating-mi-table td { border: 0; border-bottom: 1px solid #e3e8ed; padding: .55rem .7rem; }
.rating-mi-table td:last-child { font-variant-numeric: tabular-nums; }
</style>

<figure class="rating-information" data-star-rating-information data-src="/assets/jsons/star-rating-information.json">
    <figcaption>Movie Rating Information Functions</figcaption>
    <p class="rating-information-help">Click curves or labels to highlight and compare them.</p>
    <div class="rating-information-viewport"><a href="/assets/images/star-ratings/rating-system-information-functions.png"><img src="/assets/images/star-ratings/rating-system-information-functions.png" alt="Information functions for six star-rating systems, Openskill, and BT, across latent movie quality."></a></div>
    <span class="rating-information-status" aria-live="polite"></span>
</figure>
<script src="/assets/js/star-rating-information.js" defer></script>

From the chart above, it's obvious that, say, the 5-star rating system mogs the 3-star system, and the 9-star system mogs the 7-star system. But for other comparisons, it's much harder to get a clear answer. For example, compared to the 5-star system, the 7-star system covers a broader range, but within the range where they substantially overlap, the 5-star system provides more information (except around a latent quality of ~0.5). And comparing the 2-star system to the 3-star system, while the 2-star system is much better around ~0.2, once we get farther from that, the 3-star system is better. So, let's use mutual information to summarize how much information we get from each rating system.

| Rating system | Mutual information (bits) |
|:---|---:|
| 2 stars | 0.81 |
| 3 stars | 1.04 |
| 5 stars | 1.51 |
| 7 stars | 1.51 |
| 9 stars | 1.82 |
| 10 stars | 1.75 |
| Openskill | 1.24 |
| BT | 1.53 |
{: .rating-mi-table}

The 9-star system is the best, closely followed by the 10-star system, with the 5-star, 7-star, and BT rating systems in the middle of the pack. It should come as no surprise that the 2-star system performs the worst.

However, I'm unsatisfied with this method of ranking rating systems. Intuitively, it seems that what I really care about is how well a rating system distinguishes between good movies. Ideally, I'm never going to rewatch bad movies or recommend them to others, so why does it matter how well a rating system distinguishes "bad" from "really bad"? What we really care about is how much information rating systems give us about *good* movies. A latent quality of ~0.3 seems to be roughly the threshold for what I'd consider a "good" movie, so let's see how much mutual information each system provides when we restrict our attention to movies with a latent quality of at least 0.3 SD above average.

| Rating system | Conditional mutual information (bits) |
|:---|---:|
| 2 stars | 0.00 |
| 3 stars | 0.04 |
| 5 stars | 0.62 |
| 7 stars | 0.66 |
| 9 stars | 0.86 |
| 10 stars | 0.88 |
| Openskill | 0.60 |
| BT | 0.79 |
{: .rating-mi-table}

The best rating systems are now the 10-star and 9-star systems, followed by BT. In general, it seems that the more stars we have, the better.

Still, Gwern wasn't exactly wrong. It does seem that, for most people, more stars don't necessarily make for better ratings. YouTube famously had a 5-star rating system, which it eventually scrapped in favor of a binary like/dislike system after noticing that the vast majority of ratings were 5 stars, with 1 star a distant second and the other ratings practically nonexistent. Netflix later made a similar switch. Why do I get such different results?

Because I'm built different. And better[^hubris]. I am simply better than everyone else. Except the Japanese.

<figure style="margin: 1.5rem 0; text-align: center;">
    <a href="/assets/images/star-ratings/tweet_2105308691042119947_20261014_221318_via_10015_io.png"><img src="/assets/images/star-ratings/tweet_2105308691042119947_20261014_221318_via_10015_io.png" style="display: block; width: 100%; max-width: 760px; height: auto; margin: 0 auto;" alt="Screenshot of a tweet saying that a 3.7-star review is considered good in Japan because reviewers are unusually critical."></a>
</figure>

The Japanese are, anecdotally, the only people who know how to properly use a 5-star rating system. In fact, they're supposedly so strict with their ratings that you're better off looking for places with 3–4 stars than places with 5; only tourists would be so uncouth as to give something 5 stars. And this seems to work out for them.

So, it seems we could fix rating systems if everyone would just be stricter with their ratings. But [everyone won't just](https://squareallworthy.tumblr.com/post/163790039847/everyone-will-not-just). Rating platforms could adjust for individual users' rating tendencies, but apparently this is considered "lacking in transparency" and "deceptive". We could try comparison-based ratings instead, but they don't seem to have caught on much outside a few niches, like LLM evaluation. Besides, as I've shown, star ratings, when used properly, are better.

In the end, I suppose we get the rating systems we deserve.

<figure style="margin: 1.5rem 0; text-align: center;">
    <a href="/assets/images/star-ratings/two-cinephiles.png"><img src="/assets/images/star-ratings/two-cinephiles.png" style="display: block; width: 100%; max-width: 520px; height: auto; margin: 0 auto;" alt="Meme about two cinephiles: one gives a film three stars for lacking thematic nuance, while the other gives it five stars because it was fun."></a>
</figure>

[^method]: The 2-factor model fits marginally better than the 1-factor model, but the estimated correlation between the star-rating and comparison-based factors is 0.98... so they're effectively the same factor. The significant modification indices for the 1-factor model all suggested negative residual correlations between rating systems, so I didn't make any changes based on them.

[^hubris]: Maybe even better than the gods.
