---
layout: post
title: "Predicting My Movie Ratings"
date: 2026-10-15
permalink: /predicting-movie-ratings/
category: media-taste
related:
  - /simple-recsys/
  - /star-ratings/
  - /earring/
---

<style>
.site-content figure { margin: 1.5rem 0; }
.site-content figure img { display: block; max-width: 100%; height: auto; margin: 0 auto; }
</style>

[Building a simple recommender system](/simple-recsys/) was fun, but I wonder: was it a waste of time? Sure, the real treasure was the skills gained along the way[^irrelevant], but what I mean is: would I have been better off just using an existing movie rating site? And if so, which one?

Let's see.

<figure>
    <a href="/assets/images/predicting-movie-ratings/external-vs-official-fast-correlations.png">
        <img src="/assets/images/predicting-movie-ratings/external-vs-official-fast-correlations.png" width="700" loading="lazy" alt="Correlations between movie-site ratings and my ratings, with 90% bootstrap intervals.">
    </a>
</figure>

The correlations aren't great, but they're not bad either. It's particularly interesting that they're all so close. This makes me wonder: what if there's a latent movie quality factor that each movie site's ratings capture imperfectly? Then, we might expect the correlation between this latent movie quality and [my ratings](/star-ratings/) to be higher, since the latent factor would be less contaminated by 'noise'. But, alas:

<figure>
    <a href="/assets/images/predicting-movie-ratings/external-factor-vs-my-ratings.png">
        <img src="/assets/images/predicting-movie-ratings/external-factor-vs-my-ratings.png" width="700" loading="lazy" alt="Movie-site ratings and their consensus factor correlated with my ratings, with 90% bootstrap intervals.">
    </a>
</figure>

I suppose this shouldn't be a surprise. A look at the [factor structure](#factor-structure-of-movie-site-ratings) tells you that the movie-site ratings are very unidimensional (with all loadings >0.8), so there's not much to be gained by extracting a latent factor. The consensus factor correlates with my ratings at 0.49, barely different from the individual sites.

Still, we need to compare this with the predictions from my own predictors.

<figure>
    <a href="/assets/images/predicting-movie-ratings/external-factor-and-elastic-net-vs-my-ratings.png">
        <img src="/assets/images/predicting-movie-ratings/external-factor-and-elastic-net-vs-my-ratings.png" width="700" loading="lazy" alt="Elastic-net predictions, movie-site ratings, and the consensus factor compared with my ratings.">
    </a>
</figure>

Using [elastic net](https://scikit-learn.org/stable/modules/linear_model.html#elastic-net) on the embeddings[^embeddings] I created performs better (r = 0.58), and using all the z-scored tags performs best (r = 0.65). So, it seems I haven't wasted my time. I can get better personalized predictions than I'd get from movie-site ratings alone.

But how good can they get? We should expect a predictor's accuracy to increase with the number of movies in the training set, so let's see how that goes:

<figure>
    <a href="/assets/images/predicting-movie-ratings/elastic-net-set-size-with-consensus.png">
        <img src="/assets/images/predicting-movie-ratings/elastic-net-set-size-with-consensus.png" width="700" loading="lazy" alt="Elastic-net predictive correlation by training-set size, with a fitted trend and movie-site consensus benchmark.">
    </a>
</figure>

The correlation between the elastic-net predictor's predictions and my ratings seems to increase by ~0.11 with every doubling of the training-set size. It also seems to overtake the movie-site consensus factor at around ~100 movies (give or take 10). So, I guess if you've rated fewer than 100 movies, you might be better off just using movie-site ratings to pick your movies, whereas if you've rated more, you can build a personalized predictor that performs better.

However, there's a problem with this model: it predicts that we'll get perfect predictions (r = 1) once I've rated roughly 3,000 movies. Sure, that *is* a lot of movies, but even still, perfect prediction? That's just too much to expect. And yeah, there's the problem that a linear fit to this data is eventually going to give bad predictions because its outputs are unbounded, while correlations are restricted to [-1, 1] (and given our problem, we shouldn't really expect *negative* correlations). But still, one has to wonder: what's the practical limit?

