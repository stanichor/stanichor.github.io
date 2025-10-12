---
layout: post
title: "What makes a good anime?"
date: 2025-10-10
permalink: /anime-quality/
categories: 
---

What makes a good anime? While taste is subjective, there tends to be some sort of consensus on quality. For example, most people think [Frieren is a good anime](https://myanimelist.net/anime/52991/Sousou_no_Frieren). Using user ratings and genre tags, I measure which genres correlate with higher anime quality. I estimate an item-level quality score for each anime using a matrix-factorization model, then investigate how that score varies with genre and with genre combinations. 

## Estimating anime quality from ratings

I obtained the rating data from [Anime Recommendation Database 2020](https://www.kaggle.com/datasets/hernan4444/anime-recommendation-database-2020). Then, I estimate a simple matrix factorization model:

$ r\_{u,i} = \mu + b_u + b_i + p_u^Tq_i + \epsilon_{u,i}$

where: 
- $r_{u,i}$ is the rating user $u$ gave item $i$
- $\mu$ is the global mean rating
- $b_u$ is the user bias
- $b_i$ is the item bias (I interpret this as a measure of the anime's quality)
- $p_u$ and $q_i$ are the user and item factors, respectively

I fit the model with regularization, then standardize the $b_i$ values to have a mean of 0 and a standard deviation of 1. All regression coefficients reported below are expressed in these standard deviation units.

## Which genres are common?

An anime can belong to multiple genres. Broad genres (e.g., Comedy, Action, Fantasy) contain many anime, while narrow genres (e.g., Samurai, Cars, Vampires) contain few anime. 

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/anime-quality/genre-counts.png" width="600" alt="Counts of anime per genre">
    </figure>
</div>

## Estimating the effect of genres

I regress anime quality on binary genre indicators yielding the following estimates:

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/anime-quality/multiple-regression-coefs.png" width="600" alt="Regression coefficients for genres with 95% error bars">
    </figure>
</div>

While a few genres (mostly those that appear infrequently) have wide error bars, we're able to achieve relatively precise estimates for most of the genres. The strongest positive associations with anime quality are Thriller, Mystery, and Drama. Genres connected to sexual content or romance (e.g., Yaoi, Ecchi, Shounen Ai) tend to have negative or near-zero associations. Curiously, the aforementioned pattern does not apply to the Romance genre, which has a solidly positive association. The multiple regression model achieves an $R^2$ of 0.25, and the regression's predicted quality correlates with empirical quality at $r = 0.50$.

## Estimating the effect of genre combinations

We might expect there to be interactions between genres. Restricting ourselves to two-way interactions, there are 946 possible interactions, but only 771 of them actually occur, and only 179 of them are present in at least 100 anime. Because testing many interactions inflates false positives, I adjust p-values with the Benjamini–Hochberg procedure and list the interactions with adjusted p-values less than 0.01, which are as follows:  

| Interaction | Estimate (SD units) |
|-|-|
| Slice_of_Life:Supernatural | 0.59 |
| Comedy:Parody | 0.59 |
| Comedy:Harem | 0.43 |
| Action:Horror | 0.41 |
| Ecchi:Sci_Fi | 0.41 |
| Comedy:Demons | 0.39 |
| Ecchi:Harem | 0.38 |
| Fantasy:Slice_of_Life | 0.37 |
| Action:Supernatural | 0.30 |
| Comedy:Drama | 0.21 |
| Sci_Fi:Shounen | -0.30 |
| Ecchi:Romance | -0.31 |
| Drama:Mystery | -0.35 |

## A Sanity Check: The Top Anime

Looking at the highest-quality anime (excluding sequels) gives us a sense of how credible the genre-quality associations are. The genre most strongly associated with quality, Thriller, is overrepresented, appearing twice in the Top 10. The runner-ups, Mystery and Drama, are also overrepresented. At the other end, none of the top anime belong to sexually themed genres. We can also find positively associated interactions such as *Slice of Life × Supernatural* and *Comedy × Parody* represented among the top anime.

| Anime | Genres |
|-|-|
| Fullmetal Alchemist:Brotherhood | Action, Adventure, Comedy, Drama, Fantasy, Magic, Military, Shounen |
| Legend of the Galactic Heroes | Drama, Military, Sci-Fi, Space |
| Steins;Gate | Sci-Fi, Thriller |
| Gintama | Action, Comedy, Historical, Parody, Samurai, Sci-Fi, Shounen |
| Clannad: After Story | Comedy, Drama, Romance, Slice of Life, Supernatural |
| Code Geass:Lelouch of the Rebellion R2 | Action, Drama, Mecha, Military, Sci-Fi, Super Power |
| Your Name. | Drama, Romance, School, Supernatural |
| A Silent Voice | Drama, School, Shounen |
| Monster | Drama, Horror, Mystery, Police, Psychological, Seinen, Thriller |
| Gintama Season 5 | Action, Comedy, Historical, Parody, Samurai, Sci-Fi, Shounen |
| Mushi-Shi | Adventure, Fantasy, Historical, Mystery, Seinen, Slice of Life, Supernatural |


## Caveats
The estimated effects aren't causal. We don't know why certain genres are associated with higher (or lower) anime quality. It may be that some genres are inherently more appealing, or it could be that competent anime creators focus more on certain genres over others. Or possibly neither of these explanations fit and the truth is something else. 

---

## Appendix

### Genre Descriptions

MyAnimeList has a [page describing the different genres](https://myanimelist.net/anime/genre/info), which, in addition to being incomplete, is also inaccurate. For example, it claims that "Slice of Life and Comedy are incompatible by definition". However in the dataset, there are 1034 anime that belong to *both* genres. As I am not well-versed in anime, I turn to the all-knowing chatbots to briefly describe each genre.

- **Action**: Physical combat, fights, fast pacing
- **Adventure**: Journeys, quests, exploration
- **Cars**: Racing and automobile-focused stories
- **Comedy**: Humor-driven, sketch or situational comedy
- **Dementia**: Surreal or intentionally disorienting narratives
- **Demons**: Works where demonic beings play central roles
- **Drama**: Character-driven plots with emotional stakes
- **Ecchi**: Sexualized humor and fanservice without explicit sexual acts
- **Fantasy**: Magic, mythical creatures, invented worlds
- **Game**: Plots centered on games or gaming environments
- **Harem**: One character surrounded by multiple romantic interests
- **Hentai**: Pornographic anime with explicit sexual content
- **Historical**: Set in or inspired by real-world historical periods
- **Horror**: Works intended to frighten or unsettle
- **Josei**: Targeted at adult women
- **Kids**: Targeted at children
- **Magic**: Revolves around magical powers, spells, or sorcery
- **Martial Arts**: Hand-to-hand combat, martial arts techniques
- **Mecha**: Giant robots or mechanical suits as central elements
- **Military**: Focuses on soldiers, warfare, or military strategy
- **Music**: Centers on musicians, bands, and idols
- **Mystery**: Focus on solving puzzles or crimes
- **Parody**: Mocks or references other works, genres, or tropes for humor
- **Police**: Law-enforcement protagonists and procedures
- **Psychological**: Emphasis on inner states, tension, and mind-focused drama
- **Romance**: Centers on romantic relationships
- **Samurai**: Features samurai warriors, typically set in feudal Japan
- **School**: Set primarily in a school environment; student life is central
- **Sci-Fi**: Futuristic tech, space, or speculative science
- **Seinen**: Targeted at adult men
- **Shoujo**: Targeted at teenage girls
- **Shoujo Ai**: Romantic stories focusing on female-female relationships
- **Shounen**: Targeted at teenage boys
- **Shounen Ai**: omantic stories focusing on male-male relationships
- **Slice of Life**: Everyday activities and realistic settings
- **Space**: Set in outer space or involving interplanetary travel
- **Sports**: Athletic competition, teamwork, and personal improvement
- **Super Power**: Features characters with superhuman powers
- **Supernatural**: Ghosts, spirits, and other paranormal phenomena
- **Thriller**: Suspense, danger, and tension
- **Unknown**: Genre not specified
- **Vampire**: Features vampires
- **Yaoi**: Explicit stories focusing on male-male relationships
- **Yuri**: Explicit stories focusing on female–female relationships
