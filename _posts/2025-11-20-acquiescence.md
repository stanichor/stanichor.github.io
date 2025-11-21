---
layout: post
title: "Understanding Acquiescence Bias"
date: 2025-11-20
permalink: /acquiescence/
categories: 
---

Acquiescence bias, also known as yea-saying bias, is the tendency to agree with statements in a questionnaire regardless of what those statements assert. Evidence for this pattern is unambiguous. As social psychologist Jon Krosnick [noted](https://www.annualreviews.org/content/journals/10.1146/annurev.psych.50.1.537), 

> When people are asked to agree or disagree with pairs of statements stating mutually exclusive views (e.g. “I enjoy socializing” versus “I don’t enjoy socializing”), answers should be strongly negatively correlated. But across more than 40 studies, the average correlation was only -.22. Across 10 studies, an average of 52% of people agreed with an assertion, whereas only 42% disagreed with its opposite. In another eight studies, an average of 14% more people agreed with an assertion than expressed the same view in a corresponding forced-choice question. And averaging across seven studies, 22% agreed with both a statement and its reversal, whereas only 10% disagreed with both.
> 
> All of these methods suggest an average acquiescence effect of about 10%, and the same sort of evidence documents comparable acquiescence in true/false and yes/no questions.

Taken together, these findings show that a sizable minority of respondents agree with statements because they are statements, not because they endorse the content.

## Why does this happen?

Several explanations for acquiescence have been proposed:
- Some people may be predisposed toward agreeableness in general, making them more likely to acquiesce on questionnaires.
- Some sociologists argue that respondents defer to researchers—perceived as higher-status figures—leading them to endorse statements out of courtesy.
- Acquiescence may also result from respondents being unable or unwilling to interpret and answer questions correctly and thoughtfully, causing them to default to agreement.

Although these mechanisms differ, they produce the same response pattern: a general tendency for some respondents to agree to statements, regardless of content.

## How acquiescence distorts results

Acquiescence inflates correlations among items because people who agree with one statement are more likely to agree with all of them. A scale composed entirely of positively keyed items—statements that require agreement to indicate a higher score—cannot distinguish someone who strongly endorses the trait being measured from someone who simply agrees with everything. As a result, means shift upward and inter-item correlations rise, creating the illusion of coherent psychological structure where none exists.

Furthermore, acquiescence correlates negatively with cognitive ability and education[^1]. Comparing two groups that differ substantially in these traits without accounting for acquiescence will lead to erroneous conclusions. The consequences of acquiescence are especially visible in international surveys. Countries with lower average test scores show higher acquiescence on international surveys[^1], producing distinctive response patterns. For instance, [as discussed by Emil Kirkegaard](https://emilkirkegaard.dk/en/2024/01/write-simple-questions-in-surveys/), the ROSE project found that roughly 75% of Ugandan students reported interest in how detergent works, compared to roughly 15% of Norwegian students. This pattern was not limited to those two countries or that specific item. Students in low-test-scoring countries reported high interest in science across the board, while students in high-test-scoring countries gave more moderate responses. Rather than conclude that students from low-test-scoring countries are unusually fascinated by detergent, it makes more sense to assume that they are more acquiescent in their responses.

## Modeling acquiescence

Acquiescence becomes identifiable when a scale contains both positively keyed and negatively keyed items. If someone strongly agrees with “I enjoy socializing” and also strongly agrees with “I do not enjoy socializing,” it is unlikely that their responses reflect their actual sociability. Rather, they reflect a general tendency to agree.

The model I use treats acquiescence as a factor that every item loads on with the same loading. This assumes that each item is equally susceptible to agreement for reasons unrelated to its content. The assumption is not perfect—difficult or technical items may attract more automatic agreement. But it isolates the primary pattern without introducing unnecessary degrees of freedom. Allowing the loadings to vary would produce a bifactor model which are notoriously prone to overfitting[^2].

## Mitigating acquiescence

Survey designers can reduce acquiescence bias by balancing their scales. A balanced scale contains equal numbers of positively and negatively keyed items. Agreement with all items becomes impossible without contradicting oneself, which allows the acquiescence component to be detected and subtracted out. Clear wording and manageable survey length also help by reducing the cognitive load that pushes respondents toward automatic agreement.

[^1]: Gerhard Meisenberg; Amandy Williams (2008). [Are acquiescent and extreme response styles related to low intelligence and education?](https://sci-hub.usualwant.com/10.1016/j.paid.2008.01.010). doi:10.1016/j.paid.2008.01.010 
[^2]: [One simulation study](https://www.annualreviews.org/content/journals/10.1146/annurev-clinpsy-050718-095522) generated data from three different conditions: a correlated-factors structure, a bifactor structure, and a condition with minimal structure. In all three cases, the bifactor model outperformed the true data-generating model on likelihood-based fit indices. A model that explains everything explains nothing.