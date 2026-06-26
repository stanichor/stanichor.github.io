---
layout: post
title: "How Autistic Are Rationalists?"
date: 2026-05-05
permalink: /rat-autism/
redirect_from:
  - /autistic-rats/
categories: 
section: rationalist
related:
  - /rat-iq/
  - /systemizing/
  - /rat-demos/
---

It's popular to call oneself autistic these days, especially in the rationalist community. But how many rats are actually autistic? I'll look at three quantities: diagnosed autism, autism rates inferred from Autism Quotient scores, and average level of autistic traits.

## Diagnosed Autism

The [2016 LessWrong Diaspora Survey](https://jdpressman.com/public/lwsurvey2016/analysis/general_analysis_output.txt) found that 52% of respondents had no autism diagnosis, 8.5% self-reported autism without a formal diagnosis, 5.4% had been formally diagnosed, and 34.2% declined to answer. Among respondents who answered the question, 8.2% reported a formal autism diagnosis. If nonrespondents were similar to respondents, this estimates the diagnosed-autism rate at about 8.2%; if all nonrespondents were undiagnosed, the lower bound is 5.4%.

The [2014 LessWrong Survey](https://www.lesswrong.com/posts/YAkpzvjC768Jm2TYb/2014-survey-results) found similar numbers: 6.5% formally diagnosed, 11.2% self-diagnosed, and 76.0% undiagnosed.

## Model-Inferred Autism from AQ Scores

The [2012 LessWrong Survey](https://www.lesswrong.com/posts/x9FNKTEt68Rz6wQ6P/2012-survey-results) didn't ask about diagnoses directly, but did have participants take the [Autism Quotient](https://psychology-tools.com/test/autism-spectrum-quotient) (AQ) and report their scores[^aq-distribution]. For comparison, [the study that introduced the AQ](https://docs.autismresearchcentre.com/papers/2001_BCetal_AQ.pdf) tested 174 randomly selected controls (M = 16.4, SD = 6.3) and 58 adults with Asperger syndrome or high-functioning autism (M = 35.8, SD = 6.5).

Using the [raw data](https://web.archive.org/web/20130116004605/http://raikoth.net/Stuff/LessWrong/for_public.csv) from the 2012 survey, we can do some Bayesian inference[^bayes] to estimate what fraction of rats are autistic. Since we have the raw score distribution, we can calculate the posterior probability of autism for each individual, then average those probabilities across respondents.

The main uncertainty is the base rate of autism, which is hard to pin down because of [diagnostic drift over time](https://substack.com/@cremieux/p-161498315). Because the autistic and non-autistic AQ distributions overlap substantially, the estimated autistic fraction is prior-sensitive, especially for intermediate AQ scores. That said, here's what we get under different base rates (code [here](https://gist.github.com/stanichor/f9192fb93f249879f946680f5ecddf5a)):

- **3%** under a 0.1% base rate
- **7%** under a 0.5% base rate
- **10%** under a 1.0% base rate

## Autistic-Trait Elevation

Since there's no clear "true" base rate, an alternative framing may be to ask how much more autistic the average rationalist is relative to the general population. The answer: (24.1 − 16.4) / 6.3 = **1.2 SD above the control mean** (and 1.8 SD below the clinical autistic mean).

Of course, the 2012 survey is over a decade old. A more recent data source is a certain Discord channel[^discord] (N = 13), where the median AQ score was 20, about **0.6 SD above the control mean** (and 2.4 SD below the clinical sample).

## Summary

In summary, rationalists are clearly more autistic than average. Formal diagnosis rates range from 6% to 8%. Under a simple model, 3-10% of rationalists are autistic, which is 10 to 30 times higher than the general-population rate, depending on your prior. Rationalists also score 0.6 to 1.2 SD above the general population in autistic traits. So rationalists are mostly *not* autistic, though autism is very overrepresented.

[^discord]: The same channel used in [my post estimating the average rationalist IQ](https://stanichor.net/rationalist-iq/). It's composed of rationalists and rationalist-adjacent people, the IQ estimate from it matched figures I calculated from other sources, and it's only a couple years out of date, making it arguably more relevant for estimating current rationalist AQ scores than the 2012 LW survey.

[^bayes]: I model AQ scores as coming from a two-component mixture: non-autistic controls $\mathcal{N}(16.4, 6.3^2)$ and autistic adults $\mathcal{N}(35.8, 6.5^2)$, using the paper's reported group means and SDs. For each LW respondent with a valid AQ score, I compute $P(\text{autistic} \| \text{AQ} = x)$ by Bayes' rule under a chosen prior, then average those posterior probabilities across respondents.

[^aq-distribution]: The mean AQ scores was 24.1 and the standard deviation was 12.2