"use strict";

const STATES = 51;
let baseline;
let effects;

function selectedCount(rows, filter) {
  let total = 0;
  for (const [age, sex, race, education, nativity, count] of rows) {
    if (age < filter.ageMin || age > filter.ageMax) continue;
    if (filter.sex && sex !== filter.sex) continue;
    if (filter.race && race !== filter.race) continue;
    if (filter.education && education !== filter.education) continue;
    if (filter.nativity !== -1 && nativity !== filter.nativity) continue;
    total += count;
  }
  return total;
}

function ageEffect(group, minimum, maximum) {
  const rows = [];
  for (let age = minimum; age <= maximum; age++) {
    const effect = group.age[String(age)];
    if (effect) rows.push(effect);
  }
  const total = rows.reduce((sum, row) => sum + row.n, 0);
  const theta = new Float64Array(STATES);
  const log_affinity = new Float64Array(1275);
  const log_inout = new Float64Array(STATES);
  if (!total) return {theta, log_affinity, log_inout};
  for (const row of rows) {
    const weight = row.n / total;
    row.theta.forEach((value, index) => { theta[index] += weight * value; });
    row.log_affinity.forEach((value, index) => { log_affinity[index] += weight * value; });
    row.log_inout.forEach((value, index) => { log_inout[index] += weight * value; });
  }
  return {theta, log_affinity, log_inout};
}

function addEffect(target, source, sign = 1) {
  for (let k = 0; k < target.theta.length; k++) target.theta[k] += sign * source.theta[k];
  for (let k = 0; k < target.log_inout.length; k++) {
    target.log_inout[k] += sign * source.log_inout[k];
  }
  for (let k = 0; k < target.log_affinity.length; k++) {
    target.log_affinity[k] += sign * source.log_affinity[k];
  }
}

function compute(filter) {
  const base = baseline.results[filter.year];
  const year = effects.years[filter.year];
  const group = year.effects;
  const isAll = filter.ageMin === 1 && filter.ageMax === 99 &&
                filter.sex === 0 && filter.race === 0 &&
                filter.education === 0 && filter.nativity === -1;
  const isDefaultAge = filter.ageMin === 18 && filter.ageMax === 65 &&
                       filter.sex === 0 && filter.race === 0 &&
                       filter.education === 0 && filter.nativity === -1;
  if (isAll) return {theta: base.theta, affinity: base.affinity,
                     arrivals: base.arrivals, departures: base.departures,
                     inoutRatio: base.arrivals.map((value, index) => value / base.departures[index]),
                     sampledMovers: base.sample_movers, exactCount: true};
  const sampledMovers = isDefaultAge ? group.age_18_65["1"].n :
                        selectedCount(year.joint_counts, filter);
  if (sampledMovers < 300) return {insufficient: true, sampledMovers};

  const aggregate = {theta: new Float64Array(STATES),
                     log_affinity: new Float64Array(1275),
                     log_inout: new Float64Array(STATES)};
  if (filter.ageMin !== 1 || filter.ageMax !== 99) {
    addEffect(aggregate, filter.ageMin === 18 && filter.ageMax === 65 ?
      group.age_18_65["1"] : ageEffect(group, filter.ageMin, filter.ageMax));
  }
  for (const dimension of ["sex", "race", "nativity", "education"]) {
    const value = filter[dimension];
    if ((dimension === "nativity" && value === -1) ||
        (dimension !== "nativity" && value === 0)) continue;
    const effect = group[dimension][String(value)];
    if (!effect || effect.n < 300) return {insufficient: true, sampledMovers};
    addEffect(aggregate, effect);
  }
  // Education coefficients use the adult population as their reference.
  if (filter.education) addEffect(aggregate, group.adult["1"], -1);

  const mean = aggregate.theta.reduce((sum, value) => sum + value, 0) / STATES;
  const theta = base.theta.map((value, index) => value + aggregate.theta[index] - mean);
  const inoutRatio = base.arrivals.map((value, index) =>
    (value / base.departures[index]) * Math.exp(aggregate.log_inout[index]));
  const affinity = new Array(STATES).fill(null).map(() => new Array(STATES).fill(0));
  let pair = 0;
  for (let i = 0; i < STATES; i++) {
    for (let j = i + 1; j < STATES; j++) {
      const value = base.affinity[i][j] * Math.exp(aggregate.log_affinity[pair++]);
      affinity[i][j] = affinity[j][i] = value;
    }
  }
  return {theta, affinity, inoutRatio, sampledMovers, exactCount: isDefaultAge,
          lowSample: sampledMovers < 2000};
}

self.onmessage = async (event) => {
  const message = event.data;
  if (message.type === "init") {
    try {
      baseline = message.baseline;
      const response = await fetch(message.effectsUrl);
      if (!response.ok) {
        throw new Error("Could not load the compact subgroup model.");
      }
      effects = await response.json();
      self.postMessage({type: "ready"});
    } catch (error) {
      self.postMessage({type: "error", id: 0,
                        message: error instanceof Error ? error.message : String(error)});
    }
    return;
  }
  if (message.type !== "compute") return;
  try {
    self.postMessage({type: "result", id: message.id, ...compute(message.filters)});
  } catch (error) {
    self.postMessage({type: "error", id: message.id,
                      message: error instanceof Error ? error.message : String(error)});
  }
};
