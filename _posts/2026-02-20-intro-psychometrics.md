---
layout: post
title: "Resources for Understanding Psychometrics"
date: 2026-02-20
permalink: /intro-psychometrics/
categories: 
---

I enjoy [writing](https://stanichor.net/nerd-scale/) [about](https://stanichor.net/acquiescence/) [psychometrics](https://stanichor.net/mediation/). I also enjoy people reading what I write. Unfortunately, I don’t think many people do, and a big reason is probably that few people actually understand psychometrics. To help with that, I’m sharing some resources that make the field more accessible.

The [Personality Project](<https://www.personality-project.org/>) has a surprisingly nice (and free) textbook which covers the basics.
- [Chapter 4 - Covariance, Regression, and Correlation](<https://www.personality-project.org/r/book/chapter4.pdf>): Explains covariance, correlation, and other measures of association, along with issues that affect correlations (e.g., restriction of range, spurious correlations, Simpson's paradox, etc.)
- [Chapter 6 - Constructs, Components, and Factor Models](<https://www.personality-project.org/r/book/Chapter6.pdf>): Introduces Principal Components Analysis (PCA), exploratory factor analysis, confirmatory factor analysis, and higher-order factor models. Discusses how factors are extracted, rotated, transformed, and compared. Also covers multidimensional scaling, and some cluster analysis methods used in psychometrics.
- [Chapter 7 - Classical Test Theory and the Measurement of Reliability](<https://www.personality-project.org/r/book/Chapter7.pdf>): Covers classical test theory + the various measures of reliablity (of which there are *many*).
- [Chapter 8 - The “New Psychometrics” – Item Response Theory](<https://www.personality-project.org/r/book/Chapter8.pdf>): Introduces item response theory, which improves on some of the shortcomings of classical test theory.

Chapter 7 ("Reliability and Stability of Mental Measurements") of Arthur Jensen's [*Bias in Mental Testing*](<https://emilkirkegaard.dk/en/wp-content/uploads/Bias-in-Mental-Testing-Arthur-R.-Jensen.pdf>) also serves as a easy-to-understand introduction to classical test theory, along with showing how it is applied to real testing data.

Measurement invariance (often assessed via multi-group CFA) and differential item functioning (DIF, typically assessed at the item level in IRT or logistic frameworks) are important for comparing results across groups[^comparisons]. For measurement invariance, the most accessible explanation I've found is [A casual but causal take on measurement invariance](<https://www.the100.ci/2024/01/10/a-casual-but-causal-take-on-measurement-invariance/>) by The 100% CI. For differential item functioning, Meng Hu has [a very comprehensive post](https://menghu.substack.com/p/dif-review-analysis-of-racial-bias-in-wordsum) explaining various approaches to detecting DIF.

Emil Kierkegaard has created a number of useful [visualizations](https://emilkirkegaard.dk/understanding_statistics) illustrating concepts such as range restriction, ceiling and floor effects, regression to the mean, discretization, and other statistical artifacts.

[^comparisons]: The concept of comparing results across groups is very broad. It includes the obvious cases, such as comparing extroversion across countries (where the groups might be Americans and Germans). But it also includes questions like whether pre-treatment and post-treatment scores on a depression questionnaire are comparable (the 'groups' being the pre-treatment and post-treatment measurements, even if they come from the same individuals), or whether the population has become more intelligent over time (the groups being, for example, Americans in 1970 versus Americans in 2020).
