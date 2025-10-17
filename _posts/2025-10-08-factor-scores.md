---
layout: post
title: "Use Factor Scores, Not Sum Scores"
date: 2025-10-08
permalink: /factor-scores/
categories: 
---

When researchers design a scale (a set of questions intended to measure some latent trait, such as anxiety, political ideology, or social trust), the simplest way to score the scale is to add up the answers[^1] (or take their average). This is the standard approach in psychology and most social sciences. Yet, it rests on a very strong assumption: that every item measures the trait equally well[^2].

In reality, items vary considerably in how closely they track the underlying trait. Some questions capture the signal clearly, while others mostly capture noise. Consequently, when all items are treated equally, the measurement of the latent trait is degraded. 

We can improve the measurement of latent traits using factor analysis. It assumes that each individual has some unobserved level of one or more latent traits that we want to measure. Responses to each question or item are influenced by at least one of the traits to a certain degree, quantified by its *loading*, which is the correlation between the latent trait and item's response. We also assume that once we've accounted for the latent traits, the remaining variance in each item is just noise[^3].

Because items differ in their loadings, factor analysis estimates how strongly each item loads on a trait, and uses those estimates to estimate the factor scores. If one item tracks the trait closely and another only faintly, the model will reflect that. This does two things: it produces a score that better represents the underlying trait, and it reveals whether our scale is coherent. If, for example, an item has a loading of less than 0.3, then it's a poor indicator of the trait, and should probably be eliminated. (Conveniently, even if we *don't* remove it, its influence on the factor score will be small.)

This is a simple model, and can be extended. You can use factor analysis to test the assumption that the scale measures *only* one latent trait, or the assumption that the items are only related through the latent trait. You can even have hierarchical factors or incorporate item response theory, along with other advanced techniques. But even our simple model is an improvement over sum scoring.

A practical approximation of single-factor analysis can be obtained through principal components analysis (PCA). While PCA and factor analysis have different assumptions and goals, in practice, they tend to agree (as long as we keep the factor analysis simple, as we're doing). Here's a Python function that computes factor scores (for a single factor) from data (each observation is a row, each question a column):

{% highlight python %}
import numpy as np

def compute_factor_scores(data: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """
    Compute factor scores and loadings from the given dataset using
    principal factor analysis.

    Parameters
    ----------
    data : np.ndarray
        A 2D array of shape (n_samples, n_features) representing the dataset.
        Each row corresponds to an observation, and each column corresponds
        to a variable.

    Returns
    -------
    factor_scores : np.ndarray
        Array of shape (n_samples,) containing the computed factor scores
        for each observation.
    loadings : np.ndarray
        Array of shape (n_features,) representing the factor loadings
        for the extracted factor.

    Notes
    -----
    - This implementation extracts only the first principal factor.
    """
    # Matrix inverse shortcut
    inv = np.linalg.inv  

    # Number of features
    k = data.shape[1]

    # Standardize the dataset (zero mean, unit variance)
    mean = np.mean(data, axis=0)
    std = np.std(data, axis=0, ddof=1)
    standardized_data = (data - mean) / std

    # Compute the correlation matrix
    corr = np.corrcoef(standardized_data, rowvar=False)

    # Eigen decomposition of the correlation matrix
    eig_vals, eig_vecs = np.linalg.eigh(corr)

    # Sort eigenvalues and eigenvectors in descending order
    idx = np.argsort(eig_vals)[::-1]
    eig_vals, eig_vecs = eig_vals[idx], eig_vecs[:, idx]
    
    # Compute loadings for the first factor
    Lambda = eig_vecs[:, 0].reshape(-1, 1) * np.sqrt(eig_vals[0])
    loadings = Lambda.T

    # Ensure sign consistency (so that sum of squares is positive)
    sum_of_squares = np.sum((Lambda ** 2) * np.where(Lambda >= 0, 1, -1))
    if sum_of_squares < 0:
        Lambda *= -1  

    # Compute uniqueness matrix (Theta)
    Theta = np.diag(1 - (Lambda.flatten() ** 2))

    # Compute factor scores using the Bartlett method
    factor_scores = (
        inv(Lambda.T @ inv(Theta) @ Lambda)
        @ Lambda.T
        @ inv(Theta)
        @ standardized_data.T
    ).T 

    return factor_scores, loadings
{% endhighlight %}

[^1]: In a typical Likert scale, the response options might be: “Strongly Disagree” (1), “Disagree” (2), “Neither agree nor disagree” (3), “Agree” (4), and “Strongly Agree” (5).

[^2]: McNeish, D., Wolf, M.G. *Thinking twice about sum scores.* Behav Res 52, 2287–2305 (2020). https://doi.org/10.3758/s13428-020-01398-0

[^3]: In more complex models, we can allow the residual variation between items to correlate (for instance, when items share similar wording).