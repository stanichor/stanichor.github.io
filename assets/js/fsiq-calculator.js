(() => {
  const calculator = document.querySelector("[data-fsiq-calculator]");
  if (!calculator) return;

  // Fitted to the 64 paired Open Psychometrics / WASI-II records in
  // Logos, Brewer, and Young (2021). Order: intercept, memory, verbal, spatial.
  const coefficients = [
    39.2993702717989,
    0.138571738615284,
    0.213306797580951,
    0.293231307560847,
  ];
  const coefficientCovariance = [
    [144.389116391828, -0.368922141608153, -0.683443456001133, -0.227930242005066],
    [-0.368922141608153, 0.00629962185185332, -0.00115890054613081, -0.00179006158445672],
    [-0.683443456001133, -0.00115890054613081, 0.0105341780817561, -0.00291580605868587],
    [-0.227930242005066, -0.00179006158445672, -0.00291580605868587, 0.00636178404357487],
  ];
  const residualStandardError = 8.40295458532881;
  const tCritical90 = 1.67064886490464; // t(0.95, 60 residual df)
  const trainingRanges = {
    memory: [70, 137],
    verbal: [87, 129],
    spatial: [82, 144],
  };

  const form = calculator.querySelector('[data-role="form"]');
  const result = calculator.querySelector('[data-role="result"]');
  const estimate = calculator.querySelector('[data-role="estimate"]');
  const rangeNote = calculator.querySelector('[data-role="range-note"]');

  form.addEventListener("input", () => {
    result.hidden = true;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const scores = Object.fromEntries(
      ["overall", "memory", "verbal", "spatial"].map((name) => [
        name,
        Number(form.elements[name].value),
      ])
    );
    const x = [1, scores.memory, scores.verbal, scores.spatial];
    const mean = x.reduce((sum, value, i) => sum + value * coefficients[i], 0);
    const meanVariance = x.reduce(
      (sum, value, i) =>
        sum + value * x.reduce(
          (rowSum, otherValue, j) => rowSum + coefficientCovariance[i][j] * otherValue,
          0
        ),
      0
    );
    const predictionError = Math.sqrt(residualStandardError ** 2 + meanVariance);
    const margin = tCritical90 * predictionError;

    estimate.textContent = `${Math.round(mean)} (${Math.round(mean - margin)}–${Math.round(mean + margin)})`;

    const outside = Object.entries(trainingRanges)
      .filter(([name, [low, high]]) => scores[name] < low || scores[name] > high)
      .map(([name]) => name);
    rangeNote.hidden = outside.length === 0;
    rangeNote.textContent = outside.length
      ? `Outside the study's observed range: ${outside.join(", ")}. The prediction is less certain here.`
      : "";
    result.hidden = false;
  });
})();
