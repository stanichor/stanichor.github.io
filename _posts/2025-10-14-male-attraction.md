---
layout: post
title: "Factors of Attraction Towards Women: A Replication"
date: 2025-10-14
permalink: /male-attraction/
categories: 
section: psychometrics-practical
related:
  - /gender-satisfaction/
  - /gender-themes/
  - /general-kink/
---

In [What Do We Desire in a Woman?](https://thingstoread.substack.com/p/what-do-we-desire-in-a-woman), Apple Pie conducted surveys on romantic preferences, asking participants to rate several traits based on how attractive they are. The following is a replication of the analysis using confirmatory factor analysis (CFA) and item response theory (IRT), rather than using principal components analysis (PCA) as Apple Pie did. PCA forces factors to be independent, while CFA allows factors to correlate. IRT also provides more item-level information.

## Factor Analysis Results

Parallel analysis suggested eight factors.[^eight] Expand each factor below for its interpretation and loadings.

<style>
  .factor-result {
    margin: 0 !important;
    border-top: 1px solid #d0d7de;
  }

  .factor-result:last-of-type {
    border-bottom: 1px solid #d0d7de;
  }

  .factor-result summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.8rem 0.25rem;
    cursor: pointer;
    list-style: none;
  }

  .factor-result summary::-webkit-details-marker {
    display: none;
  }

  .factor-result summary h3 {
    margin: 0 !important;
    font-size: 1.25em;
  }

  .factor-result summary::after {
    content: "+";
    margin-left: 1rem;
    color: #57606a;
    font-size: 1.35rem;
    font-weight: 400;
    line-height: 1;
  }

  .factor-result[open] summary::after {
    content: "-";
  }

  .factor-result > :not(summary) {
    margin-right: 1rem;
    margin-left: 1rem;
  }

  .factor-result > :last-child {
    margin-bottom: 1.5rem;
  }
</style>

<details class="factor-result" markdown="1">
<summary><h3 id="curvaceousness">Curvaceousness</h3></summary>


<div style="text-align: center;">
    <figure>
        <img src="/assets/images/male-attraction/visualized-curvaceousness.png" width="600">
    </figure>
</div>

This factor indicates a preference for curvier physiques over more slender physiques. Though, it's not *just* a preference for an hourglass figure, but also for greater body fat and overall body mass, as demonstrated by items such as 'Heavyset', 'Comfortably Overweight', and 'Big Bellies'. There doesn't appear to be a corresponding preference for excess muscle mass, as suggested by the fact that 'Athletic' loads negatively, albeit fairly weakly. All in all, this is a pretty straightforward factor.

**Factor Loadings**

| Trait | Loading |
|---|---:|
| Unusually Curvaceous | 0.64 |
| Fat thighs | 0.64 |
| Big Bellies | 0.63 |
| Slender | -0.62 |
| Wide hips | 0.61 |
| Heavyset | 0.56 |
| Very large breasts | 0.53 |
| Bulging booty | 0.53 |
| Narrow hips | -0.50 |
| Comfortably Overweight | 0.48 |
| Tight little buns | -0.46 |
| Little Black Dresses | -0.32 |
| Athletic | -0.21 |

</details>

<details class="factor-result" markdown="1">
<summary><h3 id="vivacity">Vivacity</h3></summary>


<div style="text-align: center;">
    <figure>
        <img src="/assets/images/male-attraction/visualized-vivacity.png" width="600">
    </figure>
</div>

This factor indicates a preference for an extraverted, passionate, adventurous personality. This is obvious from the items that deal directly with personality, such as 'Adventurous' and 'Enthusiastic' (which load positively) and 'Shy' (which loads negatively), but we can learn more by looking at the other items. This is a very embodied, dare I say, Dionysian personality, as evidenced by items such as 'A Good Dancer', 'Artistic', 'The Life of the Party', 'Extremely Amorous', and 'Athletic'. There is a strong emphasis here on physicality, expressiveness, and social energy. Possibly because of this embodied aspect, with its emphasis on movement and physical activity, 'Comfortably Overweight' loads negatively. The negative loading of 'Fair skin' is especially interesting: it may reflect cultural stereotypes associating darker-skinned women with heat, sensuality, emotional expressiveness, dance, and danger. Why 'Dark skin' itself does not show up on this factor, however, is less clear.

