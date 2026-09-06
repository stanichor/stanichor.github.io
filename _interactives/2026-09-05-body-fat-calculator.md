---
layout: post
title: "Bayesian Body Fat Calculator"
date: 2026-09-05
permalink: /body-fat-calculator/
categories:
---

<link rel="stylesheet" href="{{ '/assets/css/body-fat-calculator.css' | relative_url }}">

<div
  class="bf-calculator"
  data-body-fat-calculator
  data-model-url="{{ '/assets/jsons/body_fat_model.json' | relative_url }}"
  data-joint-model-url="{{ '/assets/jsons/joint_body_composition_model.json' | relative_url }}"
  data-histogram-url="{{ '/assets/jsons/nhanes_body_fat_histogram.json' | relative_url }}"
>
  <p class="bf-intro">
    Enter whichever measurements you have to estimate body-fat percentage. The calculator averages every linear regression model that can use those measurements; blank fields are fine.
  </p>

  <p class="bf-notice">
    <strong>For adult men only.</strong> This is an experimental estimate, not a clinical measurement. It was fitted to 244 men in the SOCR body-fat dataset and is least trustworthy for unusually lean or unusually large people.
  </p>

  <div class="bf-workspace">
    <form class="bf-card bf-input-card" data-role="calculator-form">
      <h2 class="bf-section-heading">Your measurements</h2>
      <p class="bf-section-note">Use consistent units. Waist is measured at the belly button; biceps is the extended measurement.</p>

      <fieldset class="bf-unit-toggle">
        <legend class="sr-only">Measurement units</legend>
        <label>
          <input type="radio" name="bf-units" value="imperial" checked>
          <span>Imperial</span>
        </label>
        <label>
          <input type="radio" name="bf-units" value="metric">
          <span>Metric</span>
        </label>
      </fieldset>

      <div class="bf-fields">
        <div class="bf-field">
          <label for="bf-height">Height</label>
          <div class="bf-input-wrap"><input id="bf-height" data-measurement="height" type="number" min="0" inputmode="decimal" autocomplete="off"><span class="bf-unit" data-role="unit">cm</span></div>
        </div>
        <div class="bf-field">
          <label for="bf-weight">Weight</label>
          <div class="bf-input-wrap"><input id="bf-weight" data-measurement="weight" type="number" min="0" inputmode="decimal" autocomplete="off"><span class="bf-unit" data-role="unit">kg</span></div>
        </div>
        <div class="bf-field">
          <label for="bf-neck">Neck</label>
          <div class="bf-input-wrap"><input id="bf-neck" data-measurement="neck_circumference" type="number" min="0" inputmode="decimal" autocomplete="off"><span class="bf-unit" data-role="unit">cm</span></div>
        </div>
        <div class="bf-field">
          <label for="bf-chest">Chest</label>
          <div class="bf-input-wrap"><input id="bf-chest" data-measurement="chest_circumference" type="number" min="0" inputmode="decimal" autocomplete="off"><span class="bf-unit" data-role="unit">cm</span></div>
        </div>
        <div class="bf-field">
          <label for="bf-abdomen">Waist</label>
          <div class="bf-input-wrap"><input id="bf-abdomen" data-measurement="abdomen_circumference" type="number" min="0" inputmode="decimal" autocomplete="off"><span class="bf-unit" data-role="unit">cm</span></div>
        </div>
        <div class="bf-field">
          <label for="bf-hip">Hip</label>
          <div class="bf-input-wrap"><input id="bf-hip" data-measurement="hip_circumference" type="number" min="0" inputmode="decimal" autocomplete="off"><span class="bf-unit" data-role="unit">cm</span></div>
        </div>
        <div class="bf-field">
          <label for="bf-thigh">Thigh</label>
          <div class="bf-input-wrap"><input id="bf-thigh" data-measurement="thigh_circumference" type="number" min="0" inputmode="decimal" autocomplete="off"><span class="bf-unit" data-role="unit">cm</span></div>
        </div>
        <div class="bf-field">
          <label for="bf-knee">Knee</label>
          <div class="bf-input-wrap"><input id="bf-knee" data-measurement="knee_circumference" type="number" min="0" inputmode="decimal" autocomplete="off"><span class="bf-unit" data-role="unit">cm</span></div>
        </div>
        <div class="bf-field">
          <label for="bf-ankle">Ankle</label>
          <div class="bf-input-wrap"><input id="bf-ankle" data-measurement="ankle_circumference" type="number" min="0" inputmode="decimal" autocomplete="off"><span class="bf-unit" data-role="unit">cm</span></div>
        </div>
        <div class="bf-field">
          <label for="bf-biceps">Extended biceps</label>
          <div class="bf-input-wrap"><input id="bf-biceps" data-measurement="biceps_circumference" type="number" min="0" inputmode="decimal" autocomplete="off"><span class="bf-unit" data-role="unit">cm</span></div>
        </div>
        <div class="bf-field">
          <label for="bf-forearm">Forearm</label>
          <div class="bf-input-wrap"><input id="bf-forearm" data-measurement="forearm_circumference" type="number" min="0" inputmode="decimal" autocomplete="off"><span class="bf-unit" data-role="unit">cm</span></div>
        </div>
        <div class="bf-field">
          <label for="bf-wrist">Wrist</label>
          <div class="bf-input-wrap"><input id="bf-wrist" data-measurement="wrist_circumference" type="number" min="0" inputmode="decimal" autocomplete="off"><span class="bf-unit" data-role="unit">cm</span></div>
        </div>
      </div>

      <div class="bf-distance-warning" data-role="distance-warning" aria-live="polite" hidden></div>

      <div class="bf-actions">
        <button class="bf-button bf-button-primary" data-role="calculate" type="submit" disabled>Calculate</button>
        <button class="bf-button bf-button-secondary" data-role="clear" type="button">Clear all</button>
      </div>
      <p class="bf-status" data-role="status" aria-live="polite">Loading the model…</p>
    </form>

    <section class="bf-card bf-result-card" data-role="result" aria-live="polite" hidden>
      <div class="bf-result-summary">
        <div class="bf-result-stat">
          <span class="bf-result-label">Posterior predictive mean</span>
          <strong class="bf-result-value" data-role="mean">—</strong>
          <span class="bf-result-detail">Estimated body-fat percentage</span>
        </div>
        <div class="bf-result-stat">
          <span class="bf-result-label">Posterior predictive SD</span>
          <strong class="bf-result-value" data-role="sd">—</strong>
          <span class="bf-result-detail">Approx. 95% range: <span data-role="interval">—</span></span>
        </div>
      </div>
      <div class="bf-result-meta">
        <span data-role="model-count"></span>
        <span data-role="class-weights"></span>
      </div>
      <div class="bf-chart-wrap">
        <h3 class="bf-chart-title">Where the estimate falls</h3>
        <p class="bf-chart-subtitle">Reference: 2,109 NHANES 2005–2006 men aged 18–69, using the first DXA imputation.</p>
        <svg class="bf-chart" data-role="histogram"></svg>
        <div class="bf-chart-legend" aria-hidden="true">
          <span><i class="bf-key bf-key-histogram"></i>NHANES count</span>
          <span><i class="bf-key bf-key-band"></i>Estimate ±1 posterior predictive SD</span>
        </div>
      </div>
      <div class="bf-warning-box" data-role="warnings" hidden></div>
    </section>
  </div>

  <section class="bf-method">
    <h2>What Bayesian model averaging is doing</h2>

    <p>There is no single obviously correct equation for predicting body fat from these measurements. Bayesian model averaging (BMA) fits many plausible regressions, gives each one a posterior probability based on its fit and complexity, and averages their predictions. This analysis considered every subset of 12 measurements in three forms—raw, logged, and height-normalized—for 12,288 models in total.</p>

    <p>Before fitting the model, I excluded eight cases that looked too implausible or influential for this normal-range estimator: six discordant sub-5% Siri estimates, one invalid-density case reported as 0%, and one exceptionally large and influential participant. I retained a 4% case whose anthropometry independently supported exceptional leanness.</p>

    <p>If you leave a measurement blank, the calculator drops only the models that require it and renormalizes the probabilities of the compatible models. The posterior predictive SD includes residual person-to-person variation, uncertainty in the fitted coefficients, and disagreement among models. It is uncertainty about an individual prediction, not merely uncertainty about the mean.</p>

    <p>A predictor’s <strong>posterior inclusion probability (PIP)</strong> is the total posterior probability of all models in its transformation class that include that predictor. Larger values mean the data give more support to retaining it. Because the prior was uniform over all 4,096 subsets within a class, every predictor’s <strong>prior inclusion probability was 50%</strong>. The three transformation classes received equal prior probability; their posterior probabilities were:</p>

    <div class="bf-class-weights">
      <span class="bf-class-pill">Height-normalized: 75.2%</span>
      <span class="bf-class-pill">Logged: 16.2%</span>
      <span class="bf-class-pill">Raw: 8.6%</span>
    </div>

    <p class="bf-footnote">Coefficient means and SDs are conditional on both the transformation class and the predictor being included. Predictors are standardized, so coefficients are body-fat percentage points per one predictor SD.</p>

    <p class="bf-pip-key"><span aria-hidden="true"></span>Blue PIP cells exceed the 50% prior inclusion probability.</p>

    <h3>Raw measurements</h3>
    <div class="bf-table-scroll">
      <table>
        <thead><tr><th>Predictor</th><th>PIP</th><th>Mean if included</th><th>SD if included</th></tr></thead>
        <tbody>
          <tr class="bf-pip-above-prior"><td>Waist circumference</td><td>100.0%</td><td>8.18</td><td>0.87</td></tr>
          <tr class="bf-pip-above-prior"><td>Wrist circumference</td><td>94.3%</td><td>−1.39</td><td>0.40</td></tr>
          <tr class="bf-pip-above-prior"><td>Height</td><td>81.9%</td><td>−1.16</td><td>0.34</td></tr>
          <tr><td>Weight</td><td>27.3%</td><td>−2.20</td><td>1.20</td></tr>
          <tr><td>Chest circumference</td><td>18.4%</td><td>−1.12</td><td>0.73</td></tr>
          <tr><td>Neck circumference</td><td>16.6%</td><td>−0.77</td><td>0.53</td></tr>
          <tr><td>Hip circumference</td><td>11.8%</td><td>−0.76</td><td>0.70</td></tr>
          <tr><td>Extended biceps circumference</td><td>10.8%</td><td>0.50</td><td>0.50</td></tr>
          <tr><td>Forearm circumference</td><td>7.9%</td><td>0.27</td><td>0.59</td></tr>
          <tr><td>Thigh circumference</td><td>7.5%</td><td>0.12</td><td>0.61</td></tr>
          <tr><td>Ankle circumference</td><td>6.6%</td><td>−0.07</td><td>0.44</td></tr>
          <tr><td>Knee circumference</td><td>6.3%</td><td>0.07</td><td>0.50</td></tr>
        </tbody>
      </table>
    </div>

    <h3>Logged measurements</h3>
    <div class="bf-table-scroll">
      <table>
        <thead><tr><th>Predictor</th><th>PIP</th><th>Mean if included</th><th>SD if included</th></tr></thead>
        <tbody>
          <tr class="bf-pip-above-prior"><td>log(Waist circumference)</td><td>100.0%</td><td>7.78</td><td>0.57</td></tr>
          <tr class="bf-pip-above-prior"><td>log(Height)</td><td>98.2%</td><td>−1.29</td><td>0.31</td></tr>
          <tr class="bf-pip-above-prior"><td>log(Wrist circumference)</td><td>95.1%</td><td>−1.43</td><td>0.40</td></tr>
          <tr><td>log(Neck circumference)</td><td>23.4%</td><td>−0.88</td><td>0.52</td></tr>
          <tr><td>log(Chest circumference)</td><td>13.8%</td><td>−0.92</td><td>0.69</td></tr>
          <tr><td>log(Weight)</td><td>8.2%</td><td>−0.70</td><td>1.32</td></tr>
          <tr><td>log(Hip circumference)</td><td>8.1%</td><td>−0.49</td><td>0.63</td></tr>
          <tr><td>log(Extended biceps circumference)</td><td>7.7%</td><td>0.29</td><td>0.44</td></tr>
          <tr><td>log(Forearm circumference)</td><td>6.5%</td><td>0.02</td><td>0.51</td></tr>
          <tr><td>log(Thigh circumference)</td><td>6.4%</td><td>−0.09</td><td>0.48</td></tr>
          <tr><td>log(Ankle circumference)</td><td>6.4%</td><td>−0.08</td><td>0.42</td></tr>
          <tr><td>log(Knee circumference)</td><td>6.2%</td><td>−0.04</td><td>0.49</td></tr>
        </tbody>
      </table>
    </div>

    <h3>Height-normalized measurements</h3>
    <div class="bf-table-scroll">
      <table>
        <thead><tr><th>Predictor</th><th>PIP</th><th>Mean if included</th><th>SD if included</th></tr></thead>
        <tbody>
          <tr class="bf-pip-above-prior"><td>Waist circumference / height</td><td>100.0%</td><td>7.99</td><td>0.72</td></tr>
          <tr class="bf-pip-above-prior"><td>Wrist circumference / height</td><td>97.0%</td><td>−1.43</td><td>0.38</td></tr>
          <tr><td>Chest circumference / height</td><td>28.9%</td><td>−1.35</td><td>0.71</td></tr>
          <tr><td>Neck circumference / height</td><td>16.9%</td><td>−0.76</td><td>0.52</td></tr>
          <tr><td>Hip circumference / height</td><td>14.5%</td><td>−0.83</td><td>0.61</td></tr>
          <tr><td>Extended biceps circumference / height</td><td>9.4%</td><td>0.39</td><td>0.42</td></tr>
          <tr><td>Height</td><td>8.2%</td><td>0.24</td><td>0.31</td></tr>
          <tr><td>BMI</td><td>7.1%</td><td>−0.30</td><td>0.87</td></tr>
          <tr><td>Forearm circumference / height</td><td>6.7%</td><td>0.12</td><td>0.48</td></tr>
          <tr><td>Knee circumference / height</td><td>6.7%</td><td>0.18</td><td>0.43</td></tr>
          <tr><td>Thigh circumference / height</td><td>6.7%</td><td>−0.01</td><td>0.51</td></tr>
          <tr><td>Ankle circumference / height</td><td>6.4%</td><td>−0.07</td><td>0.38</td></tr>
        </tbody>
      </table>
    </div>

    <h2>How to interpret the comparison</h2>
    <p>The calculator predicts the SOCR dataset’s Siri-equation estimate derived from underwater density. The histogram is a separate reference distribution of DXA total-body fat in NHANES.</p>

  </section>
</div>

<script src="{{ '/assets/js/body-fat-calculator.js' | relative_url }}"></script>
