---
layout: post
title: "Building a Simple Recommendation System"
date: 2025-06-24
permalink: /simple-recsys/
categories: 
---

There's more art available now than ever before. In 2010, Google Books estimated that there were around [130 million published books](https://booksearch.blogspot.com/2010/08/books-of-world-stand-up-and-be-counted.html). As of March 2022, [IMDb's databases contained 605,284 movies and 222,655 TV series](https://web.archive.org/web/20220429162254/https://www.imdb.com/pressroom/stats/). As of January 2020, [MyAnimeList tracked 23,744 anime and 62,056 manga](https://myanimelist.net/forum/?topicid=2068385). 

The sheer volume makes it hard to find works you’ll actually enjoy. You could:

- Read every author until you find one you like, but that means wading through dozens you don’t.
- Ask friends for recommendations, but then *they* must sift through content on your behalf.
- Rely on Netflix- or Spotify-style algorithms, which requires trusting opaque algorithms—the user never sees the algorithm's predictions, only the results of what the system *does* with the predictions.

Each of these approaches forces you—or someone else—to do a lot of work before you find the art you like. I built a transparent recommendation system that avoids these problems. Let's see how it works.  

## Obtaining Current Ratings

I used a Bradley-Terry based model (via [OpenSkill](https://openskill.me/en/stable/)) to collect pairwise comparisons, rather than traditional ratings (e.g. 5-star ratings or 10-point ratings). Traditional rating systems have problems such as [rating inflation](https://gwern.net/resorter#rating-inflation) and discretization—which inherently discards information—both of which Bradley-Terry based models avoid. 

To select item pairs for comparison:
- With 20% probability, the system picks a random pair.
- With 80% probability, the system randomly selects from the top 3 pairs whose comparison is expected to most reduce uncertainty[^1].

The user chooses which item they prefer or declares a tie. After each comparison, I rescale all ratings to a mean of 50 and a standard deviation of 50/3 to prevent variance drift.

## Building Item Embeddings

### Movies

I obtained the data for my movie embeddings from the [MovieLens 25M Dataset](https://grouplens.org/datasets/movielens/). To ensure I only considered movies with sufficient popularity, I only considered movies with at least 100 ratings. A useful feature of the MovieLens dataset is that they've created [tag genomes](https://files.grouplens.org/papers/tag_genome.pdf)—a set of 1128 (continuous!) relevance scores (0 to 1) per movie, where each score represents how strongly a tag—like "sci-fi," "dark humor," or "nonlinear plot"—applies to that film. I compressed these tags into 159 dimensions via PCA with varimax rotation. Originally, I normalized the embeddings, but I now regard this as a mistake. Normalizing embeddings to unit length (L2 norm) distorts relative feature importance; standardizing (mean=0, std=1) per dimension preserves information.

### Books
I obtained the data for my book embeddings from [Goodreads Book Graph Datasets](https://mengtingwan.github.io/data/goodreads.html). A peculiar feature of Goodreads is their user-generated "shelves", which users can use to organize or classify books. In practice, they function much like tags, so that is how I will refer to them. To ensure I only considered books with sufficient popularity, I only considered books with at least one 5-star rating and that were added at least 100 times to their 2nd most popular tag. For the 4000 most popular tags, I created five relevant metrics per book-tag pair, based on what MovieLens used to create tag genomes:
- tag_applied(t, i)
    - 1 if tag $t$ has been applied to item $i$, 0 otherwise
- tag_count(t, i)
    - Number of times tag $t$ has been applied to item $i$
- tag_share(t, i)
    - The log-scaled smoothed proportion of tag $t$ among all tags for item $i$.
    - Calculated as: (tag_count(t, i) + $\alpha$) / (# of tags for i + $\alpha$ + $\beta$)
    - Where $\alpha$ and $\beta$ are tag-specific Beta distribution parameters for smoothing
- tag_lsi_sim(t, i)
    - Similarity between tag $t$ and item $i$ using latent semantic indexing, where each document $d_i$ is the set of tags applied to item $i$
    - We apply SVD to a term-document matrix, reducing the dimensionality, then for a given tag $t$ and item $i$, we apply the same transformation to each, and return the dot product
- avg_rating(t, i)
    - Average rating of item $i$
    - We first subtract the user’s mean from each rating, then compute each item’s mean rating based on these user-mean adjusted ratings

After assigning these scores to each tag-book pair, I perform PCA tag-wise, and use the 1st PC score as the tag value for each book. I compressed these tag values into 387 dimensions via PCA with varimax rotation. 

### Anime
I obtained the data for my anime embeddings from [Anime Recommendation Database 2020](https://www.kaggle.com/datasets/hernan4444/anime-recommendation-database-2020). This dataset had no fine-grained tag data—there are 42 categories that either apply to the anime or don't—so I had to use a matrix factorization model to create the embeddings. The model predicts $\hat{r}_{ui}$ as $\mu + b_i + b_u + q_i^Tp_u$ where $\mu$ is the global average, $b_i$ is the item bias, $b_u$ is the user bias, $q_i$ represents the item factors, and $p_u$ represents the user factors. The model minimizes the following equation: 

$ \sum_{(u,i)\in\kappa} (r_{ui} - \mu - b_u - b_i - p_u^\top q_i)^2 + \lambda\_{p_u}\lVert p_u \rVert^2 + \lambda\_{q_i}\lVert q_i \rVert^2 + \lambda\_{b_u}(b_u^2) + \lambda\_{b_i}(b_i^2)$

Hyperparameters were tuned via random search[^2]. After training the model, I concatenated the item biases with the item factors. Then, I standardize the resulting embeddings column-wise, applied a square root transform to the factors to normalize skew, then restandardized. 

## Predicting Future Ratings
For predictions, I used the [scikit-learn](https://scikit-learn.org/stable/) Python library. I use [ElasticNetCV](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.ElasticNetCV.html) to select the important (nonzero coefficient) features, followed by [RidgeCV](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.RidgeCV.html) to predict the ratings using the selected features.

## Appendix

### Incorporating Prior Information

To solve the cold start problem—the difficulty of providing accurate recommendations when a user has limited data—we can incorporate prior knowledge about what the coefficient vectors (which represent user preferences) typically look like.

In a sense, ridge regression already does this: it assumes the coefficient vector follows a multivariate normal distribution where the means are zero, the features are independent, and all dimensions share the same standard deviation. However, we can improve upon this by using a generalization of ridge regression that allows our prior to be *any* multivariate normal distribution.
#### Step 1: Ridge Regression for Each User
For each user with enough ratings (more than the dimensionality of the embeddings), we perform the following steps:
1. Collect Regression Data
    1. Collect Embeddings and Ratings: Let $\mathbf{X} \in \mathbb{R}^{n \times p}$ be the matrix of embeddings for movies rated by user $u$, where $n$ is the number of rated movies and $p$ is the dimensionality of the embeddings
    2. Normalize Ratings: Let $\mathbf{y} \in \mathbb{R}^{n}$ be the vector of user $u$’s ratings, normalized by subtracting the mean and dividing by the standard deviation.
2. Perform Ridge Regression
    - We perform ridge regression to estimate user $u$’s rating response as a linear function of movie embeddings:
        - $\hat{\mathbf{\beta}} = \arg \min_{\mathbf{\beta}} \left( \| \mathbf{y} - \mathbf{X}\mathbf{\beta} \|^2 + \lambda \| \mathbf{\beta} \|^2 \right)$
    - The solution to the ridge regression coefficients is:
        - $\hat{\mathbf{\beta}} = (\mathbf{X}^\top \mathbf{X} + \lambda \mathbf{I})^{-1} \mathbf{X}^\top \mathbf{y}$
    - To account for bias introduced by regularization, we compute a debiased version of the coefficients:
        - $\hat{\mathbf{\beta}}_{\text{debias}} = \hat{\mathbf{\beta}} + \lambda (\mathbf{X}^\top \mathbf{X} + \lambda \mathbf{I})^{-1} \hat{\mathbf{\beta}}$
3. Compute the Coefficient Variance Matrix
    1. Calculate the residual sum of squares as:
        - $\text{RSS} = \sum\_{i=1}^n (y_i - \mathbf{x}\_i^\top \hat{\mathbf{\beta}}\_{\text{debias}})^2$
    2. The residual variance $s^2$ is estimated as:
        - $s^2 = \frac{\text{RSS}}{n - p}$
    3. The variance of the coefficients is approximated as:
        - $\text{Var}(\hat{\mathbf{\beta}}_{\text{debias}}) = s^2 (\mathbf{X}^\top \mathbf{X} + \lambda \mathbf{I})^{-1}$

#### Step 2: Aggregating Coefficient Vectors
- **Weighted Mean of Coefficients**: The weighted mean for each coefficient dimension $j$ is computed as:
    - $\mu_j = \frac{\sum_{i=1}^{m} w_{ij} \beta_{ij}}{\sum_{i=1}^{m} w_{ij}}$
    - where $m$ is the number of users and $w_{ij} = \frac{1}{\text{Var}(\hat{\beta}_{ij})}$ for user $i$’s $j$-th coefficient
- **Weighted Variance and Standard Deviations**: The weighted variance for each coefficient is:
    - $\sigma_j^2 = \frac{\sum_{i=1}^{m} w_{ij} (\beta_{ij} - \mu_j)^2}{\sum_{i=1}^{m} w_{ij}}$
    - Weighted standard deviations are: $\sigma_j = \sqrt{\sigma_j^2}$.
- **Weighted Covariance Matrix**: For the covariance between coefficients $j$ and $k$:
    - $\text{Cov}(\hat{\beta}\_j, \hat{\beta}\_k) = \frac{\sum\_{i=1}^{m} w\_{i} \cdot (\beta\_{ij} - \mu_j) \cdot (\beta\_{ik} - \mu_k)}{\sum\_{i=1}^{m} w\_{i}}$
- **Weighted Correlation Matrix**: The correlation between each pair of coefficients $j$ and $k$ is calculated as:
    - $\rho_{jk} = \frac{\text{Cov}(\hat{\beta}_j, \hat{\beta}_k)}{\sigma_j \sigma_k}$

For the movies dataset, my approach worked well. For example, the "Award-Winning" dimension had a large positive prior mean, while the "Awful" dimension had a large negative one. They also had a strong negative prior correlation with each other, whereas dimensions like "Science Fiction" and "Based on Comic" showed a moderate positive correlation. The prior gives good recommendations, with top choices like [*Parasite (2019)*](https://letterboxd.com/film/parasite-2019/), [*Won't You Be My Neighbor? (2018)*](https://letterboxd.com/film/wont-you-be-my-neighbor/), and [*The Shawshank Redemption (1994)*](https://letterboxd.com/film/the-shawshank-redemption/).

For the anime dataset, my approach also performed well, though the results were less interesting. Aside from the first dimension—which corresponds to item biases (essentially how "good" an anime is) and had a positive prior mean—the other prior means were close to zero, as expected given the regularization applied to the item factors. The correlations were also near zero, which was unsurprising. The prior gives good recommendations, with top choices like [*Fullmetal Alchemist:Brotherhood*](https://myanimelist.net/anime/5114/Fullmetal_Alchemist__Brotherhood), [*Steins;Gate*](https://myanimelist.net/anime/9253/Steins_Gate), and [*Your Name*](https://myanimelist.net/anime/32281/Kimi_no_Na_wa).

For the books dataset, however, my approach failed completely. All prior means were extremely close to zero—even the "Favorites" dimension, which I expected to be strongly positive, was slightly negative. The correlations were also a mess, with none of the expected patterns emerging. The prior gives odd recommendations, with top choices like [*Deception Point*](https://www.goodreads.com/book/show/976.Deception_Point), [*The Time Traveler's Wife*](https://www.goodreads.com/book/show/18619684-the-time-traveler-s-wife), and [*Requiem for the American Dream: The 10 Principles of Concentration of Wealth & Power*](https://www.goodreads.com/book/show/30629273-requiem-for-the-american-dream). I suspect this reflects a deeper issue with Goodreads’s rating system.


[^1]: I measure expected uncertainty reduction by using the expected decrease in the chance of a draw before vs after the comparison.

[^2]: Matrix Factorization Hyperparameters:
    - Epochs: 1
    - Embedding Dimension: 16
    - Learning Rate: 2e-3
    - Item Bias Regularization: 1e-5
    - User Bias Regularization: 2e-4
    - User Factor Regularization: 0.5
    - Item Factor Regularization: 1e-2