**Factor Loadings**

| Trait | Loading |
|---|---:|
| Adventurous | 0.54 |
| Enthusiastic | 0.47 |
| Artistic | 0.41 |
| A Good Dancer | 0.41 |
| The Life of the Party | 0.41 |
| Shy | -0.38 |
| Musically Talented | 0.37 |
| Extremely Amorous | 0.30 |
| Athletic | 0.26 |
| Fair skin | -0.23 |
| Comfortably Overweight | -0.21 |
| Dangerous | 0.20 |

</details>

<details class="factor-result" markdown="1">
<summary><h3 id="sophistication">Sophistication</h3></summary>


<div style="text-align: center;">
    <figure>
        <img src="/assets/images/male-attraction/visualized-sophistication.png" width="600">
    </figure>
</div>

This factor indicates a preference for intelligence in all its forms: education, wit, humor, independent thought, etc. This is extremely obvious when we look at item pairs such as 'Educated' (positive loading) vs. 'Uneducated' (negative loading), or 'Brilliant' (positive loading) vs. 'Not so bright' (negative loading). Beyond book smarts, there's also a focus on *verbal* intelligence, as indicated by items such as 'Witty', 'Humorous', and 'Simple Spoken' (negative loading). It's not just about being smart, but about sounding smart as well.

'Wealthy' doesn't have anything to do with intelligence per se, but given the correlation between wealth and education, as well as the popular association of wealth with refinement and sophistication, the loading makes sense. Interestingly, 'Glasses' doesn't show up despite being one of *the* symbols of intelligence. I'm not sure why this is, especially since it *does* load on Masculinity.

**Factor Loadings**

| Trait | Loading |
|---|---:|
| Uneducated | -0.68 |
| Not so bright | -0.67 |
| Educated | 0.65 |
| Brilliant | 0.57 |
| Witty | 0.53 |
| Free Thinking | 0.35 |
| Humorous | 0.35 |
| Simple Spoken | -0.31 |
| Wealthy | 0.28 |

</details>

<details class="factor-result" markdown="1">
<summary><h3 id="masculinity">Masculinity</h3></summary>


<div style="text-align: center;">
    <figure>
        <img src="/assets/images/male-attraction/visualized-masculinity.png" width="600">
    </figure>
</div>

This factor indicates a preference for masculinity, or at least for a cluster of masculine-coded traits. There's a behavioral aspect, as indicated by items such as 'Dominant' and 'Submissive' (negative loading); a physical aspect, as indicated by items such as 'Broad shoulders', 'Extremely Tall', and 'Heavyset'; and a presentation aspect, as indicated by items such as 'Short hair' and 'T-Shirt & Jeans'. Taken together, the factor seems to capture a preference for women who are more physically imposing, dominant, and masculine in presentation. 'Glasses' also loads onto this factor, albeit fairly weakly, and I'm not sure why.

**Factor Loadings**

| Trait | Loading |
|---|---:|
| Submissive | -0.57 |
| Broad shoulders | 0.54 |
| Dominant | 0.46 |
| Short hair | 0.44 |
| T-Shirt & Jeans | 0.36 |
| Extremely Tall | 0.36 |
| Heavyset | 0.35 |
| Glasses | 0.22 |

</details>

<details class="factor-result" markdown="1">
<summary><h3 id="motherliness">Motherliness</h3></summary>


<div style="text-align: center;">
    <figure>
        <img src="/assets/images/male-attraction/visualized-motherliness.png" width="600">
    </figure>
</div>

This factor indicates a preference for traits associated with being a good mother and wife. There's a reproductive/childcare component ('Good with Children', 'Fertile', and 'Narrow hips' (negative loading)); a domestic component ('A Good Cook'); and an interpersonal component ('Kind' and 'Sympathetic' for the positive loadings, 'Unfaithful' and 'Dangerous' for the negative loadings). Taken together, these suggest a preference for someone nurturing, dependable, family-oriented, and safe as a long-term partner. There are also weak negative loadings for 'Free Thinking' and 'Dominant', which suggest that this preference may be associated with a more 'traditional' form of femininity.

**Factor Loadings**

