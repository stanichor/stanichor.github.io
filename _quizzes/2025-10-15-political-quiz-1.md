---
layout: post
title: "Political Quiz #1"
date: 2025-10-14
permalink: /political-quiz-1/
categories: 
---
The following quiz is based on the questions used in the study, [Attitude networks as intergroup realities: Using network-modelling to research attitude-identity relationships in polarized political contexts](https://bpspsychub.onlinelibrary.wiley.com/doi/epdf/10.1111/bjso.12665). The study is popular for showing that there's more diversity of thought on the Right than the Left. Though one might be skeptical of such claims, a [re-analysis by Leon Voss](https://www.leonvoss.com/p/reanalysis-of-the-political-diversity) shows that the claims are valid, at least within their sample. 

You can answer the questions and view your most likely party identification, along with how politically liberal you are.

## Quiz

<form id="quiz1-form" style="font-family: system-ui, sans-serif; line-height: 1.5;">
  <div style="margin-bottom: 1.5em;">
    <p style="margin-bottom: 0.5em;">Abortion should be illegal.</p>
    <label><input type="radio" name="q1" value="1"> Strongly Disagree</label><br>
    <label><input type="radio" name="q1" value="2"> Somewhat Disagree</label><br>
    <label><input type="radio" name="q1" value="3"> Neutral</label><br>
    <label><input type="radio" name="q1" value="4"> Somewhat Agree</label><br>
    <label><input type="radio" name="q1" value="5"> Strongly Agree</label>
  </div>

  <div style="margin-bottom: 1.5em;">
    <p style="margin-bottom: 0.5em;">The government should take steps to make incomes more equal.</p>
    <label><input type="radio" name="q2" value="1"> Strongly Disagree</label><br>
    <label><input type="radio" name="q2" value="2"> Somewhat Disagree</label><br>
    <label><input type="radio" name="q2" value="3"> Neutral</label><br>
    <label><input type="radio" name="q2" value="4"> Somewhat Agree</label><br>
    <label><input type="radio" name="q2" value="5"> Strongly Agree</label>
  </div>

  <div style="margin-bottom: 1.5em;">
    <p style="margin-bottom: 0.5em;">All unauthorized immigrants should be sent back to their home country.</p>
    <label><input type="radio" name="q3" value="1"> Strongly Disagree</label><br>
    <label><input type="radio" name="q3" value="2"> Somewhat Disagree</label><br>
    <label><input type="radio" name="q3" value="3"> Neutral</label><br>
    <label><input type="radio" name="q3" value="4"> Somewhat Agree</label><br>
    <label><input type="radio" name="q3" value="5"> Strongly Agree</label>
  </div>

  <div style="margin-bottom: 1.5em;">
    <p style="margin-bottom: 0.5em;">The federal budget for welfare programs should be increased.</p>
    <label><input type="radio" name="q4" value="1"> Strongly Disagree</label><br>
    <label><input type="radio" name="q4" value="2"> Somewhat Disagree</label><br>
    <label><input type="radio" name="q4" value="3"> Neutral</label><br>
    <label><input type="radio" name="q4" value="4"> Somewhat Agree</label><br>
    <label><input type="radio" name="q4" value="5"> Strongly Agree</label>
  </div>

  <div style="margin-bottom: 1.5em;">
    <p style="margin-bottom: 0.5em;">Lesbian, gay and trans couples should be allowed to legally marry.</p>
    <label><input type="radio" name="q5" value="1"> Strongly Disagree</label><br>
    <label><input type="radio" name="q5" value="2"> Somewhat Disagree</label><br>
    <label><input type="radio" name="q5" value="3"> Neutral</label><br>
    <label><input type="radio" name="q5" value="4"> Somewhat Agree</label><br>
    <label><input type="radio" name="q5" value="5"> Strongly Agree</label>
  </div>

  <div style="margin-bottom: 1.5em;">
    <p style="margin-bottom: 0.5em;">The government should regulate business to protect the environment.</p>
    <label><input type="radio" name="q6" value="1"> Strongly Disagree</label><br>
    <label><input type="radio" name="q6" value="2"> Somewhat Disagree</label><br>
    <label><input type="radio" name="q6" value="3"> Neutral</label><br>
    <label><input type="radio" name="q6" value="4"> Somewhat Agree</label><br>
    <label><input type="radio" name="q6" value="5"> Strongly Agree</label>
  </div>

  <div style="margin-bottom: 1.5em;">
    <p style="margin-bottom: 0.5em;">The federal government should make it more difficult to buy a gun.</p>
    <label><input type="radio" name="q7" value="1"> Strongly Disagree</label><br>
    <label><input type="radio" name="q7" value="2"> Somewhat Disagree</label><br>
    <label><input type="radio" name="q7" value="3"> Neutral</label><br>
    <label><input type="radio" name="q7" value="4"> Somewhat Agree</label><br>
    <label><input type="radio" name="q7" value="5"> Strongly Agree</label>
  </div>

  <div style="margin-bottom: 1.5em;">
    <p style="margin-bottom: 0.5em;">The federal government should make a concerted effort to improve social and economic conditions for African Americans.</p>
    <label><input type="radio" name="q8" value="1"> Strongly Disagree</label><br>
    <label><input type="radio" name="q8" value="2"> Somewhat Disagree</label><br>
    <label><input type="radio" name="q8" value="3"> Neutral</label><br>
    <label><input type="radio" name="q8" value="4"> Somewhat Agree</label><br>
    <label><input type="radio" name="q8" value="5"> Strongly Agree</label>
  </div>

  <p id="quiz1-result" style="margin-top: 1em; font-weight: 500;"></p>

  <button id="quiz1-submit"
    type="button"
    style="
      background-color: #007bff;
      color: white;
      border: none;
      padding: 0.6em 1.2em;
      font-size: 1em;
      border-radius: 0.4em;
      cursor: pointer;
      transition: background-color 0.2s ease, transform 0.1s ease;
    "
    onmouseover="this.style.backgroundColor='#0069d9'"
    onmouseout="this.style.backgroundColor='#007bff'"
    onmousedown="this.style.transform='scale(0.97)'"
    onmouseup="this.style.transform='scale(1)'"
  >
    Submit
  </button>
</form>

<!-- Include your shared script -->
<script src="{{ '/assets/js/irt-quiz.js' | relative_url }}"></script>
<script>
document.getElementById("quiz1-submit").addEventListener("click", () => {
  const loadings = { q1: -0.564, q2: 0.742, q3: -0.692, q4: 0.787, q5: 0.655, q6: 0.666, q7: 0.703, q8: 0.801 };
  const thresholds = {
    q1: [-Infinity, 0.2141, 0.5825, 0.8277, 1.1854, Infinity],
    q2: [-Infinity, -1.4665, -0.9085, -0.511, 0.4352, Infinity],
    q3: [-Infinity, -0.3685, 0.3227, 0.7601, 1.2636, Infinity],
    q4: [-Infinity, -1.4665, -0.8451, -0.2904, 0.5393, Infinity],
    q5: [-Infinity, -1.5848, -1.2774, -0.8992, -0.5464, Infinity],
    q6: [-Infinity, -1.8530, -1.5429, -0.9658, -0.0216, Infinity],
    q7: [-Infinity, -1.2914, -0.7934, -0.4970, 0.1390, Infinity],
    q8: [-Infinity, -1.6068, -1.1854, -0.5899, 0.2457, Infinity]
  };

  // Collect user responses
  const observation = {};
  let missing = false;
  for (let i = 1; i <= 8; i++) {
    const checked = document.querySelector(`input[name="q${i}"]:checked`);
    if (checked) {
      observation[`q${i}`] = parseInt(checked.value);
    } else {
      missing = true;
    }
  }

  const resultEl = document.getElementById("quiz1-result");

  // Prevent submission if incomplete
  if (missing) {
    resultEl.textContent = "Please answer all items before submitting.";
    return;
  }

  // Compute latent score
  const score = estimateLatentScore(observation, loadings, thresholds, false);

  // Convert latent score to percentile
  const percentile = Math.round(normalCDF(score) * 100);

  // --- Party likelihoods ---
  const priors = { R: 0.31, I: 0.41, D: 0.28 };
  const distributions = {
    R: { mean: -1.07, sd: 0.76 },
    I: { mean: -0.36, sd: 0.83 },
    D: { mean: 0.46, sd: 0.74 }
  };

  const likelihoods = {};
  let total = 0;
  for (const party in distributions) {
    likelihoods[party] = priors[party] * normalPDF((score - distributions[party].mean) / distributions[party].sd);
    total += likelihoods[party];
  }

  // Convert to percentages
  for (const party in likelihoods) {
    likelihoods[party] = Math.round((likelihoods[party] / total) * 100);
  }

  resultEl.innerHTML = `You are more politically liberal than ${percentile}% of study participants.<br>` +
                       `Republican: ${likelihoods.R}%<br>` +
                       `Independent: ${likelihoods.I}%<br>` +
                       `Democrat: ${likelihoods.D}%`;
});
</script>