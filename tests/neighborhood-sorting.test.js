"use strict";

/*
 * Regression checks for the model engine. These tests intentionally avoid the
 * browser UI and verify the behavioral rules that would be easiest to break in
 * a later refactor. Run with: node tests/neighborhood-sorting.test.js
 */

const assert = require("assert").strict;
const path = require("path");

require(path.join(__dirname, "..", "assets", "js", "neighborhood-sorting.js"));

const api = global.NeighborhoodSorting;
const Simulation = api.NeighborhoodSimulation;
const constants = api.constants;

function baseOptions(overrides) {
  return Object.assign({
    seed: "model-audit",
    correlation: 0.6,
    endogeneity: 0.7,
    homophily: 1.2,
    vacancyRate: 38.3,
    colorCount: 3,
    colorRatios: [1, 1, 1],
    maxRounds: 50,
    groupMeans: [
      { wealth: 0, status: 0 },
      { wealth: 0.5, status: -0.25 },
      { wealth: -0.5, status: 0.25 }
    ]
  }, overrides || {});
}

function arrayMean(values) {
  return values.reduce(function (sum, value) { return sum + value; }, 0) / values.length;
}

function assertValidOccupancy(simulation) {
  const occupied = Array.from(simulation.grid).filter(function (agentId) {
    return agentId !== -1;
  });

  assert.equal(occupied.length, simulation.agentCount);
  assert.equal(new Set(occupied).size, simulation.agentCount);
  assert.equal(
    Array.from(simulation.grid).filter(function (agentId) { return agentId === -1; }).length,
    simulation.vacancyCount
  );

  simulation.agents.forEach(function (agent, agentId) {
    assert.equal(simulation.grid[agent.cell], agentId);
  });
}

/* Initialization has the requested dimensions and is exactly reproducible. */
const first = new Simulation(baseOptions());
const second = new Simulation(baseOptions());
assert.equal(first.grid.length, 36 * 36);
assert.equal(first.agents.length, 800);
assert.equal(first.vacancyCount, 496);
assertValidOccupancy(first);
assert.deepEqual(Array.from(first.grid), Array.from(second.grid));
assert.deepEqual(first.agents, second.agents);
assert.deepEqual(Array.from(first.exogenousPrices), Array.from(second.exogenousPrices));
assert.equal(constants.tractSize, 3);
assert.equal(constants.tractCount, 144);

/* Equal allocation differs by at most one agent when 800 is not divisible. */
assert.deepEqual(Array.from(first.colorCounts), [267, 267, 266]);
assert.ok(first.neighborAttributeCorrelation("status") >= -1);
assert.ok(first.neighborAttributeCorrelation("status") <= 1);
assert.ok(first.neighborAttributeCorrelation("wealth") >= -1);
assert.ok(first.neighborAttributeCorrelation("wealth") <= 1);

/* Vacancy rate controls population size, and ratios control color allocation. */
const adjustablePopulation = new Simulation(baseOptions({
  vacancyRate: 50,
  colorRatios: [2, 1, 1]
}));
assert.equal(adjustablePopulation.agentCount, 648);
assert.equal(adjustablePopulation.vacancyCount, 648);
assert.deepEqual(Array.from(adjustablePopulation.colorCounts), [324, 162, 162]);
assertValidOccupancy(adjustablePopulation);

/*
 * Recalculate color isolation independently from exact cell-center positions.
 * Including b === a here verifies that self-distance is 0 (weight 1), rather
 * than a tract-centroid or average within-tract distance approximation.
 */
let exactIsolation = 0;
for (let focalId = 0; focalId < adjustablePopulation.agentCount; focalId += 1) {
  const focal = adjustablePopulation.agents[focalId];
  const focalRow = Math.floor(focal.cell / constants.gridSize);
  const focalColumn = focal.cell % constants.gridSize;
  let sameColorWeight = 0;
  let populationWeight = 0;

  for (let neighborId = 0; neighborId < adjustablePopulation.agentCount; neighborId += 1) {
    const neighbor = adjustablePopulation.agents[neighborId];
    const neighborRow = Math.floor(neighbor.cell / constants.gridSize);
    const neighborColumn = neighbor.cell % constants.gridSize;
    const directRowDistance = Math.abs(focalRow - neighborRow);
    const directColumnDistance = Math.abs(focalColumn - neighborColumn);
    const rowDistance = Math.min(directRowDistance, constants.gridSize - directRowDistance);
    const columnDistance = Math.min(
      directColumnDistance,
      constants.gridSize - directColumnDistance
    );
    const distance = Math.hypot(rowDistance, columnDistance) / constants.tractSize;
    const weight = Math.exp(-distance);

    populationWeight += weight;
    if (neighbor.color === focal.color) sameColorWeight += weight;
  }

  exactIsolation += sameColorWeight / populationWeight;
}
exactIsolation /= adjustablePopulation.agentCount;
assert.ok(
  Math.abs(adjustablePopulation.segregationHistory.color[0].isolation - exactIsolation) < 1e-7
);

