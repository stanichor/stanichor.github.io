---
layout: post
title: "Waiting for the 28th Amendment"
date: 2026-07-05
permalink: /amendments/
categories: 
section: other
related:
  - /fence/
  - /metis/
  - /game-theory/
---

> The basis of our political systems is the right of the people to make and to alter their constitutions of government.

– George Washington, [*Farewell Address*](https://avalon.law.yale.edu/18th_century/washing.asp)

There are 27 amendments ratified so far to the United States Constitution. Mentally, I group them into 6 groups: the Bill of Rights, the 11th Amendment, the 12th Amendment, the Reconstruction Amendments, the 16th through 26th Amendments, and the 27th Amendment. When trying to predict when we'll next ratify a new amendment, there's the problem that amendments seem to come in groups. The Bill of Rights were, quite literally, all bundled together, hence the name. The Reconstruction Amendments were ratified over a period of 5 years, but were all tied together by the fact that they were a reaction to the Civil War, the events and conditions leading up to it, and what was necessary to move forward from it. 

Two amendments are especially awkward for prediction. The Bill of Rights are unusual because they were created right after the Constitution went into effect and came as a package deal. The 27th Amendment is unusual for the opposite reason: it was proposed in 1789 as part of the original package of proposed amendments, ten of which became the Bill of Rights, but failed to get enough states to ratify it at the time. Its eventual ratification was due to the efforts of a college student who was annoyed he got a C on his government paper (the grade was changed to an A decades later). While the results of his efforts are impressive, the amendment itself is quite boring and uncontroversial: it just delays laws affecting congressional salary from taking effect until after the next election of representatives. Researchers aren't even sure if it's [produced any actual change in Congressional behavior](https://sci-hub.usualwant.com/10.1080/07343469.2018.1444682). Given all this, the 27th Amendment looks like an outlier.

So, when modeling amendment ratification, it is sometimes worth asking how our models look when we exclude one or both of these cases. Excluding the Bill of Rights asks what the amendment process looks like after the founding. Excluding the 27th Amendment asks what the process looks like if we ignore a rather unusual, probably ineffectual amendment.

With that out of the way, let's get to the main question: when will we see a new amendment?

## A Naive Baseline

The simplest place to start is to ignore all the complications and look at the long-run average rate of amendments. This gives us a useful baseline: what would we expect if amendments did not cluster at all? There have been 27 amendments ratified since the Constitution took effect 237 years ago[^semiquincentennial] (in 1789). That's a rate of 0.11 amendments per year. At that rate, the median year for the next amendment would be around 2032, while the expected waiting time would put it around 2035.

![Estimated odds of at least one new U.S. amendment by year](/assets/images/amendments/amendment-odds-through-2100.png)

But we might count the Bill of Rights as quite unusual: they were created right after the Constitution went into effect and came as a package deal. If we exclude them, we get a rate of 0.07 amendments per year. At that rate, the median year for the next amendment would be 2036, while the expected waiting time puts it around 2040.

![Estimated odds of at least one new U.S. amendment by year (ignoring the Bill of Rights)](/assets/images/amendments/amendment-odds-through-2100-excluding-bill-of-rights.png)

## The Lindy Estimate

The long-run average rate throws away an important fact about our current situation: we haven't had an amendment in quite a while. It may be that amendment gaps are more informative than the amendment rate, so, using the Lindy Principle, we should use the length of the current gap to improve our prediction. The most recent amendment was ratified in 1992, which (in the year 2026) was 34 years ago. The Lindy principle tells us that we should expect our current amendment-less period to last another 34 years, that is, until 2060. If you only look at previous long gaps, though, the comparable range is more like 2035-2053, with an average around 2044.

![Lindy-style estimate for the next U.S. amendment](/assets/images/amendments/lindy-amendment-estimate.png)

If we exclude that problematic 27th Amendment, we get a current gap of 55 years, pushing the Lindy estimate to 2081. There is only one previous gap at least this long: the 61-year gap between the 12th and 13th Amendments.

![Lindy-style estimate for the next U.S. amendment (excluding the 27th amendment)](/assets/images/amendments/lindy-amendment-estimate.png)

## A Changing Amendment Rate

Going back to the long-run average model, it assumes the amendment rate is constant, which, looking at when the amendments were ratified, is obviously wrong. There are periods of high amendment activity and periods of low amendment activity. So, naturally, we should try to see what happens if we let the amendment rate vary over time, which I investigate using a time-varying Poisson model.

![Estimated annual Poisson rate of U.S. amendments](/assets/images/amendments/poisson-gp-amendment-rate.png)


Well, I tried to do this with all the years, but the Bill of Rights makes it so that the length-scale gets very small; when I exclude the Bill of Rights, we get better results, though the model still does not sharply separate amendment-producing periods from amendment-less periods. The result is suggestive but unsatisfying: the model wants the amendment rate to vary, but not in a way that cleanly identifies amendment “moments.”

## Amendment Regimes

So, looking at the Poisson model, it does seem like we can see four periods of increased activity (ignoring the Bill of Rights): the 11th + 12th amendments, the Reconstruction amendments, the early 20th century amendments, and the late 20th century amendments. But perhaps the amendment rate isn't a smoothly varying variable, but something that jumps discretely. One way to model this directly is to use a [Hidden Markov Model](https://en.wikipedia.org/wiki/Hidden_Markov_model). It might be that there are periods of high (relatively speaking) amendment activity and periods of low (or none) amendment activity.

I fit a 3-state model, where the states ended up being: the Bill of Rights (10 amendments in 1 year!), an active regime (1 amendment every ~6 years), and a dormant regime (no amendments being ratified). It looks like we're 33 years into a dormant period, with the previous dormant periods lasting 60 and 42 years. If the Markov assumption is roughly right, then being 33 years into a dormant period doesn't mean we're “due”; instead, one might expect several more decades before we enter another amendment-active period.

![Viterbi-decoded amendment regimes](/assets/images/amendments/hmm-viterbi-path.png)

## What the Models Suggest

The models give different dates, but mostly seem to point in the same direction: don't expect a new amendment any time soon. The naive model says we should expect an amendment sometime in the next couple of decades. The Lindy model pushes this estimate back further to several decades, especially if we exclude the outlier that is the 27th Amendment. The Poisson model suggests the amendment rate varies over time, but does not cleanly identify amendment moments. The HMM makes the historical pattern more explicit: amendment activity seems to come in regimes, and we appear to be in a dormant regime.

Amendments are rare, but also, we're currently in the midst of an amendment drought. Amendments seem to come from “moments” in history: the founding (+ the early correction of defects in the new system), the Reconstruction, and the long Progressive era to Cold War period in which the United States was expanding federal capacity, democratizing political institutions, and widening the electorate. The post-founding period and the Civil War strike me as times when the United States was fragile and could very possibly have broken. This suggests maybe we're lucky that there haven't been more amendments: it means we've avoided events that might result in the destruction of our country.

But there is another, less comforting way to read the same pattern. Maybe fewer amendments mean fewer crises severe enough to force constitutional repair. Or maybe fewer amendments mean we have lost the ability to act collectively at constitutional scale. The United States didn't seem so fragile during the 20th century; in fact, it seems like a Golden Age, full of progress (from the first flight to a man on the Moon in 66 years!). There also seems to have been a sort of definite optimism, a sort of “You Can Just Do Things,” underlying the era, which I think is best exemplified by the 21st Amendment. People thought alcohol was the cause of many social ills so they amended the Constitution to ban it, and then when that didn't work out, they changed the Constitution *again*. That's a display of agency that I can't imagine happening today.

At first, I put the 27th Amendment in a separate group due to its unusual origins, but looking at the hidden Markov model and thinking further, I think it actually should be grouped with the other 20th century amendments. What other amendment better exemplifies the spirit of agency underlying the 20th century than the one pushed through by a college student who wanted to prove his teacher wrong?

I have anemoia, nostalgia for a time and place I never lived in. It seems that there was a period full of enormous social, political, and technological change, and I'm simply living in the aftermath[^ai]. It's not that I want Prohibition back. Rather, I want the kind of country that could try Prohibition, realize it had failed, and fix its mistakes.

[^semiquincentennial]: Yes, I know we *say* that the United States is 250 years old, but what that means is that it's been 250 years since we declared independence. The Constitution (and the modern US government) took effect in 1789; it doesn't make sense to count the 13 years (one for each colony!) before the Constitution took effect seeing as there was no amendment process and no Constitution to amend.

[^ai]: AI, though, has the potential to start a new era of change. It's also the kind of change where I worry there might not be a United States left after we've gone through it.