| Trait | Loading |
|---|---:|
| Good with Children | 0.60 |
| Fertile | 0.49 |
| Unfaithful | -0.41 |
| A Good Cook | 0.41 |
| Dangerous | -0.38 |
| Kind | 0.38 |
| Sympathetic | 0.32 |
| Narrow hips | -0.24 |
| Enthusiastic | 0.21 |
| Free Thinking | -0.21 |
| Dominant | -0.16 |

</details>

<details class="factor-result" markdown="1">
<summary><h3 id="petiteness">Petiteness</h3></summary>


<div style="text-align: center;">
    <figure>
        <img src="/assets/images/male-attraction/visualized-petiteness.png" width="600">
    </figure>
</div>

This factor indicates a preference for physical smallness, which also seems to be combined with a harmless, playful temperament. The strongest-loading items all relate to height in some way: 'Short' loads positively, while 'Long legs' and 'Extremely Tall' load negatively. The weaker-loading items, however, seem to point toward a sort of cuteness: being silly, kind, humorous, and sympathetic. The negative loading of 'Athletic' may reflect the same pattern, with a preference for physical smallness and cuteness being associated with a preference for someone less physically imposing or threatening.

**Factor Loadings**

| Trait | Loading |
|---|---:|
| Short | 0.44 |
| Long legs | -0.42 |
| Extremely Tall | -0.38 |
| Silly | 0.25 |
| Kind | 0.24 |
| Humorous | 0.23 |
| Sympathetic | 0.19 |
| Athletic | -0.18 |

</details>

<details class="factor-result" markdown="1">
<summary><h3 id="glamour">Glamour</h3></summary>


<div style="text-align: center;">
    <figure>
        <img src="/assets/images/male-attraction/visualized-glamour.png" width="600">
    </figure>
</div>

This factor indicates a preference for a woman who invests a lot in her appearance. Most of the indicators relate to styling (e.g., 'Red lipstick', 'Nail Polish', 'Jewelry') and garments (e.g., 'High Heels', 'Little Black Dresses', 'Tight Corsets'). More specifically, there's a preference for women who style and adorn themselves in such a way as to appear more "glamorous". It's not just these ornamental aspects of appearance that the factor focuses on, however, but also non-ornamental features (e.g., 'Long legs', 'Very large breasts'), suggesting that this is more than simply a preference for ornamentation. Rather, it seems to capture a preference for a glamorous, highly cultivated feminine ideal in which clothing, grooming, and bodily features all contribute to the overall presentation.

**Factor Loadings**

| Trait | Loading |
|---|---:|
| High Heels | 0.64 |
| Red lipstick | 0.52 |
| Nail Polish | 0.52 |
| Little Black Dresses | 0.42 |
| Shaved legs | 0.35 |
| Jewelry | 0.35 |
| Tight Corsets | 0.32 |
| Long legs | 0.25 |
| Very large breasts | 0.21 |

</details>

<details class="factor-result" markdown="1">
<summary><h3 id="ingénue">Ingénue</h3></summary>


<div style="text-align: center;">
    <figure>
        <img src="/assets/images/male-attraction/visualized-ingénue.png" width="600">
    </figure>
</div>

This factor indicates a preference for not just youthfulness, but what seems to be an ingénue archetype. There appear to be three main components: an age component ('Young', 'Older women' (negative loading), 'Teenagers', 'Mature' (negative loading)); a 'delicate features' component ('Small Hands', 'Little noses', 'Slender', 'Comfortably Overweight' (negative loading)); and a racialized component ('Fair skin', 'Light eyes', 'Dark skin' (negative loading)). One indicator even seems to combine all three of these components: 'Cheerleaders'. Taken together, the factor seems to capture a preference for a youthful, delicate, and fair-skinned femininity rather than youth alone.

**Factor Loadings**

| Trait | Loading |
|---|---:|
| Young | 0.57 |
| Older women | -0.50 |
| Dark skin | -0.47 |
| Teenagers | 0.47 |
| Cheerleaders | 0.42 |
| Comfortably Overweight | -0.40 |
| Small Hands | 0.38 |
| Little noses | 0.35 |
| Mature | -0.34 |
| Light eyes | 0.32 |
| Slender | 0.31 |
| Fair skin | 0.28 |

</details>

### Comparison with Apple Pie

Apple Pie's factors map most closely onto the factors found here as follows:

