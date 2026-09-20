(function (global) {
  "use strict";

  /*
   * Status, wealth, and neighborhood sorting
   * ----------------------------------------
   *
   * This file deliberately separates the model (NeighborhoodSimulation) from
   * the browser interface. The model has no DOM dependencies, which makes its
   * assumptions easier to audit and lets it be exercised from a test runner.
   * Rendering begins in the "Browser interface" section near the end.
   */

  const GRID_SIZE = 36;
  const CELL_COUNT = GRID_SIZE * GRID_SIZE;
  const DEFAULT_VACANCY_RATE = 38.3;
  const MAX_COLORS = 6;
  const TRACT_SIZE = 3;
  const TRACTS_PER_SIDE = GRID_SIZE / TRACT_SIZE;
  const TRACT_COUNT = TRACTS_PER_SIDE * TRACTS_PER_SIDE;
  const EPSILON = 1e-12;

  const GROUP_NAMES = ["Blue", "Vermilion", "Green", "Purple", "Orange", "Sky"];
  const GROUP_COLORS = ["#0072b2", "#d55e00", "#009e73", "#9b51a0", "#e69f00", "#56b4e9"];

  /*
   * Return the eight Moore neighbors of every cell. Modulo arithmetic wraps
   * rows and columns, so the rectangular display represents a torus: its top
   * touches its bottom and its left edge touches its right edge.
   *
   * A 36-wide grid is large enough that all eight wrapped neighbors are
   * distinct. We precompute them once because every price and desirability
   * calculation traverses this same topology.
   */
  function buildMooreNeighborhoods(size) {
    const neighborhoods = new Array(size * size);

    for (let row = 0; row < size; row += 1) {
      for (let column = 0; column < size; column += 1) {
        const neighbors = new Int16Array(8);
        let position = 0;

        for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
          for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
            if (rowOffset === 0 && columnOffset === 0) continue;

            const neighborRow = (row + rowOffset + size) % size;
            const neighborColumn = (column + columnOffset + size) % size;
            neighbors[position] = (neighborRow * size) + neighborColumn;
            position += 1;
          }
        }

        neighborhoods[(row * size) + column] = neighbors;
      }
    }

    return neighborhoods;
  }

  const MOORE_NEIGHBORS = buildMooreNeighborhoods(GRID_SIZE);

  /*
   * Assign every cell to one of the 12 x 12 non-overlapping tracts. Each tract
   * contains exactly 3 x 3 cells. Starting in the upper-left is arbitrary, but
   * keeping the partition fixed makes the time series directly comparable.
   */
  function buildCellTracts() {
    const cellTracts = new Int16Array(CELL_COUNT);
    for (let cell = 0; cell < CELL_COUNT; cell += 1) {
      const row = Math.floor(cell / GRID_SIZE);
      const column = cell % GRID_SIZE;
      const tractRow = Math.floor(row / TRACT_SIZE);
      const tractColumn = Math.floor(column / TRACT_SIZE);
      cellTracts[cell] = (tractRow * TRACTS_PER_SIDE) + tractColumn;
    }
    return cellTracts;
  }

  /*
   * Distance-decay isolation can use exact positions because this model knows
   * the cell occupied by every agent. For every cell pair, precompute
   * z_ab = exp(-d_ab), where d_ab is wrapped Euclidean cell-center distance.
   * Dividing by three keeps one 3 x 3 tract width equal to one distance unit.
   * A cell's distance to itself is exactly zero, so its weight is exactly one.
   */
  function buildCellDistanceWeights() {
    const weights = new Array(CELL_COUNT);

    for (let first = 0; first < CELL_COUNT; first += 1) {
      const firstRow = Math.floor(first / GRID_SIZE);
      const firstColumn = first % GRID_SIZE;
      weights[first] = new Float32Array(CELL_COUNT);

      for (let second = 0; second < CELL_COUNT; second += 1) {
        const secondRow = Math.floor(second / GRID_SIZE);
        const secondColumn = second % GRID_SIZE;
        const directRowDistance = Math.abs(firstRow - secondRow);
        const directColumnDistance = Math.abs(firstColumn - secondColumn);
        const rowDistance = Math.min(directRowDistance, GRID_SIZE - directRowDistance);
        const columnDistance = Math.min(directColumnDistance, GRID_SIZE - directColumnDistance);
        const distance = Math.hypot(rowDistance, columnDistance) / TRACT_SIZE;
        weights[first][second] = Math.exp(-distance);
      }
    }

    return weights;
  }

  const CELL_TRACTS = buildCellTracts();
  const CELL_DISTANCE_WEIGHTS = buildCellDistanceWeights();

  /* Convert an arbitrary string into four repeatable 32-bit seed values. */
  function hashSeed(seedText) {
    let hash = 1779033703 ^ seedText.length;

    for (let index = 0; index < seedText.length; index += 1) {
      hash = Math.imul(hash ^ seedText.charCodeAt(index), 3432918353);
      hash = (hash << 13) | (hash >>> 19);
    }

    return function nextHash() {
      hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
      hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
      return (hash ^= hash >>> 16) >>> 0;
    };
  }

  /*
   * A small seeded pseudo-random generator. The seed controls initialization,
   * the randomized order in each round, and random tie-breaking. Consequently,
   * resetting with unchanged inputs reproduces the entire run, not merely the
   * initial board.
   */
  class SeededRandom {
    constructor(seed) {
      const makeSeed = hashSeed(String(seed));
      this.a = makeSeed();
      this.b = makeSeed();
      this.c = makeSeed();
      this.d = makeSeed();
      this.spareNormal = null;
    }

    uniform() {
      this.a >>>= 0;
      this.b >>>= 0;
      this.c >>>= 0;
      this.d >>>= 0;

      const result = (this.a + this.b + this.d) >>> 0;
      this.d = (this.d + 1) >>> 0;
      this.a = this.b ^ (this.b >>> 9);
      this.b = (this.c + (this.c << 3)) >>> 0;
      this.c = ((this.c << 21) | (this.c >>> 11)) >>> 0;
      this.c = (this.c + result) >>> 0;
      return result / 4294967296;
    }

    /* Box–Muller produces independent standard-normal draws from uniforms. */
    normal() {
      if (this.spareNormal !== null) {
        const spare = this.spareNormal;
        this.spareNormal = null;
        return spare;
      }

      // uniform() can theoretically return zero, which is invalid inside log.
      let first = this.uniform();
      while (first === 0) first = this.uniform();
      const second = this.uniform();
      const radius = Math.sqrt(-2 * Math.log(first));
      const angle = 2 * Math.PI * second;

      this.spareNormal = radius * Math.sin(angle);
      return radius * Math.cos(angle);
    }

    /* In-place Fisher–Yates shuffle; typed arrays and normal arrays both work. */
    shuffle(values) {
      for (let index = values.length - 1; index > 0; index -= 1) {
        const other = Math.floor(this.uniform() * (index + 1));
        const temporary = values[index];
        values[index] = values[other];
        values[other] = temporary;
      }
      return values;
    }
  }

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function finiteNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function correlation(first, second) {
    const count = first.length;
    let firstMean = 0;
    let secondMean = 0;

    for (let index = 0; index < count; index += 1) {
      firstMean += first[index];
      secondMean += second[index];
    }
    firstMean /= count;
    secondMean /= count;

    let covariance = 0;
    let firstVariance = 0;
    let secondVariance = 0;
    for (let index = 0; index < count; index += 1) {
      const firstDifference = first[index] - firstMean;
      const secondDifference = second[index] - secondMean;
      covariance += firstDifference * secondDifference;
      firstVariance += firstDifference * firstDifference;
      secondVariance += secondDifference * secondDifference;
    }

    const denominator = Math.sqrt(firstVariance * secondVariance);
    return denominator > 0 ? covariance / denominator : 0;
  }

  /*
   * Dissimilarity, isolation, and delta are group-composition indices. To use
   * them with continuous status and wealth, keep a fixed median split: the
   * lower-ranked agents are group 0 and the upper-ranked agents are group 1.
   * (For an odd population, the upper half contains the extra agent.) Assigning
   * ranks once, rather than recomputing by location, keeps membership constant.
   */
  function splitAgentsIntoHalves(agents, attribute) {
    const orderedIds = agents.map(function (agent) { return agent.id; });
    orderedIds.sort(function (firstId, secondId) {
      const difference = agents[firstId][attribute] - agents[secondId][attribute];
      return difference === 0 ? firstId - secondId : difference;
    });

    const labels = new Int8Array(agents.length);
    for (let rank = Math.floor(agents.length / 2); rank < orderedIds.length; rank += 1) {
      labels[orderedIds[rank]] = 1;
    }
    return labels;
  }

  class NeighborhoodSimulation {
    constructor(options) {
      this.options = this.validateOptions(options || {});
      this.agentCount = clamp(
        Math.round(CELL_COUNT * (1 - (this.options.vacancyRate / 100))),
        this.options.colorCount,
        CELL_COUNT - 1
      );
      this.vacancyCount = CELL_COUNT - this.agentCount;
      this.actualVacancyRate = (this.vacancyCount / CELL_COUNT) * 100;
      this.random = new SeededRandom(this.options.seed);
      this.round = 0;
      this.finishedReason = null;
      this.lastResult = null;
      this.moveHistory = [];

      this.initializePopulation();
      this.snapshot = this.calculateSnapshot();
      this.observedCorrelation = correlation(
        this.agents.map(function (agent) { return agent.wealth; }),
        this.agents.map(function (agent) { return agent.status; })
      );

      /* These group labels never change because agents' attributes are fixed. */
      this.colorGroupLabels = new Int8Array(this.agentCount);
      for (let agentId = 0; agentId < this.agentCount; agentId += 1) {
        this.colorGroupLabels[agentId] = this.agents[agentId].color;
      }
      this.statusGroupLabels = splitAgentsIntoHalves(this.agents, "status");
      this.wealthGroupLabels = splitAgentsIntoHalves(this.agents, "wealth");

      this.segregationHistory = { color: [], status: [], wealth: [] };
      this.recordSegregationIndices();
    }

    validateOptions(options) {
      const colorCount = clamp(Math.round(finiteNumber(options.colorCount, 2)), 1, MAX_COLORS);
      const suppliedMeans = Array.isArray(options.groupMeans) ? options.groupMeans : [];
      const suppliedRatios = Array.isArray(options.colorRatios) ? options.colorRatios : [];
      const groupMeans = new Array(colorCount);
      const colorRatios = new Float64Array(colorCount);

      for (let color = 0; color < colorCount; color += 1) {
        const supplied = suppliedMeans[color] || {};
        groupMeans[color] = {
          wealth: clamp(finiteNumber(supplied.wealth, 0), -4, 4),
          status: clamp(finiteNumber(supplied.status, 0), -4, 4)
        };
        colorRatios[color] = clamp(finiteNumber(suppliedRatios[color], 1), 0.01, 1000);
      }

      return {
        seed: String(options.seed || "neighborhoods"),
        correlation: clamp(finiteNumber(options.correlation, 0.5), 0, 1),
        endogeneity: clamp(finiteNumber(options.endogeneity, 0.5), 0, 1),
        homophily: clamp(finiteNumber(options.homophily, 0), 0, 20),
        vacancyRate: clamp(finiteNumber(options.vacancyRate, DEFAULT_VACANCY_RATE), 5, 70),
        colorCount: colorCount,
        maxRounds: clamp(Math.round(finiteNumber(options.maxRounds, 2000)), 1, 10000),
        groupMeans: groupMeans,
        colorRatios: colorRatios
      };
    }

    initializePopulation() {
      const options = this.options;

      /* -1 is the vacancy sentinel; nonnegative entries are agent IDs. */
      this.grid = new Int16Array(CELL_COUNT);
      this.grid.fill(-1);
      this.exogenousPrices = new Float64Array(CELL_COUNT);
      this.agents = new Array(this.agentCount);
      this.colorCounts = new Int16Array(options.colorCount);
      this.colorShares = new Float64Array(options.colorCount);

      /* Every physical cell receives a fixed exogenous price R_i ~ N(0, 1). */
      for (let cell = 0; cell < CELL_COUNT; cell += 1) {
        this.exogenousPrices[cell] = this.random.normal();
      }

      /*
       * Convert the user-entered color ratios into integer group counts. Every
       * selected color receives one agent first. The remaining agents are
       * apportioned by the largest-remainder method, which follows the desired
       * ratios as closely as integer counts allow and preserves the total.
       */
      const colors = new Int8Array(this.agentCount);
      const ratioTotal = options.colorRatios.reduce(function (sum, ratio) {
        return sum + ratio;
      }, 0);
      const remainingAfterMinimum = this.agentCount - options.colorCount;
      const fractionalRemainders = new Array(options.colorCount);
      let allocated = options.colorCount;

      for (let color = 0; color < options.colorCount; color += 1) {
        const exactAdditional = remainingAfterMinimum * options.colorRatios[color] / ratioTotal;
        const additional = Math.floor(exactAdditional);
        this.colorCounts[color] = 1 + additional;
        allocated += additional;
        fractionalRemainders[color] = {
          color: color,
          fraction: exactAdditional - additional
        };
      }

      fractionalRemainders.sort(function (first, second) {
        return second.fraction - first.fraction || first.color - second.color;
      });
      for (let remainder = 0; remainder < this.agentCount - allocated; remainder += 1) {
        this.colorCounts[fractionalRemainders[remainder].color] += 1;
      }

      let agentPosition = 0;
      for (let color = 0; color < options.colorCount; color += 1) {
        const count = this.colorCounts[color];
        this.colorShares[color] = count / this.agentCount;

        for (let withinColor = 0; withinColor < count; withinColor += 1) {
          colors[agentPosition] = color;
          agentPosition += 1;
        }
      }
      this.random.shuffle(colors);

      /* Randomly select the requested number of cells without replacement. */
      const cells = new Int16Array(CELL_COUNT);
      for (let cell = 0; cell < CELL_COUNT; cell += 1) cells[cell] = cell;
      this.random.shuffle(cells);

      const residualStatusScale = Math.sqrt(1 - (options.correlation * options.correlation));

      for (let agentId = 0; agentId < this.agentCount; agentId += 1) {
        const color = colors[agentId];
        const means = options.groupMeans[color];
        const wealthDeviation = this.random.normal();
        const independentStatusDeviation = this.random.normal();

        /*
         * Wealth and status each have within-color SD 1. Centering wealth before
         * it enters the status equation allows users to set the two group means
         * independently. C is therefore a within-color correlation; differences
         * between group means can make the population-wide correlation differ.
         */
        const wealth = means.wealth + wealthDeviation;
        const status = means.status +
          (options.correlation * wealthDeviation) +
          (residualStatusScale * independentStatusDeviation);
        const cell = cells[agentId];

        this.agents[agentId] = {
          id: agentId,
          color: color,
          wealth: wealth,
          status: status,
          cell: cell
        };
        this.grid[cell] = agentId;
      }
    }

    /*
     * Calculate all neighborhood-dependent values from one occupancy state.
     * This snapshot is immutable for the duration of a round. Moves change the
     * vacancy list immediately, but neither prices nor desirability values.
     */
    calculateSnapshot() {
      const occupiedNeighborCount = new Uint8Array(CELL_COUNT);
      const neighborStatus = new Float64Array(CELL_COUNT);
      const neighborWealth = new Float64Array(CELL_COUNT);
      const neighborColorCounts = new Array(this.options.colorCount);

      for (let color = 0; color < this.options.colorCount; color += 1) {
        neighborColorCounts[color] = new Uint8Array(CELL_COUNT);
      }

      for (let cell = 0; cell < CELL_COUNT; cell += 1) {
        const neighbors = MOORE_NEIGHBORS[cell];
        let statusSum = 0;
        let wealthSum = 0;
        let count = 0;

        for (let position = 0; position < neighbors.length; position += 1) {
          const neighborAgentId = this.grid[neighbors[position]];
          if (neighborAgentId === -1) continue;

          const neighborAgent = this.agents[neighborAgentId];
          statusSum += neighborAgent.status;
          wealthSum += neighborAgent.wealth;
          neighborColorCounts[neighborAgent.color][cell] += 1;
          count += 1;
        }

        occupiedNeighborCount[cell] = count;

        // The agreed convention for a cell with no agents nearby is a mean of 0.
        neighborStatus[cell] = count === 0 ? 0 : statusSum / count;
        neighborWealth[cell] = count === 0 ? 0 : wealthSum / count;
      }

      /* Equation 2: mix endogenous neighbor wealth with the fixed cell price. */
      const rawPrice = new Float64Array(CELL_COUNT);
      const endogeneity = this.options.endogeneity;
      for (let cell = 0; cell < CELL_COUNT; cell += 1) {
        rawPrice[cell] =
          (endogeneity * neighborWealth[cell]) +
          ((1 - endogeneity) * this.exogenousPrices[cell]);
      }

      /*
       * Perform exactly one simultaneous diffusion pass. Reading exclusively
       * from rawPrice is important: an in-place update would make later cells
       * depend on earlier iteration order. Each cell retains 3/4 of its value
       * and receives 1/32 from each of its eight neighbors (8/32 = 1/4).
       */
      const price = new Float64Array(CELL_COUNT);
      for (let cell = 0; cell < CELL_COUNT; cell += 1) {
        const neighbors = MOORE_NEIGHBORS[cell];
        let neighboringPriceSum = 0;
        for (let position = 0; position < neighbors.length; position += 1) {
          neighboringPriceSum += rawPrice[neighbors[position]];
        }
        price[cell] = (0.75 * rawPrice[cell]) + (neighboringPriceSum / 32);
      }

      return {
        occupiedNeighborCount: occupiedNeighborCount,
        neighborStatus: neighborStatus,
        neighborWealth: neighborWealth,
        neighborColorCounts: neighborColorCounts,
        rawPrice: rawPrice,
        price: price
      };
    }

    /*
     * Color fit is q_ig - p_g. With no occupied neighbors, q_ig is defined to
     * equal p_g, making an empty neighborhood neutral (fit = 0). Subtracting
     * the population share also makes one-color runs reproduce the base model.
     */
    colorFit(agent, cell, snapshot) {
      const neighborCount = snapshot.occupiedNeighborCount[cell];
      if (neighborCount === 0) return 0;

      const sameColorCount = snapshot.neighborColorCounts[agent.color][cell];
      return (sameColorCount / neighborCount) - this.colorShares[agent.color];
    }

    utility(agent, cell, snapshot) {
      return snapshot.neighborStatus[cell] +
        (this.options.homophily * this.colorFit(agent, cell, snapshot));
    }

    /*
     * Calculate the three indices from the source post for one grouping of the
     * population. For more than two colors, each color is treated as the focal
     * group against all other colors; results are averaged using each color's
     * population share. The same procedure averages the two halves for status
     * and wealth. This produces one interpretable time series per attribute.
     */
    segregationForGroups(labels, groupCount) {
      /* With only one color there is no between-color segregation to measure. */
      if (groupCount < 2) {
        return { dissimilarity: null, isolation: null, delta: null };
      }

      const tractPopulation = new Int16Array(TRACT_COUNT);
      const groupTractPopulation = new Array(groupCount);
      const groupTotals = new Int16Array(groupCount);
      for (let group = 0; group < groupCount; group += 1) {
        groupTractPopulation[group] = new Int16Array(TRACT_COUNT);
      }

      for (let agentId = 0; agentId < this.agents.length; agentId += 1) {
        const tract = CELL_TRACTS[this.agents[agentId].cell];
        const group = labels[agentId];
        tractPopulation[tract] += 1;
        groupTractPopulation[group][tract] += 1;
        groupTotals[group] += 1;
      }

      let weightedDissimilarity = 0;
      let weightedDelta = 0;

      for (let group = 0; group < groupCount; group += 1) {
        const focalByTract = groupTractPopulation[group];
        const focalTotal = groupTotals[group];
        const otherTotal = this.agentCount - focalTotal;
        const populationWeight = focalTotal / this.agentCount;
        let dissimilarity = 0;
        let delta = 0;

        for (let tract = 0; tract < TRACT_COUNT; tract += 1) {
          const focal = focalByTract[tract];
          const other = tractPopulation[tract] - focal;

          /* D = 1/2 sum_i |x_i/X - y_i/Y|. */
          dissimilarity += Math.abs((focal / focalTotal) - (other / otherTotal));

          /* All 144 tracts have equal area, so a_i/A = 1/144 in delta. */
          delta += Math.abs((focal / focalTotal) - (1 / TRACT_COUNT));

        }

        weightedDissimilarity += populationWeight * (0.5 * dissimilarity);
        weightedDelta += populationWeight * (0.5 * delta);
      }

      /*
       * Calculate distance-decay isolation from exact agent locations instead
       * of tract centroids. For each focal agent a, measure the distance-weighted
       * share of all agents b who have a's group label. Averaging these shares
       * over agents is algebraically the population-weighted average of each
       * group's DP_xx. The focal agent is included at exact distance zero.
       */
      let weightedIsolation = 0;
      for (let focalId = 0; focalId < this.agentCount; focalId += 1) {
        const focalAgent = this.agents[focalId];
        const focalGroup = labels[focalId];
        const cellWeights = CELL_DISTANCE_WEIGHTS[focalAgent.cell];
        let localFocalWeight = 0;
        let localPopulationWeight = 0;

        for (let neighborId = 0; neighborId < this.agentCount; neighborId += 1) {
          const distanceWeight = cellWeights[this.agents[neighborId].cell];
          localPopulationWeight += distanceWeight;
          if (labels[neighborId] === focalGroup) localFocalWeight += distanceWeight;
        }

        weightedIsolation += localFocalWeight / localPopulationWeight;
      }
      weightedIsolation /= this.agentCount;

      return {
        dissimilarity: weightedDissimilarity,
        isolation: weightedIsolation,
        delta: weightedDelta
      };
    }

    calculateSegregationIndices() {
      return {
        color: this.segregationForGroups(this.colorGroupLabels, this.options.colorCount),
        status: this.segregationForGroups(this.statusGroupLabels, 2),
        wealth: this.segregationForGroups(this.wealthGroupLabels, 2)
      };
    }

    recordSegregationIndices() {
      const values = this.calculateSegregationIndices();
      ["color", "status", "wealth"].forEach((attribute) => {
        this.segregationHistory[attribute].push({
          round: this.round,
          dissimilarity: values[attribute].dissimilarity,
          isolation: values[attribute].isolation,
          delta: values[attribute].delta
        });
      });
    }

    /* Return the current vacancy list. During a round, a move swaps one entry. */
    collectVacancies() {
      const vacancies = new Int16Array(this.vacancyCount);
      let vacancyPosition = 0;
      for (let cell = 0; cell < CELL_COUNT; cell += 1) {
        if (this.grid[cell] === -1) {
          vacancies[vacancyPosition] = cell;
          vacancyPosition += 1;
        }
      }
      return vacancies;
    }

    /*
     * Advance one full asynchronous-movement round using frozen neighborhood
     * values. Each agent acts exactly once in a freshly shuffled order.
     */
    step() {
      if (this.finishedReason !== null) return this.lastResult;

      const frozen = this.snapshot;
      const vacancies = this.collectVacancies();
      const order = new Int16Array(this.agentCount);
      for (let agentId = 0; agentId < this.agentCount; agentId += 1) order[agentId] = agentId;
      this.random.shuffle(order);

      let moves = 0;
      let noAffordableVacancy = 0;

      for (let orderPosition = 0; orderPosition < order.length; orderPosition += 1) {
        const agent = this.agents[order[orderPosition]];
        const currentCell = agent.cell;
        const currentUtility = this.utility(agent, currentCell, frozen);
        let bestUtility = currentUtility;
        let bestVacancyPosition = -1;
        let equalBestCount = 0;
        let foundAffordable = false;

        for (let vacancyPosition = 0; vacancyPosition < vacancies.length; vacancyPosition += 1) {
          const candidateCell = vacancies[vacancyPosition];

          // Current owners may stay in unaffordable homes, but buyers cannot enter one.
          if (frozen.price[candidateCell] > agent.wealth + EPSILON) continue;
          foundAffordable = true;

          const candidateUtility = this.utility(agent, candidateCell, frozen);
          if (candidateUtility > bestUtility + EPSILON) {
            bestUtility = candidateUtility;
            bestVacancyPosition = vacancyPosition;
            equalBestCount = 1;
          } else if (
            bestVacancyPosition !== -1 &&
            Math.abs(candidateUtility - bestUtility) <= EPSILON
          ) {
            /*
             * Reservoir sampling selects uniformly among tied best cells without
             * constructing a temporary array. A tie with the current residence
             * never enters this branch, because moving requires strict improvement.
             */
            equalBestCount += 1;
            if (this.random.uniform() < (1 / equalBestCount)) {
              bestVacancyPosition = vacancyPosition;
            }
          }
        }

        if (!foundAffordable) noAffordableVacancy += 1;

        if (bestVacancyPosition !== -1) {
          const destination = vacancies[bestVacancyPosition];
          this.grid[currentCell] = -1;
          this.grid[destination] = agent.id;
          agent.cell = destination;

          /*
           * The destination is no longer open; the agent's former cell is now
           * available to agents later in this round. Its frozen values remain
           * those calculated at the start of the round, as specified.
           */
          vacancies[bestVacancyPosition] = currentCell;
          moves += 1;
        }
      }

      this.round += 1;
      this.moveHistory.push(moves);

      // The completed arrangement becomes the frozen snapshot for the next round.
      this.snapshot = this.calculateSnapshot();
      this.recordSegregationIndices();

      if (moves === 0) {
        this.finishedReason = "converged";
      } else if (this.round >= this.options.maxRounds) {
        this.finishedReason = "limit";
      }

      this.lastResult = {
        round: this.round,
        moves: moves,
        noAffordableVacancy: noAffordableVacancy,
        finishedReason: this.finishedReason
      };
      return this.lastResult;
    }

    /*
     * Mean q_ig - p_g across agents. Multiplying by 100 presents the result as
     * percentage points of same-color exposure above random-mixing prevalence.
     */
    excessSameColorExposure() {
      let total = 0;

      for (let agentId = 0; agentId < this.agents.length; agentId += 1) {
        const agent = this.agents[agentId];
        total += this.colorFit(agent, agent.cell, this.snapshot);
      }

      return total / this.agents.length;
    }

    /*
     * Measure local sorting directly on the Moore-neighbor network. Each
     * occupied adjacency contributes an ordered pair (focal value, neighbor
     * value); the reverse direction is also included. Counting both directions
     * gives every agent-neighbor exposure equal weight and does not change the
     * Pearson correlation. Agents with no occupied neighbors contribute no
     * pair, because there is no observed neighbor attribute to correlate.
     */
    neighborAttributeCorrelation(attribute) {
      const focalValues = [];
      const neighborValues = [];

      for (let agentId = 0; agentId < this.agents.length; agentId += 1) {
        const agent = this.agents[agentId];
        const neighbors = MOORE_NEIGHBORS[agent.cell];

        for (let position = 0; position < neighbors.length; position += 1) {
          const neighborId = this.grid[neighbors[position]];
          if (neighborId === -1) continue;

          focalValues.push(agent[attribute]);
          neighborValues.push(this.agents[neighborId][attribute]);
        }
      }

      return focalValues.length > 1 ? correlation(focalValues, neighborValues) : 0;
    }
  }

  /* Export the engine and constants so automated checks can use them directly. */
  global.NeighborhoodSorting = {
    NeighborhoodSimulation: NeighborhoodSimulation,
    SeededRandom: SeededRandom,
    constants: {
      gridSize: GRID_SIZE,
      cellCount: CELL_COUNT,
      defaultVacancyRate: DEFAULT_VACANCY_RATE,
      maxColors: MAX_COLORS,
      tractSize: TRACT_SIZE,
      tractCount: TRACT_COUNT
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Browser interface                                                      */
  /* ---------------------------------------------------------------------- */

  if (typeof document === "undefined") return;

  const root = document.querySelector("[data-neighborhood-sorting]");
  if (!root) return;

  function role(name) {
    return root.querySelector('[data-role="' + name + '"]');
  }

  const elements = {
    board: role("board"),
    tooltip: role("tooltip"),
    indexCharts: Array.from(root.querySelectorAll("[data-index-chart]")),
    indexValues: Array.from(root.querySelectorAll("[data-index-value]")),
    indexChanges: Array.from(root.querySelectorAll("[data-index-change]")),
    run: role("run"),
    step: role("step"),
    reset: role("reset"),
    speed: role("speed"),
    runStatus: role("run-status"),
    round: role("round"),
    roundLimit: role("round-limit"),
    correlation: role("correlation"),
    correlationOutput: role("correlation-output"),
    endogeneity: role("endogeneity"),
    endogeneityOutput: role("endogeneity-output"),
    homophily: role("homophily"),
    homophilyOutput: role("homophily-output"),
    vacancyRate: role("vacancy-rate"),
    vacancyRateOutput: role("vacancy-rate-output"),
    colorCount: role("color-count"),
    maxRounds: role("max-rounds"),
    seed: role("seed"),
    randomizeSeed: role("randomize-seed"),
    groupMeans: role("group-means"),
    mapLegend: role("map-legend"),
    neighborStatusCorrelation: role("neighbor-status-correlation"),
    neighborWealthCorrelation: role("neighbor-wealth-correlation"),
    neighborStatusChange: role("neighbor-status-change"),
    neighborWealthChange: role("neighbor-wealth-change"),
    segregation: role("segregation"),
    segregationChange: role("segregation-change"),
    observedCorrelation: role("observed-correlation")
  };

  const groupMeans = Array.from({ length: MAX_COLORS }, function () {
    return { wealth: 0, status: 0 };
  });
  const groupRatios = Array.from({ length: MAX_COLORS }, function () { return 1; });

  let simulation = null;
  let running = false;
  let animationFrame = null;
  let selectedCell = null;
  let currentView = "color";
  let currentSegregationView = "color";
  let initialStatistics = null;

  const SEGREGATION_SERIES = [
    { key: "dissimilarity", label: "Dissimilarity", color: "#1769aa" },
    { key: "isolation", label: "Distance-decay isolation", color: "#d97706" },
    { key: "delta", label: "Delta", color: "#7c3aed" }
  ];

  function readOptions() {
    const maxRounds = clamp(Math.round(finiteNumber(elements.maxRounds.value, 2000)), 1, 10000);
    elements.maxRounds.value = String(maxRounds);

    return {
      seed: elements.seed.value.trim() || "neighborhoods",
      correlation: Number(elements.correlation.value),
      endogeneity: Number(elements.endogeneity.value),
      homophily: Number(elements.homophily.value),
      vacancyRate: Number(elements.vacancyRate.value),
      colorCount: Number(elements.colorCount.value),
      maxRounds: maxRounds,
      groupMeans: groupMeans,
      colorRatios: groupRatios
    };
  }

  function buildGroupMeanControls() {
    const count = Number(elements.colorCount.value);
    elements.groupMeans.textContent = "";

    const header = document.createElement("div");
    header.className = "ns-group-header";
    header.innerHTML = "<span>Color</span><span>Ratio</span><span>Wealth</span><span>Status</span>";
    elements.groupMeans.appendChild(header);

    for (let color = 0; color < count; color += 1) {
      const row = document.createElement("div");
      row.className = "ns-group-row";

      const name = document.createElement("div");
      name.className = "ns-group-name";
      name.innerHTML = '<span class="ns-group-dot" style="--group-color: ' +
        GROUP_COLORS[color] + '"></span><span class="ns-group-label"><span>' +
        GROUP_NAMES[color] + '</span><small class="ns-group-share" data-group-share="' +
        color + '">—</small></span>';
      row.appendChild(name);

      const ratioLabel = document.createElement("label");
      ratioLabel.className = "ns-mean-input";
      ratioLabel.setAttribute("aria-label", GROUP_NAMES[color] + " population ratio");
      const ratioInput = document.createElement("input");
      ratioInput.type = "number";
      ratioInput.min = "0.01";
      ratioInput.max = "1000";
      ratioInput.step = "0.1";
      ratioInput.value = String(groupRatios[color]);
      ratioInput.dataset.groupIndex = String(color);
      ratioInput.dataset.ratio = "true";
      ratioInput.inputMode = "decimal";
      ratioLabel.appendChild(ratioInput);
      row.appendChild(ratioLabel);

      ["wealth", "status"].forEach(function (kind) {
        const label = document.createElement("label");
        label.className = "ns-mean-input";
        label.setAttribute("aria-label", GROUP_NAMES[color] + " mean " + kind);

        const input = document.createElement("input");
        input.type = "number";
        input.min = "-4";
        input.max = "4";
        input.step = "0.1";
        input.value = String(groupMeans[color][kind]);
        input.dataset.groupIndex = String(color);
        input.dataset.meanKind = kind;
        input.inputMode = "decimal";
        label.appendChild(input);
        row.appendChild(label);
      });

      elements.groupMeans.appendChild(row);
    }
  }

  function formatNumber(value, digits) {
    return Number(value).toFixed(digits).replace("-0.00", "0.00").replace("-0.0", "0.0");
  }

  function formatSigned(value, digits) {
    const rounded = formatNumber(value, digits);
    return value > 0 ? "+" + rounded : rounded;
  }

  function comparisonText(initial, current, digits, unit) {
    const suffix = unit || "";
    const displayedInitial = Number(Number(initial).toFixed(digits));
    const displayedCurrent = Number(Number(current).toFixed(digits));
    return "Initial " + formatNumber(displayedInitial, digits) + suffix +
      " · Δ " + formatSigned(displayedCurrent - displayedInitial, digits) + suffix;
  }

  function updateRangeOutputs() {
    elements.correlationOutput.value = Number(elements.correlation.value).toFixed(2);
    elements.endogeneityOutput.value = Number(elements.endogeneity.value).toFixed(2);
    elements.homophilyOutput.value = Number(elements.homophily.value).toFixed(2);
    const vacancyRate = Number(elements.vacancyRate.value);
    const impliedAgentCount = Math.round(CELL_COUNT * (1 - (vacancyRate / 100)));
    elements.vacancyRateOutput.value = vacancyRate.toFixed(1) + "% · " +
      impliedAgentCount.toLocaleString() + " agents";
  }

  function stopAnimation(statusText) {
    running = false;
    if (animationFrame !== null) cancelAnimationFrame(animationFrame);
    animationFrame = null;
    elements.run.textContent = "Run";
    elements.run.setAttribute("aria-pressed", "false");
    if (statusText) elements.runStatus.textContent = statusText;
  }

  function resetSimulation() {
    stopAnimation();
    simulation = new NeighborhoodSimulation(readOptions());
    initialStatistics = {
      neighborStatusCorrelation: simulation.neighborAttributeCorrelation("status"),
      neighborWealthCorrelation: simulation.neighborAttributeCorrelation("wealth"),
      excessSameColor: simulation.excessSameColorExposure() * 100
    };
    selectedCell = null;
    elements.tooltip.hidden = true;
    elements.roundLimit.textContent = simulation.options.maxRounds.toLocaleString();
    elements.board.setAttribute(
      "aria-label",
      "A 36 by 36 toroidal grid containing " + simulation.agentCount.toLocaleString() +
        " agents and " + simulation.vacancyCount.toLocaleString() + " vacancies"
    );
    elements.runStatus.textContent = "Ready to run";
    renderAll();
  }

  function statusForResult(result) {
    if (!result) return "Ready to run";
    if (result.finishedReason === "converged") {
      return "Converged — no agent found a better affordable vacancy";
    }
    if (result.finishedReason === "limit") {
      return "Stopped at the round limit";
    }
    return result.moves.toLocaleString() + (result.moves === 1 ? " agent moved" : " agents moved");
  }

  function runOneRound() {
    const result = simulation.step();
    if (result && result.finishedReason !== null) {
      stopAnimation(statusForResult(result));
    }
    return result;
  }

  function animationTick() {
    if (!running) return;

    const roundsPerFrame = Number(elements.speed.value);
    const frameDeadline = performance.now() + 12;
    let completed = 0;

    /*
     * The time budget keeps the page responsive even at 100×. A slow device may
     * perform fewer than the requested rounds in one frame, but never locks the
     * main thread until all 2,000 rounds finish.
     */
    while (
      running &&
      completed < roundsPerFrame &&
      performance.now() < frameDeadline
    ) {
      runOneRound();
      completed += 1;
    }

    renderAll();
    if (running) animationFrame = requestAnimationFrame(animationTick);
  }

  function toggleRunning() {
    if (running) {
      stopAnimation("Paused");
      return;
    }
    if (simulation.finishedReason !== null) return;

    running = true;
    elements.run.textContent = "Pause";
    elements.run.setAttribute("aria-pressed", "true");
    elements.runStatus.textContent = "Running…";
    animationFrame = requestAnimationFrame(animationTick);
  }

  /* Interpolate through a red–neutral–blue diverging palette on [-3, 3]. */
  function interpolateChannel(start, end, amount) {
    return Math.round(start + ((end - start) * amount));
  }

  function divergingColor(value) {
    const bounded = clamp(value, -3, 3);
    const negative = [182, 83, 60];
    const neutral = [246, 245, 240];
    const positive = [39, 106, 155];
    const amount = Math.abs(bounded) / 3;
    const endpoint = bounded < 0 ? negative : positive;
    return "rgb(" +
      interpolateChannel(neutral[0], endpoint[0], amount) + "," +
      interpolateChannel(neutral[1], endpoint[1], amount) + "," +
      interpolateChannel(neutral[2], endpoint[2], amount) + ")";
  }

  function fitCanvasToDisplay(canvas, fallbackWidth, fallbackHeight) {
    const rectangle = canvas.getBoundingClientRect();
    const cssWidth = rectangle.width || fallbackWidth;
    const cssHeight = rectangle.height || fallbackHeight;
    const pixelRatio = Math.min(global.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(cssWidth * pixelRatio));
    const height = Math.max(1, Math.round(cssHeight * pixelRatio));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const context = canvas.getContext("2d");
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    return { context: context, width: cssWidth, height: cssHeight };
  }

  function cellColor(cell) {
    const agentId = simulation.grid[cell];

    if (currentView === "price") return divergingColor(simulation.snapshot.price[cell]);
    if (agentId === -1) return "#edf0f3";

    const agent = simulation.agents[agentId];
    if (currentView === "color") return GROUP_COLORS[agent.color];
    if (currentView === "status") return divergingColor(agent.status);
    return divergingColor(agent.wealth);
  }

  function drawBoard() {
    const fitted = fitCanvasToDisplay(elements.board, 620, 620);
    const context = fitted.context;
    const cellWidth = fitted.width / GRID_SIZE;
    const cellHeight = fitted.height / GRID_SIZE;
    const gap = Math.max(0.45, Math.min(cellWidth, cellHeight) * 0.045);

    context.clearRect(0, 0, fitted.width, fitted.height);
    context.fillStyle = "#dce2e9";
    context.fillRect(0, 0, fitted.width, fitted.height);

    for (let cell = 0; cell < CELL_COUNT; cell += 1) {
      const row = Math.floor(cell / GRID_SIZE);
      const column = cell % GRID_SIZE;
      const x = column * cellWidth;
      const y = row * cellHeight;

      context.fillStyle = cellColor(cell);
      context.fillRect(x + gap, y + gap, cellWidth - (2 * gap), cellHeight - (2 * gap));

      /* In price view, a dot distinguishes occupied cells from vacancies. */
      if (currentView === "price" && simulation.grid[cell] !== -1) {
        const value = simulation.snapshot.price[cell];
        context.beginPath();
        context.arc(x + (cellWidth / 2), y + (cellHeight / 2), Math.max(1.2, cellWidth * 0.13), 0, 2 * Math.PI);
        context.fillStyle = Math.abs(value) < 1.2 ? "#273142" : "rgba(255,255,255,0.9)";
        context.fill();
      }
    }

    if (selectedCell !== null) {
      const row = Math.floor(selectedCell / GRID_SIZE);
      const column = selectedCell % GRID_SIZE;
      context.strokeStyle = "#111827";
      context.lineWidth = 2;
      context.strokeRect(
        (column * cellWidth) + 1,
        (row * cellHeight) + 1,
        cellWidth - 2,
        cellHeight - 2
      );
    }
  }

  function renderLegend() {
    elements.mapLegend.textContent = "";

    if (currentView === "color") {
      for (let color = 0; color < simulation.options.colorCount; color += 1) {
        const item = document.createElement("span");
        item.className = "ns-legend-item";
        item.innerHTML = '<i class="ns-legend-swatch" style="--swatch: ' +
          GROUP_COLORS[color] + '"></i>' + GROUP_NAMES[color];
        elements.mapLegend.appendChild(item);
      }

      const vacancy = document.createElement("span");
      vacancy.className = "ns-legend-item";
      vacancy.innerHTML = '<i class="ns-legend-swatch" style="--swatch: #edf0f3"></i>Vacant';
      elements.mapLegend.appendChild(vacancy);
      return;
    }

    const gradient = document.createElement("span");
    gradient.className = "ns-gradient-legend";
    gradient.innerHTML = "<span>−3</span><i class=\"ns-gradient-bar\"></i><span>+3</span>";
    elements.mapLegend.appendChild(gradient);
  }

  function drawSegregationChart(canvas, history, series) {
    const fitted = fitCanvasToDisplay(canvas, 360, 152);
    const context = fitted.context;
    const width = fitted.width;
    const height = fitted.height;
    const margin = { top: 9, right: 8, bottom: 22, left: 34 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    context.clearRect(0, 0, width, height);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);

    if (history.length === 0 || history[0].dissimilarity === null) {
      context.fillStyle = "#6b7280";
      context.font = "11px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
      context.textAlign = "center";
      context.fillText("Requires at least two colors", width / 2, height / 2);
      return;
    }

    const xMaximum = Math.max(10, history[history.length - 1].round);

    context.strokeStyle = "#e1e6ed";
    context.lineWidth = 1;
    context.fillStyle = "#687386";
    context.font = "10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";

    [0, 0.5, 1].forEach(function (fraction) {
      const y = margin.top + (plotHeight * (1 - fraction));
      context.beginPath();
      context.moveTo(margin.left, y);
      context.lineTo(width - margin.right, y);
      context.stroke();
      context.textAlign = "right";
      context.textBaseline = "middle";
      context.fillText(fraction.toFixed(1), margin.left - 6, y);
    });

    context.textBaseline = "top";
    context.textAlign = "left";
    context.fillText("0", margin.left, height - margin.bottom + 7);
    context.textAlign = "right";
    context.fillText(String(history[history.length - 1].round), width - margin.right, height - margin.bottom + 7);

    context.beginPath();
    history.forEach(function (point, index) {
      const x = margin.left + ((point.round / xMaximum) * plotWidth);
      const y = margin.top + ((1 - point[series.key]) * plotHeight);
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.strokeStyle = series.color;
    context.lineWidth = 2;
    context.lineJoin = "round";
    context.lineCap = "round";
    context.stroke();

    const latest = history[history.length - 1];
    const latestX = margin.left + ((latest.round / xMaximum) * plotWidth);
    const latestY = margin.top + ((1 - latest[series.key]) * plotHeight);
    context.beginPath();
    context.arc(latestX, latestY, 2.5, 0, Math.PI * 2);
    context.fillStyle = series.color;
    context.fill();
  }

  function drawHistory() {
    const history = simulation.segregationHistory[currentSegregationView];
    const latest = history[history.length - 1];

    SEGREGATION_SERIES.forEach(function (series) {
      const canvas = elements.indexCharts.find(function (candidate) {
        return candidate.dataset.indexChart === series.key;
      });
      const output = elements.indexValues.find(function (candidate) {
        return candidate.dataset.indexValue === series.key;
      });
      const change = elements.indexChanges.find(function (candidate) {
        return candidate.dataset.indexChange === series.key;
      });
      const initial = history[0];

      output.value = latest && latest[series.key] !== null
        ? formatNumber(latest[series.key], 3)
        : "N/A";
      change.textContent = latest && initial && latest[series.key] !== null && initial[series.key] !== null
        ? comparisonText(initial[series.key], latest[series.key], 3)
        : "Initial N/A";
      drawSegregationChart(canvas, history, series);
    });
  }

  function updateGroupShareOutputs() {
    root.querySelectorAll("[data-group-share]").forEach(function (output) {
      const color = Number(output.dataset.groupShare);
      const count = simulation.colorCounts[color];
      const percentage = (count / simulation.agentCount) * 100;
      output.textContent = formatNumber(percentage, 1) + "% · " +
        count.toLocaleString() + (count === 1 ? " agent" : " agents");
    });
  }

  function updateStatistics() {
    const neighborStatus = simulation.neighborAttributeCorrelation("status");
    const neighborWealth = simulation.neighborAttributeCorrelation("wealth");
    const excessSameColor = simulation.excessSameColorExposure() * 100;

    elements.round.textContent = simulation.round.toLocaleString();
    elements.neighborStatusCorrelation.textContent = formatNumber(neighborStatus, 2);
    elements.neighborWealthCorrelation.textContent = formatNumber(neighborWealth, 2);
    elements.neighborStatusChange.textContent = comparisonText(
      initialStatistics.neighborStatusCorrelation,
      neighborStatus,
      2
    );
    elements.neighborWealthChange.textContent = comparisonText(
      initialStatistics.neighborWealthCorrelation,
      neighborWealth,
      2
    );
    elements.segregation.textContent = formatSigned(excessSameColor, 1) + " pp";
    elements.segregationChange.textContent = comparisonText(
      initialStatistics.excessSameColor,
      excessSameColor,
      1,
      " pp"
    );
    elements.observedCorrelation.textContent = formatNumber(simulation.observedCorrelation, 2);
    elements.run.disabled = simulation.finishedReason !== null;
    elements.step.disabled = simulation.finishedReason !== null;
  }

  function renderAll() {
    drawBoard();
    renderLegend();
    updateGroupShareOutputs();
    drawHistory();
    updateStatistics();
  }

  function sameColorShare(agent, cell) {
    const count = simulation.snapshot.occupiedNeighborCount[cell];
    if (count === 0) return simulation.colorShares[agent.color];
    return simulation.snapshot.neighborColorCounts[agent.color][cell] / count;
  }

  function tooltipRows(rows) {
    return rows.map(function (row) {
      return '<span class="ns-tooltip-row"><span>' + row[0] + "</span><span>" + row[1] + "</span></span>";
    }).join("");
  }

  function describeCell(cell) {
    const agentId = simulation.grid[cell];
    const row = Math.floor(cell / GRID_SIZE) + 1;
    const column = (cell % GRID_SIZE) + 1;
    const snapshot = simulation.snapshot;
    const commonRows = [
      ["Housing price", formatSigned(snapshot.price[cell], 2)],
      ["Neighbor status", formatSigned(snapshot.neighborStatus[cell], 2)],
      ["Occupied neighbors", String(snapshot.occupiedNeighborCount[cell])]
    ];

    if (agentId === -1) {
      return {
        html: "<strong>Vacant cell · row " + row + ", column " + column + "</strong>" + tooltipRows(commonRows),
        text: "Vacant cell, row " + row + ", column " + column +
          ". Price " + formatSigned(snapshot.price[cell], 2) +
          ", neighbor status " + formatSigned(snapshot.neighborStatus[cell], 2) + "."
      };
    }

    const agent = simulation.agents[agentId];
    const share = sameColorShare(agent, cell);
    const rows = [
      ["Color", GROUP_NAMES[agent.color]],
      ["Status", formatSigned(agent.status, 2)],
      ["Wealth", formatSigned(agent.wealth, 2)]
    ].concat(commonRows).concat([
      ["Same-color share", formatNumber(share * 100, 1) + "%"],
      ["Residential utility", formatSigned(simulation.utility(agent, cell, snapshot), 2)]
    ]);

    return {
      html: "<strong>Agent · row " + row + ", column " + column + "</strong>" + tooltipRows(rows),
      text: GROUP_NAMES[agent.color] + " agent, row " + row + ", column " + column +
        ". Status " + formatSigned(agent.status, 2) +
        ", wealth " + formatSigned(agent.wealth, 2) +
        ", housing price " + formatSigned(snapshot.price[cell], 2) + "."
    };
  }

  function showCellTooltip(cell, clientX, clientY) {
    selectedCell = cell;
    const description = describeCell(cell);
    elements.tooltip.innerHTML = description.html;
    elements.tooltip.hidden = false;
    elements.board.setAttribute("aria-label", description.text);

    const boardRectangle = elements.board.getBoundingClientRect();
    const wrapRectangle = elements.board.parentElement.getBoundingClientRect();
    const naturalX = clientX - wrapRectangle.left + 12;
    const naturalY = clientY - wrapRectangle.top + 12;
    const tooltipWidth = elements.tooltip.offsetWidth || 190;
    const tooltipHeight = elements.tooltip.offsetHeight || 180;
    const maximumX = wrapRectangle.width - tooltipWidth - 6;
    const maximumY = wrapRectangle.height - tooltipHeight - 6;

    elements.tooltip.style.left = clamp(naturalX, 6, maximumX) + "px";
    elements.tooltip.style.top = clamp(naturalY, 6, maximumY) + "px";

    // Redraw only the board so the selected-cell outline follows the pointer.
    if (boardRectangle.width > 0) drawBoard();
  }

  function cellFromPointer(event) {
    const rectangle = elements.board.getBoundingClientRect();
    const x = clamp(event.clientX - rectangle.left, 0, rectangle.width - 0.001);
    const y = clamp(event.clientY - rectangle.top, 0, rectangle.height - 0.001);
    const column = Math.floor((x / rectangle.width) * GRID_SIZE);
    const row = Math.floor((y / rectangle.height) * GRID_SIZE);
    return (row * GRID_SIZE) + column;
  }

  function showKeyboardCell(cell) {
    const rectangle = elements.board.getBoundingClientRect();
    const row = Math.floor(cell / GRID_SIZE);
    const column = cell % GRID_SIZE;
    const clientX = rectangle.left + ((column + 0.5) / GRID_SIZE * rectangle.width);
    const clientY = rectangle.top + ((row + 0.5) / GRID_SIZE * rectangle.height);
    showCellTooltip(cell, clientX, clientY);
  }

  elements.run.addEventListener("click", toggleRunning);

  elements.step.addEventListener("click", function () {
    stopAnimation();
    const result = runOneRound();
    if (result && result.finishedReason === null) elements.runStatus.textContent = statusForResult(result);
    renderAll();
  });

  elements.reset.addEventListener("click", resetSimulation);

  [elements.correlation, elements.endogeneity, elements.homophily, elements.vacancyRate].forEach(function (input) {
    input.addEventListener("input", updateRangeOutputs);
    input.addEventListener("change", resetSimulation);
  });

  elements.colorCount.addEventListener("change", function () {
    buildGroupMeanControls();
    resetSimulation();
  });

  [elements.maxRounds, elements.seed].forEach(function (input) {
    input.addEventListener("change", resetSimulation);
  });

  elements.randomizeSeed.addEventListener("click", function () {
    const randomPart = Math.floor(Math.random() * 0xFFFFFFFF).toString(36);
    elements.seed.value = "run-" + randomPart;
    resetSimulation();
  });

  elements.groupMeans.addEventListener("change", function (event) {
    const input = event.target.closest("input[data-group-index]");
    if (!input) return;

    const color = Number(input.dataset.groupIndex);
    if (input.dataset.ratio === "true") {
      const ratio = clamp(finiteNumber(input.value, 1), 0.01, 1000);
      input.value = String(ratio);
      groupRatios[color] = ratio;
      resetSimulation();
      return;
    }

    const kind = input.dataset.meanKind;
    const value = clamp(finiteNumber(input.value, 0), -4, 4);
    input.value = String(value);
    groupMeans[color][kind] = value;
    resetSimulation();
  });

  role("view-options").addEventListener("change", function (event) {
    if (event.target.name !== "ns-view") return;
    currentView = event.target.value;
    drawBoard();
    renderLegend();
  });

  root.querySelectorAll("[data-segregation-view]").forEach(function (button) {
    button.addEventListener("click", function () {
      currentSegregationView = button.dataset.segregationView;
      root.querySelectorAll("[data-segregation-view]").forEach(function (otherButton) {
        otherButton.setAttribute(
          "aria-pressed",
          String(otherButton.dataset.segregationView === currentSegregationView)
        );
      });
      elements.indexCharts.forEach(function (canvas) {
        const series = SEGREGATION_SERIES.find(function (candidate) {
          return candidate.key === canvas.dataset.indexChart;
        });
        canvas.setAttribute(
          "aria-label",
          "Line chart of " + currentSegregationView + " " + series.label.toLowerCase() + " by round"
        );
      });
      drawHistory();
    });
  });

  elements.board.addEventListener("pointermove", function (event) {
    if (event.pointerType === "touch") return;
    showCellTooltip(cellFromPointer(event), event.clientX, event.clientY);
  });

  elements.board.addEventListener("pointerdown", function (event) {
    showCellTooltip(cellFromPointer(event), event.clientX, event.clientY);
  });

  elements.board.addEventListener("pointerleave", function (event) {
    if (event.pointerType === "touch") return;
    selectedCell = null;
    elements.tooltip.hidden = true;
    elements.board.setAttribute(
      "aria-label",
      "A 36 by 36 toroidal grid containing " + simulation.agentCount.toLocaleString() +
        " agents and " + simulation.vacancyCount.toLocaleString() + " vacancies"
    );
    drawBoard();
  });

  elements.board.addEventListener("keydown", function (event) {
    const arrows = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    if (!arrows.includes(event.key)) return;
    event.preventDefault();

    if (selectedCell === null) selectedCell = 0;
    let row = Math.floor(selectedCell / GRID_SIZE);
    let column = selectedCell % GRID_SIZE;
    if (event.key === "ArrowLeft") column = (column - 1 + GRID_SIZE) % GRID_SIZE;
    if (event.key === "ArrowRight") column = (column + 1) % GRID_SIZE;
    if (event.key === "ArrowUp") row = (row - 1 + GRID_SIZE) % GRID_SIZE;
    if (event.key === "ArrowDown") row = (row + 1) % GRID_SIZE;
    showKeyboardCell((row * GRID_SIZE) + column);
  });

  /* Keep canvases crisp and correctly sized when their responsive cards resize. */
  if (typeof ResizeObserver !== "undefined") {
    const resizeObserver = new ResizeObserver(function () {
      if (simulation !== null) {
        drawBoard();
        drawHistory();
      }
    });
    resizeObserver.observe(elements.board);
    elements.indexCharts.forEach(function (canvas) {
      resizeObserver.observe(canvas);
    });
  } else {
    global.addEventListener("resize", renderAll);
  }

  buildGroupMeanControls();
  updateRangeOutputs();
  resetSimulation();
})(typeof window !== "undefined" ? window : globalThis);