/*
 * On a torus, diffusion conserves the mean price. This also catches accidental
 * in-place smoothing, an incorrect neighbor weight, and edge-cell omissions.
 */
assert.ok(
  Math.abs(arrayMean(Array.from(first.snapshot.rawPrice)) -
    arrayMean(Array.from(first.snapshot.price))) < 1e-12
);

/* All three segregation dimensions are recorded at initialization on [0, 1]. */
["color", "status", "wealth"].forEach(function (attribute) {
  const initial = first.segregationHistory[attribute][0];
  assert.equal(initial.round, 0);
  ["dissimilarity", "isolation", "delta"].forEach(function (index) {
    assert.ok(initial[index] >= 0 && initial[index] <= 1);
  });
});

/*
 * Every completed move must have been both affordable and a strict utility
 * improvement under the single frozen snapshot used for that round.
 */
const frozen = first.snapshot;
const originalCells = first.agents.map(function (agent) { return agent.cell; });
const result = first.step();
assert.ok(result.moves > 0);
assert.equal(first.segregationHistory.color.length, 2);
assert.equal(first.segregationHistory.status.length, 2);
assert.equal(first.segregationHistory.wealth.length, 2);
first.agents.forEach(function (agent, agentId) {
  if (agent.cell === originalCells[agentId]) return;

  const oldUtility = first.utility(agent, originalCells[agentId], frozen);
  const newUtility = first.utility(agent, agent.cell, frozen);
  assert.ok(newUtility > oldUtility + 1e-12);
  assert.ok(frozen.price[agent.cell] <= agent.wealth + 1e-12);
});
assertValidOccupancy(first);

/* Further asynchronous rounds must preserve the one-agent/one-cell invariant. */
for (let round = 0; round < 10 && first.finishedReason === null; round += 1) {
  first.step();
  assertValidOccupancy(first);
}

/*
 * With one color, q_ig and p_g are both 1 (or both use the neutral empty-cell
 * convention), so beta must have no effect. The two trajectories stay equal.
 */
const oneColorMeans = [{ wealth: 0, status: 0 }];
const noColorPreference = new Simulation(baseOptions({
  seed: "one-color",
  colorCount: 1,
  homophily: 0,
  groupMeans: oneColorMeans
}));
const strongColorPreference = new Simulation(baseOptions({
  seed: "one-color",
  colorCount: 1,
  homophily: 4,
  groupMeans: oneColorMeans
}));

assert.equal(noColorPreference.segregationHistory.color[0].dissimilarity, null);
assert.equal(noColorPreference.segregationHistory.color[0].isolation, null);
assert.equal(noColorPreference.segregationHistory.color[0].delta, null);

for (let round = 0; round < 8; round += 1) {
  const withoutColor = noColorPreference.step();
  const withColor = strongColorPreference.step();
  assert.equal(withoutColor.moves, withColor.moves);
  assert.deepEqual(Array.from(noColorPreference.grid), Array.from(strongColorPreference.grid));
  if (withoutColor.finishedReason !== null) break;
}

/* An agent with no occupied neighbors gets q_ig = p_g and therefore fit zero. */
const isolated = new Simulation(baseOptions({ colorCount: 2 }));
const focalAgent = isolated.agents[0];
isolated.grid.fill(-1);
isolated.grid[focalAgent.cell] = focalAgent.id;
const isolatedSnapshot = isolated.calculateSnapshot();
assert.equal(isolatedSnapshot.occupiedNeighborCount[focalAgent.cell], 0);
assert.equal(isolated.colorFit(focalAgent, focalAgent.cell, isolatedSnapshot), 0);

console.log("Neighborhood-sorting model checks passed.");
