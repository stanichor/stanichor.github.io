---
layout: post
title: "Programming Language Use by Gender Identity"
date: 2025-11-13
permalink: /programming-gender/
redirect_from:
  - /prog-lang-gender/
category: uncategorized
related:
  - /rat-demographics/
  - /tailcalled-gender/
  - /systemizing/
---

People often claim that Rust is unusually popular among trans women. Is it? The [Stack Overflow Survey](https://survey.stackoverflow.co/) asks developers which languages they use and their gender identity, so we can check. I used the 2017–2022 surveys to estimate the gender breakdown of each language's users. 

Below are the estimates, with 94% credible intervals. I use a hierarchical model to partially pool the estimates across languages, since otherwise a handful of respondents can make an obscure language appear to have a very unusual gender distribution.

## What the Survey Shows

### Cis Men

#### Top Languages

| | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 |
| #1 | Dart (96.0%) | F# (96.1%) | Rust (95.2%) | Rust (96.4%) | Rust (96.6%) | Delphi (97.8%) |
| #2 | Rust (95.7%) | Delphi/Object Pascal (95.9%) | Go (95.1%) | Dart (95.5%) | Go (96.4%) | F# (96.5%) |
| #3 | F# (95.5%) | Groovy (95.5%) | Dart (95.0%) | Go (94.6%) | Delphi (96.4%) | Go (96.5%) |
| #4 | TypeScript (95.5%) | Lua (95.5%) | Kotlin (94.4%) | Kotlin (94.0%) | F# (96.4%) | Rust (96.5%) |
| #5 | Lua (95.5%) | Go (95.4%) | F# (94.2%) | C (93.5%) | Groovy (96.1%) | Solidity (96.2%) |

#### Yearly Proportion Estimates

<details>
    <summary>2017</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/prog-lang-gender/2017/cis-men-graph.png" width="900" alt="Point-and-error-bar chart showing the estimated share of cis men among users of each programming language in 2017, ordered from highest to lowest, with 94 percent credible intervals.">
        </figure>
    </div>
</details>


<details>
    <summary>2018</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/prog-lang-gender/2018/cis-men-graph.png" width="900" alt="Point-and-error-bar chart showing the estimated share of cis men among users of each programming language in 2018, ordered from highest to lowest, with 94 percent credible intervals.">
        </figure>
</div>
</details>


<details>
    <summary>2019</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/prog-lang-gender/2019/cis-men-graph.png" width="900" alt="Point-and-error-bar chart showing the estimated share of cis men among users of each programming language in 2019, ordered from highest to lowest, with 94 percent credible intervals.">
        </figure>
    </div>
</details>

<details>
    <summary>2020</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/prog-lang-gender/2020/cis-men-graph.png" width="900" alt="Point-and-error-bar chart showing the estimated share of cis men among users of each programming language in 2020, ordered from highest to lowest, with 94 percent credible intervals.">
        </figure>
    </div>
</details>

<details>
    <summary>2021</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/prog-lang-gender/2021/cis-men-graph.png" width="900" alt="Point-and-error-bar chart showing the estimated share of cis men among users of each programming language in 2021, ordered from highest to lowest, with 94 percent credible intervals.">
        </figure>
    </div>
</details>

<details>
    <summary>2022</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/prog-lang-gender/2022/cis-men-graph.png" width="900" alt="Point-and-error-bar chart showing the estimated share of cis men among users of each programming language in 2022, ordered from highest to lowest, with 94 percent credible intervals.">
        </figure>
    </div>
</details>

#### Summary

Since most of the respondents are cis men, the proportion is above 90% for almost every language. Rust, Dart, Go, F#, and Delphi usually rank near the top.

R is almost always near the bottom, with SAS and APL also appearing near the bottom when they're included.

### Cis Women

#### Top Languages

| | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 |
| #1 | R (13.6%) | R (9.6%) | R (11.1%) | R (12.5%) | R (8.2%) | SAS (8.1%) |
| #2 | Matlab (10.9%) | Matlab (7.9%) | Ruby (9.0%) | Ruby (8.9%) | Matlab (7.6%) | APL (7.4%) |
| #3 | Ruby (9.0%) | Hack (7.6%) | HTML/CSS (7.4%) | HTML/CSS (7.8%) | APL (6.8%) | R (7.0%) |
| #4 | Visual Basic 6 (8.8%) | Ruby (7.4%) | JavaScript (6.8%) | SQL (7.5%) | HTML/CSS (5.0%) | MATLAB (5.5%) |
| #5 | Common Lisp (7.7%) | Cobol (7.3%) | SQL (6.6%) | JavaScript (7.3%) | Ruby (4.9%) | Ruby (5.2%) |

#### Yearly Proportion Estimates

<details>
    <summary>2017</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/prog-lang-gender/2017/cis-women-graph.png" width="900" alt="Point-and-error-bar chart showing the estimated share of cis women among users of each programming language in 2017, ordered from highest to lowest, with 94 percent credible intervals.">
        </figure>
    </div>
</details>


<details>
    <summary>2018</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/prog-lang-gender/2018/cis-women-graph.png" width="900" alt="Point-and-error-bar chart showing the estimated share of cis women among users of each programming language in 2018, ordered from highest to lowest, with 94 percent credible intervals.">
        </figure>
</div>
</details>


<details>
    <summary>2019</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/prog-lang-gender/2019/cis-women-graph.png" width="900" alt="Point-and-error-bar chart showing the estimated share of cis women among users of each programming language in 2019, ordered from highest to lowest, with 94 percent credible intervals.">
        </figure>
    </div>
</details>

<details>
    <summary>2020</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/prog-lang-gender/2020/cis-women-graph.png" width="900" alt="Point-and-error-bar chart showing the estimated share of cis women among users of each programming language in 2020, ordered from highest to lowest, with 94 percent credible intervals.">
        </figure>
    </div>
</details>

<details>
    <summary>2021</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/prog-lang-gender/2021/cis-women-graph.png" width="900" alt="Point-and-error-bar chart showing the estimated share of cis women among users of each programming language in 2021, ordered from highest to lowest, with 94 percent credible intervals.">
        </figure>
    </div>
</details>

<details>
    <summary>2022</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/prog-lang-gender/2022/cis-women-graph.png" width="900" alt="Point-and-error-bar chart showing the estimated share of cis women among users of each programming language in 2022, ordered from highest to lowest, with 94 percent credible intervals.">
        </figure>
    </div>
</details>

#### Summary

R comes first in five of the six years, with SAS beating it in 2022. MATLAB and Ruby also show up repeatedly. I suspect the prominence of R, MATLAB, and SAS has something to do with their use in statistics and scientific computing.

### Trans Women

#### Top Languages

| | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 |
| #1 | Erlang (1.2%) | Rust (1.2%) | Rust (1.9%) | Rust (1.7%) | APL (4.1%) | APL (4.2%) |
| #2 | Rust (1.1%) | Erlang (1.1%) | WebAssembly (1.7%) | Haskell (1.2%) | Haskell (2.5%) | Crystal (2.9%) |
| #3 | Haskell (1.0%) | Lua (1.1%) | Elixir (1.4%) | Assembly (1.1%) | COBOL (2.3%) | Lua (2.8%) |
| #4 | Julia (0.9%) | Haskell (1.0%) | Clojure (1.3%) | Julia (1.0%) | LISP (2.2%) | OCaml (2.7%) |
| #5 | Dart (0.8%) | Hack (0.7%) | F# (1.1%) | Perl (1.0%) | Erlang (2.1%) | Haskell (2.7%) |

#### Yearly Proportion Estimates

<details>
    <summary>2017</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/prog-lang-gender/2017/trans-women-graph.png" width="900" alt="Point-and-error-bar chart showing the estimated share of trans women among users of each programming language in 2017, ordered from highest to lowest, with 94 percent credible intervals.">
        </figure>
    </div>
</details>


<details>
    <summary>2018</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/prog-lang-gender/2018/trans-women-graph.png" width="900" alt="Point-and-error-bar chart showing the estimated share of trans women among users of each programming language in 2018, ordered from highest to lowest, with 94 percent credible intervals.">
        </figure>
</div>
</details>


<details>
    <summary>2019</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/prog-lang-gender/2019/trans-women-graph.png" width="900" alt="Point-and-error-bar chart showing the estimated share of trans women among users of each programming language in 2019, ordered from highest to lowest, with 94 percent credible intervals.">
        </figure>
    </div>
</details>

<details>
    <summary>2020</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/prog-lang-gender/2020/trans-women-graph.png" width="900" alt="Point-and-error-bar chart showing the estimated share of trans women among users of each programming language in 2020, ordered from highest to lowest, with 94 percent credible intervals.">
        </figure>
    </div>
</details>

<details>
    <summary>2021</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/prog-lang-gender/2021/trans-women-graph.png" width="900" alt="Point-and-error-bar chart showing the estimated share of trans women among users of each programming language in 2021, ordered from highest to lowest, with 94 percent credible intervals.">
        </figure>
    </div>
</details>

<details>
    <summary>2022</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/prog-lang-gender/2022/trans-women-graph.png" width="900" alt="Point-and-error-bar chart showing the estimated share of trans women among users of each programming language in 2022, ordered from highest to lowest, with 94 percent credible intervals.">
        </figure>
    </div>
</details>

#### Summary

Rust does seem to live up to its reputation. It ranks in the top two from 2017 through 2020, and is #1 for three years in a row. Haskell and Erlang also show up quite a bit, along with Clojure and Julia.

APL is even stranger. More than 4% of its respondents were trans women in both 2021 and 2022, compared with around 1–2% for Rust in the earlier years.
While APL has small sample sizes, the hierarchical model already shrinks extreme values toward the global mean, so the large estimates should still be indicative of a real pattern.

### Trans Men

#### Top Languages

| | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 |
| #1 | Hack (0.9%) | Ocaml (0.8%) | WebAssembly (3.0%) | Julia (1.2%) | APL (7.3%) | APL (6.2%) |
| #2 | Elixir (0.8%) | Hack (0.6%) | Erlang (2.4%) | Assembly (0.7%) | Crystal (2.2%) | SAS (2.0%) |
| #3 | Julia (0.7%) | Clojure (0.5%) | F# (1.8%) | Dart (0.6%) | Erlang (1.4%) | Crystal (1.7%) |
| #4 | Clojure (0.6%) | F# (0.4%) | Clojure (1.6%) | Objective-C (0.6%) | COBOL (1.3%) | OCaml (1.4%) |
| #5 | Erlang (0.4%) | Julia (0.4%) | Elixir (1.4%) | Perl (0.6%) | F# (1.0%) | COBOL (1.2%) |

#### Yearly Proportion Estimates

<details>
    <summary>2017</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/prog-lang-gender/2017/trans-men-graph.png" width="900" alt="Point-and-error-bar chart showing the estimated share of trans men among users of each programming language in 2017, ordered from highest to lowest, with 94 percent credible intervals.">
        </figure>
    </div>
</details>


<details>
    <summary>2018</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/prog-lang-gender/2018/trans-men-graph.png" width="900" alt="Point-and-error-bar chart showing the estimated share of trans men among users of each programming language in 2018, ordered from highest to lowest, with 94 percent credible intervals.">
        </figure>
</div>
</details>


<details>
    <summary>2019</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/prog-lang-gender/2019/trans-men-graph.png" width="900" alt="Point-and-error-bar chart showing the estimated share of trans men among users of each programming language in 2019, ordered from highest to lowest, with 94 percent credible intervals.">
        </figure>
    </div>
</details>

<details>
    <summary>2020</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/prog-lang-gender/2020/trans-men-graph.png" width="900" alt="Point-and-error-bar chart showing the estimated share of trans men among users of each programming language in 2020, ordered from highest to lowest, with 94 percent credible intervals.">
        </figure>
    </div>
</details>

<details>
    <summary>2021</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/prog-lang-gender/2021/trans-men-graph.png" width="900" alt="Point-and-error-bar chart showing the estimated share of trans men among users of each programming language in 2021, ordered from highest to lowest, with 94 percent credible intervals.">
        </figure>
    </div>
</details>

<details>
    <summary>2022</summary>
    <div style="text-align: center;">
        <figure>
            <img src="/assets/images/prog-lang-gender/2022/trans-men-graph.png" width="900" alt="Point-and-error-bar chart showing the estimated share of trans men among users of each programming language in 2022, ordered from highest to lowest, with 94 percent credible intervals.">
        </figure>
    </div>
</details>

#### Summary

The rankings for trans men are less consistent, partly because they're such a small share of the survey. APL is the exception, ranking first in both 2021 (7.3%) and 2022 (6.2%). Clojure, Julia, and F# also show up repeatedly.

## What Stands Out

A few things worth noting:

- Languages used in statistics and scientific computing (e.g., R, SAS, and MATLAB) rank relatively high for cis women and low for cis men.
- Functional and functional-adjacent languages (e.g., Rust, APL, Haskell, Erlang) contain the largest shares of respondents who identify as trans women.
- APL is the most unusual result. In 2021–2022, it ranks highly not only for trans women, but also for trans men and cis women. 

So there's something to the Rust stereotype. APL, however, shows an even greater over-representation among trans women.

## Appendix: Modeling Decisions

I want to estimate, for each programming language, the proportion of users who come from each gender group. Because some languages have small sample sizes, I use statistical smoothing to avoid unstable estimates from sparse data. To do this, I use a hierarchical Dirichlet-Multinomial model.

### Likelihood (per-language count data)

For each language $\ell$, we observe counts of how many users come from each gender group:

$$k_\ell = (k_{\ell,1}, k_{\ell,2}, k_{\ell,3}, k_{\ell,4})$$

These counts are modeled as:

$$k_\ell \sim \text{Multinomial}(N_\ell, \theta_\ell)$$

where $N_\ell = \sum_g k_{\ell,g}$ and $\theta_\ell$ is the unknown vector of group proportions for that language.

### Dirichlet prior for proportions

Each language's group-distribution $\theta_\ell$ is given a Dirichlet prior: 

$$\theta_\ell \sim \text{Dirichlet}(\tau\phi)$$

This ensures all proportions are non-negative and sum to 1.

### Hierarchical structure (smoothing across languages)

Two shared parameters determine how languages relate to one another: 
- $\phi$: a global “average” distribution of gender groups across all languages
  - $\phi \sim \text{Dirichlet}(1,1,1,1)$
- $\tau$: a concentration parameter controlling similarity between languages
  - $\tau \sim \text{HalfNormal}(\sigma)$
