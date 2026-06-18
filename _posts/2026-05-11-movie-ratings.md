---
layout: post
title: "Evaluating My Movie Recommendation System"
date: 2026-05-11
permalink: /movie-ratings/
categories: 
section: media-analysis
favorite: true
---

I [built a movie recommendation system](https://stanichor.net/simple-recsys/). I'd like to know things about it. What do my ratings look like? How accurate is the recsys? How accurate could it be? How does it compare to external rating sites? Are newer movies better or worse for me? Let’s see.

## What My Ratings Look Like

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/movie-ratings/rating-kde.png" width="500" alt="Kernel density plot of my movie ratings.">
    </figure>
</div>

By design, my movie ratings have a mean of 50 and a standard deviation of $50/3 \approx 16.6$. Weirdly, the distribution seems to be trimodal. I’m not sure why this is. Maybe I instinctively sort movies into “good”, “mid”, and “terrible”.

There are two negative outliers: *Trash Humpers* (2009) and *Metropia* (2009). They were so bad that, to be honest, I didn’t watch more than a couple of minutes. I didn’t watch them expecting them to be good; I just wanted to see whether my recsys was accurate on the lower end in addition to the upper end. My verdict: it was.

## How Much Data Does the Recsys Need?

So, how accurate is the recsys?

It doesn’t seem to matter very much which prediction model I use. I’ve tried ridge regression, elastic net, Bayesian linear regression, ridge regression with interactions, and Gaussian processes; the cross-validated correlations between predicted and actual ratings usually end up between 0.60 and 0.65.

One obvious thing accuracy should depend on is how many movies are in the training set. The more movies I watch and rate, the more data the recsys has to learn my preferences. So, what does that relationship look like? Is there a ceiling?

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/movie-ratings/correlation_by_set_size.png" width="500" alt="Prediction accuracy by number of movies in the training set, with the x-axis on a log scale.">
    </figure>
</div>

The relationship looks fairly linear on a log scale over the observed range, though I haven’t actually fit the trend directly (and, surely, it must start to level off at some point, due to irreducible noise in my ratings, limitations in the embeddings, and the fact that the correlation is bounded above at 1)[^accuracy-method]. If we look at the graphs (in the Appendix) for the mean absolute error and RMSE by training set size, they also look pretty linear[^accuracy]. Anyway, the curve is somewhat noisy, but the overall pattern is clear: very roughly, I’d need to double the number of movies I’ve rated to increase the correlation by about 0.10, which is a lot of movies to watch. Still, reasonable accuracy seems pretty easy to achieve if someone else wishes to build a similar system: a correlation of about 0.5 is reached by around 50 movies.

## Optimizing the Embeddings

Since the recsys uses PCA to reduce the dimensionality of the movie embeddings, I also need to choose how many dimensions to keep.

Too few, and there isn’t enough information left to make accurate predictions. Too many, and the model can overfit. There are also preprocessing choices: should I apply a Box-Cox transformation to the original embedding features before PCA, to make them closer to normally distributed? Should the resulting embeddings be standardized, so each dimension has mean 0 and standard deviation 1, or normalized, so each movie vector has length 1?

I tested several combinations. The broad result is that most preprocessing choices do not change the eventual performance ceiling very much: most methods plateau at correlations around 0.60 to 0.65. The exception is standardization, which produces an early optimum around 40 dimensions: performance improves at first, then declines noticeably until roughly 400 dimensions, before eventually starting to rise again.

### Normalized embeddings

<div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center;">
    <figure style="text-align: center;">
        <img src="/assets/images/movie-ratings/normalized_embedding_size.png" width="400" alt="Prediction accuracy by embedding size using normalized embeddings.">
        <figcaption>Normalized embeddings</figcaption>
    </figure>
    <figure style="text-align: center;">
        <img src="/assets/images/movie-ratings/normalized_embedding_size_with_interactions.png" width="400" alt="Prediction accuracy by embedding size using normalized embeddings with interaction terms.">
        <figcaption>Normalized embeddings with interactions</figcaption>
    </figure>
</div>

### Box-Cox normalized embeddings

<div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center;">
    <figure style="text-align: center;">
        <img src="/assets/images/movie-ratings/boxcox_normalized_embedding_size.png" width="400" alt="Prediction accuracy by embedding size using Box-Cox normalized embeddings.">
        <figcaption>Box-Cox normalized embeddings</figcaption>
    </figure>
    <figure style="text-align: center;">
        <img src="/assets/images/movie-ratings/boxcox_normalized_embedding_size_with_interactions.png" width="400" alt="Prediction accuracy by embedding size using Box-Cox normalized embeddings with interaction terms.">
        <figcaption>Box-Cox normalized embeddings with interactions</figcaption>
    </figure>
</div>

### Standardized embeddings

<div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center;">
    <figure style="text-align: center;">
        <img src="/assets/images/movie-ratings/standardized_embedding_size.png" width="400" alt="Prediction accuracy by embedding size using standardized embeddings.">
        <figcaption>Standardized embeddings</figcaption>
    </figure>
    <figure style="text-align: center;">
        <img src="/assets/images/movie-ratings/boxcox_standardized_embedding_size.png" width="400" alt="Prediction accuracy by embedding size using Box-Cox standardized embeddings.">
        <figcaption>Box-Cox standardized embeddings</figcaption>
    </figure>
</div>

Overall, it seems the exact embedding construction is not the main constraint. Beyond a certain point, prediction accuracy seems mostly limited by the amount of rating data, irreducible noise in my ratings, and possibly information missing from the embedding space itself.

## External Rating Sites as Predictors

The recsys is moderately predictive of how much I’ll like a movie, but it has one major limitation: it only works for movies in the dataset. Sometimes I might want to watch a movie that just came out, but only if I know I’ll probably enjoy it. So how well do external movie-rating sites, such as Rotten Tomatoes, predict my ratings?

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/movie-ratings/external-correlations.png" width="900" alt="Correlations between my movie ratings and ratings from external movie rating sites.">
    </figure>
</div>

All the external raters have fairly similar predictive accuracy, with correlations ranging from about 0.45 to 0.50.[^pallesen] TMDb users perform best (r=0.48), though only slightly better than the others.

How well do they work together?

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/movie-ratings/multiplatform-prediction.png" width="500" alt="Prediction of my movie ratings using ratings from multiple external platforms.">
    </figure>
</div>

The combined correlation of 0.49 is technically higher than any individual site, though only slightly higher than the best individual predictor (TMDb users: $r = 0.48$). However, this comparison is somewhat misleading, since the individual platform correlations above are in-sample correlations with my ratings, whereas the combined prediction is evaluated out-of-sample. If we compare out-of-sample performance instead, the combined model performs similarly to the best individual platform ($r = 0.45$), while the individual platforms get IMDb: $r = 0.42$; Rotten Tomatoes: $r = 0.42$; Metacritic: $r = 0.41$; and TMDb users: $r = 0.47$. That said, the confidence intervals overlap substantially, so I wouldn’t put much weight on the apparent differences.

Of course, I’d be remiss if I didn’t consider the possibility that there’s some latent trait of “general movie quality” or “public/critical regard” that each site measures imperfectly. Instead of treating the platforms as separate predictors, another approach is to treat them as noisy measures of a shared latent factor. So how well do the latent scores predict my ratings? I extracted a one-factor model from the standardized platform ratings and used the resulting factor scores as predictors.

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/movie-ratings/latent-factor.png" width="500" alt="Relationship between latent external-rating factor scores and my movie ratings.">
    </figure>
</div>

The latent factor predicts my ratings about as well as the best individual platform in-sample, though it performs worse out-of-sample ($r = 0.42$).

Also, here are the loadings:

| Platform                  | Loading |
| ------------------------- | ------: |
| IMDb                      |  +0.97 |
| TMDb - Users              |  +0.94 |
| Rotten Tomatoes - Critics |  +0.84 |
| Metacritic                |  +0.84 |

The user-rating platforms load more strongly on the common factor than the critic-rating platforms, which suggests that this one-factor solution is weighted somewhat more toward public reception than pure critical reception.

## Do Genres Help? (No)

Of course, there’s the problem of genres. Perhaps external ratings have biases for or against different genres that I don’t share. I’ll want to control for genres and see if that improves things. So, what does the multiplatform prediction look like if we add genre information?

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/movie-ratings/platforms-plus-genres.png" width="500">
    </figure>
</div>

Adding genre information[^genre] did not produce evidence of improved performance. The multiplatform model had $r = 0.45$, 95% CI $[0.33, 0.55]$; with genres added, it fell to $r = 0.40$, 95% CI $[0.27, 0.51]$. Since the intervals overlap substantially, I wouldn’t put much weight on the apparent decline, but there’s no evidence here that adding broad genre information helps. The same thing happens if genre information is added to the latent-factor model:

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/movie-ratings/latent-factor-plus-genres.png" width="500">
    </figure>
</div>

## Are Movies Getting Better or Worse?

Are movies getting better or worse over time? I don’t know. [Other people](https://emilkirkegaard.dk/en/2024/03/should-you-watch-that-recent-movie/) have looked into this, but the answer is mostly irrelevant for my purposes. I don’t care whether other people like recent movies more or less. I care whether *I* like recent movies more or less.

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/movie-ratings/predicted-ratings-by-year.png" width="500" alt="Predicted movie ratings by release year.">
    </figure>
</div>

I graph predicted ratings by year instead of actual ratings by year to reduce selection bias in which movies I actually watch. For example, most of the old movies I’ve watched have been with friends who have good taste in movies, so they’re selected to be among the better old movies. Conversely, many recent movies are movies I watched when I was young and had little control over what I watched, or when I had nothing better to do. Those movies might have been popular, but that doesn’t mean they were good.

That said, this doesn’t eliminate selection bias entirely, since the model is still trained on the movies I chose to watch. If I’ve mostly watched unusually good old movies, then the model may learn that old-movie-associated features predict high ratings, even if the average old movie would not actually be unusually good for me.

Overall, release year doesn’t seem to matter much. The dip in the very early 1900s is probably due to me watching *Arrival of a Train*, a very early film that isn’t that interesting. It is, literally, just a train arriving at a station.

## Star Ratings

So, the rating predictions can tell me what movies I should watch next. But they don’t tell me what movies I should rewatch. After all, if I already know I like a movie, and I’ve forgotten most of it, why not go with a sure thing and give it a rewatch?

One way to approach rewatching is to always rewatch the movie I’ve ranked highest. But that will probably get boring [after the first couple hundred times](https://www.theguardian.com/film/2023/feb/01/i-watched-groundhog-day-every-day-for-a-year-heres-what-i-learned). Enjoyment of a movie probably undergoes some decay immediately after watching it and then slowly recovers over time. But I don’t know how much enjoyment decays or how quickly it regenerates.

To address this, I need to rate instances of watching a movie rather than the movies themselves. My first thought was to do this the way I usually rate movies: by comparison. But this doesn’t quite feel right. It’s a known problem that ratings are affected by how well we remember something, and our memories get worse the farther we are from the event in question.

When it comes to the movies themselves, I don’t think this is a major problem, at least for me. While I might not accurately remember the experience of watching a movie, I usually remember the fact of how much I liked it. And if I don’t, that’s just evidence that the movie was mediocre. But I don’t think this works nearly as well for specific instances of rewatching a movie. I don’t think I can accurately compare the ninth viewing of a movie from six months ago to the second viewing of a movie from seven years ago.

So, for practical reasons, I think I’ll have to try star ratings. While star ratings have their own problems, they have the advantage that I can record them immediately after a viewing, rather than relying on my memory months or years later. Before I start collecting ratings of individual viewings, though, it seems worth figuring out which star-rating system works best for me.

The main problem with star ratings is that ratings end up compressed, such that, for example, [5/5 stars equates to excellence, 4/5 stars equates to mediocrity, and anything else is terrible](https://xkcd.com/1098/). Back when YouTube still had a 5-star rating system, the vast majority of videos received 5 stars, with ratings of 1 star a distant second and the other ratings practically nonexistent. This led them to switch to a binary like/dislike rating system, a move that has since been echoed by other companies such as Netflix.

But perhaps this is a skill issue. Maybe I’m different. And better.[^hubris]

The first issue is deciding how many stars to use. Too few stars and we lose information. Too many and ratings may be heavily affected by noise despite their (false) precision. Odd-numbered scales have a midpoint, while even-numbered scales force a lean either positive or negative.

To determine this, I rated the movies I’ve seen using various star-rating systems: 2-star[^2-star], 3-star[^3-star], 5-star[^5-star], 7-star[^7-star], 9-star[^9-star], and 10-star[^10-star]. The histograms for each rating system are shown below.

<details>
  <summary>2 stars</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/movie-ratings/histograms/2-star.png" width="1000">
        </figure>
    </div>
</details>

<details>
  <summary>3 stars</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/movie-ratings/histograms/3-star.png" width="1000">
        </figure>
    </div>
</details>

<details>
  <summary>5 stars</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/movie-ratings/histograms/5-star.png" width="1000">
        </figure>
    </div>
</details>

<details>
  <summary>7 stars</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/movie-ratings/histograms/7-star.png" width="1000">
        </figure>
    </div>
</details>

<details>
  <summary>9 stars</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/movie-ratings/histograms/9-star.png" width="1000">
        </figure>
    </div>
</details>

<details>
  <summary>10 stars</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/movie-ratings/histograms/10-star.png" width="1000">
        </figure>
    </div>
</details>

It seems like I don't suffer too badly from the bunching-up problem that often causes star-rating systems to lose much of their effective resolution. While I tend to like the movies I watch, the ratings are fairly spread out rather than concentrated at the top end of the scale. I do seem to have a tendency to rate movies 7 stars on the 9-star system, and I rarely give the maximum rating on the 7-, 9-, and 10-star systems, but overall the distributions look much healthier than the horror stories about star-rating systems would lead you to expect.

Now let’s see how well the star ratings correlate with each other, as well as how well they correlate with my Resorter ratings.

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/movie-ratings/raw-rating-system-correlations.png" width="1000">
    </figure>
</div>

The correlations are pretty high! 

However, these are correlations between the observed ratings, not necessarily between the underlying judgments that produced them. Since the star-rating systems force me to place movies into a limited number of categories, some information is inevitably lost. This process of discretization tends to attenuate correlations (that is, it makes them weaker). To address this, we can estimate the correlations that would exist if the observed ratings arose from discretizing underlying continuous judgments. These are known as [polychoric correlations](https://en.wikipedia.org/wiki/Polychoric_correlation).

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/movie-ratings/latent-rating-system-correlations.png" width="1000">
    </figure>
</div>

Most of the differences between the rating systems disappear once discretization is accounted for. The difference between the two correlation matrices is difficult to see because all the correlations are so high, so let’s instead look at a matrix showing the difference between them:

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/movie-ratings/correlation-residuals.png" width="1000">
    </figure>
</div>

It's important to note, however, that the polychoric correlations are best thought of as estimates of the correlations between the underlying continuous judgments that, under the model, gave rise to the observed ratings. The raw correlations remain lower because discretization necessarily loses information. Looking at the raw correlations with the Resorter ratings, they appear to plateau around the 5-star system, suggesting that 5 stars might be “good enough.”

While the polychoric correlations tell us that the rating systems are very similar, they do not tell us whether they are measuring the same underlying thing. To investigate that, I fit a simple factor model.

Looking at the latent correlations, the star-rating systems are all much more correlated with each other than they are with the Resorter ratings. This is probably because the star-rating systems are all variations on the same method, while the Resorter ratings come from a different method.

One way to think about this is that when I'm assigning star ratings, I'm first forming a general "how good is this movie?" judgment and only then mapping that judgment onto a particular rating scale. If that's true, then the different star-rating systems are not really independent measurements of movie enjoyment; they're different discretizations of the same underlying star-rating judgment.

To model this, I assumed there was a latent movie-enjoyment factor. The Resorter rating loads directly on this factor, while the star-rating systems are mediated through a latent star-rating judgment factor. In other words, the star ratings are not treated as independent measurements of enjoyment; they are treated as different discretizations of a shared star-rating judgment, which is itself explained by underlying movie enjoyment. 

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/movie-ratings/mermaid-diagram.png" width="1000">
    </figure>
</div>

Under this model, the correlation[^model-issues] between the star-rating factor and the Resorter ratings is 0.94. The loadings are as follows:

- 2-star rating: 0.97
- 3-star rating: 0.96
- 5-star rating: 0.96
- 7-star rating: 0.94
- 9-star rating: 0.96
- 10-star rating: 0.95

The loadings are all quite similar, ranging from 0.94 to 0.97. Since they do not appear to differ much in practice, we might suppose that the loadings are in fact equal, or at least close enough for practical purposes. If so, this would suggest that none of the star-rating systems is substantially more faithful to the underlying star-rating judgment than any other. Sure enough, the model with equal star-rating loadings fits better despite having fewer parameters[^model-fit].

The correlation between the star-rating factor and the Resorter ratings remains 0.94, and the common loading of the star-rating systems on their factor is 0.95.

So far we've established that the rating systems are measuring roughly the same underlying judgment. For example, a 10-star system can do a better job distinguishing between good movies because it allows finer distinctions: I can label one movie a 9 and another a 10, whereas under the 2-star system both would simply receive 2/2 stars. However, having more categories does not automatically mean more information; additional categories only help if they are used reliably.

In [Item Response Theory](https://en.wikipedia.org/wiki/Item_response_theory), [information](https://en.wikipedia.org/wiki/Item_response_theory#Information) is defined as the reciprocal of the squared [standard error of estimation](https://en.wikipedia.org/wiki/Standard_error). As such, higher information corresponds to more precise measurement. Graphing the information for each system gives the following:

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/movie-ratings/item-iics.png" width="1000">
    </figure>
</div>

The 2-star ratings, predictably, provide the least information, and only over a fairly narrow range of movie quality (near the boundary between "liked" and "disliked"). So, for example, if I want to distinguish a 70th-percentile movie from a 95th-percentile movie, using 2-star ratings is an obviously bad choice, while 7-star ratings is a better choice. This matters because the rewatching problem is not primarily about distinguishing movies I like from movies I dislike; it is about distinguishing among movies I already know I like.

What's interesting is that most of the gain in information appears to plateau around the 7-star system. We no longer see large increases in either information or range. So one might conclude that, for me, a 7-star rating system is "good enough": it seems to capture most of the information gained by adding additional categories, without requiring finer distinctions that may not be used reliably. 

## Things I Still Want to Know

It's nice to see that the recsys works. Though, to make it work better, I'd have to watch *a lot* more movies, which is unfortunate. The external movie raters aren't as good, but serviceable enough for recent movies. Anyway, I have more questions that I may eventually answer someday:
- It seems all the regression methods have roughly the same level of predictiveness. But perhaps I just haven't looked hard enough? Maybe I need to use neural networks? Or a GP using ARD? Or something else?
- What is the maximum amount of rating-relevant information it's possible to capture from the embeddings in principle?
- What's the decay rate of movie enjoyment? It doesn’t make sense to compare movie instances (while it does make sense to compare movies), so I’d have to figure out the best number of Likert scale items to use.
- If I used more external rating sites, would there still be a single factor? Or would there be two very correlated factors associated with critics vs the public?

## Appendix

### Other Measures of Accuracy vs Training Set Size

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/movie-ratings/mad_by_set_size.png" width="500">
    </figure>
</div>

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/movie-ratings/rmse_by_set_size.png" width="500">
    </figure>
</div>


[^pallesen]: Jonatan Pallesen has also [compared his movie ratings against external movie sources](https://x.com/jonatanpallesen/status/2035264976110116889) and found that the correlations differ by a lot (Rotten Tomatoes - Audience: r = 0.24; Rotten Tomatoes - Critics: r = 0.36; IMDb: r = 0.45; criticker.com PSI: r = 0.69). I don't know why his correlations are so heterogenous. Also, perhaps I should try Criticker.

[^accuracy-method]: So, how did I do this? For each set size, for each movie, I got a random set of movies (excluding the chosen movie), fit a regression to those movies and ratings, predicted the rating of the chosen movie, then calculated the accuracy statistics. 

[^genre]: I encoded genres as broad, multi-hot indicators, so a movie could belong to multiple genres.

[^accuracy]: This is interesting, since these are different accuracy metrics on different scales, yet they show roughly the same pattern.

[^hubris]: Maybe even better than the gods.

[^2-star]: 1 = Didn’t like it, 2 = Liked it

[^3-star]: 1 = Bad, 2 = Meh, 3 = Good

[^5-star]: 1 = Strongly dislike, 2 = Dislike, 3 = Meh, 4 = Like, 5 = Strongly like

[^7-star]: 1 = Strongly dislike, 2 = Dislike, 3 = Slightly dislike, 4 = Meh, 5 = Slightly like, 6 = Like, 7 = Strongly like

[^9-star]: 1 = Extremely bad, 2 = Quite bad, 3 = Moderately bad, 4 = Slightly bad, 5 = Meh, 6 = Slightly good, 7 = Moderately good, 8 = Quite good, 9 = Extremely good

[^10-star]: 1 = An Abomination (Shouldn’t exist; I find it repulsive, deeply offensive, and/or a complete waste of  time and resources)<br>
    2 = Hated It (Self-explanatory)<br>
    3 = Plain Bad (Glaringly amateur or lazy in all the worst ways. Has bad acting, cheesy visual effects, cringy dialogue, and/or a ridiculous story)<br>
    4 = Poor (Some things are done well in a technical sense, but just not very entertaining)<br>
    5 = Meh (Wasn’t completely bored to tears, but it didn’t exactly captivate me)<br>
    6 = Watchable (Not exactly a ‘good’ movie, but easy to watch and enjoy with the right mindset)<br>
    7 = Good (A solid, well-made movie. It didn’t just hold my attention, it also provided me with a good time.)<br>
    8 = Great (Intrigued by and invested in the story. Would recommend to my friends.)<br>
    9 = Outstanding (Instant classic.)<br>
    10 = Riveting (Absolute cinema.)

[^model-issues]: Since the model contains only two indicators of the latent enjoyment factor (the Resorter ratings and the star-rating factor), the individual loadings cannot be uniquely determined. For example, a model in which both indicators load at $\lambda$ fits the data just as well as one in which the loadings are $\lambda^2$ and 1. To identify the model, I constrained the two loadings to be equal. Under this constraint, the correlation between the Resorter ratings and the star-rating factor is simply the product of the two loadings. Thus, the reported correlation of 0.94 corresponds to loadings of about 0.97 from movie enjoyment onto each.

[^model-fit]: More specifically, the equal-loading model achieved a slightly better WAIC than the model with separate loadings for each star-rating system. This suggests that any real differences between the loadings are too small to justify estimating them separately. The improvement is modest, but it goes in the direction one would expect if the loadings are in fact approximately equal.