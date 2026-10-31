---
layout: post
title: "A Factor Analysis of Tailcalled’s Gender Surveys"
date: 2026-10-30
permalink: /tailcalled-gender/
redirect_from:
  - /gender-satisfaction/
  - /gender-themes/
category: human-traits
related:
  - /kink-factors/
  - /targeted-personality/
  - /general-kink/
---

[Tailcalled](https://surveyanon.wordpress.com/) ran a "Gender satisfaction and other things" survey with responses from 185 cis men recruited on Prolific, and a "Gender themes" survey with responses from 188 cis men recruited on Prolific. Some respondents took both surveys, so we can combine the responses and analyze them as a whole.

<link rel="stylesheet" href="{{ "/assets/css/tailcalled-gender.css" | relative_url }}">
<script src="{{ "/assets/js/tailcalled-gender.js" | relative_url }}" defer></script>
<script src="{{ "/assets/js/tailcalled-correlations.js" | relative_url }}" defer></script>
<script src="{{ "/assets/js/tailcalled-implications.js" | relative_url }}" defer></script>
<script src="{{ "/assets/js/tailcalled-appraisals.js" | relative_url }}" defer></script>

## Factors

Parallel analysis suggested extracting 11 factors. And yet, there are 20 factors described below. This is because I thought splitting several of the original factors might provide a more informative analysis. For example, the following pairs of factors were originally merged:

- Feminization Fantasies (F2) and Comfort with Feminization (F3)
- Attraction to Men (F17) and Attraction to Women (F18)
- BDSM Dominance (F15) and BDSM Submission (F16)
- Gender Progressivism (F11) and Perceived Female Advantage (F12)
- Male Identification (F4) and Gender Traditionalism (F10)

The splits seem reasonable, though the original relationships are reflected in the correlations between the resulting factors (especially Attraction to Men and Attraction to Women). Additionally, Masculine Interests (F5) and Extraversion (F6) were merged for some strange reason, but don't seem to be that closely related now that they're split apart. From some spare items that weren't assigned to any factors, I created Machismo (F14). I also created General Sexual Interest (F20) to control for differences in overall sexual interest. The Trans/Androgynous Attraction (F19) factor was also added because, what the hell, it works.

<details class="tailcalled-factor">
  <summary><h3 id="f1">F1: Gender Dysphoria</h3></summary>
  <div class="tailcalled-chart" data-tailcalled-factor="F1"
       data-src="{{ "/assets/data/tailcalled-gender/factors.json" | relative_url }}"
       role="group" aria-label="Interactive Tailcalled diagram for F1: Gender Dysphoria">
    <p class="tailcalled-status" role="status">Enable JavaScript to explore this diagram.</p>
  </div>
</details>

<details class="tailcalled-factor">
  <summary><h3 id="f2">F2: Feminization Fantasies</h3></summary>
  <div class="tailcalled-chart" data-tailcalled-factor="F2"
       data-src="{{ "/assets/data/tailcalled-gender/factors.json" | relative_url }}"
       role="group" aria-label="Interactive Tailcalled diagram for F2: Feminization Fantasies">
    <p class="tailcalled-status" role="status">Enable JavaScript to explore this diagram.</p>
  </div>
</details>

<details class="tailcalled-factor">
  <summary><h3 id="f3">F3: Comfort with Feminization</h3></summary>
  <div class="tailcalled-chart" data-tailcalled-factor="F3"
       data-src="{{ "/assets/data/tailcalled-gender/factors.json" | relative_url }}"
       role="group" aria-label="Interactive Tailcalled diagram for F3: Comfort with Feminization">
    <p class="tailcalled-status" role="status">Enable JavaScript to explore this diagram.</p>
  </div>
</details>

<details class="tailcalled-factor">
  <summary><h3 id="f4">F4: Male Identification</h3></summary>
  <div class="tailcalled-chart" data-tailcalled-factor="F4"
       data-src="{{ "/assets/data/tailcalled-gender/factors.json" | relative_url }}"
       role="group" aria-label="Interactive Tailcalled diagram for F4: Male Identification">
    <p class="tailcalled-status" role="status">Enable JavaScript to explore this diagram.</p>
  </div>
</details>

<details class="tailcalled-factor">
  <summary><h3 id="f5">F5: Masculine Interests</h3></summary>
  <div class="tailcalled-chart" data-tailcalled-factor="F5"
       data-src="{{ "/assets/data/tailcalled-gender/factors.json" | relative_url }}"
       role="group" aria-label="Interactive Tailcalled diagram for F5: Masculine Interests">
    <p class="tailcalled-status" role="status">Enable JavaScript to explore this diagram.</p>
  </div>
</details>

<details class="tailcalled-factor">
  <summary><h3 id="f6">F6: Extraversion</h3></summary>
  <div class="tailcalled-chart" data-tailcalled-factor="F6"
       data-src="{{ "/assets/data/tailcalled-gender/factors.json" | relative_url }}"
       role="group" aria-label="Interactive Tailcalled diagram for F6: Extraversion">
    <p class="tailcalled-status" role="status">Enable JavaScript to explore this diagram.</p>
  </div>
</details>

<details class="tailcalled-factor">
  <summary><h3 id="f7">F7: Psychological Distress</h3></summary>
  <div class="tailcalled-chart" data-tailcalled-factor="F7"
       data-src="{{ "/assets/data/tailcalled-gender/factors.json" | relative_url }}"
       role="group" aria-label="Interactive Tailcalled diagram for F7: Psychological Distress">
    <p class="tailcalled-status" role="status">Enable JavaScript to explore this diagram.</p>
  </div>
</details>

<details class="tailcalled-factor">
  <summary><h3 id="f8">F8: Female Affiliation</h3></summary>
  <div class="tailcalled-chart" data-tailcalled-factor="F8"
       data-src="{{ "/assets/data/tailcalled-gender/factors.json" | relative_url }}"
       role="group" aria-label="Interactive Tailcalled diagram for F8: Female Affiliation">
    <p class="tailcalled-status" role="status">Enable JavaScript to explore this diagram.</p>
  </div>
</details>

<details class="tailcalled-factor">
  <summary><h3 id="f9">F9: Belief in Gender Stereotypes</h3></summary>
  <div class="tailcalled-chart" data-tailcalled-factor="F9"
       data-src="{{ "/assets/data/tailcalled-gender/factors.json" | relative_url }}"
       role="group" aria-label="Interactive Tailcalled diagram for F9: Belief in Gender Stereotypes">
    <p class="tailcalled-status" role="status">Enable JavaScript to explore this diagram.</p>
  </div>
</details>

<details class="tailcalled-factor">
  <summary><h3 id="f10">F10: Gender Traditionalism</h3></summary>
  <div class="tailcalled-chart" data-tailcalled-factor="F10"
       data-src="{{ "/assets/data/tailcalled-gender/factors.json" | relative_url }}"
       role="group" aria-label="Interactive Tailcalled diagram for F10: Gender Traditionalism">
    <p class="tailcalled-status" role="status">Enable JavaScript to explore this diagram.</p>
  </div>
</details>

<details class="tailcalled-factor">
  <summary><h3 id="f11">F11: Gender Progressivism</h3></summary>
  <div class="tailcalled-chart" data-tailcalled-factor="F11"
       data-src="{{ "/assets/data/tailcalled-gender/factors.json" | relative_url }}"
       role="group" aria-label="Interactive Tailcalled diagram for F11: Gender Progressivism">
    <p class="tailcalled-status" role="status">Enable JavaScript to explore this diagram.</p>
  </div>
</details>

<details class="tailcalled-factor">
  <summary><h3 id="f12">F12: Perceived Female Advantage</h3></summary>
  <div class="tailcalled-chart" data-tailcalled-factor="F12"
       data-src="{{ "/assets/data/tailcalled-gender/factors.json" | relative_url }}"
       role="group" aria-label="Interactive Tailcalled diagram for F12: Perceived Female Advantage">
    <p class="tailcalled-status" role="status">Enable JavaScript to explore this diagram.</p>
  </div>
</details>

<details class="tailcalled-factor">
  <summary><h3 id="f13">F13: Sexual Experience</h3></summary>
  <div class="tailcalled-chart" data-tailcalled-factor="F13"
       data-src="{{ "/assets/data/tailcalled-gender/factors.json" | relative_url }}"
       role="group" aria-label="Interactive Tailcalled diagram for F13: Sexual Experience">
    <p class="tailcalled-status" role="status">Enable JavaScript to explore this diagram.</p>
  </div>
</details>

<details class="tailcalled-factor">
  <summary><h3 id="f14">F14: Machismo</h3></summary>
  <div class="tailcalled-chart" data-tailcalled-factor="F14"
       data-src="{{ "/assets/data/tailcalled-gender/factors.json" | relative_url }}"
       role="group" aria-label="Interactive Tailcalled diagram for F14: Machismo">
    <p class="tailcalled-status" role="status">Enable JavaScript to explore this diagram.</p>
  </div>
</details>

<details class="tailcalled-factor">
  <summary><h3 id="f15">F15: BDSM Dominance</h3></summary>
  <div class="tailcalled-chart" data-tailcalled-factor="F15"
       data-src="{{ "/assets/data/tailcalled-gender/factors.json" | relative_url }}"
       role="group" aria-label="Interactive Tailcalled diagram for F15: BDSM Dominance">
    <p class="tailcalled-status" role="status">Enable JavaScript to explore this diagram.</p>
  </div>
</details>

<details class="tailcalled-factor">
  <summary><h3 id="f16">F16: BDSM Submission</h3></summary>
  <div class="tailcalled-chart" data-tailcalled-factor="F16"
       data-src="{{ "/assets/data/tailcalled-gender/factors.json" | relative_url }}"
       role="group" aria-label="Interactive Tailcalled diagram for F16: BDSM Submission">
    <p class="tailcalled-status" role="status">Enable JavaScript to explore this diagram.</p>
  </div>
</details>

<details class="tailcalled-factor">
  <summary><h3 id="f17">F17: Attraction to Men</h3></summary>
  <div class="tailcalled-chart" data-tailcalled-factor="F17"
       data-src="{{ "/assets/data/tailcalled-gender/factors.json" | relative_url }}"
       role="group" aria-label="Interactive Tailcalled diagram for F17: Attraction to Men">
    <p class="tailcalled-status" role="status">Enable JavaScript to explore this diagram.</p>
  </div>
</details>

<details class="tailcalled-factor">
  <summary><h3 id="f18">F18: Attraction to Women</h3></summary>
  <div class="tailcalled-chart" data-tailcalled-factor="F18"
       data-src="{{ "/assets/data/tailcalled-gender/factors.json" | relative_url }}"
       role="group" aria-label="Interactive Tailcalled diagram for F18: Attraction to Women">
    <p class="tailcalled-status" role="status">Enable JavaScript to explore this diagram.</p>
  </div>
</details>

<details class="tailcalled-factor">
  <summary><h3 id="f19">F19: Trans/Androgynous Attraction</h3></summary>
  <div class="tailcalled-chart" data-tailcalled-factor="F19"
       data-src="{{ "/assets/data/tailcalled-gender/factors.json" | relative_url }}"
       role="group" aria-label="Interactive Tailcalled diagram for F19: Trans/Androgynous Attraction">
    <p class="tailcalled-status" role="status">Enable JavaScript to explore this diagram.</p>
  </div>
</details>

<details class="tailcalled-factor">
  <summary><h3 id="f20">F20: General Sexual Interest</h3></summary>
  <div class="tailcalled-chart" data-tailcalled-factor="F20"
       data-src="{{ "/assets/data/tailcalled-gender/factors.json" | relative_url }}"
       role="group" aria-label="Interactive Tailcalled diagram for F20: General Sexual Interest">
    <p class="tailcalled-status" role="status">Enable JavaScript to explore this diagram.</p>
  </div>
</details>

## Factor Structure

### Factor Correlation Matrix

<div class="tailcalled-correlations" data-tailcalled-correlations
     data-src="{{ "/assets/data/tailcalled-gender/correlations.json" | relative_url }}">
  <div class="tailcalled-correlation-controls">
    <label><input type="checkbox" data-role="adjust-f20" checked disabled> Adjust for F20: General Sexual Interest</label>
  </div>
  <p class="tailcalled-correlation-help" data-role="matrix-status" role="status">Loading correlation matrix…</p>
  <p class="tailcalled-correlation-help">Select a cell to see the factor names and 90% credible interval. Use the arrow keys to move between cells; scroll sideways on smaller screens.</p>
  <div class="tailcalled-correlation-scroll" data-role="matrix"></div>
  <div class="tailcalled-correlation-key" aria-label="Correlation colors from negative one to positive one">
    <span>Correlation</span>
    <span class="tailcalled-correlation-gradient" aria-hidden="true"><span>−1</span><span>0</span><span>+1</span></span>
  </div>
  <div class="tailcalled-correlation-readout" data-role="correlation-readout" role="status" aria-live="polite" hidden>
    <p class="tailcalled-correlation-pair" data-role="correlation-pair"></p>
    <span class="tailcalled-correlation-estimate" data-role="correlation-estimate"></span>
    <span class="tailcalled-correlation-interval" data-role="correlation-interval"></span>
  </div>
</div>

### Residual Correlations

<!-- BEGIN residual correlation tables -->
<!-- Generated by analyses/tailcalled-gender/export_residual_correlation_tables.py. -->
<div class="tailcalled-residuals">
<p>There are also some residual correlations in our factor model worth listing. Some arise because the same item was asked in both surveys, allowing us to see how stable responses were over time. Others arise because two questions are <em>basically</em> identical, either because they ask about the same behavior or experience, or because they're paraphrases of each other. Still others reflect relationships that aren't fully explained by our 20 factors.</p>
<details class="tailcalled-factor tailcalled-residual-section">
  <summary><h4>Repeated questions ("test–retest")</h4></summary>
<div class="tailcalled-residual-scroll" role="region" aria-label="Repeated questions (“test–retest”)" tabindex="0">
<table class="tailcalled-residual-table" data-residual-group="repeated">
<thead><tr><th scope="col">Question</th><th scope="col">Observed r</th><th scope="col">Residual r [90% CI]</th></tr></thead>
<tbody>
<tr><th scope="row">Do you believe there are more than two genders?</th><td>0.96</td><td>0.88 <span class="tailcalled-residual-interval">[0.81, 0.94]</span></td></tr>
<tr><th scope="row">If you had the opportunity to magically try being female, with the option of switching back, how long would you try?</th><td>0.89</td><td>0.71 <span class="tailcalled-residual-interval">[0.63, 0.78]</span></td></tr>
<tr><th scope="row">Do you feel like people can choose their gender?</th><td>0.88</td><td>0.68 <span class="tailcalled-residual-interval">[0.57, 0.77]</span></td></tr>
<tr><th scope="row">Do you think it is important for men to be manly and women to be womanly?</th><td>0.88</td><td>0.48 <span class="tailcalled-residual-interval">[0.36, 0.61]</span></td></tr>
<tr><th scope="row">Would you be offended if people thought you were unmanly or gay?</th><td>0.86</td><td>0.72 <span class="tailcalled-residual-interval">[0.63, 0.80]</span></td></tr>
<tr><th scope="row">Do you feel men or women have it easier in life?</th><td>0.85</td><td>0.64 <span class="tailcalled-residual-interval">[0.52, 0.74]</span></td></tr>
<tr><th scope="row">Do you believe men have an obligation to take care of and protect women?</th><td>0.84</td><td>0.73 <span class="tailcalled-residual-interval">[0.64, 0.81]</span></td></tr>
<tr><th scope="row">Do you believe women can do anything men can? (Other than physical strength)</th><td>0.83</td><td>0.77 <span class="tailcalled-residual-interval">[0.68, 0.85]</span></td></tr>
<tr><th scope="row">Do you feel like women are prone to excessively overthinking things?</th><td>0.83</td><td>0.40 <span class="tailcalled-residual-interval">[0.28, 0.52]</span></td></tr>
<tr><th scope="row">Body sex satisfaction</th><td>0.83</td><td>0.32 <span class="tailcalled-residual-interval">[0.23, 0.41]</span></td></tr>
<tr><th scope="row">Do you feel young women tend to have a lot of unnecessary drama? (More than young men)</th><td>0.79</td><td>0.43 <span class="tailcalled-residual-interval">[0.32, 0.54]</span></td></tr>
<tr><th scope="row">Do you think you could be happy if you were a woman?</th><td>0.79</td><td>0.40 <span class="tailcalled-residual-interval">[0.29, 0.53]</span></td></tr>
<tr><th scope="row">How psychologically different do you feel men and women are?</th><td>0.77</td><td>0.65 <span class="tailcalled-residual-interval">[0.55, 0.75]</span></td></tr>
<tr><th scope="row">If you were to suddenly magically become a woman, how confusing would it feel?</th><td>0.76</td><td>0.31 <span class="tailcalled-residual-interval">[0.20, 0.43]</span></td></tr>
<tr><th scope="row">If you somehow magically became a woman in mind and body, would you still consider that to be &quot;you&quot;?</th><td>0.75</td><td>0.54 <span class="tailcalled-residual-interval">[0.43, 0.65]</span></td></tr>
<tr><th scope="row">Who do you think has a most healthy understanding of gender?</th><td>0.71</td><td>0.52 <span class="tailcalled-residual-interval">[0.41, 0.62]</span></td></tr>
<tr><th scope="row">Do women feel too much guilt about everything?</th><td>0.69</td><td>0.41 <span class="tailcalled-residual-interval">[0.31, 0.53]</span></td></tr>
<tr><th scope="row">Do you feel you have learned a lot of lessons about how to succeed as a man?</th><td>0.55</td><td>0.39 <span class="tailcalled-residual-interval">[0.28, 0.50]</span></td></tr>
</tbody></table></div>
</details>
<details class="tailcalled-factor tailcalled-residual-section">
  <summary><h4>Similar or overlapping questions</h4></summary>
<div class="tailcalled-residual-scroll" role="region" aria-label="Similar or overlapping questions" tabindex="0">
<table class="tailcalled-residual-table" data-residual-group="similar">
<thead><tr><th scope="col">Questions</th><th scope="col">Observed r</th><th scope="col">Residual r [90% CI]</th></tr></thead>
<tbody>
<tr><th scope="row"><span class="tailcalled-residual-item">Are you autistic?</span><span class="tailcalled-residual-item">Mental conditions [Autism-spectrum]</span></th><td>0.96</td><td>0.91 <span class="tailcalled-residual-interval">[0.85, 0.95]</span></td></tr>
<tr><th scope="row"><span class="tailcalled-residual-item">Sexuaity [Having causal sex with a stranger]</span><span class="tailcalled-residual-item">Sexual arousal [Having casual sex with a stranger]</span></th><td>0.85</td><td>0.80 <span class="tailcalled-residual-interval">[0.76, 0.85]</span></td></tr>
<tr><th scope="row"><span class="tailcalled-residual-item">Do you do muscle training and/or activity that requires a lot of upper body strength?</span><span class="tailcalled-residual-item">I do not exercise on a regular basis [-]</span></th><td>−0.66</td><td>−0.60 <span class="tailcalled-residual-interval">[−0.70, −0.49]</span></td></tr>
<tr><th scope="row"><span class="tailcalled-residual-item">Cross-gender fetishism screener [Wearing women&#x27;s clothes or makeup or other feminine accessories]</span><span class="tailcalled-residual-item">Do you have a fetish for women&#x27;s underwear?</span></th><td>0.84</td><td>0.59 <span class="tailcalled-residual-interval">[0.43, 0.74]</span></td></tr>
<tr><th scope="row"><span class="tailcalled-residual-item">I get upset easily [-]</span><span class="tailcalled-residual-item">Is it easy for people to hurt your feelings?</span></th><td>0.71</td><td>0.56 <span class="tailcalled-residual-interval">[0.45, 0.65]</span></td></tr>
<tr><th scope="row"><span class="tailcalled-residual-item">Sexuaity [Feeling affection and emotional attachment during sex]</span><span class="tailcalled-residual-item">Sexual arousal [Feeling emotional attachment or affection during sex]</span></th><td>0.59</td><td>0.54 <span class="tailcalled-residual-interval">[0.43, 0.64]</span></td></tr>
</tbody></table></div>
</details>
<details class="tailcalled-factor tailcalled-residual-section">
  <summary><h4>Other residual associations</h4></summary>
<div class="tailcalled-residual-scroll" role="region" aria-label="Other residual associations" tabindex="0">
<table class="tailcalled-residual-table" data-residual-group="remaining">
<thead><tr><th scope="col">Questions</th><th scope="col">Observed r</th><th scope="col">Residual r [90% CI]</th></tr></thead>
<tbody>
<tr><th scope="row"><span class="tailcalled-residual-item">Sexual arousal [Being treated as a slave by your partner]</span><span class="tailcalled-residual-item">Sexual arousal [Treating your partner as a slave]</span></th><td>0.85</td><td>0.76 <span class="tailcalled-residual-interval">[0.66, 0.84]</span></td></tr>
<tr><th scope="row"><span class="tailcalled-residual-item">Sexual arousal [Being tied up by your partner using rope]</span><span class="tailcalled-residual-item">Sexual arousal [Tying up your partner using rope]</span></th><td>0.79</td><td>0.75 <span class="tailcalled-residual-interval">[0.67, 0.82]</span></td></tr>
<tr><th scope="row"><span class="tailcalled-residual-item">Sexual arousal [Having sex with a male-to-female transsexual]</span><span class="tailcalled-residual-item">Sexual arousal [Making out with someone whose sex you cannot tell]</span></th><td>0.90</td><td>0.68 <span class="tailcalled-residual-interval">[0.56, 0.78]</span></td></tr>
<tr><th scope="row"><span class="tailcalled-residual-item">Sexual arousal [Being treated roughly by your partner in bed, e.g. spanked, pulled hair, or shoved around]</span><span class="tailcalled-residual-item">Sexual arousal [Treating your partner roughly in bed, e.g. spanking, pulling hair or shoving them around]</span></th><td>0.72</td><td>0.57 <span class="tailcalled-residual-interval">[0.45, 0.68]</span></td></tr>
<tr><th scope="row"><span class="tailcalled-residual-item">Do you have a negative opinion of gay men?</span><span class="tailcalled-residual-item">Do you wear makeup in your everyday life?</span></th><td>−1.00</td><td>−0.54 <span class="tailcalled-residual-interval">[−0.92, 0.15]</span></td></tr>
<tr><th scope="row"><span class="tailcalled-residual-item">Mental conditions [Borderline personality disorder]</span><span class="tailcalled-residual-item">Mental conditions [Some psychotic or dissociative disorder]</span></th><td>0.80</td><td>0.52 <span class="tailcalled-residual-interval">[0.22, 0.76]</span></td></tr>
<tr><th scope="row"><span class="tailcalled-residual-item">Have you had a threesome? [Two men]</span><span class="tailcalled-residual-item">How many different sexual partners have you had?</span></th><td>0.74</td><td>0.51 <span class="tailcalled-residual-interval">[0.29, 0.70]</span></td></tr>
<tr><th scope="row"><span class="tailcalled-residual-item">I don&#x27;t think I could ever adapt to being a woman [-]</span><span class="tailcalled-residual-item">I would be very unhappy if I had to be a woman [-]</span></th><td>0.72</td><td>0.51 <span class="tailcalled-residual-interval">[0.40, 0.60]</span></td></tr>
<tr><th scope="row"><span class="tailcalled-residual-item">Have you been shamed for not being masculine enough?</span><span class="tailcalled-residual-item">Have you gotten teased about looking like a girl?</span></th><td>0.71</td><td>0.51 <span class="tailcalled-residual-interval">[0.32, 0.67]</span></td></tr>
<tr><th scope="row"><span class="tailcalled-residual-item">If you magically woke up as a woman tomorrow, which emotions would you feel as a result? [Fury]</span><span class="tailcalled-residual-item">If you magically woke up as a woman tomorrow, which emotions would you feel as a result? [Humiliation]</span></th><td>0.75</td><td>0.49 <span class="tailcalled-residual-interval">[0.34, 0.63]</span></td></tr>
<tr><th scope="row"><span class="tailcalled-residual-item">I regularly experience a &quot;phantom vagina&quot;, having sensations as if I had a vagina [-]</span><span class="tailcalled-residual-item">I think of myself as being transgender [-]</span></th><td>0.75</td><td>0.49 <span class="tailcalled-residual-interval">[0.26, 0.69]</span></td></tr>
<tr><th scope="row"><span class="tailcalled-residual-item">I would be better able to attract partners if I was a woman [-]</span><span class="tailcalled-residual-item">I would have more friends if I was a woman [-]</span></th><td>0.55</td><td>0.39 <span class="tailcalled-residual-interval">[0.28, 0.50]</span></td></tr>
</tbody></table></div>
</details>
</div>
<!-- END residual correlation tables -->

### Higher-Order Factor Structure

<figure class="tailcalled-higher-order">
  <div class="tailcalled-higher-order-scroll" role="region" aria-label="Higher-order factor structure diagram" tabindex="0">
    <img src="{{ "/assets/images/tailcalled-gender/higher-order-factor-structure.svg" | relative_url }}"
         alt="F1–F19 listed vertically in numerical order, with six higher-order factors to the left. Arrows show signed loadings; dashed two-headed curves on the right show residual correlations between F2 and F3, F2 and F8, and F2 and F10.">
  </div>
  <figcaption>Correlations are adjusted for F20: General Sexual Interest. Numbers on arrows are loadings; numbers on dashed curves are residual correlations. The H6 loading is fixed at 0.9999 (shown as 1.00). Higher-order factors are allowed to correlate; their correlations are omitted from the diagram. <a href="{{ "/assets/images/tailcalled-gender/higher-order-factor-structure.svg" | relative_url }}">Open the diagram at full size</a>.</figcaption>
</figure>

<figure class="tailcalled-higher-order-correlations">
  <img src="{{ "/assets/images/tailcalled-gender/higher-order-factor-correlations.svg" | relative_url }}"
       alt="Correlation matrix for higher-order factors H1–H6, using the same factor orientations as the diagram above. Full factor names appear along the rows and correlations are shown to two decimal places.">
</figure>

## Implications

Correlations are nice, but sometimes we want to look at more complicated relationships. In his paper [The Factor Structure of Conspiracist Beliefs](https://openpsych.net/files/papers/Zimmer_2024a.pdf), Zimmer notes that for some pairs of factors, not only is the correlation high, but almost all points lie on one side of the bottom-left-to-top-right diagonal. For example, comparing the Flat Earth and Generic Conspiracy factor scores, the vast majority of points lie below the diagonal. That is, respondents who score highly on Flat Earth almost always score at least as highly on Generic Conspiracy. One might conclude that high Flat Earth belief implies high Generic Conspiracy belief (or, equivalently, that low Generic Conspiracy belief implies low Flat Earth belief). I use a different measure from Zimmer's, but we can look for similar patterns in the survey data.

<div class="tailcalled-implications" data-tailcalled-implications
     data-src="{{ "/assets/data/tailcalled-gender/implications.json" | relative_url }}">
  <p class="tailcalled-implication-help" data-role="implication-status" role="status">Loading implication plots…</p>
  <div class="tailcalled-implication-rank-controls">
    <label>Rank by<select data-role="ranking-mode" disabled>
      <option value="asymmetry">Strength − converse</option>
      <option value="strength">Strength</option>
    </select></label>
  </div>
  <p class="tailcalled-implication-help" data-role="ranking-note"></p>
  <div class="tailcalled-implication-table-scroll" data-role="ranking-region" role="region" aria-label="Top ten ranked implications" tabindex="0">
    <table class="tailcalled-implication-table">
      <thead><tr><th scope="col">Rank</th><th scope="col">Implication</th><th scope="col">Strength</th><th scope="col">Converse</th></tr></thead>
      <tbody data-role="implication-rankings"></tbody>
    </table>
  </div>
  <div class="tailcalled-implication-controls">
    <label>X-axis factor<select data-role="implication-x" disabled></select></label>
    <label>Y-axis factor<select data-role="implication-y" disabled></select></label>
    <label>Implication<select data-role="implication-type" disabled>
      <option value="1/1">High X ⇒ High Y</option>
      <option value="1/-1">High X ⇒ Low Y</option>
      <option value="-1/1">Low X ⇒ High Y</option>
      <option value="-1/-1">Low X ⇒ Low Y</option>
    </select></label>
    <fieldset class="tailcalled-implication-direction"><legend>Display as</legend>
      <label><input type="radio" name="implication-direction" data-role="direction-forward" value="forward" checked disabled> Implication</label>
      <label><input type="radio" name="implication-direction" data-role="direction-contrapositive" value="contrapositive" disabled> Contrapositive</label>
    </fieldset>
  </div>
  <p class="tailcalled-implication-selected" data-role="selected-implication" role="status" aria-live="polite"></p>
  <div class="tailcalled-implication-strengths">
    <div data-role="forward-card"><span>Implication</span><span class="tailcalled-implication-value"><strong data-role="forward-strength">—</strong><span class="tailcalled-implication-ci" data-role="forward-interval"></span></span></div>
    <div data-role="converse-card"><span>Converse</span><span class="tailcalled-implication-value"><strong data-role="converse-strength">—</strong><span class="tailcalled-implication-ci" data-role="converse-interval"></span></span></div>
  </div>
  <div class="tailcalled-implication-plot" data-role="implication-plot"></div>
</div>

<details class="tailcalled-implication-methods">
  <summary>How the scores and ranking work</summary>
  <p>For an implication <code>sX ⇒ tY</code>, where <code>s</code> and <code>t</code> are +1 for high and −1 for low, each violation has severity <code>d = max(0, min(sX, −tY))</code>. This is the distance to the nearest nonviolating point.</p>
  <p>The average severity is <code>V = mean(d)</code>. Independent standard-normal variables have expected severity <code>V₀ = (√2 − 1)/(2√π) ≈ 0.11685</code>. Implication strength is <code>I = 1 − V/V₀</code>: 1 means no violations, 0 matches the independence baseline, and negative values mean more severe violations than that baseline.</p>
  <p>By default, the table ranks pairs by <code>max(0, I) − max(0, I_converse)</code>, favoring strong implications with weak converses; ties are broken by implication strength. Selecting “Strength” ranks by <code>I</code> alone. Each pair appears once, using its highest-scoring direction under the selected rule. The converse of <code>A ⇒ B</code> is <code>B ⇒ A</code>. The contrapositive, <code>not B ⇒ not A</code>, has exactly the same score as the original implication.</p>
  <p>Severities are averaged across 191 participants and 1,000 posterior draws, retaining the fitted population scale. The 90% credible intervals describe uncertainty in this sample’s implication strength; they do not include resampling participants.</p>
</details>

There are many potential implications one could look at, but let's take a look at High F2: Feminization Fantasies ⇒ High F3: Comfort with Feminization. I think this makes intuitive sense. For example, we shouldn't expect to see someone who frequently fantasizes about feminization yet is very uncomfortable with feminization. In a sense, comfort with feminization is (loosely) necessary but not sufficient for feminization fantasies. Or perhaps feminization fantasies cause comfort with feminization. Both are consistent with the data. Of course, the contrapositive is logically equivalent: not being high in comfort with feminization implies not being high in feminization fantasies. So, the data is also consistent with discomfort with feminization inhibiting feminization fantasies as well as a lack of feminization fantasies being (loosely) necessary but not sufficient for discomfort with feminization.

Usually, when dealing with correlations, one must keep in mind that correlation is not causation. But in most cases where two variables are correlated but neither causes the other, the reason is that they share a common cause. Implication patterns are more informative than correlations alone, since there's an asymmetry must be explained, yet which a common cause is incapable of explaining. That said, the implication pattern doesn't necessarily imply causation. For this example, we might think that feminization fantasies are really a more extreme example of the same sort of phenomenon as comfort with feminization. For example, frequently initiating conversations with complete strangers is a more extreme form of extraversion than enjoying time with one's friends. We would notice a lack of people who enjoy starting conversations with strangers but not spending time with their friends, especially compared to people who enjoy spending time with their friends but not starting conversations with strangers. But one doesn't cause the other. That might be the case with the two factors we're looking at, which were, to be fair, originally merged before I split them apart, and even now correlate with each other at +.59.

But I don't think this kind of explanation works as well for implications involving more distinct factors, such as High F17: Attraction to Men ⇒ High F11: Gender Progressivism. In this case, gender-progressive beliefs aren't a more extreme version of attraction to men. I think, in a case like this, we might really suspect that attraction to men causes gender-progressive beliefs. 

Regardless, measuring implication strength like this seems like it may yield interesting hypotheses, and seems like something that should at least be considered more often in research.

## Benefits/Harms

Let's take a look at how the factors we've extracted relate to whether people see aspects of being male or female as beneficial or harmful. These coefficients describe the association with a one-SD increase in each factor, holding the other factors fixed. Positive coefficients mean that higher factor scores are associated with seeing the aspect as more beneficial to men.

<div class="tailcalled-appraisals" data-tailcalled-appraisals
     data-src="{{ "/assets/data/tailcalled-gender/appraisals.json" | relative_url }}">
  <p class="tailcalled-appraisal-help" data-role="appraisal-status" role="status">Loading benefits/harms results…</p>
  <p class="tailcalled-appraisal-help" data-role="appraisal-explanation"></p>
  <div class="tailcalled-appraisal-matrix-scroll" data-role="appraisal-chart" role="region" aria-label="Appraisal coefficient heatmap" tabindex="0"></div>
  <div class="tailcalled-appraisal-key"><span data-role="appraisal-color-label">Coefficient</span><span class="tailcalled-appraisal-gradient"><span data-role="appraisal-color-low"></span><span>0</span><span data-role="appraisal-color-high"></span></span></div>
  <div class="tailcalled-appraisal-readout" data-role="appraisal-readout" role="status" aria-live="polite" hidden>
    <p class="tailcalled-appraisal-heading" data-role="appraisal-heading"></p>
    <div class="tailcalled-appraisal-selected-value"><strong data-role="appraisal-estimate"></strong><span data-role="appraisal-interval"></span></div>
    <p class="tailcalled-appraisal-description" data-role="appraisal-description" hidden></p>
    <p class="tailcalled-appraisal-help" data-role="appraisal-overall-note" hidden>Overall male advantage is the mean coefficient across the 16 appraisals, rather than an additional survey response.</p>
    <details class="tailcalled-appraisal-scale" data-role="appraisal-response-scale" hidden>
      <summary>Response options, from low to high</summary>
      <ol data-role="appraisal-responses"></ol>
    </details>
  </div>
  <p class="tailcalled-appraisal-help">Estimates are posterior means with 90% credible intervals, rounded to two decimal places.</p>
</div>

<details class="tailcalled-appraisal-methods">
  <summary>About this fit</summary>
  <p>The 20-factor measurement model and the 16 ordinal appraisal regressions were fitted jointly. Power in society, Male femininity, and Male gender norms were removed from the measurement indicators and used only as appraisal outcomes. The joint fit includes 191 participants, of whom 185 answered the appraisal questions.</p>
  <p>Each item coefficient is an overall coefficient plus an item-specific departure. Departures sum to zero across the 16 appraisals for each factor. The model also includes a shared participant appraisal residual whose variance can shrink toward zero.</p>
</details>

We've got some interesting results. Male Identification seems to consistently predict belief in greater male advantage (which didn't surprise me), while Extraversion seems to consistently predict belief in greater female advantage (which did surprise me). Also, Perceived Female Advantage has a particularly large association with how one thinks power in society would affect them as either gender, but smaller associations with some of the other aspects. This might be surprising unless you remember that the factor deals with how each gender is treated by society.

## Takeaways

I originally did this analysis because I thought it would help me understand the nature of gender. Unfortunately, it did not. It is interesting, I guess, to see that some men like being men while others dislike being men, and that some men fantasize about being women or think it would be nice if they were women. But I don't know how to connect that to the thing some people call gender. Is gender just what we wish we were? Or something more? I can think of only one solution to this puzzle: I am demanding Tailcalled release the gender survey.

*That said, thanks to [Tailcalled](https://surveyanon.wordpress.com/) for sharing the data!*