Tailcalled has a post about [playing around with "gendermetricity"](https://surveyanon.wordpress.com/2019/07/22/playing-around-with-gendermetricity/), a measure of how much variance in an outcome can, in theory, be explained by a set of masculinity/femininity-related variables. The underlying idea, also used in [morphometricity](https://www.pnas.org/doi/10.1073/pnas.1604378113), is more general: given some measure of similarity between observations, we can estimate how much of the variance in an outcome is associated with that similarity.

In our case, we can use the similarity between movies' [MovieLens genome tags](https://grouplens.org/datasets/movielens/25m/) to estimate how much of the variance in my ratings is attributable to tag-related differences. Let's call this *tagmetricity*. Taking its square root puts it on a correlation-equivalent scale, giving us a rough estimate of how well we could expect to predict my ratings from tags, even with ~infinite training data.

Since I'm using elastic net on z-scored tags, the most relevant similarity measure is the standardized linear kernel. But I've included [other kernels](#explanation-of-similarity-kernels) too, so we can see the limits of different prediction methods:

<figure>
    <a href="/assets/images/predicting-movie-ratings/tagmetricity.png">
        <img src="/assets/images/predicting-movie-ratings/tagmetricity.png" width="700" loading="lazy" alt="Tagmetricity estimates on a correlation-equivalent scale for several movie-similarity kernels.">
    </a>
</figure>

So, the standardized linear kernel gives us an estimate of ~0.72, suggesting that we shouldn't expect elastic net to get much above that. Other kernels give estimates as high as ~0.78, suggesting there might be somewhat more predictive information available if we use a different prediction method.

Here's what that looks like compared to the predictors we've got so far:

<figure>
    <a href="/assets/images/predicting-movie-ratings/external-factor-and-elastic-net-vs-my-ratings-with-tagmetricity.png">
        <img src="/assets/images/predicting-movie-ratings/external-factor-and-elastic-net-vs-my-ratings-with-tagmetricity.png" width="700" loading="lazy" alt="Elastic-net and external-rating correlations compared with standardized-linear tagmetricity.">
    </a>
</figure>

So, it looks like we've already squeezed out most of the predictiveness that we can reasonably expect from a linear model using these tags.

I'd be remiss if I didn't mention AI. Can AI predict how much I'll like a movie? How does its predictive ability depend on the model and reasoning effort? Let's see:

<figure>
    <a href="/assets/images/predicting-movie-ratings/ai-vs-my-ratings.png">
        <img src="/assets/images/predicting-movie-ratings/ai-vs-my-ratings.png" width="700" loading="lazy" alt="Correlations between GPT-6 model predictions and my ratings, grouped by model and reasoning effort.">
    </a>
</figure>

AI is much better at predicting my movie ratings than all the other methods we've looked at. But other than Sol and Astra being better than Luna, and Luna with reasoning effort being better than Luna without reasoning effort, it doesn't seem like anything else matters much; increasing reasoning effort beyond low doesn't seem to improve performance. Perhaps [deep learning has hit a wall](https://nautil.us/deep-learning-is-hitting-a-wall-238440). Anyway, here are all the results together:

<figure>
    <a href="/assets/images/predicting-movie-ratings/external-factor-and-elastic-net-vs-my-ratings-with-tagmetricity-and-astra-high.png">
        <img src="/assets/images/predicting-movie-ratings/external-factor-and-elastic-net-vs-my-ratings-with-tagmetricity-and-astra-high.png" width="700" loading="lazy" alt="GPT-6 Astra high, elastic-net, and external-rating correlations compared with standardized-linear tagmetricity.">
    </a>
</figure>

The best-performing OpenAI model is right at the level implied by tagmetricity. It wouldn't be out of the question for it to exceed that level, since it has more information available to it than just tags. Though I suspect further improvements will be modest, given how little performance seems to vary between the better models or across reasoning-effort levels.

So, was trying to predict which movies I'll like a waste of time? Yes.

Though elastic net is better than using movie-site ratings, it's roughly matched by the cheapest model I checked (GPT-6 Luna) and beaten by even GPT-6.1 Sol on low reasoning effort. And while I expect AI's performance to also depend on how many movies I've rated, there's no particular reason to expect it to be worse than elastic net at an equivalent training-set size. In fact, we should expect it to perform pretty well even with little information about my preferences. After all, it can draw on movie-site ratings, which are already moderately correlated with my preferences, so it should have a decent predictive baseline even before learning much about my tastes.

I suspect this pattern generalizes to other domains. At this point, I really see no reason not to let AI decide what media I consume[^principal]. After all, its judgment is superhuman, if not now, then soon. Perhaps it's time to consider [surrendering the rest of my free will to the AIs](/earring/).

## Appendix

### Factor Structure of Movie Site Ratings

As previously mentioned, movie-site ratings are strongly unidimensional. With nine movie-site rating measures, the first factor explains 85% of the variance. So, what does the factor structure look like, and what are the factor loadings?

<figure>
    <a href="/assets/images/predicting-movie-ratings/one-factor-structure.png">
        <img src="/assets/images/predicting-movie-ratings/one-factor-structure.png" width="700" loading="lazy" alt="One-factor structure of movie-site ratings, with nine loadings and residual correlations for the two critic scores and for Letterboxd and MUBI.">
    </a>
</figure>

Overall, high loadings all around. Though I did have to allow for some residual correlations between Letterboxd and MUBI, and between the Rotten Tomatoes and Metacritic critic ratings, which got me thinking. Letterboxd and MUBI are both targeted towards ~~movie snobs~~ cinephiles. And the Rotten Tomatoes and Metacritic critic ratings are both, well, critic ratings. So, what if we model the ratings using three correlated factors: a popular consensus factor, a cinephile consensus factor, and a critic consensus factor?

<figure>
    <a href="/assets/images/predicting-movie-ratings/three-factor-structure.png">
        <img src="/assets/images/predicting-movie-ratings/three-factor-structure.png" width="700" loading="lazy" alt="Three-factor structure of movie-site ratings, showing popular, cinephile, and critic factors, their loadings, and their correlations.">
    </a>
</figure>

This model fits better than the one-factor model, but only by the teensiest of margins. That said, let's see which of these factors predicts my ratings best.

<figure>
    <a href="/assets/images/predicting-movie-ratings/external-three-factors-vs-my-ratings.png">
        <img src="/assets/images/predicting-movie-ratings/external-three-factors-vs-my-ratings.png" width="700" loading="lazy" alt="Correlations of the popular, critic, and cinephile factors and individual movie-site ratings with my ratings, with 90% bootstrap intervals.">
    </a>
</figure>

They all have pretty much the same performance. This makes sense, seeing as the factors are all very highly correlated with each other. But perhaps some of them contain predictive information that the others don't? What if we throw all three into a linear regression?

Well, for reasons[^bifactor], I decided to use a bifactor model instead, separating the general movie-consensus factor from the variation specific to popular audiences, cinephiles, and critics. This lets us see whether any of these groups' preferences predict my ratings above and beyond the general consensus.

<figure>
    <a href="/assets/images/predicting-movie-ratings/bifactor-ols-coefficients.png">
        <img src="/assets/images/predicting-movie-ratings/bifactor-ols-coefficients.png" width="700" loading="lazy" alt="Standardized OLS coefficients for the general movie-consensus factor and the popular-, critic-, and cinephile-specific factors, with 90% confidence intervals.">
    </a>
</figure>

Alas, that didn't help either. I like movies that everyone else likes, and it doesn't seem to matter much how you define 'everyone else'.

### Explanation of Similarity Kernels

Each of the kernels is a different way of measuring how similar two movies are, using the 1,128 MovieLens tags. For each one, I center the similarity matrix and rescale it so the average diagonal is 1. Then, I use tagmetricity to estimate how much of the variance in my ratings can be explained by that particular notion of similarity.

The formulas below are for the similarity of movies $i$ and $j$ *before* that final centering and rescaling. Let $x_i$ be a movie's raw tag vector, $z_i$ its tag-by-tag z-scored vector, and $p=1128$ the number of tags.

- **Standardized linear:** Z-score each tag, then take the dot product of the movies' tag vectors: $K_{ij}^{(0)}=z_i^\top z_j/p$. This is the most relevant kernel for elastic net, since that's also trained on z-scored tags.
- **Raw linear:** Same as above, except we don't z-score the tags: $K_{ij}^{(0)}=x_i^\top x_j/p$.
- **Cosine:** Z-score the tags, then normalize each movie's tag vector to have length 1: $K_{ij}^{(0)}=z_i^\top z_j/(\lVert z_i\rVert\lVert z_j\rVert)$.
- **Gaussian:** Instead of using dot products, we look at the distance between movies in the z-scored tag space: $K_{ij}^{(0)}=\exp\left(-\lVert z_i-z_j\rVert^2/(2\ell^2)\right)$, where $\ell$ is the median pairwise distance.
- **Mahalanobis:** Similar to standardized linear, except we also account for the correlations between tags: $K_{ij}^{(0)}=z_i^\top\Sigma^{-1}z_j/p$, where $\Sigma$ is the shrinkage-estimated tag covariance matrix. 
- **Quadratic:** Take the standardized dot product, add 1, and square it: $K_{ij}^{(0)}=(1+z_i^\top z_j/p)^2$.

### Tag-metric Correlations

<figure>
    <a href="/assets/images/predicting-movie-ratings/tag-metric-correlations.png">
        <img src="/assets/images/predicting-movie-ratings/tag-metric-correlations.png" width="700" loading="lazy" alt="Correlation matrix for the tag-associated components of my ratings, movie-site consensus, and individual movie-site ratings.">
    </a>
</figure>

[^irrelevant]: Though increasingly irrelevant in this age of abundant intelligence.

[^embeddings]: Embeddings with 115 dimensions, created by performing factor analysis with varimax rotation on 1,128 z-scored tags.

[^bifactor]: Initially, I wanted to use a hierarchical factor model, extracting the general consensus factor and the residuals of the popular, cinephile, and critic factors. However, extracting scores for those residuals turned out to be less straightforward than I'd expected, so I used a bifactor model instead, which estimates the general and group-specific factors directly.

[^principal]: Well, besides the obvious [principal-agent problems](https://en.wikipedia.org/wiki/Principal%E2%80%93agent_problem).
