---
layout: post
title: "What Is A Nerd? (A Psychometric Analysis of the NPAS)"
date: 2025-10-14
permalink: /nerd-scale/
categories: 
---

What is a nerd? Definitions vary, but one practical way to answer that question is empirical: identify the traits that predict someone's self-label of "nerd". The [Nerdy Personality Attributes Scale](https://openpsychometrics.org/tests/NPAS/) (NPAS) does exactly that. The creators began with 445 candidate items, had participants rate themselves on the items, report how nerdy they were, and then kept the 26 items most strongly correlated with self-reported nerdiness[^1]. Below I describe the data, the factor structure, reliability and validity, gender bias in items, a reduced 12-item set, and what the findings imply about the prototypical “nerd.”

## Data

The analysis uses the [public NPAS dataset](https://openpsychometrics.org/_rawdata/) from Open Psychometrics (N = 14,167). Respondents rated 26 items on a five-point scale from Strongly Disagree (1) to Strongly Agree (5). The sample is self-selected (visitors to an online psychometrics site); the sample is probably nerdier than average.

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/nerd-scale/summed-scores.png" width="600" alt="Alt text">
    </figure>
</div>

## Factor Structure

Exploratory factor analysis produced a clear one-factor solution; additional factors were uninterpretable. The factor loadings are as follows: 

| Question | Loading |
|-|-|
| Q5: I collect books. | 0.58 |
| Q26: I can be socially awkward at times. | 0.57 |
| Q9: I like science fiction. | 0.56 |
| Q13: I would describe my smarts as bookish. | 0.56 |
| Q24: I am a strange person. | 0.55 |
| Q6: I prefer academic success to social success. | 0.54 |
| Q17: I am more comfortable interacting online than in person. | 0.54 |
| Q4: My appearance is not as important as my intelligence. | 0.50 |
| Q20: I was a very odd child. | 0.50 |
| Q10: I would rather read a book than go to a party. | 0.49 |
| Q1: I am interested in science. | 0.48 |
| Q8: I spend recreational time researching topics others might find dry or overly rigorous. | 0.48 |
| Q23: I get excited about my ideas and research. | 0.47 |
| Q14: I like to read technology news reports. | 0.47 |
| Q12: I spend more time at the library than any other public place. | 0.47 |
| Q3: I like to play RPGs. (Ex. D&D) | 0.44 |
| Q7: I watch science related shows. | 0.43 |
| Q22: I enjoy learning more than I need to. | 0.42 |
| Q2: I was in advanced classes. | 0.42 |
| Q16: I gravitate towards introspection. | 0.39 |
| Q25: I care about super heroes. | 0.38 |
| Q21: I sometimes prefer fictional people to real ones. | 0.35 |
| Q18: I love to read challenging material. | 0.30 |
| Q11: I am more comfortable with my hobbies than I am with other people. | 0.29 |
| Q15: I have started writing a novel. | 0.28 |
| Q19: I have played a lot of video games. | 0.22 |

### Internal Consistency

The coefficient omega is 0.87, a level of internal consistency that supports treating the 26 items as a coherent scale. However, test information begins to fall off above +1 SD on the latent trait, indicating the NPAS has fewer items that discriminate high levels of nerdiness in this sample. This is consistent with a ceiling effect in the population, probably as a result of the self-selection. The latent nerdiness score correlates r = 0.51 with self-reported nerdiness (1–7 scale) which supports validity.

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/nerd-scale/full-scale-reliability.png" width="600" alt="Alt text">
    </figure>
</div>

## Examination of Sex Differences
I tested for differential item functioning[^2] (DIF) by gender. Items with absolute DIF magnitude > 0.10 are shown below; positive values indicate greater probability of endorsement for women at the same latent level; negative values favor men.

Biased in favor of women:
- Q8: I spend recreational time researching topics others might find dry or overly rigorous. (+0.19)
- Q23: I get excited about my ideas and research. (+0.17)
- Q21: I sometimes prefer fictional people to real ones. (+0.16)
- Q13: I would describe my smarts as bookish. (+0.14)
- Q22: I enjoy learning more than I need to. (+0.11)

Biased in favor of men:
- Q19: I have played a lot of video games. (-0.26)
- Q25: I care about super heroes. (-0.24)
- Q7: I watch science related shows. (-0.15)
- Q11: I am more comfortable with my hobbies than I am with other people. (-0.15)
- Q5: I collect books. (-0.11)

Several biased items reflect cultural differences in hobby expression and media consumption rather than differences in the underlying latent trait. The distribution of latent nerdiness by gender is displayed below:

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/nerd-scale/latent-scores-by-gender.png" width="600" alt="Alt text">
    </figure>
</div>

Adjusting for bias, there's little difference between average male and female nerdiness.

## Reduced Item Set

To make a shorter scale, I applied [Bayesian Design Optimization](https://haines-lab.com/post/bayesian-design-optimization-an-application-to-item-reduction-in-scale-development-research/) to reduce the number of items while maximizing information. Reducing the number of items to 12 (while excluding items displaying DIF), yields the following items (ordered by expected information contribution): 

- Q4: My appearance is not as important as my intelligence.
- Q9: I like science fiction.
- Q6: I prefer academic success to social success.
- Q17: I am more comfortable interacting online than in person.
- Q2: I was in advanced classes.
- Q26: I can be socially awkward at times.
- Q1: I am interested in science.
- Q20: I was a very odd child.
- Q24: I am a strange person.
- Q3: I like to play RPGs. (Ex. D&D)
- Q10: I would rather read a book than go to a party.
- Q14: I like to read technology news reports.

The plot below shows the reliability across the scale. The 12-item set reduces reliability slightly (coefficient omega has dropped to 0.80), although the effect is more pronounced at the higher end of the scale.

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/nerd-scale/reduced-scale-reliability.png" width="600" alt="Alt text">
    </figure>
</div>

The following plot is a Tailcalled diagram for the reduced set. We create a standardized (mean=0, SD=1) latent variable summarizing the displayed items in the bottom of the plot. The rows below the histogram show the median response to each question for a given level of the latent variable. 

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/nerd-scale/reduced-set-tailcalled-diagram.png" width="600" alt="Alt text">
    </figure>
</div>

## What is a nerd?

In essence, the prototypical nerd is **a socially awkward introvert who values intelligence, learning, and education over popularity**. This definition captures the central cluster of traits: intellectual interests and a lack of social success. Others have also attempted to define what a nerd is:  
- Paul Graham, in his 2003 essay, [Why Nerds Are Unpopular](https://paulgraham.com/nerds.html), argues that nerds are people who value intelligence over popularity. This trait aligns closely with items Q4 and Q6, so Graham’s definition fits the data well.
- In [On “Geek” Versus “Nerd”](https://slackprop.wordpress.com/2013/06/03/on-geek-versus-nerd/), the author investigates the distinction between geeks and nerds by performing textual analysis of Twitter. They conclude that "*geeky* words are more about *stuff* (e.g., “#stuff”), while *nerdy* words are more about *ideas* (e.g., “hypothesis”). Geeks are fans, and fans collect stuff; nerds are practitioners, and practitioners play with ideas." This contrast is interesting given that the highest-loading item, Q5, is “I collect books.” Yet most NPAS items are idea-oriented, emphasizing curiosity and intellect rather than collecting or fandom. A nerd collects books not to own them, but to read and absorb the ideas inside. Other items are about interests in science, research, and learning.

[^1]: [Development of the Nerdy Personality Attributes Scale](https://openpsychometrics.org/tests/NPAS/development/)

[^2]: Basically, whether the items display bias.