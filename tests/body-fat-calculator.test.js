"use strict";

const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");

require(path.join(__dirname, "..", "assets", "js", "body-fat-calculator.js"));

const artifact = JSON.parse(fs.readFileSync(
  path.join(__dirname, "..", "assets", "jsons", "body_fat_model.json"),
  "utf8"
));
const jointArtifact = JSON.parse(fs.readFileSync(
  path.join(__dirname, "..", "assets", "jsons", "joint_body_composition_model.json"),
  "utf8"
));

const cases = [
  {
    measurements: {},
    mean: 19.561885245902,
    sd: 8.018599672659,
    models: 3
  },
  {
    measurements: {
      height: 178,
      weight: 80,
      abdomen_circumference: 92,
      wrist_circumference: 18.2
    },
    mean: 19.231630498031,
    sd: 4.226903327617,
    models: 48
  },
  {
    measurements: {
      height: 70 * 2.54,
      weight: 176 * 0.45359237,
      abdomen_circumference: 36.2 * 2.54,
      wrist_circumference: 7.2 * 2.54
    },
    mean: 19.086442593614,
    sd: 4.227260283451,
    models: 48
  },
  {
    measurements: {
      neck_circumference: 38,
      abdomen_circumference: 95
    },
    mean: 21.464698309248,
    sd: 4.488500406071,
    models: 9
  },
  {
    measurements: {
      height: 180,
      weight: 82,
      neck_circumference: 38,
      chest_circumference: 102,
      abdomen_circumference: 94,
      hip_circumference: 100,
      thigh_circumference: 60,
      knee_circumference: 39,
      ankle_circumference: 23,
      biceps_circumference: 33,
      forearm_circumference: 29,
      wrist_circumference: 18
    },
    mean: 20.630297935723,
    sd: 4.220692733739,
    models: 12288
  }
];

cases.forEach(function (testCase) {
  const result = global.BodyFatCalculator.estimateBodyFat(artifact, testCase.measurements);
  assert.ok(Math.abs(result.mean - testCase.mean) < 1e-10);
  assert.ok(Math.abs(result.sd - testCase.sd) < 1e-10);
  assert.equal(result.compatibleModelCount, testCase.models);
});

const coordinateMean = Object.fromEntries(jointArtifact.coordinate_names.map(function (name, index) {
  return [name, jointArtifact.coordinate_means[index]];
}));
const heightAtMean = Math.exp(coordinateMean.log_height_cm);
const atTrainingMean = {
  height: heightAtMean,
  weight: Math.exp(coordinateMean.log_bmi) * Math.pow(heightAtMean / 100, 2)
};
artifact.measurement_keys.slice(2).forEach(function (name) {
  atTrainingMean[name] = heightAtMean * Math.exp(coordinateMean["log_" + name + "_to_height"]);
});
const meanDistance = global.BodyFatCalculator.measurementDistance(jointArtifact, atTrainingMean);
assert.ok(meanDistance.distance < 1e-12);
assert.equal(meanDistance.unlikely, false);

const logHeightIndex = jointArtifact.coordinate_names.indexOf("log_height_cm");
const unlikelyHeight = global.BodyFatCalculator.measurementDistance(jointArtifact, {
  height: Math.exp(
    jointArtifact.coordinate_means[logHeightIndex] +
    3.1 * jointArtifact.coordinate_standard_deviations[logHeightIndex]
  )
});
assert.equal(unlikelyHeight.dimensions, 1);
assert.equal(unlikelyHeight.unlikely, true);
assert.equal(unlikelyHeight.diagnostics[0].label, "Height");
assert.ok(unlikelyHeight.diagnostics[0].z > 3);

console.log("Body-fat predictions and Mahalanobis warnings passed.");
