---
layout: post
title: "Status, Wealth, and Neighborhood Sorting"
date: 2026-09-19
permalink: /neighborhood-sorting/
categories:
---

<link rel="stylesheet" href="{{ '/assets/css/neighborhood-sorting.css' | relative_url }}">

<div class="ns-interactive" data-neighborhood-sorting>
  <p class="ns-intro">
    What happens when everyone wants high-status neighbors, but wealth limits where people can move? This model populates a 36 × 36 toroidal grid. Adjust its density, group composition, and preference for living near one’s own color to explore how economic inequality and homophily interact.
  </p>

  <noscript><p class="ns-notice">This interactive requires JavaScript.</p></noscript>

  <div class="ns-app">
    <section class="ns-stage-card" aria-labelledby="ns-board-title">
      <div class="ns-stage-heading">
        <div>
          <h2 id="ns-board-title">Neighborhood map</h2>
          <p data-role="run-status" aria-live="polite">Ready to run</p>
        </div>
        <div class="ns-round-counter">
          <span>Round</span>
          <strong><span data-role="round">0</span> / <span data-role="round-limit">2,000</span></strong>
        </div>
      </div>

      <div class="ns-board-wrap">
        <canvas
          class="ns-board"
          data-role="board"
          width="620"
          height="620"
          tabindex="0"
          role="img"
          aria-label="A 36 by 36 toroidal neighborhood grid"
        ></canvas>
        <div class="ns-tooltip" data-role="tooltip" hidden></div>
      </div>

      <div class="ns-view-row">
        <fieldset class="ns-segmented" data-role="view-options">
          <legend>Map cells by</legend>
          <label><input type="radio" name="ns-view" value="color" checked><span>Color</span></label>
          <label><input type="radio" name="ns-view" value="status"><span>Status</span></label>
          <label><input type="radio" name="ns-view" value="wealth"><span>Wealth</span></label>
          <label><input type="radio" name="ns-view" value="price"><span>Price</span></label>
        </fieldset>
        <div class="ns-map-legend" data-role="map-legend" aria-label="Map legend"></div>
      </div>

      <div class="ns-playback" aria-label="Simulation controls">
        <button class="ns-button ns-button-primary" data-role="run" type="button">Run</button>
        <button class="ns-button" data-role="step" type="button">Step</button>
        <button class="ns-button" data-role="reset" type="button">Reset</button>
        <label class="ns-speed-control">
          <span>Speed</span>
          <select data-role="speed">
            <option value="1">1×</option>
            <option value="5">5×</option>
            <option value="25" selected>25×</option>
            <option value="100">100×</option>
          </select>
        </label>
      </div>

      <p class="ns-stage-note">Opposite edges touch. Hover or tap a cell for its frozen, start-of-round values.</p>
    </section>

    <aside class="ns-control-card" aria-labelledby="ns-controls-title">
      <div class="ns-control-heading">
        <h2 id="ns-controls-title">Model settings</h2>
        <p>Changing a setting starts a new run.</p>
      </div>

      <div class="ns-control-group">
        <label class="ns-range-label" for="ns-correlation">
          <span>Status–wealth correlation (<em>C</em>)
            <span class="ns-help" tabindex="0" role="button" aria-label="Explain status–wealth correlation" aria-describedby="ns-help-correlation">
              <span class="ns-help-icon" aria-hidden="true">?</span>
              <span class="ns-help-popover" id="ns-help-correlation" role="tooltip">
                <strong>Within-color correlation</strong>
                <em>C</em> controls how closely an agent’s status follows its wealth deviation within its color group. At 0 they are independent within colors; at 1, wealth deviation completely determines status deviation.
                <span class="ns-help-equation">\(S_a=\mu^S_g+C(W_a-\mu^W_g)+\sqrt{1-C^2}X_a\)</span>
              </span>
            </span>
          </span>
          <output data-role="correlation-output" for="ns-correlation">0.50</output>
        </label>
        <input id="ns-correlation" data-role="correlation" type="range" min="0" max="1" step="0.05" value="0.5">
      </div>

      <div class="ns-control-group">
        <label class="ns-range-label" for="ns-endogeneity">
          <span>Price endogeneity (<em>E</em>)
            <span class="ns-help" tabindex="0" role="button" aria-label="Explain price endogeneity" aria-describedby="ns-help-endogeneity">
              <span class="ns-help-icon" aria-hidden="true">?</span>
              <span class="ns-help-popover" id="ns-help-endogeneity" role="tooltip">
                <strong>Neighbor-determined price</strong>
                <em>E</em> sets the weight given to mean neighbor wealth instead of a cell’s fixed random price. At 0 prices are fully exogenous; at 1 they are fully determined by neighbor wealth before smoothing.
                <span class="ns-help-equation">\(H_i^{raw}=E\bar W_{N(i)}+(1-E)R_i\)</span>
                <span class="ns-help-equation">\(H_i=.75H_i^{raw}+\frac{1}{32}\sum_{j\in N(i)}H_j^{raw}\)</span>
              </span>
            </span>
          </span>
          <output data-role="endogeneity-output" for="ns-endogeneity">0.50</output>
        </label>
        <input id="ns-endogeneity" data-role="endogeneity" type="range" min="0" max="1" step="0.05" value="0.5">
      </div>

      <div class="ns-control-group">
        <label class="ns-range-label" for="ns-homophily">
          <span>Color preference (<em>β</em>)
            <span class="ns-help" tabindex="0" role="button" aria-label="Explain color preference" aria-describedby="ns-help-homophily">
              <span class="ns-help-icon" aria-hidden="true">?</span>
              <span class="ns-help-popover" id="ns-help-homophily" role="tooltip">
                <strong>Preference for own-color neighbors</strong>
                <em>β</em> measures how many status units an agent will trade for greater representation of its own color. At 0 agents have no color preference, so only neighbor status affects desirability.
                <span class="ns-help-equation">\(U_{ig}=\bar S_{N(i)}+\beta(q_{ig}-p_g)\)</span>
              </span>
            </span>
          </span>
          <output data-role="homophily-output" for="ns-homophily">0.00</output>
        </label>
        <input id="ns-homophily" data-role="homophily" type="range" min="0" max="4" step="0.1" value="0">
      </div>

      <div class="ns-control-group">
        <label class="ns-range-label" for="ns-vacancy-rate">
          <span>Vacancy rate</span>
          <output data-role="vacancy-rate-output" for="ns-vacancy-rate">38.3% · 800 agents</output>
        </label>
        <input id="ns-vacancy-rate" data-role="vacancy-rate" type="range" min="5" max="70" step="0.1" value="38.3">
      </div>

      <div class="ns-control-grid">
        <label>
          <span>Colors</span>
          <select data-role="color-count">
            <option value="1">1</option>
            <option value="2" selected>2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        </label>
        <label>
          <span>Maximum rounds</span>
          <input data-role="max-rounds" type="number" min="1" max="10000" step="1" value="2000" inputmode="numeric">
        </label>
        <label class="ns-seed-field">
          <span>Random seed</span>
          <span class="ns-seed-input">
            <input data-role="seed" type="text" value="neighborhoods" maxlength="48" spellcheck="false">
            <button data-role="randomize-seed" type="button" title="Generate a new seed" aria-label="Generate a new random seed">↻</button>
          </span>
        </label>
      </div>

      <div class="ns-group-means">
        <div class="ns-group-means-heading">
          <h3>Color groups</h3>
          <span>Ratios are relative; within-group SD = 1</span>
        </div>
        <div class="ns-group-table" data-role="group-means"></div>
      </div>
    </aside>
  </div>

  <section class="ns-results" aria-labelledby="ns-results-title">
    <div class="ns-results-heading">
      <div>
        <h2 id="ns-results-title">What is happening?</h2>
        <p>Statistics describe the population and its current spatial arrangement.</p>
      </div>
    </div>

    <div class="ns-stat-grid">
      <div class="ns-stat">
        <span class="ns-stat-label-with-help">Neighbor status correlation
          <span class="ns-help ns-help-stat ns-help-plain" tabindex="0" role="button" aria-label="Explain neighbor status correlation" aria-describedby="ns-help-neighbor-status">
            <span class="ns-help-icon" aria-hidden="true"><span class="ns-help-glyph">?</span></span>
            <span class="ns-help-popover" id="ns-help-neighbor-status" role="tooltip">
              <strong>Local status sorting</strong>
              The Pearson correlation between the status values of agents who occupy adjacent Moore-neighbor cells. Values near 1 indicate local similarity, 0 indicates little association, and negative values indicate local dissimilarity.
              <span class="ns-help-equation">\(r_{S,N}=\operatorname{corr}(S_a,S_b\mid b\in N(a))\)</span>
            </span>
          </span>
        </span>
        <strong data-role="neighbor-status-correlation">—</strong>
        <span class="ns-stat-change" data-role="neighbor-status-change">Initial —</span>
      </div>
      <div class="ns-stat">
        <span class="ns-stat-label-with-help">Neighbor wealth correlation
          <span class="ns-help ns-help-stat ns-help-plain" tabindex="0" role="button" aria-label="Explain neighbor wealth correlation" aria-describedby="ns-help-neighbor-wealth">
            <span class="ns-help-icon" aria-hidden="true"><span class="ns-help-glyph">?</span></span>
            <span class="ns-help-popover" id="ns-help-neighbor-wealth" role="tooltip">
              <strong>Local wealth sorting</strong>
              The Pearson correlation between the wealth values of agents who occupy adjacent Moore-neighbor cells. Values near 1 indicate local similarity, 0 indicates little association, and negative values indicate local dissimilarity.
              <span class="ns-help-equation">\(r_{W,N}=\operatorname{corr}(W_a,W_b\mid b\in N(a))\)</span>
            </span>
          </span>
        </span>
        <strong data-role="neighbor-wealth-correlation">—</strong>
        <span class="ns-stat-change" data-role="neighbor-wealth-change">Initial —</span>
      </div>
      <div class="ns-stat">
        <span>Excess same-color neighbors</span>
        <strong data-role="segregation">0.0 pp</strong>
        <span class="ns-stat-change" data-role="segregation-change">Initial —</span>
      </div>
      <div class="ns-stat">
        <span class="ns-stat-label-with-help">Population status–wealth correlation
          <span class="ns-help ns-help-stat ns-help-plain" tabindex="0" role="button" aria-label="Explain population status–wealth correlation" aria-describedby="ns-help-observed-correlation">
            <span class="ns-help-icon" aria-hidden="true"><span class="ns-help-glyph">?</span></span>
            <span class="ns-help-popover" id="ns-help-observed-correlation" role="tooltip">
              <strong>Realized Pearson correlation</strong>
              The correlation between status and wealth across all generated agents. Unlike <em>C</em>, it includes differences between color-group means and finite-sample randomness.
              <span class="ns-help-equation">\(r_{SW}=\frac{\operatorname{cov}(S,W)}{s_Ss_W}\)</span>
            </span>
          </span>
        </span>
        <strong data-role="observed-correlation">—</strong>
        <span class="ns-stat-change">Fixed during run</span>
      </div>
    </div>

    <div class="ns-history-card">
      <div class="ns-history-heading">
        <div>
          <h3>Segregation over time</h3>
          <span>Tract indices use 3×3 blocks; isolation uses exact locations</span>
        </div>
        <div class="ns-index-tabs" role="group" aria-label="Attribute used to measure segregation">
          <button type="button" data-segregation-view="color" aria-pressed="true">Color</button>
          <button type="button" data-segregation-view="status" aria-pressed="false">Status</button>
          <button type="button" data-segregation-view="wealth" aria-pressed="false">Wealth</button>
        </div>
      </div>
      <div class="ns-index-chart-grid">
        <section class="ns-index-chart">
          <div class="ns-index-chart-heading">
            <div class="ns-index-title"><h4><i style="--line-color: #1769aa"></i>Dissimilarity</h4>
              <span class="ns-help ns-help-index ns-help-plain" tabindex="0" role="button" aria-label="Explain dissimilarity" aria-describedby="ns-help-dissimilarity">
                <span class="ns-help-icon" aria-hidden="true"><span class="ns-help-glyph">?</span></span>
                <span class="ns-help-popover" id="ns-help-dissimilarity" role="tooltip">
                  <strong>Dissimilarity index</strong>
                  Measures how unevenly a focal group and everyone else are distributed across the 3×3 tracts. Zero is even distribution; one is complete separation.
                  <span class="ns-help-equation">\(D=\frac12\sum_i\left|\frac{x_i}{X}-\frac{y_i}{Y}\right|\)</span>
                </span>
              </span>
            </div>
            <div class="ns-index-reading"><output data-index-value="dissimilarity">—</output><small data-index-change="dissimilarity">Initial —</small></div>
          </div>
          <canvas data-index-chart="dissimilarity" width="480" height="240" aria-label="Line chart of color dissimilarity by round"></canvas>
        </section>
        <section class="ns-index-chart">
          <div class="ns-index-chart-heading">
            <div class="ns-index-title"><h4><i style="--line-color: #d97706"></i>Distance-decay isolation</h4>
              <span class="ns-help ns-help-index ns-help-plain" tabindex="0" role="button" aria-label="Explain distance-decay isolation" aria-describedby="ns-help-isolation">
                <span class="ns-help-icon" aria-hidden="true"><span class="ns-help-glyph">?</span></span>
                <span class="ns-help-popover" id="ns-help-isolation" role="tooltip">
                  <strong>Distance-decay isolation</strong>
                  Measures the same-group share of the spatial environment around the average focal-group agent. Nearby agents receive exponentially greater weight than distant agents.
                  <span class="ns-help-equation">\(\mathrm{DP}_{xx}=\frac1X\sum_{a\in x}\frac{\sum_b e^{-d_{ab}}\mathbf1(b\in x)}{\sum_b e^{-d_{ab}}}\)</span>
                </span>
              </span>
            </div>
            <div class="ns-index-reading"><output data-index-value="isolation">—</output><small data-index-change="isolation">Initial —</small></div>
          </div>
          <canvas data-index-chart="isolation" width="480" height="240" aria-label="Line chart of color distance-decay isolation by round"></canvas>
        </section>
        <section class="ns-index-chart">
          <div class="ns-index-chart-heading">
            <div class="ns-index-title"><h4><i style="--line-color: #7c3aed"></i>Delta</h4>
              <span class="ns-help ns-help-index ns-help-plain" tabindex="0" role="button" aria-label="Explain delta" aria-describedby="ns-help-delta">
                <span class="ns-help-icon" aria-hidden="true"><span class="ns-help-glyph">?</span></span>
                <span class="ns-help-popover" id="ns-help-delta" role="tooltip">
                  <strong>Delta index</strong>
                  Compares a focal group’s distribution across 3×3 tracts with the distribution of land area. Higher values indicate that the group occupies a more concentrated share of space.
                  <span class="ns-help-equation">\(\mathrm{DEL}=\frac12\sum_i\left|\frac{x_i}{X}-\frac{a_i}{A}\right|\)</span>
                </span>
              </span>
            </div>
            <div class="ns-index-reading"><output data-index-value="delta">—</output><small data-index-change="delta">Initial —</small></div>
          </div>
          <canvas data-index-chart="delta" width="480" height="240" aria-label="Line chart of color delta by round"></canvas>
        </section>
      </div>
      <p class="ns-index-note" data-role="index-note">
        For color, each group is compared with all other colors and results are population-weighted. For status and wealth, agents are split into fixed lower and upper halves. Dissimilarity and delta use 3×3 tracts; distance-decay isolation uses exact agent-to-agent toroidal distances, scaled so three cell widths equal one distance unit.
      </p>
    </div>
  </section>

  <details class="ns-method">
    <summary>How the model works</summary>
    <div class="ns-method-body">
      <h3>Space and population</h3>
      <p>The model is a cellular automaton on a 36 × 36 lattice. Its opposite edges touch, making the grid a torus: a cell on the left edge is adjacent to the corresponding cells on the right edge, and the top similarly wraps to the bottom. Each cell has the eight surrounding cells as its Moore neighborhood.</p>
      <p>The grid contains 1,296 cells. If the selected vacancy rate is \(v\) percent, the model creates \(N=\operatorname{round}[1296(1-v/100)]\) agents and leaves the remaining cells vacant. The default vacancy rate of 38.3% produces 800 agents and 496 vacancies.</p>
      <p>Each color has an adjustable population ratio. These are relative weights rather than percentages: ratios of 2, 1, and 1 allocate approximately 50%, 25%, and 25% of agents to the three colors. The implied percentage and integer agent count appear beneath each color name. The model converts the ratios to integer counts as closely as possible while ensuring that every selected color has at least one agent. Color is categorical; colors have no inherent ordering or distance from one another.</p>

      <h3>Wealth and status</h3>
      <p>Every agent has continuous wealth and status attributes. Wealth determines which vacant cells an agent can afford. Status represents how desirable that agent is as a neighbor: all else equal, every agent prefers neighborhoods containing agents with higher status.</p>
      <p>For agent <em>a</em> in color group <em>g</em>, the attributes are generated as</p>
      <div class="ns-method-equation">
        \[
        W_a=\mu^W_g+\varepsilon^W_a,
        \qquad
        S_a=\mu^S_g+C\varepsilon^W_a+\sqrt{1-C^2}\,\varepsilon^S_a,
        \]
      </div>
      <p>where \(\varepsilon^W_a\) and \(\varepsilon^S_a\) are independent draws from \(N(0,1)\). The user-selected \(\mu^W_g\) and \(\mu^S_g\) are the expected wealth and status means for group <em>g</em>; both attributes have a within-group standard deviation of 1.</p>
      <p>The parameter \(C\in[0,1]\) is the <em>within-color</em> status–wealth correlation. When \(C=0\), status and wealth are independent within each color. When \(C=1\), an agent’s wealth deviation from its group mean completely determines its status deviation. The displayed population correlation is the realized Pearson correlation across all generated agents, so it can differ from \(C\) because of sampling variation and differences between color-group means.</p>

      <h3>Neighborhood desirability and color preference</h3>
      <p>Let \(N(i)\) be the occupied Moore neighbors of cell <em>i</em>, and let \(n_i\) be their number. The status desirability of the cell is</p>
      <div class="ns-method-equation">
        \[
        A_i=
        \begin{cases}
        \displaystyle\frac{1}{n_i}\sum_{j\in N(i)}S_j,&n_i&gt;0,\\[6pt]
        0,&n_i=0.
        \end{cases}
        \]
      </div>
      <p>This is a mean rather than a sum. For example, if a cell has one neighbor with status 0.7, adding a second neighbor with status 0.1 lowers its status desirability from 0.7 to 0.4.</p>
      <p>For an agent of color <em>g</em>, let \(q_{ig}\) be the proportion of cell <em>i</em>’s occupied neighbors that share color <em>g</em>, and let \(p_g\) be that color’s share of the full population. Color fit is measured relative to random-mixing prevalence, \(q_{ig}-p_g\). If a cell has no occupied neighbors, \(q_{ig}\) is defined as \(p_g\), making its color fit zero.</p>
      <p>The agent-specific residential utility of cell <em>i</em> is</p>
      <div class="ns-method-equation">
        \[
        U_{ig}=A_i+\beta(q_{ig}-p_g).
        \]
      </div>
      <p>The color-preference parameter \(\beta\) is expressed in status units. At \(\beta=0\), agents have no color preference and the extension reduces to the original status-based decision rule. Larger values mean agents are willing to give up more neighborhood status for greater overrepresentation of their own color. With only one color, \(q_{ig}=p_g=1\), so the color term is always zero regardless of \(\beta\).</p>

      <h3>Housing prices</h3>
      <p>Every cell receives a fixed exogenous price \(R_i\sim N(0,1)\). At the beginning of a round, the cell’s raw price combines this fixed value with the mean wealth of its occupied neighbors:</p>
      <div class="ns-method-equation">
        \[
        H_i^{\mathrm{raw}}=E\bar W_{N(i)}+(1-E)R_i,
        \qquad
        \bar W_{N(i)}=
        \begin{cases}
        \displaystyle\frac{1}{n_i}\sum_{j\in N(i)}W_j,&n_i&gt;0,\\[6pt]
        0,&n_i=0.
        \end{cases}
        \]
      </div>
      <p>Price endogeneity \(E\in[0,1]\) controls the mixture. At \(E=0\), raw prices are entirely exogenous. At \(E=1\), they are entirely determined by neighboring wealth. Intermediate values blend the two.</p>
      <p>The model then performs one simultaneous diffusion pass to prevent abrupt price changes between adjacent cells:</p>
      <div class="ns-method-equation">
        \[
        H_i=0.75H_i^{\mathrm{raw}}+\frac{1}{32}\sum_{k\in M(i)}H_k^{\mathrm{raw}},
        \]
      </div>
      <p>where \(M(i)\) contains all eight Moore-neighbor cells, occupied or not. Thus, a cell retains 75% of its raw value and receives 1/32 from each neighbor, for 25% in total. All cells read from the same raw-price field, so iteration order cannot affect diffusion.</p>

      <h3>Movement and timing</h3>
      <p>At the start of every round, the model calculates and freezes all cell prices, status desirabilities, and color-fit values. It then gives every agent one opportunity to act, using a newly randomized agent order.</p>
      <ol>
        <li>The acting agent observes every cell that is vacant at that moment.</li>
        <li>A vacancy is affordable when its frozen price satisfies \(H_i\le W_a\).</li>
        <li>Among affordable vacancies, the agent identifies the greatest residential utility \(U_{ig}\).</li>
        <li>The agent moves only if that utility is strictly greater than the frozen utility of its current residence. Otherwise, it stays.</li>
        <li>If several destinations tie for the highest utility, one is selected randomly.</li>
      </ol>
      <p>An agent may remain in its current residence even when its price has risen above the agent’s wealth. If no vacancy is affordable, the agent is forced to stay. When an agent moves, its destination becomes occupied and its former cell becomes available to agents acting later in the same round. However, both cells retain their start-of-round prices and desirability values until every agent has acted.</p>
      <p>After the round, neighborhood values are recalculated from the new arrangement. The simulation converges when a full round produces no moves; otherwise it stops at the selected round limit, which defaults to 2,000. Initialization, agent order, and tie-breaking all use the displayed random seed, so resetting with unchanged settings exactly reproduces a run.</p>

      <h3>Reported statistics</h3>
      <p>“Neighbor status correlation” and “neighbor wealth correlation” are Pearson correlations across occupied Moore-neighbor pairs. Each adjacency is counted in both directions, and agents with no occupied neighbors do not contribute a pair. Values closer to 1 indicate that similar agents tend to be immediate neighbors, values near 0 indicate little local association, and negative values indicate that dissimilar agents tend to be neighbors.</p>
      <p>“Excess same-color neighbors” is the agent-weighted mean of \(q_{ig}-p_g\), expressed in percentage points. A value of zero means same-color exposure matches population prevalence on average; positive values indicate excess same-color exposure. “Population status–wealth correlation” is the realized Pearson correlation between those attributes across all agents; it does not change as agents move.</p>

      <h3>Segregation indices</h3>
      <p>The 36 × 36 grid is divided into 144 fixed tracts, each containing 3 × 3 cells. For color, every color is treated in turn as the focal group and compared with all other colors; the group-specific results are then averaged using population shares. For status and wealth, agents are permanently divided into lower and upper halves according to their initial attribute ranks, and the two group-specific results are averaged. Color segregation is undefined when only one color exists.</p>
      <p>For a focal group, let \(x_i\) and \(y_i\) be its population and the complementary population in tract <em>i</em>, and let \(X\) and \(Y\) be their grid-wide totals. The dissimilarity index measures how unevenly the two groups are distributed:</p>
      <div class="ns-method-equation">
        \[
        D=\frac{1}{2}\sum_i\left|\frac{x_i}{X}-\frac{y_i}{Y}\right|.
        \]
      </div>
      <p>Distance-decay isolation measures the focal-group share of the spatial environment experienced by an average focal-group agent. Because every agent’s exact cell is known, it is calculated directly from agent-to-agent distances rather than approximating everyone in a tract as living at its centroid:</p>
      <div class="ns-method-equation">
        \[
        \mathrm{DP}_{xx}=\frac{1}{X}\sum_{a\in x}
        \left(
        \frac{\sum_b e^{-d_{ab}}\mathbf{1}(b\in x)}
        {\sum_b e^{-d_{ab}}}
        \right).
        \]
      </div>
      <p>Here, \(d_{ab}\) is the exact wrapped Euclidean distance between the centers of the cells occupied by agents <em>a</em> and <em>b</em>. Three cell widths equal one distance unit. The focal agent is included with its exact self-distance \(d_{aa}=0\), rather than an approximated within-tract distance. Because this is an isolation rather than a prevalence-adjusted measure, its random-mixing baseline depends on the focal group’s population share.</p>
      <p>Finally, delta compares the focal group’s distribution with the distribution of land area:</p>
      <div class="ns-method-equation">
        \[
        \mathrm{DEL}=\frac{1}{2}\sum_i\left|\frac{x_i}{X}-\frac{a_i}{A}\right|.
        \]
      </div>
      <p>All tracts have equal area, so \(a_i/A=1/144\). Higher dissimilarity indicates greater unevenness, higher distance-decay isolation indicates more same-group spatial contact, and higher delta indicates that the group occupies a smaller and more concentrated share of the available tract area.</p>
    </div>
  </details>
</div>

<script src="{{ '/assets/js/neighborhood-sorting.js' | relative_url }}"></script>
