(function () {
  "use strict";

  const QUIZ_ITEM_COUNT = 26;
  const EPS = 1e-12;
  const RULES = {
    nonNerdMaxSelfIdProb: 0.33,
    nerdMinSelfIdProb: 0.67,
    strongSubtypeMinTopProb: 0.60,
    strongSubtypeMinMargin: 0.20,
    mixedSubtypeMinTopProb: 0.40,
    mixedSubtypeMinSecondProb: 0.25,
    mixedSubtypeMaxMargin: 0.20
  };

  const LIKERT_OPTIONS = [
    { value: 1, label: "Strongly Disagree" },
    { value: 2, label: "Somewhat Disagree" },
    { value: 3, label: "Neutral" },
    { value: 4, label: "Somewhat Agree" },
    { value: 5, label: "Strongly Agree" }
  ];

  const GATE_LABELS = {
    non_nerd: "Non-nerd",
    nerd_adjacent: "Nerd-adjacent",
    nerd: "Nerd"
  };

  const GENERAL_DESCRIPTIONS = {
    non_nerd: [
      "You do not seem especially drawn to the classic nerd pattern: getting absorbed in ideas, interests, systems, stories, or subjects for their own sake.",
      "You may still be curious, smart, creative, or deeply interested in particular things. But for you, nerdiness probably feels more like an occasional flavor than a central part of how you move through the world."
    ],
    nerd_adjacent: [
      "You have a noticeable nerdy streak. You may enjoy learning for its own sake, getting unusually into your interests, or spending time in worlds of books, games, ideas, fandoms, or technical subjects.",
      "Still, nerdiness may not be the main way you understand yourself. You seem close enough to recognize the territory, but not so deep in it that it fully takes over your self-image."
    ],
    nerd: [
      "Nerdiness seems to be a real part of your personality. You are probably the kind of person who can get intensely interested in ideas, fictional worlds, technical subjects, academic questions, or oddly specific hobbies.",
      "You may care more than most people about understanding things, following your curiosity, and having interests that feel genuinely yours. Your result suggests that nerdiness is not just something you occasionally do, but part of how you relate to the world."
    ]
  };

  const SUBTYPE_COPY = {
    hobbyist: {
      title: "The Hobbyist",
      description: [
        "Your nerdiness is built around deep interests, private fascinations, and the pleasure of having a world to disappear into. You are drawn to hobbies with texture: systems to understand, rules to master, lore to absorb, details to notice, and questions to chase long after most people would have moved on.",
        "You probably like having a few interests that feel genuinely yours. Your curiosity may be quiet, but it runs deep; you can turn a game, setting, topic, or creative project into a whole inner landscape. You may feel most at home in spaces where people connect through shared interests rather than ordinary small talk. Your nerdiness is less about performing a public identity and more about having a rich inner life."
      ]
    },

    geek: {
      title: "The Geek",
      description: [
        "Your nerdiness is enthusiastic, recognizable, and culturally fluent. You are drawn to the shared worlds of geek culture: science media, games, superheroes, libraries, fandoms, and the familiar pleasures of knowing the references, stories, and symbols that other geeks know too.",
        "You probably enjoy learning most when it is vivid, accessible, and connected to things you can talk about, watch, play, collect, or share. Your curiosity has a social and cultural side: part excitement, part fandom, part wanting to know how the cool thing works. Your nerdiness is not hidden away; it shows up in what you enjoy, what you follow, and what you get excited to talk about."
      ]
    },

    scholar: {
      title: "The Scholar",
      description: [
        "Your nerdiness is centered on ideas. You are drawn to learning, research, intellectual projects, and the feeling of following a thought further than you technically need to. You probably care about understanding things in a serious way, not just knowing the answer but seeing the structure underneath it.",
        "You may be the kind of person who gets attached to questions, theories, arguments, or unfinished lines of thought. Your curiosity is self-directed and sometimes demanding: once something catches your mind, it can feel worth pursuing even if no one else quite understands why. Your nerdiness is about depth, abstraction, and taking ideas seriously."
      ]
    },

    hobbyist_geek: {
      title: "The Hobbyist-Geek",
      description: [
        "Your nerdiness combines deep personal interests with recognizable geek culture. You may enjoy games, fandoms, science media, genre fiction, or other shared nerd worlds, but you are not just passing through them casually. You like having things to dig into: mechanics, lore, timelines, systems, references, strategies, and obscure corners.",
        "This is the profile of someone whose interests are both playful and absorbing. You enjoy the fun surface of nerd culture, but you also like having a private relationship with the things you love. You are part fan, part deep-diver: enthusiastic enough to enjoy the shared culture, and detail-oriented enough to make it your own."
      ]
    },

    hobbyist_scholar: {
      title: "The Hobbyist-Scholar",
      description: [
        "Your nerdiness combines niche interests with intellectual depth. You are drawn to hobbies and private fascinations, but you also want to understand them rigorously. A casual interest can easily become a research project; a game, story, system, or topic can turn into something you analyze, organize, and think about from multiple angles.",
        "This is the profile of someone whose hobbies often turn into studies. You may not always separate play from learning, because for you, part of the fun is figuring out how things work. Your curiosity is both personal and serious: you like having interests that feel absorbing, meaningful, and intellectually alive."
      ]
    },

    geek_scholar: {
      title: "The Geek-Scholar",
      description: [
        "Your nerdiness combines geek-culture enthusiasm with serious intellectual curiosity. You may enjoy science media, games, superheroes, genre fiction, or other familiar nerd domains, but you are also drawn to ideas, learning, research, and academic achievement. You like the fun of nerd culture, but you also want the deeper explanation.",
        "This is the profile of someone who can move easily between enthusiasm and analysis. You can enjoy the story, the spectacle, or the fandom, then immediately start asking how it works, what it means, or what principle lies underneath it. Your nerdiness is both expressive and thoughtful: you like being excited by things, and you like understanding them."
      ]
    },

    generalist: {
      title: "The Generalist",
      description: [
        "Your nerdiness does not fall neatly into just one subtype. You may have niche hobbies, recognizable geek-culture interests, and intellectual curiosity all at once, or your answers may point in different directions depending on the topic. Rather than having one obvious nerd style, you draw from several parts of the nerdy personality space.",
        "This is the profile of someone with a broad, flexible kind of nerdiness. You might be a deep-diver in one context, a fan in another, and an idea person somewhere else entirely. Your interests may not share one simple theme, but they are connected by curiosity, absorption, and the pleasure of caring about things more than most people do."
      ]
    }
  };

  const windowApi = {};

  function clampProbability(probability) {
    return Math.max(EPS, Math.min(1 - EPS, probability));
  }

  function normalCdf(x) {
    const sign = x < 0 ? -1 : 1;
    const absX = Math.abs(x) / Math.sqrt(2);
    const t = 1 / (1 + 0.3275911 * absX);
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const erfApprox = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
    return clampProbability(0.5 * (1 + sign * erfApprox));
  }

  function orderedProbitCategoryProb(response, eta, thresholds) {
    const categoryCount = thresholds.length + 1;

    if (!Number.isInteger(response) || response < 1 || response > categoryCount) {
      throw new Error(`Invalid ordered-probit response: ${response}`);
    }

    const lowerCdf = response === 1 ? 0 : normalCdf(thresholds[response - 2] - eta);
    const upperCdf = response === categoryCount ? 1 : normalCdf(thresholds[response - 1] - eta);

    return clampProbability(upperCdf - lowerCdf);
  }

  function makeThetaGrid(min, max, step) {
    if (!(step > 0) || max < min) {
      throw new Error("Invalid theta grid configuration.");
    }

    const count = Math.floor(((max - min) / step) + 0.5) + 1;
    return Array.from({ length: count }, function (_, index) {
      return Number((min + (index * step)).toFixed(12));
    });
  }

  function logSumExp(values) {
    const maxValue = Math.max.apply(null, values);
    const total = values.reduce(function (sum, value) {
      return sum + Math.exp(value - maxValue);
    }, 0);

    return maxValue + Math.log(total);
  }

  function normalizeLogWeights(logWeights) {
    const logTotal = logSumExp(logWeights);
    return logWeights.map(function (value) {
      return Math.exp(value - logTotal);
    });
  }

  function logPrior(theta, mean, sd) {
    const z = (theta - mean) / sd;
    return -0.5 * z * z;
  }

  function validateStrictlyIncreasing(values) {
    for (let index = 1; index < values.length; index += 1) {
      if (!(values[index] > values[index - 1])) {
        return false;
      }
    }

    return true;
  }

  function validateResponses(responses) {
    return Array.isArray(responses) &&
      responses.length === QUIZ_ITEM_COUNT &&
      responses.every(function (response) {
        return Number.isInteger(response) && response >= 1 && response <= 5;
      });
  }

  function validateModel(model) {
    const errors = [];

    if (!model || typeof model !== "object") {
      errors.push("Model JSON must be an object.");
      return { valid: false, errors: errors };
    }

    if (!Array.isArray(model.itemIds) || model.itemIds.length !== QUIZ_ITEM_COUNT) {
      errors.push("Model must contain exactly 26 item IDs.");
    }

    if (!Array.isArray(model.itemTexts) || model.itemTexts.length !== QUIZ_ITEM_COUNT) {
      errors.push("Model must contain exactly 26 item texts.");
    }

    if (!Array.isArray(model.responseScale) || model.responseScale.join(",") !== "1,2,3,4,5") {
      errors.push("Model response scale must be [1, 2, 3, 4, 5].");
    }

    if (!model.irt || !Array.isArray(model.irt.loadings) || model.irt.loadings.length !== QUIZ_ITEM_COUNT) {
      errors.push("IRT loadings must contain exactly 26 values.");
    }

    if (!model.irt || !Array.isArray(model.irt.thresholds) || model.irt.thresholds.length !== QUIZ_ITEM_COUNT) {
      errors.push("IRT thresholds must contain exactly 26 threshold arrays.");
    } else {
      model.irt.thresholds.forEach(function (thresholds, index) {
        if (!Array.isArray(thresholds) || thresholds.length !== 4) {
          errors.push(`IRT thresholds for item ${index + 1} must have length 4.`);
          return;
        }

        if (!validateStrictlyIncreasing(thresholds)) {
          errors.push(`IRT thresholds for item ${index + 1} must be strictly increasing.`);
        }
      });
    }

    if (!model.selfIdCalibration || !Array.isArray(model.selfIdCalibration.thresholds) || model.selfIdCalibration.thresholds.length !== 6) {
      errors.push("Self-ID thresholds must have length 6.");
    } else if (!validateStrictlyIncreasing(model.selfIdCalibration.thresholds)) {
      errors.push("Self-ID thresholds must be strictly increasing.");
    }

    if (!model.mixture || !Array.isArray(model.mixture.clusterWeights) || model.mixture.clusterWeights.length !== 3) {
      errors.push("Cluster weights must contain exactly 3 values.");
    }

    if (!model.mixture || !Array.isArray(model.mixture.clusterLabels) || model.mixture.clusterLabels.length !== 3) {
      errors.push("Cluster labels must contain exactly 3 values.");
    }

    if (!model.mixture || !Array.isArray(model.mixture.clusterDisplayNames) || model.mixture.clusterDisplayNames.length !== 3) {
      errors.push("Cluster display names must contain exactly 3 values.");
    }

    if (!model.mixture || !Array.isArray(model.mixture.clusterIntercepts) || model.mixture.clusterIntercepts.length !== 3) {
      errors.push("Cluster intercepts must be a 3 x 26 array.");
    } else {
      model.mixture.clusterIntercepts.forEach(function (clusterIntercepts, clusterIndex) {
        if (!Array.isArray(clusterIntercepts) || clusterIntercepts.length !== QUIZ_ITEM_COUNT) {
          errors.push(`Cluster intercepts for class ${clusterIndex + 1} must contain 26 values.`);
        }
      });
    }

    if (model.mixture && Array.isArray(model.mixture.clusterWeights)) {
      const weightSum = model.mixture.clusterWeights.reduce(function (sum, weight) {
        return sum + weight;
      }, 0);

      if (Math.abs(weightSum - 1) > 1e-3) {
        errors.push(`Cluster weights must sum to approximately 1. Received ${weightSum.toFixed(6)}.`);
      }
    }

    if (!model.thetaGrid || typeof model.thetaGrid.min !== "number" || typeof model.thetaGrid.max !== "number" || typeof model.thetaGrid.step !== "number") {
      errors.push("Theta grid must include numeric min, max, and step values.");
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  function scoreResponseLogLikelihood(responses, model, theta, intercepts) {
    return responses.reduce(function (sum, response, index) {
      const eta = (model.irt.loadings[index] * theta) + (intercepts ? intercepts[index] : 0);
      const probability = orderedProbitCategoryProb(response, eta, model.irt.thresholds[index]);
      return sum + Math.log(probability);
    }, 0);
  }

  function scoreThetaPosterior(responses, model) {
    if (!validateResponses(responses)) {
      throw new Error("Responses must be 26 integers on the 1-5 response scale.");
    }

    const mean = typeof model.irt.thetaMean === "number" ? model.irt.thetaMean : 0;
    const sd = typeof model.irt.thetaSd === "number" ? model.irt.thetaSd : 1;
    const thetaGrid = makeThetaGrid(model.thetaGrid.min, model.thetaGrid.max, model.thetaGrid.step);
    const logPosterior = thetaGrid.map(function (theta) {
      return scoreResponseLogLikelihood(responses, model, theta) + logPrior(theta, mean, sd);
    });
    const posteriorWeights = normalizeLogWeights(logPosterior);
    const thetaMean = thetaGrid.reduce(function (sum, theta, index) {
      return sum + (theta * posteriorWeights[index]);
    }, 0);
    const thetaVariance = thetaGrid.reduce(function (sum, theta, index) {
      const diff = theta - thetaMean;
      return sum + (diff * diff * posteriorWeights[index]);
    }, 0);

    return {
      thetaGrid: thetaGrid,
      posteriorWeights: posteriorWeights,
      thetaMean: thetaMean,
      thetaSd: Math.sqrt(Math.max(thetaVariance, 0))
    };
  }

  function selfIdAtLeastForTheta(theta, model, category) {
    const thresholds = model.selfIdCalibration.thresholds;
    const maxCategory = thresholds.length + 1;

    if (!Number.isInteger(category) || category < 1 || category > maxCategory) {
      throw new Error(`Invalid self-ID threshold category: ${category}`);
    }

    if (category === 1) {
      return 1;
    }

    const eta = model.selfIdCalibration.loading * theta;
    return clampProbability(1 - normalCdf(thresholds[category - 2] - eta));
  }

  function integrateSelfIdAtLeast(thetaPosterior, model, category) {
    return thetaPosterior.thetaGrid.reduce(function (sum, theta, index) {
      return sum + (selfIdAtLeastForTheta(theta, model, category) * thetaPosterior.posteriorWeights[index]);
    }, 0);
  }

  function predictSelfIdAtLeast(responses, model, category) {
    const thresholdCategory = Number.isInteger(category)
      ? category
      : (model.selfIdCalibration.nerdThresholdCategory || 5);
    const thetaPosterior = scoreThetaPosterior(responses, model);
    return integrateSelfIdAtLeast(thetaPosterior, model, thresholdCategory);
  }

  function scoreSubtypePosteriors(responses, model) {
    const thetaGrid = makeThetaGrid(model.thetaGrid.min, model.thetaGrid.max, model.thetaGrid.step);
    const mean = typeof model.irt.thetaMean === "number" ? model.irt.thetaMean : 0;
    const sd = typeof model.irt.thetaSd === "number" ? model.irt.thetaSd : 1;

    const classLogWeights = model.mixture.clusterLabels.map(function (_label, clusterIndex) {
      const intercepts = model.mixture.clusterIntercepts[clusterIndex];
      const thetaLogTerms = thetaGrid.map(function (theta) {
        return scoreResponseLogLikelihood(responses, model, theta, intercepts) + logPrior(theta, mean, sd);
      });

      return Math.log(clampProbability(model.mixture.clusterWeights[clusterIndex])) + logSumExp(thetaLogTerms);
    });

    const normalized = normalizeLogWeights(classLogWeights);
    const subtypeProbs = {};

    model.mixture.clusterLabels.forEach(function (label, index) {
      subtypeProbs[label] = normalized[index];
    });

    return subtypeProbs;
  }

  function classifyNerdGate(selfIdAtLeast5Prob, rules) {
    if (selfIdAtLeast5Prob < rules.nonNerdMaxSelfIdProb) {
      return "non_nerd";
    }

    if (selfIdAtLeast5Prob < rules.nerdMinSelfIdProb) {
      return "nerd_adjacent";
    }

    return "nerd";
  }

  function sortSubtypeProbabilities(subtypeProbs, model) {
    return model.mixture.clusterLabels.map(function (label, index) {
      return {
        label: label,
        displayName: model.mixture.clusterDisplayNames[index],
        prob: subtypeProbs[label]
      };
    }).sort(function (left, right) {
      return right.prob - left.prob;
    });
  }

  function classifySubtype(subtypeProbs, model, rules) {
    const ordered = sortSubtypeProbabilities(subtypeProbs, model);
    const top = ordered[0];
    const second = ordered[1];
    const margin = top.prob - second.prob;

    if (top.prob >= rules.strongSubtypeMinTopProb && margin >= rules.strongSubtypeMinMargin) {
      return {
        kind: "strong",
        primary: top.label,
        secondary: null,
        topProb: top.prob,
        secondProb: second.prob,
        margin: margin,
        ordered: ordered
      };
    }

    if (
      top.prob >= rules.mixedSubtypeMinTopProb &&
      second.prob >= rules.mixedSubtypeMinSecondProb &&
      margin < rules.mixedSubtypeMaxMargin
    ) {
      return {
        kind: "mixed",
        primary: top.label,
        secondary: second.label,
        topProb: top.prob,
        secondProb: second.prob,
        margin: margin,
        ordered: ordered
      };
    }

    return {
      kind: "undifferentiated",
      primary: null,
      secondary: null,
      topProb: top.prob,
      secondProb: second.prob,
      margin: margin,
      ordered: ordered
    };
  }

  function resolveFinalCategory(nerdGate, subtypeResult) {
    if (nerdGate !== "nerd") {
      return nerdGate;
    }

    if (subtypeResult.kind === "strong") {
      return `strong_${subtypeResult.primary}`;
    }

    if (subtypeResult.kind === "mixed") {
      return `mixed_${subtypeResult.primary}_${subtypeResult.secondary}`;
    }

    return "undifferentiated_nerd";
  }

  function scoreQuiz(responses, model, rules) {
    const thetaPosterior = scoreThetaPosterior(responses, model);
    const selfIdThresholdCategory = model.selfIdCalibration.nerdThresholdCategory || 5;
    const selfIdAtLeast5Prob = integrateSelfIdAtLeast(thetaPosterior, model, selfIdThresholdCategory);
    const nerdGate = classifyNerdGate(selfIdAtLeast5Prob, rules);
    const result = {
      nerdGate: nerdGate,
      finalCategory: null,
      selfIdThresholdCategory: selfIdThresholdCategory,
      selfIdAtLeast5Prob: selfIdAtLeast5Prob,
      thetaMean: thetaPosterior.thetaMean,
      thetaSd: thetaPosterior.thetaSd,
      thetaGrid: thetaPosterior.thetaGrid,
      posteriorWeights: thetaPosterior.posteriorWeights,
      subtypeProbs: null,
      subtypeResult: null
    };

    if (nerdGate !== "non_nerd") {
      result.subtypeProbs = scoreSubtypePosteriors(responses, model);
      result.subtypeResult = classifySubtype(result.subtypeProbs, model, rules);
    }

    result.finalCategory = resolveFinalCategory(result.nerdGate, result.subtypeResult || { kind: "undifferentiated" });

    return result;
  }

  function formatPercent(value) {
    return `${(value * 100).toFixed(1)}%`;
  }

  function formatWholePercent(value) {
    return `${Math.round(value * 100)}%`;
  }

  function nerdScore(value) {
    return Math.round(clampProbability(value) * 100);
  }

  function formatSigned(value) {
    const rounded = value.toFixed(2);
    return value >= 0 ? `+${rounded}` : rounded;
  }

  function titleCaseLabel(label) {
    return label.split("_").map(function (part) {
      return part.charAt(0).toUpperCase() + part.slice(1);
    }).join(" ");
  }

  function renderItems(form, model) {
    const fragment = document.createDocumentFragment();

    model.itemTexts.forEach(function (text, index) {
      const itemId = model.itemIds[index];
      const container = document.createElement("fieldset");
      container.style.marginBottom = "1.5em";
      container.style.padding = "1em";
      container.style.border = "1px solid #d0d7de";
      container.style.borderRadius = "6px";

      const legend = document.createElement("legend");
      legend.style.fontWeight = "600";
      legend.style.padding = "0 0.35em";
      legend.textContent = `${index + 1}. ${text}`;
      container.appendChild(legend);

      LIKERT_OPTIONS.forEach(function (option) {
        const label = document.createElement("label");
        label.style.display = "block";
        label.style.marginBottom = "0.35em";

        const input = document.createElement("input");
        input.type = "radio";
        input.name = itemId;
        input.value = String(option.value);
        input.style.marginRight = "0.45em";

        label.appendChild(input);
        label.appendChild(document.createTextNode(option.label));
        container.appendChild(label);
      });

      fragment.appendChild(container);
    });

    form.innerHTML = "";
    form.appendChild(fragment);
  }

  function collectResponses(form, model) {
    return model.itemIds.map(function (itemId) {
      const checked = form.querySelector(`input[name="${itemId}"]:checked`);
      return checked ? Number.parseInt(checked.value, 10) : null;
    });
  }

  function firstMissingItem(responses) {
    return responses.findIndex(function (response) {
      return !Number.isInteger(response);
    });
  }

  function clusterDisplayName(label, model) {
    const index = model.mixture.clusterLabels.indexOf(label);
    return index === -1 ? titleCaseLabel(label) : model.mixture.clusterDisplayNames[index];
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function subtypeCopyKey(subtypeResult) {
    if (subtypeResult.kind === "strong") {
      return subtypeResult.primary;
    }

    if (subtypeResult.kind === "mixed") {
      return [subtypeResult.primary, subtypeResult.secondary].sort().join("_");
    }

    return "generalist";
  }

  function technicalDetailsHtml(result, model) {
    return `
      <details style="margin-top: 1.5em;">
        <summary style="cursor: pointer; font-weight: 600;">Technical details</summary>
        <div style="margin-top: 1em;">
          <p>The underlying psychometric analysis is described in more detail in my previous post: <a href="/nerd/"><em>What Is A Nerd? (A Psychometric Analysis of the NPAS)</em></a>. Basically, I modeled the 26 NPAS items using an <a href="https://arxiv.org/abs/2108.08604">ordered-probit 2PL IRT model</a>, from which I extracted a latent nerdiness factor. This factor showed convergent validity with <a href="/nerd/#what-is-a-nerd">definitions of nerdiness proposed by others</a>.</p>
          <p>The Nerd Score is not a percentile, a choice I made because the NPAS sample suffers from strong self-selection and is much nerdier than average. Instead, I fit an ordinal-probit regression to estimate the probability that someone would choose at least a 5/7 on the item "I see myself as: nerdy," where 5 means "Agree a little." The predicted probability becomes the Nerd Score, and so is best interpreted as an estimate of nerd self-identification rather than a rank against the population. The Nerd Score is split into three parts: 0-33 = Non-Nerd, 34-66 = Nerd-Adjacent, and 67-100 = Nerd.</p>
          <p>The subtype model is based on a mixture of IRT models. Given the results in <a href="/nerd/">my analysis of the NPAS</a>, where <a href="/mediation/#metric-invariance">metric invariance</a> mostly held across sex and age, I fixed the item loadings to be equal across clusters to simplify estimation. What differs between clusters are the item intercepts. The relative spacing between response thresholds stays fixed, but the overall tendency to endorse specific items can shift between clusters. Basically, you can think of the model as assuming <a href="/mediation/#metric-invariance">metric invariance</a> across clusters, but not <a href="/mediation/#scalar-invariance">scalar invariance</a>.</p>
          <p>To determine how many clusters to keep, I fit models ranging from one cluster to seven clusters and compared them using the <a href="https://arxiv.org/abs/1205.4123">integrated completed likelihood criterion (ICL)</a>. I used that criterion because it penalizes classification entropy-that is, cases where a respondent cannot cleanly be assigned to a cluster-which should, in theory, favor crisp, clean clusters. The model that minimized ICL had three clusters. After inspecting the intercept patterns, I assigned the labels Hobbyist, Geek, and Scholar. The subtype percentages are posterior probabilities over those three clusters.</p>
          <p>Additionally, a subtype is only displayed if the Nerd Score is greater than 33; that is, if you are at least Nerd-Adjacent. A strong subtype is displayed when one cluster has at least 60% probability and leads the runner-up by at least 20 percentage points. A mixed type is displayed when the top cluster has at least 40% probability, the second cluster has at least 25% probability, and the margin between them is no more than 20 percentage points. Otherwise, the result is displayed as Generalist.</p>
        </div>
      </details>
    `;
  }

  function renderResult(result, model, resultEl) {
    const score = nerdScore(result.selfIdAtLeast5Prob);
    const parts = [];
    const generalDescription = GENERAL_DESCRIPTIONS[result.nerdGate];

    parts.push(`<h2 style="margin-top: 0;">Your result: ${GATE_LABELS[result.nerdGate]}</h2>`);
    parts.push(`<p><strong>Nerd Score: ${score} / 100</strong><br>${result.nerdGate === "nerd" ? "You are very likely to see yourself as nerdy." : result.nerdGate === "nerd_adjacent" ? "You show some nerdy traits, but not a clear nerd identity." : "You are unlikely to strongly see yourself as nerdy."}</p>`);
    parts.push(`<p>${generalDescription[0]}</p>`);
    parts.push(`<p>${generalDescription[1]}</p>`);

    if (result.subtypeResult && result.subtypeProbs) {
      const copy = SUBTYPE_COPY[subtypeCopyKey(result.subtypeResult)];
      parts.push(`<p><strong>Subtype: ${copy.title}</strong></p>`);
      parts.push(`<p>${copy.description[0]}</p>`);
      parts.push(`<p>${copy.description[1]}</p>`);
      parts.push(
        `<p><strong>Subtype mix:</strong><br>` +
        `Hobbyist: ${formatWholePercent(result.subtypeProbs.hobbyist)}<br>` +
        `Geek: ${formatWholePercent(result.subtypeProbs.geek)}<br>` +
        `Scholar: ${formatWholePercent(result.subtypeProbs.scholar)}</p>`
      );
    }

    parts.push(technicalDetailsHtml(result, model));
    resultEl.innerHTML = parts.join("");
  }

  function showMessage(target, message, color) {
    target.textContent = message;
    target.style.color = color;
  }

  async function loadModel(modelUrl) {
    const response = await fetch(modelUrl, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Failed to load model JSON (${response.status}).`);
    }

    return response.json();
  }

  async function initNpasQuiz(rootSelector) {
    const root = document.querySelector(rootSelector || "#npas-quiz");

    if (!root) {
      return;
    }

    const form = root.querySelector("[data-role='quiz-form']");
    const statusEl = root.querySelector("[data-role='quiz-status']");
    const resultEl = root.querySelector("[data-role='quiz-result']");
    const submitButton = root.querySelector("[data-role='quiz-submit']");
    const modelUrl = root.dataset.modelUrl || "/assets/jsons/npas_quiz_model.json";

    showMessage(statusEl, "Loading quiz model...", "#57606a");
    submitButton.disabled = true;

    try {
      const model = await loadModel(modelUrl);
      const validation = validateModel(model);

      if (!validation.valid) {
        console.error("Invalid NPAS model bundle.", validation.errors);
        showMessage(statusEl, "This quiz model is invalid. Check the console for details.", "#cf222e");
        return;
      }

      Object.assign(RULES, model.classificationRules || {});
      renderItems(form, model);
      showMessage(statusEl, "Answer all 26 items, then submit to score the quiz.", "#57606a");
      submitButton.disabled = false;

      root.addEventListener("submit", function (event) {
        event.preventDefault();
      });

      submitButton.addEventListener("click", function () {
        resultEl.innerHTML = "";

        const responses = collectResponses(form, model);
        const missingIndex = firstMissingItem(responses);

        if (missingIndex !== -1) {
          showMessage(statusEl, `Please answer all items before submitting. Item ${missingIndex + 1} is still blank.`, "#cf222e");
          return;
        }

        if (!validateResponses(responses)) {
          console.error("Invalid NPAS responses.", responses);
          showMessage(statusEl, "Responses were invalid. Please refresh and try again.", "#cf222e");
          return;
        }

        try {
          const result = scoreQuiz(responses, model, RULES);
          showMessage(statusEl, "Scoring complete.", "#1a7f37");
          renderResult(result, model, resultEl);
        } catch (error) {
          console.error("NPAS scoring failed.", error);
          showMessage(statusEl, "Scoring failed. Check the console for details.", "#cf222e");
        }
      });
    } catch (error) {
      console.error("Failed to initialize NPAS quiz.", error);
      showMessage(statusEl, "Could not load the quiz model. Check the console for details.", "#cf222e");
    }
  }

  windowApi.RULES = RULES;
  windowApi.normalCdf = normalCdf;
  windowApi.orderedProbitCategoryProb = orderedProbitCategoryProb;
  windowApi.makeThetaGrid = makeThetaGrid;
  windowApi.logSumExp = logSumExp;
  windowApi.normalizeLogWeights = normalizeLogWeights;
  windowApi.scoreThetaPosterior = scoreThetaPosterior;
  windowApi.predictSelfIdAtLeast = predictSelfIdAtLeast;
  windowApi.scoreSubtypePosteriors = scoreSubtypePosteriors;
  windowApi.classifyNerdGate = classifyNerdGate;
  windowApi.classifySubtype = classifySubtype;
  windowApi.scoreQuiz = scoreQuiz;
  windowApi.validateModel = validateModel;
  windowApi.initNpasQuiz = initNpasQuiz;

  window.NPASQuiz = windowApi;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initNpasQuiz("#npas-quiz");
    });
  } else {
    initNpasQuiz("#npas-quiz");
  }
}());
