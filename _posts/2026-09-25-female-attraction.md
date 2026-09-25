---
layout: post
title: "Factors of Attraction Towards Men: A Replication"
date: 2026-09-25
permalink: /female-attraction/
categories: 
section: psychometrics-practical
related:
  - /male-attraction/
  - /acquiescence/
  - /kink-factors/
---

In [Factors of Attraction Toward Men](https://thingstoread.substack.com/p/factors-of-attraction-toward-men), Apple Pie conducted surveys on romantic preferences, asking participants to rate several traits based on how attractive they are. The following is a replication of the analysis using confirmatory factor analysis (CFA) and item response theory (IRT), rather than using principal component analysis (PCA) as Apple Pie did. PCA forces factors to be orthogonal, while CFA allows factors to correlate. IRT also provides more item-level information.

## Factor Analysis Results

Parallel analysis suggested nine factors. Expand each factor below for its interpretation and loadings.

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
<summary><h3 id="ruggedness">Ruggedness</h3></summary>


<div style="text-align: center;">
    <figure>
        <img src="/assets/images/female-attraction/visualized-ruggedness.png" alt="Ruggedness factor illustration" width="600">
    </figure>
</div>

This factor indicates a preference for roughness and danger. The items dealing with bodily preferences ('Smooth Skin' (negative loading), 'Scars', 'Rough Skin', 'Sweat') indicate a preference for a sort of ruggedness: a weathered, physically tough appearance rather than a smooth or polished one. The items dealing with personality ('Dangerous', 'Cocky Attitude', 'Adventurous') indicate the behavioral archetype of the “bad boy”: someone daring, cocky, and somewhat risk-seeking. Other items, such as 'Guns', 'Motorcycles', and 'Clunky Old Cars', fit into the same general aesthetic of roughness, danger, and disregard for polish. Taken together, the factor seems to capture a preference for a rough, dangerous form of masculinity, encompassing both rugged appearance and roguish behavior.

**Factor Loadings**

| Trait | Loading |
|---|---:|
| Scars | 0.64 |
| Smooth Skin | -0.63 |
| Rough Skin | 0.61 |
| Dangerous | 0.54 |
| Sweat | 0.49 |
| Pretty Faces | -0.36 |
| Clunky Old Cars | 0.36 |
| Motorcycles | 0.35 |
| Guns | 0.34 |
| Cocky Attitude | 0.34 |
| Adventurous | 0.30 |
| Rugged Looks | 0.24 |

</details>

<details class="factor-result" markdown="1">
<summary><h3 id="companionability">Companionability</h3></summary>


<div style="text-align: center;">
    <figure>
        <img src="/assets/images/female-attraction/visualized-companionability.png" alt="Companionability factor illustration" width="600">
    </figure>
</div>

This factor represents a preference for a warm, lively, enjoyable personality. This is obvious from the items that deal directly with personality, such as 'Enthusiastic', 'Silly', 'Humorous', and 'Adventurous', but we can learn more by looking at the other items. This is a relatively embodied personality, as evidenced by items such as 'A Good Dancer', 'A Good Cook', and 'The Life of the Party': someone who expresses their personality through doing things rather than merely possessing abstract personality traits. There's also an emphasis on the man being “safe”, as you can see from items such as 'Kind', 'Sympathetic', and 'Good with Children', as well as the negative loading of 'Unfaithful'. Taken together, this seems to describe someone energetic, fun, warm, and socially engaging.

**Factor Loadings**

| Trait | Loading |
|---|---:|
| Enthusiastic | 0.54 |
| A Good Dancer | 0.53 |
| Kind | 0.52 |
| Silly | 0.45 |
| Sympathetic | 0.40 |
| A Good Cook | 0.40 |
| The Life of the Party | 0.38 |
| Humorous | 0.36 |
| Good with Children | 0.36 |
| Adventurous | 0.35 |
| Unfaithful | -0.28 |

</details>

<details class="factor-result" markdown="1">
<summary><h3 id="affluence">Affluence</h3></summary>


<div style="text-align: center;">
    <figure>
        <img src="/assets/images/female-attraction/visualized-affluence.png" alt="Affluence factor illustration" width="600">
    </figure>
</div>

Honestly, there's not much to say here: this factor is obvious and only has a measly three items. It represents a preference for rich men. 'Money' and 'Wealthy' are obvious. 'Fast Cars' loads positively, but weakly, probably because fast cars are a visible symbol of wealth. Notably, this factor isn't about a preference for high-status men *per se*. Education, intelligence, suits, dominance, and other potential indicators of status don't load on this factor. It really does seem to be about money specifically.

**Factor Loadings**

| Trait | Loading |
|---|---:|
| Money | 0.64 |
| Wealthy | 0.60 |
| Fast Cars | 0.29 |

</details>

<details class="factor-result" markdown="1">
<summary><h3 id="boyishness">Boyishness</h3></summary>


<div style="text-align: center;">
    <figure>
        <img src="/assets/images/female-attraction/visualized-boyishness.png" alt="Boyishness factor illustration" width="600">
    </figure>
</div>

This factor indicates a preference for youthful prettiness. The age component is obvious: 'Young' and 'Teenagers' load positively. There's also a facial and bodily component: 'Pretty in the Face', 'Pretty Faces', and 'Slender' all load positively. Evidently, hair is not seen as youthful, as shown by the negative loadings of 'Chest Hair', 'Facial Hair', and 'Receding Hairlines'.

**Factor Loadings**

| Trait | Loading |
|---|---:|
| Pretty in the Face | 0.63 |
| Chest Hair | -0.61 |
| Receding Hairlines | -0.53 |
| Facial Hair | -0.48 |
| Pretty Faces | 0.48 |
| Young | 0.46 |
| Slender | 0.44 |
| Short Necks | -0.37 |
| Teenagers | 0.33 |

</details>

<details class="factor-result" markdown="1">
<summary><h3 id="intellect">Intellect</h3></summary>


<div style="text-align: center;">
    <figure>
        <img src="/assets/images/female-attraction/visualized-intellect.png" alt="Intellect factor illustration" width="600">
    </figure>
</div>

This factor indicates a preference for intelligence in all its forms: education, brilliance, maturity, independent thought, and wit. This is obvious when we look at item pairs such as 'Educated' (positive loading) vs. 'Uneducated' (negative loading), or 'Brilliant' (positive loading) vs. 'Not so bright' (negative loading). Beyond book smarts, there's also a focus on verbal intelligence, as indicated by items such as 'Witty' and 'Simple Spoken' (negative loading). Interestingly, 'Humorous' does *not* load on this factor, despite the loading of 'Witty', suggesting that the relevant distinction is verbal cleverness rather than simply being funny.

**Factor Loadings**

| Trait | Loading |
|---|---:|
| Uneducated | -0.71 |
| Educated | 0.71 |
| Not so bright | -0.60 |
| Brilliant | 0.48 |
| Witty | 0.39 |
| Free Thinking | 0.39 |
| Simple Spoken | -0.38 |
| Mature | 0.38 |

</details>

<details class="factor-result" markdown="1">
<summary><h3 id="pigmentation">Pigmentation</h3></summary>


<div style="text-align: center;">
    <figure>
        <img src="/assets/images/female-attraction/visualized-pigmentation.png" alt="Pigmentation factor illustration" width="600">
    </figure>
</div>

This is a factor that I was not expecting, yet it's fairly straightforward: it represents a preference for darker coloration over lighter coloration. 'Dark Skin', 'Dark Eyes', and 'Black Hair' all load positively, while 'Fair Skin', 'Light Hair', and 'Light Eyes' load negatively. In other words, all the items dealing with light/dark coloration are present and have exactly the loading signs you would expect. The only slight oddity is that 'Black Hair' loads considerably more weakly than the skin, hair-lightness, and eye-color items. I'm not sure why. Other than that, this seems to be an unusually clean preference for darker pigmentation across skin, hair, and eyes.

**Factor Loadings**

| Trait | Loading |
|---|---:|
| Fair Skin | -0.60 |
| Dark Skin | 0.53 |
| Light Hair | -0.49 |
| Dark Eyes | 0.41 |
| Light Eyes | -0.37 |
| Black Hair | 0.22 |

</details>

<details class="factor-result" markdown="1">
<summary><h3 id="adiposity">Adiposity</h3></summary>


<div style="text-align: center;">
    <figure>
        <img src="/assets/images/female-attraction/visualized-adiposity.png" alt="Adiposity factor illustration" width="600">
    </figure>
</div>

This is another straightforward factor: it represents a preference for fat men, as evidenced by the positive loadings of 'Comfortably Overweight' and 'Heavyset' and the negative loading of 'Slender'. Importantly, items such as 'Athletic' and 'Bulging Muscles' don't load on this factor, suggesting that this isn't simply a preference for larger or more physically substantial men in general. Rather, it seems specifically to capture a preference for greater body fat and a heavier build.

**Factor Loadings**

| Trait | Loading |
|---|---:|
| Comfortably Overweight | 0.58 |
| Heavyset | 0.58 |
| Slender | -0.26 |

</details>

<details class="factor-result" markdown="1">
<summary><h3 id="bohemianism">Bohemianism</h3></summary>


<div style="text-align: center;">
    <figure>
        <img src="/assets/images/female-attraction/visualized-bohemianism.png" alt="Bohemianism factor illustration" width="600">
    </figure>
</div>

This factor indicates a preference for an artistic, expressive, unconventional presentation, or a sort of bohemian type in that it is both artistic and socially unconventional. The artistic side of the factor can be seen in items such as 'Artistic' and 'Musically Talented' while 'Long Hair' fits naturally with the same alternative aesthetic. At the other end are items associated with more conventional forms of masculinity and presentation: 'Men in Uniform', 'Jocks', 'Suits and Ties', 'Cologne', and 'Guns' all load negatively. Taken together, the factor seems to contrast an artistic, expressive, alternative masculinity with a more conventional, institutional, and stereotypically masculine presentation.

**Factor Loadings**

| Trait | Loading |
|---|---:|
| Men in Uniform | -0.54 |
| Long Hair | 0.50 |
| Guns | -0.47 |
| Jocks | -0.45 |
| Artistic | 0.42 |
| Musically Talented | 0.33 |
| Cologne | -0.32 |
| Cocky Attitude | -0.32 |
| Suits and Ties | -0.31 |

</details>

<details class="factor-result" markdown="1">
<summary><h3 id="virility">Virility</h3></summary>


<div style="text-align: center;">
    <figure>
        <img src="/assets/images/female-attraction/visualized-virility.png" alt="Virility factor illustration" width="600">
    </figure>
</div>

This factor indicates a preference for sexually dimorphic masculinity. Most of the items relate to the physical side of things: broad rather than narrow shoulders, broad rather than weak jaws, deep voices, greater musculature, tall rather than short stature, and larger rather than smaller genitals. The items relating to personality point in the same direction: 'Dominant' loads positively while 'Shy' loads negatively, suggesting a preference for a stereotypically masculine personality alongside the stereotypically masculine body.

**Factor Loadings**

| Trait | Loading |
|---|---:|
| Narrow Shoulders | -0.69 |
| Broad Shoulders | 0.63 |
| Broad Jaws | 0.61 |
| Deep Voices | 0.58 |
| Weak Chins | -0.55 |
| Short | -0.55 |
| Bulging Muscles | 0.53 |
| Small Genitals | -0.49 |
| Dominant | 0.48 |
| Shy | -0.47 |
| Virile | 0.46 |
| Extremely Tall | 0.39 |
| Very Large Genitals | 0.35 |
| Rugged Looks | 0.31 |

</details>

### Comparison with Apple Pie

Apple Pie's factors map most closely onto the factors found here as follows:

| Apple Pie factor | Closest factor(s) here (sign relative to first-named pole) |
|---|---|
| Artists vs Heroes | Bohemianism (+); Virility (-), Affluence (-) |
| Pretty Boys vs Masculine Men | Boyishness (+); Virility (-), Ruggedness (-) |
| Romantic Comedy | Companionability (+) |
| Kind vs Dangerous | Companionability (+); Ruggedness (-) |
| Ditsy Teens vs Sophisticated Gentlemen | Boyishness (+); Intellect (-) |

## An(other) Aside About Acquiescence

At this point, I should mention [acquiescence bias](/acquiescence/). Acquiescence bias is the tendency to agree with statements in a questionnaire regardless of what those statements actually assert. For example, in this dataset, there are traits that are natural opposites: Tall vs. Short, Fair skin vs. Dark skin, Young vs Old. A respondent high in acquiescence would say that they strongly prefer both tall men *and* short men, young men *and* old men, and so on. Here's a visualization:

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/female-attraction/acquiescence-opposite-pairs.png" width="600">
    </figure>
</div>

Now, it's perfectly fine for someone to prefer many traits, even if they are 'opposites', but this doesn't help us determine the factors, that is, the substantive sources of covariation among preferences. In fact, acquiescence will obscure those factors, because a general tendency to endorse items will make all indicators *more* positively correlated with one another, regardless of their content.

For this reason, I've modeled an acquiescence factor that affects all items equally, allowing this general endorsement tendency to be separated from the substantive preference factors. This seems to have been warranted, seeing as the common loading on the acquiescence factor was about 0.20 (90% posterior HDI: [0.18, 0.21]).

## Factor Correlation Matrix

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/female-attraction/factor-correlation.png" alt="Correlations among the nine preference factors" width="800">
    </figure>
</div>

The correlations between preference factors make intuitive sense. Virility is a preference for a stereotypically masculine man, and so naturally has a negative correlation with Bohemianism, which is a preference for an *unconventional* man. Preferences for youthful prettiness (Boyishness) are negatively correlated with preferences for roughness and danger (Ruggedness), as well as with the aforementioned stereotypical manliness (Virility). The negative correlation between preferences for Affluence and Bohemianism makes sense if one keeps in mind the stereotype of the starving artist. As for positive correlations, the one between preferences for Ruggedness and Virility makes sense, since both are, in their own way, preferences for a particular kind of masculinity.

## Takeaways

To be honest, I'm not sure what to put here. I think I've said everything that needs to be said. I have no further opinions. Thanks for reading.

*Thanks to [Apple Pie](https://thingstoread.substack.com/) for sharing the data!*

## Appendix

### Correlation Fishing

Let's take a look at some of the correlations[^correlation] between preferences and other traits. First, preferences and personality.

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/female-attraction/preference-personality.png" alt="Preferences and personality factor-score regressions" width="600">
    </figure>
</div>

There isn't much going on here, so let's move on to the correlations between preferences and politics.

The political items used were:

- Hierarchy: It is important for society to have a hierarchy.
- Religion: Religion is very important in my life.
- Euthanasia: People suffering from incurable diseases should have the right to be put painlessly to death.
- Equality: We would have fewer problems if we treated people more equally.
- Free speech: Free speech is important, and should be protected even if some people's feelings are hurt.
- Compulsory schooling: Teenagers should be legally required to go to school.

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/female-attraction/preference-politics.png" alt="Preferences and politics factor-score regressions" width="600">
    </figure>
</div>

Responses to the hierarchy item were positively correlated with the Virility factor and negatively correlated with the Bohemianism factor (as well as with the Companionability and Pigmentation factors). It seems like women who think societal hierarchies are important have stronger preferences for conventionally masculine men, along with stronger preferences for fairer-skinned men.

Responses to the equality item were positively correlated with the Bohemianism factor (and the Pigmentation factor) and negatively correlated with the Affluence factor. All in all, these correlations seem to be broadly the reverse of the pattern for the hierarchy item.

Other correlations were weaker, though one possibly interesting finding is the positive correlation between endorsing euthanasia and preference for Intellect.

Finally, social desirability:

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/female-attraction/social-desirability.png" alt="Social desirability factor-score regressions" width="600">
    </figure>
</div>

It seems that the most socially desirable preference is for a man who would make a good lead in a romantic comedy?

<style>
  .measurement-model { margin: 0.8rem 0 2.5rem; }
  .measurement-model .model-figure { margin: 0 0 1.5rem; overflow-x: auto; }
  .measurement-model .model-figure img { display: block; width: 100%; min-width: 720px; max-width: 900px; height: auto; margin: 0 auto; }
  .measurement-model h4 { margin: 1.3rem 0 0.55rem; font-size: 1.08em; }
  .measurement-model .model-factor-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 1.5rem; border-top: 1px solid #d0d7de; }
  .measurement-model .model-factor { min-width: 0; padding: 0.75rem 0 0.65rem; border-bottom: 1px solid #d0d7de; }
  .measurement-model .model-factor h5 { margin: 0 0 0.35rem; font-size: 1em; }
  .measurement-model.politics-model .model-factor-grid { grid-template-columns: minmax(0, 1fr); }
  .measurement-model.politics-model .model-factor { display: grid; grid-template-columns: 11rem minmax(0, 1fr); gap: 1rem; }
  .measurement-model.politics-model .model-factor ul { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 1.5rem; }
  .measurement-model ul { margin: 0; padding: 0; list-style: none; }
  .measurement-model li { margin: 0.25rem 0; line-height: 1.5; }
  .measurement-model .model-estimate { font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .measurement-model .model-hdi { color: #57606a; font-size: 0.88em; white-space: nowrap; }
  .measurement-model .model-shared { margin: 1rem 0 1.25rem; padding-left: 0.75rem; border-left: 3px solid #3069a5; }
  .measurement-model .model-method-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.15rem 1.5rem; padding-top: 0.4rem; border-top: 1px solid #d0d7de; }
  .measurement-model .model-correlations { margin: 0; border-top: 1px solid #d0d7de; }
  .measurement-model .model-correlations > div { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.45rem 0; border-bottom: 1px solid #d0d7de; }
  .measurement-model .model-correlations dt { margin: 0; font-weight: 400; font-style: normal; }
  .measurement-model .model-correlations dd { margin: 0; white-space: nowrap; }
  @media (max-width: 680px) {
    .measurement-model .model-factor-grid, .measurement-model .model-method-list { grid-template-columns: minmax(0, 1fr); }
    .measurement-model .model-correlations > div { display: block; }
    .measurement-model.politics-model .model-factor { display: block; }
    .measurement-model.politics-model .model-factor ul { grid-template-columns: minmax(0, 1fr); }
  }
</style>

### Factor Model of Personality

I modelled the HEXACO items as resulting from 8 orthogonal factors: the 6 HEXACO factors, an acquiescence factor that all items loaded on equally, and a social desirability factor.

<div class="measurement-model">
  <figure class="model-figure">
    <img src="/assets/images/female-attraction/hexaco-factor-model.svg" alt="Six orthogonal HEXACO factors, orthogonal acquiescence, and orthogonal social desirability. Each HEXACO factor loads on two signed items; acquiescence has one shared loading and social desirability has a signed loading per item.">
  </figure>
  <h4>HEXACO item loadings</h4>
  <div class="model-factor-grid"><section class="model-factor"><h5>Honesty-Humility</h5><ul><li><span class="model-item">Honest, Honorable:</span> <span class="model-estimate">0.20</span> <span class="model-hdi">(90% HDI: [0.09, 0.29])</span></li><li><span class="model-item">Amoral, Carefree:</span> <span class="model-estimate">-0.31</span> <span class="model-hdi">(90% HDI: [-0.42, -0.20])</span></li></ul></section><section class="model-factor"><h5>Emotionality</h5><ul><li><span class="model-item">Sentimental, Soft:</span> <span class="model-estimate">0.42</span> <span class="model-hdi">(90% HDI: [0.33, 0.51])</span></li><li><span class="model-item">Rugged, Unemotional:</span> <span class="model-estimate">-0.44</span> <span class="model-hdi">(90% HDI: [-0.53, -0.34])</span></li></ul></section><section class="model-factor"><h5>Extraversion</h5><ul><li><span class="model-item">Active, Talkative:</span> <span class="model-estimate">0.62</span> <span class="model-hdi">(90% HDI: [0.55, 0.69])</span></li><li><span class="model-item">Introverted, Withdrawn:</span> <span class="model-estimate">-0.63</span> <span class="model-hdi">(90% HDI: [-0.70, -0.56])</span></li></ul></section><section class="model-factor"><h5>Agreeableness</h5><ul><li><span class="model-item">Easygoing, Calm:</span> <span class="model-estimate">0.49</span> <span class="model-hdi">(90% HDI: [0.39, 0.58])</span></li><li><span class="model-item">Tense, Hot-Tempered:</span> <span class="model-estimate">-0.49</span> <span class="model-hdi">(90% HDI: [-0.59, -0.40])</span></li></ul></section><section class="model-factor"><h5>Conscientiousness</h5><ul><li><span class="model-item">Organized, Thorough:</span> <span class="model-estimate">0.40</span> <span class="model-hdi">(90% HDI: [0.30, 0.49])</span></li><li><span class="model-item">Disorganized, Careless:</span> <span class="model-estimate">-0.37</span> <span class="model-hdi">(90% HDI: [-0.46, -0.27])</span></li></ul></section><section class="model-factor"><h5>Openness</h5><ul><li><span class="model-item">Interested in Art, Deep:</span> <span class="model-estimate">0.44</span> <span class="model-hdi">(90% HDI: [0.34, 0.54])</span></li><li><span class="model-item">Down-to-Earth, Unimaginative:</span> <span class="model-estimate">-0.44</span> <span class="model-hdi">(90% HDI: [-0.56, -0.35])</span></li></ul></section></div>
  <p class="model-shared"><strong>Acquiescence:</strong> one shared loading of 0.035 <span class="model-hdi">(90% HDI: [0.013, 0.059])</span>.</p>
  <h4>Social desirability item loadings</h4>
  <ul class="model-method-list">
    <li><span class="model-item">Honest, Honorable:</span> <span class="model-estimate">0.55</span> <span class="model-hdi">(90% HDI: [0.47, 0.64])</span></li>
      <li><span class="model-item">Disorganized, Careless:</span> <span class="model-estimate">-0.48</span> <span class="model-hdi">(90% HDI: [-0.57, -0.39])</span></li>
      <li><span class="model-item">Organized, Thorough:</span> <span class="model-estimate">0.43</span> <span class="model-hdi">(90% HDI: [0.34, 0.52])</span></li>
      <li><span class="model-item">Active, Talkative:</span> <span class="model-estimate">0.20</span> <span class="model-hdi">(90% HDI: [0.11, 0.28])</span></li>
      <li><span class="model-item">Amoral, Carefree:</span> <span class="model-estimate">-0.19</span> <span class="model-hdi">(90% HDI: [-0.31, -0.08])</span></li>
      <li><span class="model-item">Introverted, Withdrawn:</span> <span class="model-estimate">-0.16</span> <span class="model-hdi">(90% HDI: [-0.24, -0.07])</span></li>
      <li><span class="model-item">Sentimental, Soft:</span> <span class="model-estimate">0.16</span> <span class="model-hdi">(90% HDI: [0.05, 0.25])</span></li>
      <li><span class="model-item">Easygoing, Calm:</span> <span class="model-estimate">0.15</span> <span class="model-hdi">(90% HDI: [0.05, 0.25])</span></li>
      <li><span class="model-item">Tense, Hot-Tempered:</span> <span class="model-estimate">-0.12</span> <span class="model-hdi">(90% HDI: [-0.22, -0.03])</span></li>
      <li><span class="model-item">Interested in Art, Deep:</span> <span class="model-estimate">0.11</span> <span class="model-hdi">(90% HDI: [0.03, 0.21])</span></li>
      <li><span class="model-item">Rugged, Unemotional:</span> <span class="model-estimate">-0.08</span> <span class="model-hdi">(90% HDI: [-0.16, -0.01])</span></li>
      <li><span class="model-item">Down-to-Earth, Unimaginative:</span> <span class="model-estimate">-0.06</span> <span class="model-hdi">(90% HDI: [-0.14, -0.002])</span></li>
  </ul>
</div>

The loadings on the HEXACO factors are moderate, though some, such as Honesty-Humility, are lower than I'd like. Overall, though, the model looks decent, and there doesn't seem to be much acquiescence occurring.

### Factor Model of Politics

Apple Pie chose the six politics items to represent the three factors of political views that they found in their earlier research: Conservatism, Tough-mindedness, and Libertarianism. Apple Pie says the factors are orthogonal, but I thought I'd test that assumption anyway by allowing the factors to correlate. I also included an orthogonal acquiescence factor.

<div class="measurement-model politics-model">
  <figure class="model-figure">
    <img src="/assets/images/female-attraction/politics-factor-model.svg" alt="Three correlated political factors each load on two signed items. Independent acquiescence has one shared positive loading on all six items.">
  </figure>
  <h4>Political item loadings</h4>
  <div class="model-factor-grid"><section class="model-factor"><h5>Conservatism</h5><ul><li><span class="model-item">It is important for society to have a hierarchy:</span> <span class="model-estimate">0.28</span> <span class="model-hdi">(90% HDI: [0.17, 0.39])</span></li><li><span class="model-item">Religion is very important in my life:</span> <span class="model-estimate">0.29</span> <span class="model-hdi">(90% HDI: [0.18, 0.40])</span></li></ul></section><section class="model-factor"><h5>Tough-mindedness</h5><ul><li><span class="model-item">People suffering from incurable diseases should have the right to be put painlessly to death:</span> <span class="model-estimate">0.11</span> <span class="model-hdi">(90% HDI: [0.03, 0.21])</span></li><li><span class="model-item">We would have fewer problems if we treated people more equally:</span> <span class="model-estimate">-0.11</span> <span class="model-hdi">(90% HDI: [-0.20, -0.01])</span></li></ul></section><section class="model-factor"><h5>Libertarianism</h5><ul><li><span class="model-item">Free speech is important, and should be protected even if some people&#39;s feelings are hurt:</span> <span class="model-estimate">0.23</span> <span class="model-hdi">(90% HDI: [0.12, 0.36])</span></li><li><span class="model-item">Teenagers should be legally required to go to school:</span> <span class="model-estimate">-0.21</span> <span class="model-hdi">(90% HDI: [-0.31, -0.10])</span></li></ul></section></div>
  <p class="model-shared"><strong>Acquiescence:</strong> one shared loading of 0.053 <span class="model-hdi">(90% HDI: [0.015, 0.089])</span>.</p>
  <h4>Factor correlations</h4>
  <dl class="model-correlations">
    <div><dt>Conservatism / Tough-mindedness</dt><dd><span class="model-estimate">0.001</span> <span class="model-hdi">(90% HDI: [-0.123, 0.130])</span></dd></div>
      <div><dt>Conservatism / Libertarianism</dt><dd><span class="model-estimate">0.015</span> <span class="model-hdi">(90% HDI: [-0.101, 0.132])</span></dd></div>
      <div><dt>Tough-mindedness / Libertarianism</dt><dd><span class="model-estimate">0.015</span> <span class="model-hdi">(90% HDI: [-0.100, 0.130])</span></dd></div>
  </dl>
</div>

Unfortunately, it's not a good model: the factor loadings are very weak. Perhaps this is because there are substantial cross-loadings; for example, we might expect the euthanasia item to also load on Libertarianism. I'd also expect the hierarchy and equality items to be more negatively correlated than would be implied by the factor correlations and loadings alone. Regardless, modeling the factors seems like a bad idea here, so I look at correlations using the raw items instead.

[^correlation]: Really, these are standardized regression coefficients between factor scores. Because the scores are calculated rather than jointly modeled, I expect the associations to be attenuated to some extent.