| Apple Pie factor | Closest factor(s) here |
|---|---|
| Skinny Girls vs BBWs | Curvaceousness |
| Vapid Chicks vs Great Personalities | Vivacity and Sophistication |
| Barbie Dimension | Glamour |
| MILF Dimension | Masculinity and low Ingénue |
| Temptresses vs Trad Wives | Motherliness and Petiteness |

## An Aside About Acquiescence

At this point, I should mention [acquiescence bias](/acquiescence/). Acquiescence bias is the tendency to agree with statements in a questionnaire regardless of what those statements actually assert. For example, in this dataset, there are traits that are natural opposites: Tall vs. Short, Fair skin vs. Dark skin, Dominant vs. Submissive. A respondent high in acquiescence would say that they strongly prefer both tall women *and* short women, dominant women *and* submissive women, and so on. Here's a visualization:

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/male-attraction/acquiescence-opposite-pairs.png" width="600">
    </figure>
</div>

Now, it's perfectly fine for someone to prefer many traits, even if they are 'opposites', but this doesn't help us determine the factors, that is, the substantive sources of covariation among preferences. In fact, acquiescence can obscure those factors, because a general tendency to endorse items will make all indicators *more* positively correlated with one another, regardless of their content.

For this reason, I've modeled an acquiescence factor that affects all items equally, allowing this general endorsement tendency to be separated from the substantive preference factors. This seems to have been warranted, seeing as the common loading on the acquiescence factor was about 0.25 (94% posterior HDI: [0.23, 0.26]).

## Factor Correlation Matrix

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/male-attraction/factor-correlation.png" width="800">
    </figure>
</div>

Most of the correlations between preference factors make sense. The negative correlations between Masculinity & Ingénue, Ingénue & Curvaceousness, and Motherliness & Masculinity, are all unsurprising.

## Takeaways

To be honest, I'm not sure what to put here. I think I've said everything that needs to be said. I have no further opinions. Thanks for reading.

*Thanks to [Apple Pie](https://thingstoread.substack.com/) for sharing the data!*

## Appendix

### Correlation Fishing

Let's take a look at some of the correlations[^correlation] between preferences and other traits. First, preferences and personality. There isn't much going on here: the only correlations of note are that preferences for Vivacity seem to be positively correlated with both extraversion and openness.

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/male-attraction/preference-personality.png" width="600">
    </figure>
</div>

Both relationships make sense given what the Vivacity factor captures: a preference for adventurousness, enthusiasm, sociability, artistic expression, and similar traits would probably be more common among men who are themselves more extraverted and open.

The political items were:

- Hierarchy: It is important for society to have a hierarchy.
- Religion: Religion is very important in my life.
- Euthanasia: People suffering from incurable diseases should have the right to be put painlessly to death.
- Equality: We would have fewer problems if we treated people more equally.
- Free speech: Free speech is important, and should be protected even if some people's feelings are hurt.
- Compulsory schooling: Teenagers should be legally required to go to school.

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/male-attraction/preference-politics.png" width="600">
    </figure>
</div>

Responses to the hierarchy item were positively correlated with the Ingénue and Motherliness factors and negatively correlated with the Masculinity factor. One fairly straightforward interpretation is that preference for hierarchy is associated with greater endorsement of traditional gender roles: Ingénue and Motherliness both describe fairly traditional feminine ideals, while the Masculinity factor, as you can tell by the name, does not.

The other correlations of note were between responses to the equality item and the Masculinity factor (positive) and Ingénue factor (negative), seemingly the reverse of the pattern for hierarchy. There's also a positive correlation between responses to the euthanasia item and preference for Sophistication, which is... interesting.

Finally, social desirability:

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/male-attraction/social-desirability.png" width="600">
    </figure>
</div>

I'm not quite sure what to make of these correlations. Well, the negative correlation with the Ingénue factor makes some sense given some of its more... sus indicators. The positive correlation with Vivacity, however, confuses me. Unlike the Ingénue result, there isn't an obvious reason why giving socially desirable responses should be associated with a stronger (stated) preference for adventurous, expressive, and high-energy women (at least, when compared with the other factors). 

[^eight]: So, *technically*, I should have modeled 7 factors + acquiescence, but I had already modeled the 8 factors before I decided to add the acquiescence factor, and the factors still seem crisp and interpretable, so I'll leave it be. Besides, for an exploratory analysis such as this, I'm fine with erring on the side of too many factors than too few.

[^correlation]: Really, standardized regression coefficients between factor scores.
