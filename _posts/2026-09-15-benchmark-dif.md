---
layout: post
title: "Do AI Benchmarks Measure the Same Thing Over Time?"
date: 2026-09-15
permalink: /benchmark-dif/
categories: 
section: psychometrics-practical
related:
---

<link rel="stylesheet" href="{{ '/assets/css/benchmark-dif.css' | relative_url }}">

AI's moving pretty fast these days. How fast? Really fast. You want a quantitative answer? That's what benchmarks are for. Just have the AI models answer questions and complete tasks, then score the results. You can use the scores to compare models and chart AI progress. But benchmarks have a problem. They saturate too fast. AI progress is so fast that benchmarks can become useless within a couple of years, sometimes much less.

So, you might think to solve this problem by 'linking' benchmarks together. If you know how much more difficult one benchmark is than another, you can sort of combine them into a mega-benchmark that works even as model capabilities saturate easier benchmarks. This is how Epoch's ECI works.

It borrows from item response theory, specifically the 2PL model. The 2PL model is so called because it uses the logistic function and two parameters, the benchmark discrimination ($\alpha_b$) and difficulty ($D_b$), in the following way (for Epoch's ECI):

$$
\mu_{mb} = \sigma(\alpha_b[C_m-D_b])
$$

where:

$$
\sigma(x) = \frac{1}{1+e^{-x}}
$$

where:

- $\mu_{mb}$ is the predicted performance of a model, $m$, on a benchmark $b$.
- $\alpha_b$ is the benchmark's discrimination. It tells us how good the benchmark is at 'discriminating' between high- and low-capability models. On a benchmark with high discrimination, small differences in capability produce large differences in performance, while on a benchmark with low discrimination, performance changes more gradually with capability.
- $D_b$ is the benchmark's difficulty. It tells us, well, how difficult the benchmark is.
- $C_m$ is the model's capability. Models with high capabilities will be able to do well even on difficult benchmarks, while those with low capabilities will struggle with even easy benchmarks.

The ECI assumes these parameters are constant across time, but that's not a safe assumption to make. Whenever we're comparing a latent construct across groups, we need to ensure that our measurement instrument is measuring the same construct in the same way. In psychometrics, this is called [*measurement invariance*](https://www.the100.ci/2024/01/10/a-casual-but-causal-take-on-measurement-invariance/). Otherwise, we could have biased items that make one group artificially score higher than another, giving us misleading results.

For example, vocabulary is known to be very *g*-loaded, and so one might decide to use a vocabulary test as a proxy for cognitive ability, like WORDSUM in the General Social Survey. However, there are words that men are more likely to know than women and vice versa[^vocab].

<div class="vocabulary-gap-table" role="region" aria-label="Vocabulary knowledge differences by gender">
<table>
  <thead>
    <tr>
      <th colspan="2" class="vocabulary-gap-men">Men more likely to know</th>
      <th colspan="2" class="vocabulary-gap-women">Women more likely to know</th>
    </tr>
    <tr>
      <th>Word</th>
      <th>Advantage</th>
      <th>Word</th>
      <th>Advantage</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>howitzer</td><td>+31 pp</td><td>peplum</td><td>+51 pp</td></tr>
    <tr><td>thermistor</td><td>+31 pp</td><td>tulle</td><td>+50 pp</td></tr>
    <tr><td>azimuth</td><td>+31 pp</td><td>chignon</td><td>+48 pp</td></tr>
    <tr><td>femtosecond</td><td>+32 pp</td><td>bandeau</td><td>+46 pp</td></tr>
    <tr><td>milliamp</td><td>+32 pp</td><td>freesia</td><td>+45 pp</td></tr>
    <tr><td>aileron</td><td>+33 pp</td><td>chenille</td><td>+42 pp</td></tr>
    <tr><td>servo</td><td>+33 pp</td><td>kohl</td><td>+41 pp</td></tr>
    <tr><td>degauss</td><td>+33 pp</td><td>verbena</td><td>+40 pp</td></tr>
    <tr><td>boson</td><td>+32 pp</td><td>doula</td><td>+38 pp</td></tr>
    <tr><td>checksum</td><td>+33 pp</td><td>ruche</td><td>+37 pp</td></tr>
  </tbody>
</table>
<p>“Advantage” is the difference in the proportion of men and women who knew the word, in percentage points.</p>
</div>

If we have a test that consists of many of these words, it'll be biased: one gender will have a higher chance of getting items correct than the other, even holding cognitive ability constant.

Going back to AI models, we might decide to group models by *when* they were released. In this case, for example, a benchmark might become popular, so much so that labs start explicitly optimizing for performance on it. We might then see models' performance on that benchmark increase very rapidly, much faster than their general capability. In that case, making use of the benchmark without accounting for this shift would cause us to overestimate AI progress. And so, we must check whether the parameters are actually static across time.

For this analysis, I use the public ECI data downloaded on September 15, 2026, containing 2,745 reported scores from 264 models across 58 benchmarks. I measure time using each model’s release month. Thus, a change over time means that models released in different months have different expected performance on a benchmark after accounting for their estimated general capability.

First, what happens when we allow the benchmark discriminations to vary depending on model release date?

<section
  class="benchmark-dif-interactive"
  data-benchmark-dif-chart
  data-kind="discrimination"
  data-default-benchmark="b47"
  data-data-url="{{ '/assets/jsons/benchmark_dif.json' | relative_url }}"
  aria-labelledby="benchmark-discrimination-title"
>
  <div class="benchmark-dif-heading">
    <div>
      <h2 id="benchmark-discrimination-title" data-role="title">Benchmark discrimination over time</h2>
      <p>Absolute posterior mean with a 90% credible band for temporal shape</p>
    </div>
    <label class="benchmark-dif-control">
      <span>Benchmark</span>
      <select data-role="benchmark-select" disabled>
        <option>Loading benchmarks…</option>
      </select>
    </label>
  </div>
  <div class="benchmark-dif-marker-key" aria-label="Month marker legend">
    <span><i class="is-shape-band" aria-hidden="true"></i>90% temporal-shape band</span>
    <span><i aria-hidden="true"></i>Month with observations</span>
    <span><i class="is-interpolated" aria-hidden="true"></i>Interpolated month</span>
    <span><i class="is-epoch" aria-hidden="true"></i>Epoch static estimate</span>
  </div>
  <div class="benchmark-dif-plot" data-role="plot"></div>
  <p class="benchmark-dif-status" data-role="status" aria-live="polite">Loading discrimination estimates…</p>
  <p class="benchmark-dif-footnote">The band removes uncertainty in the curve’s observation-weighted overall level, isolating uncertainty in its temporal shape. Hover over, tap, or use the arrow keys for the ordinary absolute interval. Interpolated months receive zero weight; blank periods fall outside the observed range.</p>
  <p class="sr-only" data-role="readout" aria-live="polite"></p>
</section>

There are two benchmarks that display a unique, peculiar U-shape: VPCT and GSM8K. I'm not quite sure why this is. Other than those two, most benchmarks have either relatively static discriminations or decreasing discriminations over time, the most prominent of which are ARC-AGI-2, DeepSWE, GeoBench, and GDPval. There aren't actually any benchmarks I can confidently say have had increasing discriminations, rather than the weird U-shape. This might be because model capabilities eventually progress past the point at which benchmarks have peak discriminative ability and into a region where they become increasingly poor at discriminating between models, because they don't have enough items of the requisite difficulty.

What happens when we allow a benchmark's difficulty to vary depending on model release date?

<section
  class="benchmark-dif-interactive"
  data-benchmark-dif-chart
  data-kind="difficulty"
  data-default-benchmark="b7"
  data-data-url="{{ '/assets/jsons/benchmark_dif.json' | relative_url }}"
  aria-labelledby="benchmark-difficulty-title"
>
  <div class="benchmark-dif-heading">
    <div>
      <h2 id="benchmark-difficulty-title" data-role="title">Benchmark difficulty over time</h2>
      <p>Absolute posterior mean EDI with a 90% credible band for temporal shape</p>
    </div>
    <label class="benchmark-dif-control">
      <span>Benchmark</span>
      <select data-role="benchmark-select" disabled>
        <option>Loading benchmarks…</option>
      </select>
    </label>
  </div>
  <div class="benchmark-dif-marker-key" aria-label="Month marker legend">
    <span><i class="is-shape-band" aria-hidden="true"></i>90% temporal-shape band</span>
    <span><i aria-hidden="true"></i>Month with observations</span>
    <span><i class="is-interpolated" aria-hidden="true"></i>Interpolated month</span>
    <span><i class="is-epoch" aria-hidden="true"></i>Epoch static estimate</span>
  </div>
  <div class="benchmark-dif-plot" data-role="plot"></div>
  <p class="benchmark-dif-status" data-role="status" aria-live="polite">Loading difficulty estimates…</p>
  <p class="benchmark-dif-footnote">The band removes uncertainty in the curve’s observation-weighted overall level, isolating uncertainty in its temporal shape. Hover over, tap, or use the arrow keys for the ordinary absolute interval. Interpolated months receive zero weight; blank periods fall outside the observed range.</p>
  <p class="sr-only" data-role="readout" aria-live="polite"></p>
</section>

Benchmarks with increasing difficulty include Winogrande, Fiction.LiveBench, DeepResearch Bench, and ARC AI2, which seem to share a focus on language tasks. Benchmarks with decreasing difficulty include DeepSWE, GSM8K, MATH Level 5, and OSWorld. DeepSWE is the benchmark that's exhibited the biggest decrease in difficulty, so much so that it's an outlier. It's also focused on long-horizon software engineering, which seems to be a popular focus of labs as of late, a fact which I don't think is a coincidence. The other fast-decreasing benchmarks are focused on math and software ability, which have also been a focus of labs recently.

Now, I don't think it makes sense to think of benchmarks as literally getting more or less difficult. Ideally, they should be the same difficulty across time. So I think it's best to interpret increasing benchmark "difficulty" as models improving on that benchmark more slowly than they're improving in general capability, and decreasing benchmark "difficulty" as models improving on that benchmark faster than they're improving in general capability. Under that interpretation, the pattern makes sense. We see models increasing their math and coding capabilities faster than their general ability, while improving at language tasks more slowly than their general ability. This makes sense. Labs are focusing heavily on math and coding through post-training regimes such as RLVR, while comparatively less attention is being paid to language tasks.

Is there a correlation between average discrimination changes and average difficulty changes?

<section
  class="benchmark-dif-interactive benchmark-dif-scatter-card"
  data-benchmark-dif-scatter
  data-data-url="{{ '/assets/jsons/benchmark_dif.json' | relative_url }}"
  aria-labelledby="benchmark-change-correlation-title"
>
  <div class="benchmark-dif-heading">
    <div>
      <h2 id="benchmark-change-correlation-title">Average monthly changes</h2>
      <p data-role="subtitle">Each point shows one benchmark’s posterior-mean change.</p>
    </div>
  </div>
  <div class="benchmark-dif-correlation-summary" data-role="correlation-summary" hidden>
    <div class="benchmark-dif-correlation-row">
      <span class="benchmark-dif-correlation-label">All benchmarks</span>
      <strong data-role="correlation-all-estimate"></strong>
      <span class="benchmark-dif-correlation-interval" data-role="correlation-all-interval"></span>
    </div>
    <div class="benchmark-dif-correlation-row">
      <span class="benchmark-dif-correlation-label">Without DeepSWE and VPCT</span>
      <strong data-role="correlation-restricted-estimate"></strong>
      <span class="benchmark-dif-correlation-interval" data-role="correlation-restricted-interval"></span>
    </div>
  </div>
  <div class="benchmark-dif-scatter" data-role="plot"></div>
  <p class="benchmark-dif-status" data-role="status" aria-live="polite">Loading benchmark changes…</p>
  <p class="benchmark-dif-footnote">The correlation is recalculated for every paired posterior draw; its interval therefore includes uncertainty in both temporal parameters. Hover over or tap a point to see the benchmark and exact posterior-mean changes. Selecting a point also updates both trend charts.</p>
  <p class="sr-only" data-role="readout" aria-live="polite"></p>
</section>

If we ignore the outliers that are DeepSWE and VPCT, our mean estimate is that the correlation is exactly... 0. So, it doesn't seem like there's anything interesting there.

So, should we throw out the ECI because it uses static parameters and try something new? No. It turns out that predicted model capabilities taking changing parameters into account correlate at 0.995 with Epoch's predicted model capabilities, making them nearly identical. The same holds for benchmark difficulties, which correlate at 0.98, though at the extremes my estimates suggest that the hardest benchmarks aren't quite as hard as Epoch estimates and the easiest benchmarks aren't quite as easy. Benchmark discriminations are less correlated, at only 0.85, but there's no discernible systematic pattern to the differences.

Still, it does mean we need to be careful when treating AI capability as a unitary construct, as the ECI does. Which capabilities are most relevant changes over time, partly because labs shift their focus. It used to be reading and understanding language, but as models became proficient at that, attention shifted toward coding and mathematics. A chart that represents AI progress with a single capability score is therefore somewhat misleading: what counts as capability changes over time. Progress in currently relevant capabilities, such as mathematics and coding, may be underestimated by combining them with benchmarks that emphasize domains in which progress is now slower, such as general language understanding. Those benchmarks pull the construct the ECI is measuring towards slower-moving domains.

In conclusion, the ECI remains a (very) useful summary of average benchmark performance, but it should not be mistaken for a measure of a single, unchanging construct. We should take care to think about *which* capabilities we think are useful to measure.

## Appendix

### The Real Treasure Was The Models We Made Along The Way

I didn't begin with the final two-stage model. I started by reproducing Epoch's estimator as literally as possible, then changed one assumption at a time, to ensure I wasn't making any silly mistakes. Expand the steps below to follow the progression from the public ECI implementation to the two-stage model used in this post. (You *could* always just skip to the final model, but I think it's easier to go step-by-step.)

The code, frozen data, and compact results for all six models are available in the [accompanying GitHub repository](https://github.com/stanichor/eci-temporal-invariance).

<details class="model-step" markdown="1">
<summary><h4 id="bayesianizing-eci">1. Bayesianizing the ECI</h4></summary>

The core of Epoch's model is, as described above, the logistic function ([source](https://epoch.ai/data/eci-documentation/methodology)) ([line 242](https://github.com/epoch-research/eci-public/blob/main/src/eci/fitting.py#L242) of the ECI implementation):

$$
\mu_{mb} = \sigma(\alpha_b[C_m-D_b])
$$

where:

$$
\sigma(x) = \frac{1}{1+e^{-x}}
$$

**Free parameter vector**

There are $M$ models and $B$ benchmarks. Epoch's implementation estimates:

$$\phi = (C_1, \dots, C_M,D_1,\dots,D_B,\alpha_1,\dots,\alpha_{B-1})$$

There is one benchmark discrimination excluded from the free parameter vector: Winogrande's discrimination, which is fixed at 1. The number of free parameters is therefore:

$$
K = M + 2B - 1
$$

The raw parameter bounds are ([lines 257-266](https://github.com/epoch-research/eci-public/blob/main/src/eci/fitting.py#L257-L266) of the ECI implementation):

$$-10 \leq C_m \leq 10$$

$$-10 \leq D_b \leq 10$$

$$0.1 \leq \alpha_b \leq 10$$

Observed scores are clipped to $[0.001,0.999]$ before fitting ([lines 196-197](https://github.com/epoch-research/eci-public/blob/main/src/eci/fitting.py#L196-L197) of the ECI implementation).

**Implemented residual vector**

For every observed score, the code ([line 243](https://github.com/epoch-research/eci-public/blob/main/src/eci/fitting.py#L243) of the ECI implementation) supplies SciPy with the residual:

$$
r_{mb}(\phi) = \mu_{mb}(\phi) - s_{mb}
$$

It appends one additional regularization residual ([lines 245-246](https://github.com/epoch-research/eci-public/blob/main/src/eci/fitting.py#L245-L246) of the ECI implementation):

$$
r_\text{reg}(\phi) = \sqrt{\lambda \frac{1}{K} \sum_{k=1}^{K}\phi_k^2}
$$

where the default regularization strength is ([line 138](https://github.com/epoch-research/eci-public/blob/main/src/eci/fitting.py#L138) of the ECI implementation):

$$
\lambda = 0.1
$$

Scipy's `least_squares` minimizes one half of the sum of squared residuals. Epoch's implemented objective is therefore:

$$
\begin{aligned}
\mathcal{L}(\phi) &= \frac{1}{2}\left(\left(\sum_{(m,b) \in \mathcal{O}} r_{mb}(\phi)^2\right) + r_\text{reg}(\phi)^2\right) \\
&= \frac{1}{2}\left(\left(\sum_{(m,b) \in \mathcal{O}} [\mu_{mb}(\phi) - s_{mb}]^2\right) + \lambda\frac{1}{K}\sum_{k=1}^{K}\phi_k^2\right) \\
&= \frac{1}{2}\sum_{(m,b) \in \mathcal{O}}[\mu_{mb}(\phi) - s_{mb}]^2 + \frac{1}{2}\frac{\lambda}{K}\sum_{k=1}^{K}\phi_k^2
\end{aligned}
$$

subject to the parameter bounds and the fixed Winogrande discrimination.

**Public scale**

After fitting, Epoch maps the raw capabilities to the ECI scale using Claude 3.5 Sonnet at 130 and GPT-5 at 150.

**Exact MAP-equivalent model**

Assume conditionally independent Gaussian score errors with fixed residual standard deviation $\sigma_\varepsilon$:

$$
s_{mb}\mid\phi
\sim
\mathcal N\left(\mu_{mb}(\phi),\sigma_\varepsilon^2\right).
$$

The negative log-likelihood, ignoring constants, is:

$$
-\log p(s\mid\phi)
=
\frac{1}{2\sigma_\varepsilon^2}
\sum_{(m,b)\in\mathcal O}
\left[s_{mb}-\mu_{mb}(\phi)\right]^2.
$$

We place independent Gaussian priors with a common standard deviation $\tau$ on the free parameters, subject to the same bounds used by Epoch:

$$
C_m\sim\operatorname{TruncatedNormal}(0,\tau^2;-10,10),
$$

$$
D_b\sim\operatorname{TruncatedNormal}(0,\tau^2;-10,10),
$$

and:

$$
\alpha_b
\sim
\operatorname{TruncatedNormal}(0,\tau^2;0.1,10)
$$

for each non-Winogrande benchmark. The Winogrande slope remains fixed:

$$
\alpha_{\text{Winogrande}}=1.
$$

Away from the bounds, the negative log-prior is:

$$
-\log p(\phi)
=
\frac{1}{2\tau^2}
\sum_{k=1}^{K}\phi_k^2
+\text{constant}
$$

So, the negative log-posterior is

$$
-\log p(s\mid\phi) - \log p(\phi) = \frac{1}{2\sigma_\varepsilon^2}
\sum_{(m,b)\in\mathcal O}
\left[s_{mb}-\mu_{mb}(\phi)\right]^2 + \frac{1}{2\tau^2}
\sum_{k=1}^{K}\phi_k^2
$$

If we multiply the negative log-posterior by $\sigma_\epsilon^2$, we get:

$$
\frac{1}{2}
\sum_{(m,b)\in\mathcal O}
\left[s_{mb}-\mu_{mb}(\phi)\right]^2
+
\frac{1}{2}
\frac{\sigma_\varepsilon^2}{\tau^2}
\sum_{k=1}^{K}\phi_k^2
$$

This matches Epoch's objective when:

$$
\boxed{
\frac{\lambda}{K}
=
\frac{\sigma_\varepsilon^2}{\tau^2}
}
$$

or equivalently:

$$
\boxed{
\tau
=
\sigma_\varepsilon\sqrt{\frac{K}{\lambda}}
}.
$$

It's important to note that there's no unique pair $(\sigma_\epsilon, \tau)$ implied by the objective. Only the ratio is implied. We could set $\sigma_\epsilon = 1$, but, since the scores lie in $[0.001, 0.999]$, a *residual* standard deviation of 1 would be *absurdly* large on the observed scale.

What's more, this also affects $\tau$. For example, if $K = 379$ and $\lambda = 0.1$, then setting $\epsilon_e = 1$ implies

$$
\tau = \sqrt{379/0.1} \approx 61.6
$$

This is nearly flat over the capability and difficulty bounds $[-10, 10]$ and the discrimination bounds $[0.1, 10]$. As such, the penalty isn't really doing much.

Unfortunately, I first ended up doing taking the 'convenient' approach of setting $\sigma_\epsilon = 1$, and so while the MAP estimates match exactly, the posterior means are all over the place.

<div class="model-comparison-figures">
  <figure>
    <img src="{{ '/assets/images/benchmark-dif/models/model-1-map.png' | relative_url }}" alt="Epoch parameters compared with Model 1 Bayesian MAP estimates">
  </figure>
  <figure>
    <img src="{{ '/assets/images/benchmark-dif/models/model-1-mcmc-mean.png' | relative_url }}" alt="Epoch parameters compared with Model 1 Bayesian posterior means">
  </figure>
</div>

</details>

<details class="model-step" markdown="1">
<summary><h4 id="learning-the-scale">2. Learning the Residual Scale</h4></summary>

The first model set $\sigma_\varepsilon=1$ because that was convenient. However, a residual standard deviation of 1 is absurdly large for scores bounded between 0 and 1. Furthermore, Epoch's objective doesn't actually tell us that $\sigma_\varepsilon$ should equal 1. It identifies only the ratio

$$
\frac{\sigma_\varepsilon^2}{\tau^2}=\frac{\lambda}{K}.
$$

The second model I fit therefore assigns

$$
\log\sigma_\varepsilon\sim\mathcal N(\log 0.1,1)
$$

and deterministically sets

$$
\tau=\sigma_\varepsilon\sqrt{\frac{K}{\lambda}}.
$$

Conditional on every value of $\sigma_\varepsilon$, the model preserves exactly the same variance-to-penalty ratio as Epoch, but now it can learn the appropriate residual variance from the data. Everything else remains unchanged: Winogrande's discrimination is fixed at 1, capabilities and difficulties remain bounded to $[-10,10]$, and the other discriminations remain bounded to $[0.1,10]$. As you can see, the MAP estimates still match Epoch's exactly, while the posterior mean estimates are much more reasonable, though there's a bend in the curve starting below an ECI of ~120 such that the Bayesian estimates are higher than Epoch's estimates.

<div class="model-comparison-figures">
  <figure>
    <img src="{{ '/assets/images/benchmark-dif/models/model-2-map.png' | relative_url }}" alt="Epoch parameters compared with Model 2 Bayesian MAP estimates">
  </figure>
  <figure>
    <img src="{{ '/assets/images/benchmark-dif/models/model-2-mcmc-mean.png' | relative_url }}" alt="Epoch parameters compared with Model 2 Bayesian posterior means">
  </figure>
</div>

</details>

<details class="model-step" markdown="1">
<summary><h4 id="unfixing-winogrande">3. Unfixing Winogrande</h4></summary>

The next model estimates Winogrande's discrimination along with every other benchmark discrimination. There are now

$$
K=M+2B
$$

free ECI parameters, and every discrimination receives the same bounded Gaussian prior:

$$
\alpha_b\sim\operatorname{TruncatedNormal}(0,\tau^2;0.1,10).
$$

Removing the Winogrande anchor creates a scale identifiability issue. For any $a>0$,

$$
C_m'=aC_m,\qquad D_b'=aD_b,\qquad \alpha_b'=\frac{\alpha_b}{a}
$$

produces exactly the same predictions. The likelihood is also unchanged when the same constant is added to every capability and difficulty. The bounded proper priors make the posterior proper and select a particular origin and unit, but I still don't like the model.

Nevertheless, it's still a useful intermediate model. If we're to model changes in discriminations, we can't also fix the discrimination of one of the benchmarks. The model produces MAP estimates, that no longer exactly match those of Epoch, but are still extremely close. The posterior mean estimates have also gotten closer to Epoch's estimates.

<div class="model-comparison-figures">
  <figure>
    <img src="{{ '/assets/images/benchmark-dif/models/model-3-map.png' | relative_url }}" alt="Epoch parameters compared with Model 3 Bayesian MAP estimates">
  </figure>
  <figure>
    <img src="{{ '/assets/images/benchmark-dif/models/model-3-mcmc-mean.png' | relative_url }}" alt="Epoch parameters compared with Model 3 Bayesian posterior means">
  </figure>
</div>

</details>

<details class="model-step" markdown="1">
<summary><h4 id="symmetric-identification">4. Replacing the Anchor and Bounds with Symmetric Identification</h4></summary>

Our next model removes the hard bounds and resolves the identifiability issue without privileging a particular model or benchmark.

Capabilities and difficulties are combined into one vector and assigned a zero-sum Gaussian prior:

$$
(C_1,\ldots,C_M,D_1,\ldots,D_B)
\sim\operatorname{ZeroSumNormal}(\tau),
$$

which enforces

$$
\sum_m C_m+\sum_bD_b=0.
$$

This identifies the origin of the latent scale. Discriminations are modeled on their natural logarithmic scale:

$$
s_\alpha\sim\operatorname{HalfNormal}(0.5),
$$

$$
(\log\alpha_1,\ldots,\log\alpha_B)
\sim\operatorname{ZeroSumNormal}(s_\alpha).
$$

Therefore,

$$
\sum_b\log\alpha_b=0
$$

and the geometric mean discrimination is exactly one:

$$
\left(\prod_b\alpha_b\right)^{1/B}=1.
$$

This identifies the multiplicative scale symmetrically. It also gives discrimination shrinkage a more natural interpretation: $\alpha_b=2$ and $\alpha_b=0.5$ are equally far from 1 on the log scale. This static model becomes the foundation for the parameter-varying models. Also, our posterior mean estimates are finally lining up with Epoch's estimates, which is nice.

<div class="model-comparison-figures">
  <figure>
    <img src="{{ '/assets/images/benchmark-dif/models/model-4-map.png' | relative_url }}" alt="Epoch parameters compared with Model 4 Bayesian MAP estimates">
  </figure>
  <figure>
    <img src="{{ '/assets/images/benchmark-dif/models/model-4-mcmc-mean.png' | relative_url }}" alt="Epoch parameters compared with Model 4 Bayesian posterior means">
  </figure>
</div>

</details>

<details class="model-step" markdown="1">
<summary><h4 id="temporal-discriminations">5. Allowing Discriminations to Change Over Time</h4></summary>

The first parameter-varying model keeps capabilities and difficulties static but allows benchmark discriminations to depend on model-release month. Let $t_{0b}$ be benchmark $b$'s earliest observed month. Its initial log discrimination receives the prior described above:

$$
s_\alpha\sim\operatorname{HalfNormal}(0.5),
$$

$$
(a_{1,0},\ldots,a_{B,0})
\sim\operatorname{ZeroSumNormal}(s_\alpha).
$$

Temporal change follows a stationary RBF Gaussian process. All benchmarks share the same length scale,

$$
\ell_\alpha\sim\operatorname{Uniform}(2,36),
$$

which is measured in months, with correlation

$$
K_{\alpha,tt'}
=
\exp\left[-\frac{(t-t')^2}{2\ell_\alpha^2}\right]+10^{-4}I.
$$

Each benchmark has an independent GP trajectory $f_b$ with its own amplitude:

$$
f_b\sim\mathcal N(\mathbf 0,K_\alpha),
$$

$$
\kappa_b\sim\operatorname{HalfNormal}(0.5).
$$

The monthly discrimination is

$$
\log\alpha_{b,t}
=
a_{b,0}+\kappa_b\left(f_{b,t}-f_{b,t_{0b}}\right).
$$

Subtracting the GP value at the benchmark's first observed month makes the prior described above act on each benchmark's earliest discrimination. The likelihood for observed scores becomes

$$
s_{mb}
\sim
\mathcal N\left(
\sigma\left[\alpha_{b,t_m}(C_m-D_b)\right],
\sigma_\varepsilon^2
\right).
$$

For comparisons with a static ECI discrimination, I use the geometric mean across a benchmark's supported months. This is the first stage of the final analysis.

<div class="model-comparison-figures">
  <figure>
    <img src="{{ '/assets/images/benchmark-dif/models/model-5-map.png' | relative_url }}" alt="Epoch parameters compared with Model 5 Bayesian MAP estimates">
  </figure>
  <figure>
    <img src="{{ '/assets/images/benchmark-dif/models/model-5-mcmc-mean.png' | relative_url }}" alt="Epoch parameters compared with Model 5 Bayesian posterior means">
  </figure>
</div>

</details>

<details class="model-step" markdown="1">
<summary><h4 id="two-stage-temporal-model">6. The Final Two-Stage Model</h4></summary>

The analysis in this post uses a two-stage Bayesian model. Stage 1 is the model described immediately above. Rather than passing only its posterior means into Stage 2, I draw complete discrimination surfaces

$$
\boldsymbol\alpha^{(q)}
=
\{\alpha^{(q)}_{b,t}:b=1,\ldots,B;\ t=1,\ldots,T\}.
$$

This preserves the posterior dependence among neighboring months and among benchmarks.

Each surface receives a benchmark-balanced normalization. If $\mathcal T_b$ is benchmark $b$'s supported calendar range, define the average log discrimination, $g^{(q)}$ as

$$
g^{(q)}
=
\frac{1}{B}
\sum_b
\left[
\frac{1}{|\mathcal T_b|}
\sum_{t\in\mathcal T_b}
\log\alpha^{(q)}_{b,t}
\right].
$$

The surface we end up using is

$$
\widetilde\alpha^{(q)}_{b,t}
=
\exp\left[\log\alpha^{(q)}_{b,t}-g^{(q)}\right].
$$

This is one scale normalization for the entire surface, not a separate normalization within each month. This normalization makes the benchmark-balanced geometric mean discrimination equal to 1. It does not change relative differences between benchmarks or temporal changes within a benchmark; it only fixes the otherwise arbitrary unit of the latent scale.

For every propagated surface, I fit a conditional difficulty-varying model. The discrimination surface is fixed within that fit, while capabilities and average benchmark difficulties are re-estimated with the symmetric zero-sum prior. Difficulty deviations follow another shared-length-scale RBF process:

$$
\ell_D\sim\operatorname{Uniform}(2,36),
$$

$$
h_b\sim\mathcal N(\mathbf 0,K_D),
$$

$$
\omega_b\sim\operatorname{HalfNormal}(0.5).
$$

Let the raw temporal-difficulty surface be

$$
r_{b,t}=\omega_bh_{b,t}.
$$

The raw surface could absorb both benchmark averages and a movement shared by all benchmarks in a calendar month. To prevent that, I project it away from every additive benchmark and month effect. If $Q$ is an orthonormal basis for those effects over supported benchmark-month cells, then

$$
\boldsymbol\delta=(I-QQ^\top)\mathbf r.
$$

This imposes the constraints

$$
\sum_{t\in\mathcal T_b}\delta_{b,t}=0
$$

for every benchmark. Thus, the deviations average to zero across each benchmark’s supported months and do not change its overall difficulty. It also imposes

$$
\sum_{b:(b,t)\text{ supported}}\delta_{b,t}=0
$$

for every month. Thus, within each month, the deviations average to zero across the benchmarks used in that month. The deviations therefore cannot say that all benchmarks became easier or harder together; they measure how benchmark difficulties change *relative* to one another. Monthly difficulty is then

$$
D_{b,t}=\bar D_b+\delta_{b,t},
$$

and the conditional likelihood is

$$
s_{mb}
\sim
\mathcal N\left(
\sigma\left[
\widetilde\alpha^{(q)}_{b,t_m}
(C_m-D_{b,t_m})
\right],
\sigma_\varepsilon^2
\right).
$$

I repeat this fit for complete surfaces drawn from Stage 1 and pool the conditional posteriors:

$$
p_{\mathrm{mod}}(\Theta_D\mid s)
\approx
\frac{1}{Q}
\sum_{q=1}^{Q}
p_2\left(
\Theta_D\mid s,\widetilde{\boldsymbol\alpha}^{(q)}
\right).
$$

This results in our final estimates, which, when we ignore changes in discriminations and difficulties over time, match Epoch's estimates pretty well.

<div class="model-comparison-figures">
  <figure>
    <img src="{{ '/assets/images/benchmark-dif/models/model-6-map.png' | relative_url }}" alt="Epoch parameters compared with Model 6 Bayesian MAP estimates">
  </figure>
  <figure>
    <img src="{{ '/assets/images/benchmark-dif/models/model-6-mcmc-mean.png' | relative_url }}" alt="Epoch parameters compared with Model 6 Bayesian posterior means">
  </figure>
</div>

</details>

[^vocab]: Marc Brysbaert, Paweł Mandera, Samantha F. McCormick, and Emmanuel Keuleers, “Word Prevalence Norms for 62,000 English Lemmas,” Behavior Research Methods 51 (2019): 467–479, https://doi.org/10.3758/s13428-018-1077-9

<script src="{{ '/assets/js/benchmark-dif.js' | relative_url }}"></script>
