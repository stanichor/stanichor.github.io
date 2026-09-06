(function (global) {
  "use strict";

  const MEASUREMENT_KEYS = [
    "height",
    "weight",
    "neck_circumference",
    "chest_circumference",
    "abdomen_circumference",
    "hip_circumference",
    "thigh_circumference",
    "knee_circumference",
    "ankle_circumference",
    "biceps_circumference",
    "forearm_circumference",
    "wrist_circumference"
  ];

  const LABELS = {
    height: "Height",
    weight: "Weight",
    neck_circumference: "Neck circumference",
    chest_circumference: "Chest circumference",
    abdomen_circumference: "Waist circumference",
    hip_circumference: "Hip circumference",
    thigh_circumference: "Thigh circumference",
    knee_circumference: "Knee circumference",
    ankle_circumference: "Ankle circumference",
    biceps_circumference: "Extended biceps circumference",
    forearm_circumference: "Forearm circumference",
    wrist_circumference: "Wrist circumference"
  };

  // Chi-square cutoffs with tail probability 0.002699796, matching the
  // two-sided probability beyond ±3 SD for one normally distributed value.
  const MAHALANOBIS_SQUARED_CUTOFFS = [
    null,
    9.000000000000002,
    11.829158081900811,
    14.156413609126687,
    16.2513408139562,
    18.205314008384107,
    20.06208616571405,
    21.84658167301522,
    23.574591022671065,
    25.256865861792942,
    26.90111940580125,
    28.51310874842274,
    30.097266729568577
  ];

  function dot(left, right) {
    return left.reduce(function (sum, value, index) {
      return sum + value * right[index];
    }, 0);
  }

  function solveLinearSystem(matrix, vector) {
    const size = matrix.length;
    const augmented = matrix.map(function (row, index) {
      return row.slice().concat(vector[index]);
    });

    for (let column = 0; column < size; column += 1) {
      let pivotRow = column;
      for (let row = column + 1; row < size; row += 1) {
        if (Math.abs(augmented[row][column]) > Math.abs(augmented[pivotRow][column])) {
          pivotRow = row;
        }
      }
      if (Math.abs(augmented[pivotRow][column]) < 1e-12) {
        throw new Error("A compatible model could not be solved numerically.");
      }
      if (pivotRow !== column) {
        const temporary = augmented[column];
        augmented[column] = augmented[pivotRow];
        augmented[pivotRow] = temporary;
      }

      const pivot = augmented[column][column];
      for (let item = column; item <= size; item += 1) {
        augmented[column][item] /= pivot;
      }
      for (let row = 0; row < size; row += 1) {
        if (row === column) continue;
        const factor = augmented[row][column];
        for (let item = column; item <= size; item += 1) {
          augmented[row][item] -= factor * augmented[column][item];
        }
      }
    }
    return augmented.map(function (row) { return row[size]; });
  }

  function transformMeasurements(className, measurements) {
    const height = measurements.height;
    const transformed = {};
    MEASUREMENT_KEYS.forEach(function (measurement, index) {
      const value = measurements[measurement];
      if (className === "raw" && value !== undefined) {
        transformed[index] = value;
      } else if (className === "logged" && value !== undefined) {
        transformed[index] = Math.log(value);
      } else if (className === "height_normalized") {
        if (measurement === "height" && height !== undefined) {
          transformed[index] = height;
        } else if (measurement === "weight" && height !== undefined && value !== undefined) {
          transformed[index] = value / Math.pow(height / 100, 2);
        } else if (measurement !== "height" && measurement !== "weight" && height !== undefined && value !== undefined) {
          transformed[index] = value / height;
        }
      }
    });
    return transformed;
  }

  function estimateBodyFat(artifact, measurements) {
    const n = Number(artifact.number_of_observations);
    const g = Number(artifact.g);
    const responseMean = Number(artifact.response_mean);
    const totalSumSquares = Number(artifact.response_centered_sum_squares);
    const shrinkage = g / (1 + g);
    const logModelPrior = Math.log(Number(artifact.class_prior_probability)) - Math.log(Number(artifact.models_per_class));
    const predictions = [];

    artifact.classes.forEach(function (modelClass) {
      const transformed = transformMeasurements(modelClass.name, measurements);
      const availableIndices = Object.keys(transformed).map(Number).sort(function (a, b) { return a - b; });
      const standardized = {};
      availableIndices.forEach(function (index) {
        standardized[index] = (transformed[index] - modelClass.predictor_means[index]) /
          modelClass.predictor_standard_deviations[index];
      });

      const subsetCount = Math.pow(2, availableIndices.length);
      for (let mask = 0; mask < subsetCount; mask += 1) {
        const included = availableIndices.filter(function (_, position) {
          return mask & (1 << position);
        });
        let adjustedSumSquares;
        let predictionMean;
        let predictionVariance;

        if (included.length === 0) {
          adjustedSumSquares = totalSumSquares;
          predictionMean = responseMean;
          const expectedResidualVariance = adjustedSumSquares / (n - 3);
          predictionVariance = expectedResidualVariance * (1 + 1 / n);
        } else {
          const xtx = included.map(function (row) {
            return included.map(function (column) {
              return modelClass.xtx[row][column];
            });
          });
          const xty = included.map(function (index) { return modelClass.xty[index]; });
          const betaHat = solveLinearSystem(xtx, xty);
          const regressionSumSquares = dot(xty, betaHat);
          adjustedSumSquares = totalSumSquares - shrinkage * regressionSumSquares;
          const expectedResidualVariance = adjustedSumSquares / (n - 3);
          const xNew = included.map(function (index) { return standardized[index]; });
          predictionMean = responseMean + dot(xNew, betaHat.map(function (value) { return shrinkage * value; }));
          const inverseTimesX = solveLinearSystem(xtx, xNew);
          const coefficientMeanVariance = shrinkage * expectedResidualVariance * dot(xNew, inverseTimesX);
          predictionVariance = expectedResidualVariance * (1 + 1 / n) + coefficientMeanVariance;
        }

        predictions.push({
          transformationClass: modelClass.name,
          predictors: included.map(function (index) { return modelClass.predictor_names[index]; }),
          logWeight: logModelPrior - 0.5 * included.length * Math.log(1 + g) -
            0.5 * (n - 1) * Math.log(adjustedSumSquares),
          mean: predictionMean,
          variance: predictionVariance
        });
      }
    });

    const maximumLogWeight = Math.max.apply(null, predictions.map(function (prediction) {
      return prediction.logWeight;
    }));
    const relativeWeights = predictions.map(function (prediction) {
      return Math.exp(prediction.logWeight - maximumLogWeight);
    });
    const totalWeight = relativeWeights.reduce(function (sum, weight) { return sum + weight; }, 0);
    const weights = relativeWeights.map(function (weight) { return weight / totalWeight; });
    const posteriorMean = predictions.reduce(function (sum, prediction, index) {
      return sum + weights[index] * prediction.mean;
    }, 0);
    const secondMoment = predictions.reduce(function (sum, prediction, index) {
      return sum + weights[index] * (prediction.variance + prediction.mean * prediction.mean);
    }, 0);
    const posteriorSd = Math.sqrt(Math.max(secondMoment - posteriorMean * posteriorMean, 0));
    const classWeights = { raw: 0, logged: 0, height_normalized: 0 };
    predictions.forEach(function (prediction, index) {
      classWeights[prediction.transformationClass] += weights[index];
    });

    const warnings = [];
    Object.keys(measurements).forEach(function (name) {
      const range = artifact.measurement_ranges_metric[name];
      if (measurements[name] < range.minimum || measurements[name] > range.maximum) {
        warnings.push(LABELS[name] + " is outside the cleaned SOCR training range.");
      }
    });
    if (Object.keys(measurements).length && measurements.height === undefined) {
      warnings.push("Without height, BMI and circumference-to-height models cannot use the other measurements.");
    }
    if (!Object.keys(measurements).length) {
      warnings.push("No measurements were supplied, so this is the intercept-only population prediction.");
    }

    return {
      mean: posteriorMean,
      sd: posteriorSd,
      lower95: posteriorMean - 1.96 * posteriorSd,
      upper95: posteriorMean + 1.96 * posteriorSd,
      compatibleModelCount: predictions.length,
      classWeights: classWeights,
      warnings: warnings
    };
  }

  function metricValue(name, value, units) {
    if (units === "metric") return value;
    return name === "weight" ? value * 0.45359237 : value * 2.54;
  }

  function observationSystem(jointArtifact, measurements) {
    const coordinateNames = jointArtifact.coordinate_names;
    const dimension = coordinateNames.length;
    const rows = [];
    const observed = [];
    const labels = [];
    const coordinateIndex = function (name) { return coordinateNames.indexOf(name); };
    const add = function (coefficients, value, label) {
      const row = Array(dimension).fill(0);
      Object.keys(coefficients).forEach(function (index) {
        row[Number(index)] = coefficients[index];
      });
      rows.push(row);
      observed.push(value);
      labels.push(label);
    };

    if (measurements.height !== undefined) {
      add({ [coordinateIndex("log_height_cm")]: 1 }, Math.log(measurements.height), LABELS.height);
    }
    if (measurements.weight !== undefined) {
      add({
        [coordinateIndex("log_height_cm")]: 2,
        [coordinateIndex("log_bmi")]: 1
      }, Math.log(measurements.weight) + Math.log(10000), LABELS.weight);
    }
    MEASUREMENT_KEYS.slice(2).forEach(function (name) {
      if (measurements[name] === undefined) return;
      add({
        [coordinateIndex("log_height_cm")]: 1,
        [coordinateIndex("log_" + name + "_to_height")]: 1
      }, Math.log(measurements[name]), LABELS[name]);
    });
    return { rows: rows, observed: observed, labels: labels };
  }

  function quadraticObservationCovariance(standardizedRows, correlation) {
    return standardizedRows.map(function (left) {
      return standardizedRows.map(function (right) {
        let value = 0;
        for (let row = 0; row < correlation.length; row += 1) {
          for (let column = 0; column < correlation.length; column += 1) {
            value += left[row] * correlation[row][column] * right[column];
          }
        }
        return value;
      });
    });
  }

  function conditionalDiagnostics(centered, covariance, labels) {
    return labels.map(function (label, index) {
      if (labels.length === 1) {
        const z = centered[0] / Math.sqrt(covariance[0][0]);
        return { label: label, z: z, absoluteZ: Math.abs(z) };
      }
      const others = labels.map(function (_, candidate) { return candidate; }).filter(function (candidate) {
        return candidate !== index;
      });
      const otherCovariance = others.map(function (row) {
        return others.map(function (column) { return covariance[row][column]; });
      });
      const covarianceWithOthers = others.map(function (other) { return covariance[index][other]; });
      const otherCentered = others.map(function (other) { return centered[other]; });
      const expectedOffset = dot(covarianceWithOthers, solveLinearSystem(otherCovariance, otherCentered));
      const conditionalVariance = covariance[index][index] - dot(
        covarianceWithOthers,
        solveLinearSystem(otherCovariance, covarianceWithOthers)
      );
      const z = (centered[index] - expectedOffset) / Math.sqrt(Math.max(conditionalVariance, 1e-15));
      return { label: label, z: z, absoluteZ: Math.abs(z) };
    }).sort(function (left, right) { return right.absoluteZ - left.absoluteZ; });
  }

  function measurementDistance(jointArtifact, measurements) {
    const system = observationSystem(jointArtifact, measurements);
    if (!system.rows.length) return null;

    const means = jointArtifact.coordinate_means;
    const standardDeviations = jointArtifact.coordinate_standard_deviations;
    const standardizedRows = system.rows.map(function (row) {
      return row.map(function (coefficient, index) {
        return coefficient * standardDeviations[index];
      });
    });
    const centered = system.observed.map(function (value, index) {
      return value - dot(system.rows[index], means);
    });
    const covariance = quadraticObservationCovariance(
      standardizedRows,
      jointArtifact.standardized_correlation_matrix
    );
    const squaredDistance = dot(centered, solveLinearSystem(covariance, centered));
    const cutoffSquared = MAHALANOBIS_SQUARED_CUTOFFS[system.rows.length];
    return {
      distance: Math.sqrt(Math.max(squaredDistance, 0)),
      squaredDistance: squaredDistance,
      dimensions: system.rows.length,
      cutoff: Math.sqrt(cutoffSquared),
      unlikely: squaredDistance >= cutoffSquared,
      diagnostics: conditionalDiagnostics(centered, covariance, system.labels)
    };
  }

  function formatPercent(value, digits) {
    return (100 * value).toFixed(digits) + "%";
  }

  function svgElement(tag, attributes) {
    const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attributes || {}).forEach(function (name) {
      element.setAttribute(name, attributes[name]);
    });
    return element;
  }

  function renderHistogram(svg, histogram, estimate) {
    const width = 760;
    const height = 340;
    const margin = { top: 34, right: 22, bottom: 48, left: 54 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    const xMin = 0;
    const xMax = 55;
    const yMax = Math.max.apply(null, histogram.counts) * 1.08;
    const clamp = function (value, minimum, maximum) {
      return Math.max(minimum, Math.min(maximum, value));
    };
    const x = function (value) {
      return margin.left + (clamp(value, xMin, xMax) - xMin) / (xMax - xMin) * plotWidth;
    };
    const y = function (value) {
      return margin.top + plotHeight - value / yMax * plotHeight;
    };

    svg.replaceChildren();
    svg.setAttribute("viewBox", "0 0 " + width + " " + height);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "NHANES body-fat histogram with the estimated mean at " +
      estimate.mean.toFixed(1) + " percent and a posterior predictive standard deviation of " +
      estimate.sd.toFixed(1) + " percentage points.");

    for (let tick = 0; tick <= 50; tick += 10) {
      const gridLine = svgElement("line", {
        x1: x(tick), y1: margin.top, x2: x(tick), y2: margin.top + plotHeight,
        class: "bf-chart-grid"
      });
      svg.appendChild(gridLine);
      const label = svgElement("text", {
        x: x(tick), y: height - 20, class: "bf-chart-tick", "text-anchor": "middle"
      });
      label.textContent = tick + "%";
      svg.appendChild(label);
    }

    histogram.counts.forEach(function (count, index) {
      const left = x(histogram.bin_edges[index]);
      const right = x(histogram.bin_edges[index + 1]);
      const top = y(count);
      svg.appendChild(svgElement("rect", {
        x: left + 1,
        y: top,
        width: Math.max(0, right - left - 2),
        height: margin.top + plotHeight - top,
        rx: 2,
        class: "bf-chart-bar"
      }));
    });

    const bandLeft = x(estimate.mean - estimate.sd);
    const bandRight = x(estimate.mean + estimate.sd);
    svg.appendChild(svgElement("rect", {
      x: bandLeft,
      y: margin.top,
      width: Math.max(2, bandRight - bandLeft),
      height: plotHeight,
      class: "bf-chart-band"
    }));
    [estimate.mean - estimate.sd, estimate.mean + estimate.sd].forEach(function (value) {
      svg.appendChild(svgElement("line", {
        x1: x(value), y1: margin.top, x2: x(value), y2: margin.top + plotHeight,
        class: "bf-chart-sd-line"
      }));
    });
    svg.appendChild(svgElement("line", {
      x1: x(estimate.mean), y1: margin.top - 6, x2: x(estimate.mean), y2: margin.top + plotHeight,
      class: "bf-chart-mean-line"
    }));
    const meanLabel = svgElement("text", {
      x: x(estimate.mean), y: 20, class: "bf-chart-mean-label", "text-anchor": "middle"
    });
    meanLabel.textContent = estimate.mean.toFixed(1) + "%";
    svg.appendChild(meanLabel);

    svg.appendChild(svgElement("line", {
      x1: margin.left, y1: margin.top + plotHeight, x2: margin.left + plotWidth, y2: margin.top + plotHeight,
      class: "bf-chart-axis"
    }));
    const axisLabel = svgElement("text", {
      x: margin.left + plotWidth / 2, y: height - 2, class: "bf-chart-axis-label", "text-anchor": "middle"
    });
    axisLabel.textContent = "DXA total-body fat percentage";
    svg.appendChild(axisLabel);
  }

  function initializeCalculator(root) {
    const form = root.querySelector("[data-role='calculator-form']");
    const submitButton = root.querySelector("[data-role='calculate']");
    const clearButton = root.querySelector("[data-role='clear']");
    const status = root.querySelector("[data-role='status']");
    const resultPanel = root.querySelector("[data-role='result']");
    const distanceWarning = root.querySelector("[data-role='distance-warning']");
    const fields = Array.from(root.querySelectorAll("[data-measurement]"));
    let artifact;
    let jointArtifact;
    let histogram;
    let units = "imperial";

    function setStatus(message, isError) {
      status.textContent = message;
      status.classList.toggle("is-error", Boolean(isError));
    }

    function updateUnitLabels() {
      fields.forEach(function (field) {
        const name = field.dataset.measurement;
        const suffix = field.closest(".bf-field").querySelector("[data-role='unit']");
        suffix.textContent = name === "weight" ? (units === "metric" ? "kg" : "lb") :
          (units === "metric" ? "cm" : "in");
        field.step = name === "weight" ? "0.1" : "0.01";
      });
    }

    function measurementsForDistance() {
      const measurements = {};
      fields.forEach(function (field) {
        const value = Number(field.value);
        if (!field.value.trim() || !Number.isFinite(value) || value <= 0) return;
        measurements[field.dataset.measurement] = metricValue(field.dataset.measurement, value, units);
      });
      return measurements;
    }

    function updateDistanceWarning() {
      if (!jointArtifact) return;
      const distance = measurementDistance(jointArtifact, measurementsForDistance());
      if (!distance || !distance.unlikely) {
        distanceWarning.hidden = true;
        return;
      }
      distanceWarning.hidden = false;
      const notable = distance.diagnostics.filter(function (diagnostic) {
        return diagnostic.absoluteZ >= 2;
      }).slice(0, 3);
      const highlighted = notable.length ? notable : distance.diagnostics.slice(0, 2);
      distanceWarning.replaceChildren();
      const lead = document.createElement("p");
      lead.textContent = "🤨 This combination is unusually unlikely. Are you sure you entered the information correctly?";
      distanceWarning.appendChild(lead);
      const caution = document.createElement("p");
      caution.textContent = "If these values are correct, treat the estimate cautiously: this combination is unlike those in the training data.";
      distanceWarning.appendChild(caution);
      const listLead = document.createElement("p");
      listLead.textContent = highlighted.length === 1 ?
        "The value that looks unusual is:" : "The values that look unusual are:";
      distanceWarning.appendChild(listLead);
      const list = document.createElement("ul");
      highlighted.forEach(function (diagnostic) {
        const item = document.createElement("li");
        item.textContent = diagnostic.label + " (" +
          (diagnostic.z < 0 ? "lower" : "higher") + " than expected)";
        list.appendChild(item);
      });
      distanceWarning.appendChild(list);
    }

    function readMeasurements() {
      const measurements = {};
      fields.forEach(function (field) {
        field.setCustomValidity("");
        if (!field.value.trim()) return;
        const value = Number(field.value);
        if (!Number.isFinite(value) || value <= 0) {
          field.setCustomValidity("Enter a positive number or leave this measurement blank.");
          return;
        }
        measurements[field.dataset.measurement] = metricValue(field.dataset.measurement, value, units);
      });
      if (!form.reportValidity()) return null;
      return measurements;
    }

    function renderResult(estimate) {
      root.querySelector("[data-role='mean']").textContent = estimate.mean.toFixed(1) + "%";
      root.querySelector("[data-role='sd']").textContent = estimate.sd.toFixed(1) + " points";
      root.querySelector("[data-role='interval']").textContent = estimate.lower95.toFixed(1) + "%–" + estimate.upper95.toFixed(1) + "%";
      root.querySelector("[data-role='model-count']").textContent = estimate.compatibleModelCount.toLocaleString() + " compatible models";
      root.querySelector("[data-role='class-weights']").textContent =
        "Height-normalized " + formatPercent(estimate.classWeights.height_normalized, 1) +
        " · logged " + formatPercent(estimate.classWeights.logged, 1) +
        " · raw " + formatPercent(estimate.classWeights.raw, 1);

      const warningBox = root.querySelector("[data-role='warnings']");
      const messages = estimate.warnings.filter(function (message) {
        return !message.startsWith("No measurements");
      });
      warningBox.replaceChildren();
      if (messages.length) {
        const title = document.createElement("strong");
        title.textContent = "A note about this estimate";
        warningBox.appendChild(title);
        const list = document.createElement("ul");
        messages.forEach(function (message) {
          const item = document.createElement("li");
          item.textContent = message;
          list.appendChild(item);
        });
        warningBox.appendChild(list);
        warningBox.hidden = false;
      } else {
        warningBox.hidden = true;
      }

      renderHistogram(root.querySelector("[data-role='histogram']"), histogram, estimate);
      resultPanel.hidden = false;
      setStatus(estimate.warnings.indexOf("No measurements were supplied, so this is the intercept-only population prediction.") >= 0 ?
        "No measurements entered; showing the model's population prediction." : "Estimate updated.", false);
    }

    root.querySelectorAll("input[name='bf-units']").forEach(function (radio) {
      radio.addEventListener("change", function () {
        const nextUnits = radio.value;
        if (nextUnits === units) return;
        fields.forEach(function (field) {
          if (!field.value) return;
          const value = Number(field.value);
          if (!Number.isFinite(value)) return;
          const isWeight = field.dataset.measurement === "weight";
          const converted = units === "metric" ?
            (isWeight ? value / 0.45359237 : value / 2.54) :
            (isWeight ? value * 0.45359237 : value * 2.54);
          field.value = converted.toFixed(isWeight ? 1 : 2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
        });
        units = nextUnits;
        updateUnitLabels();
        updateDistanceWarning();
      });
    });

    fields.forEach(function (field) {
      field.addEventListener("input", function () {
        field.setCustomValidity("");
        updateDistanceWarning();
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!artifact || !histogram) return;
      const measurements = readMeasurements();
      if (!measurements) return;
      submitButton.disabled = true;
      setStatus("Calculating across the compatible models…", false);
      global.setTimeout(function () {
        try {
          updateDistanceWarning();
          renderResult(estimateBodyFat(artifact, measurements));
        } catch (error) {
          setStatus("The estimate could not be calculated. " + error.message, true);
        } finally {
          submitButton.disabled = false;
        }
      }, 0);
    });

    clearButton.addEventListener("click", function () {
      form.reset();
      units = "imperial";
      fields.forEach(function (field) {
        field.value = "";
        field.setCustomValidity("");
      });
      distanceWarning.hidden = true;
      updateUnitLabels();
      resultPanel.hidden = true;
      setStatus("Enter any measurements you have; every field is optional.", false);
      fields[0].focus();
    });

    Promise.all([
      global.fetch(root.dataset.modelUrl).then(function (response) {
        if (!response.ok) throw new Error("The calculator model did not load.");
        return response.json();
      }),
      global.fetch(root.dataset.jointModelUrl).then(function (response) {
        if (!response.ok) throw new Error("The plausibility model did not load.");
        return response.json();
      }),
      global.fetch(root.dataset.histogramUrl).then(function (response) {
        if (!response.ok) throw new Error("The NHANES reference data did not load.");
        return response.json();
      })
    ]).then(function (loaded) {
      artifact = loaded[0];
      jointArtifact = loaded[1];
      histogram = loaded[2];
      if (artifact.format_version !== 1 || artifact.measurement_keys.join("|") !== MEASUREMENT_KEYS.join("|")) {
        throw new Error("The calculator model has an unsupported format.");
      }
      if (jointArtifact.format_version !== 1 || !Array.isArray(jointArtifact.coordinate_names)) {
        throw new Error("The plausibility model has an unsupported format.");
      }
      submitButton.disabled = false;
      updateUnitLabels();
      updateDistanceWarning();
      setStatus("Enter any measurements you have; every field is optional.", false);
    }).catch(function (error) {
      setStatus(error.message, true);
    });
  }

  const api = {
    estimateBodyFat: estimateBodyFat,
    measurementDistance: measurementDistance,
    solveLinearSystem: solveLinearSystem
  };
  global.BodyFatCalculator = api;
  if (typeof document !== "undefined") {
    document.querySelectorAll("[data-body-fat-calculator]").forEach(initializeCalculator);
  }
})(typeof window === "undefined" ? globalThis : window);
