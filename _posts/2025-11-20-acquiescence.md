---
layout: post
title: "Understanding Acquiescence Bias"
date: 2025-11-20
permalink: /acquiescence/
category: measurement
related:
  - /schwartz-values/
  - /attraction-to-women/
  - /attraction-to-men/
---

Acquiescence bias, also known as yea-saying bias, is the tendency to agree with statements in a questionnaire regardless of what those statements assert. As social psychologist Jon Krosnick [noted](https://www.annualreviews.org/content/journals/10.1146/annurev.psych.50.1.537),

> When people are asked to agree or disagree with pairs of statements stating mutually exclusive views (e.g. “I enjoy socializing” versus “I don’t enjoy socializing”), answers should be strongly negatively correlated. But across more than 40 studies, the average correlation was only -.22. Across 10 studies, an average of 52% of people agreed with an assertion, whereas only 42% disagreed with its opposite. In another eight studies, an average of 14% more people agreed with an assertion than expressed the same view in a corresponding forced-choice question. And averaging across seven studies, 22% agreed with both a statement and its reversal, whereas only 10% disagreed with both.
>
> All of these methods suggest an average acquiescence effect of about 10%, and the same sort of evidence documents comparable acquiescence in true/false and yes/no questions.

## Why does this happen?

There are a few (non-exclusive) possible explanations:

- Some people may simply be more inclined to agree with others, including on questionnaires.
- Some sociologists argue that respondents defer to researchers, whom they perceive as higher-status figures, and agree out of courtesy.
- Respondents might also have trouble understanding the questions, or simply not want to think too hard about them, and default to agreement. The fact that acquiescence is negatively correlated with cognitive ability and education[^1] supports this explanation.

Although these mechanisms differ, they produce the same response pattern: a general tendency for some respondents to agree to statements, regardless of content.

## How acquiescence distorts results

Acquiescence inflates correlations among items because people who agree with one statement are more likely to agree with the others as well, not because they actually agree with the item content, but because they just tend to agree with items. If a scale contains only positively keyed items (where agreement indicates more of the trait), we can't easily distinguish someone who strongly endorses the trait from someone who just agrees with everything. This pushes up the mean and the correlations between items, making the scale look more internally consistent than it really is.

Acquiescence can also cause problems when comparing groups, especially in international surveys, since response styles can differ substantially between countries. For example, [Emil Kirkegaard](https://emilkirkegaard.dk/en/2024/01/write-simple-questions-in-surveys/) discusses results from the ROSE project, which found that roughly 75% of Ugandan students reported interest in how detergent works, compared to roughly 15% of Norwegian students. And it wasn't just detergent. Students in some countries reported high interest in practically every science topic they were asked about, while students in others were much more selective. I find it hard to believe that these differences are entirely due to genuine differences in interest. For example, I'm rather skeptical that Ugandan students are *that* interested in detergent. Some of the variation is probably due to differences in acquiescence.

## Modeling acquiescence

Acquiescence becomes identifiable when a scale contains both positively keyed and negatively keyed items. If someone strongly agrees with "I enjoy socializing" and also strongly agrees with "I do not enjoy socializing," it's a pretty good guess that they just have a tendency to agree with statements.

The model I tend to use treats acquiescence as a factor that every item loads on with the same loading. In other words, it assumes that each item is equally susceptible to agreement for reasons unrelated to its content. Obviously, this assumption isn't perfect. Difficult or technical items may attract more automatic agreement than simpler ones. But letting the loadings vary freely would introduce a lot more parameters (and problems); it would result in a bifactor model which are notoriously prone to overfitting[^2].

## Mitigating acquiescence

One way to deal with acquiescence is to balance the scale, with equal numbers of positively and negatively keyed items. The acquiescence on the positively and negatively keyed items will balance out, resulting in a score that shouldn't be biased by acquiescence. To *lessen* acquiescence, clear wording and shorter questionnaires help, since respondents will have less reason to default to agreement.

[^1]: Gerhard Meisenberg; Amandy Williams (2008). [Are acquiescent and extreme response styles related to low intelligence and education?](https://doi.org/10.1016/j.paid.2008.01.010). doi:10.1016/j.paid.2008.01.010

[^2]: [One simulation study](https://www.annualreviews.org/content/journals/10.1146/annurev-clinpsy-050718-095522) generated data from three different conditions: a correlated-factors structure, a bifactor structure, and a condition with minimal structure. In all three cases, the bifactor model outperformed the true data-generating model on likelihood-based fit indices. A model that explains everything explains nothing.
