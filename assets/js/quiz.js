// assets/js/quiz.js

// --- Utility: standard normal PDF ---
function normalPDF(x) {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

// --- Utility: standard normal CDF (Φ(x)) ---
// Using Abramowitz & Stegun approximation
function normalCDF(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const poly = t * (0.3193815 +
               t * (-0.3565638 +
               t * (1.781478 +
               t * (-1.821256 +
               t * 1.330274))));
  let p = 1 - (d * poly);
  if (x < 0) p = 1 - p;
  return p;
}

// --- Estimate the latent score given observed responses ---
function estimateLatentScore(observation, loadings, thresholds, debug = false) {
  // 1. Define possible latent scores
  const possibleLatentScores = Array.from({ length: 601 }, (_, i) => -3 + i * 0.01);

  // 2. Define prior (standard normal)
  const prior = possibleLatentScores.map((x) => normalPDF(x));

  // 3. Compute likelihoods for each item
  const likelihoods = computeLikelihoods(observation, possibleLatentScores, loadings, thresholds, debug);

  // 4. Multiply priors and likelihoods across all items to get posterior
  let posterior = prior.slice(); // copy
  for (const item in observation) {
    const like = likelihoods[item];
    for (let i = 0; i < posterior.length; i++) {
      posterior[i] *= like[i];
    }
  }

  // 5. Normalize posterior
  const total = posterior.reduce((a, b) => a + b, 0);
  for (let i = 0; i < posterior.length; i++) posterior[i] /= total;

  // 6. Find the median latent score
  return findMedianScore(posterior, possibleLatentScores);
}

// --- Compute likelihoods for each observed item ---
function computeLikelihoods(observation, possibleLatentScores, loadings, thresholds, debug = false) {
  const likelihoods = {};

  for (const [item, score] of Object.entries(observation)) {
    const upper = getNormalDistCDF(item, score, possibleLatentScores, loadings, thresholds);
    const lower = getNormalDistCDF(item, score - 1, possibleLatentScores, loadings, thresholds);
    const like = upper.map((u, i) => u - lower[i]);
    likelihoods[item] = like;

    if (debug && Math.random() < 0.05) {
      console.log(`Debug for ${item}:`, { score, meanLike: average(like) });
    }
  }

  return likelihoods;
}

// --- Compute the normal CDF for each possible latent score given an item and category ---
function getNormalDistCDF(item, score, possibleLatentScores, loadings, thresholds) {
  const loading = loadings[item];
  const sd = Math.sqrt(1 - (loading * loading));
  const thresh = thresholds[item][score];

  return possibleLatentScores.map((theta) => {
    const mean = theta * loading;
    return normalCDF((thresh - mean) / sd);
  });
}

// --- Find the median of the posterior distribution ---
function findMedianScore(posterior, possibleLatentScores) {
  let cumulative = 0;
  const total = posterior.reduce((a, b) => a + b, 0);
  for (let i = 0; i < posterior.length; i++) {
    cumulative += posterior[i];
    if (cumulative >= total / 2) {
      return possibleLatentScores[i];
    }
  }
  return possibleLatentScores[possibleLatentScores.length - 1];
}

// --- Helper: average for debugging ---
function average(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

