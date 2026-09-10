---
layout: post
title: "Factor Analysis of Kink Preferences"
date: 2025-06-18
permalink: /kink-factors/
redirect_from:
  - /kink-factor-analysis/
categories: 
section: psychometrics-practical
related:
  - /general-kink/
  - /gender-satisfaction/
  - /gender-themes/
---

In an [old tweet](https://twitter.com/Aella_Girl/status/1659045052180471808), Aella presented a factor analysis of her kink survey, identifying eight factors:

1. Power/Sadomasochism/Bondage
2. Big Boobies/Bimbos/Skirts/Pigtails
3. Romance/Kissing/Gentleness
4. Orgies/Freeuse/Anonymous Sex/Exhibitionism
5. Furries/Bestiality/Monsters
6. Body Fluids/Urine/Disgust/Scat
7. Genderplay/Futa/Gender Transforms
8. Ageplay/Incest/Age Gaps

Given that biological sex strongly influences sexual preferences, we might expect these factors to differ between men and women. For example, a BDSM factor might emphasize dominance for men and submission for women. Additionally, factors may differ between cis and trans respondents (e.g., the genderplay factor). So, it would seem inaccurate to say that there are really eight factors. But we should test this hypothesis by performing factor analyses for cis men, cis women, trans men, and trans women separately, seeing what factors arise, and then comparing them.

Within each group, I only included respondents who answered at least 12 of the 127 items. I calculated [polychoric correlations](https://en.wikipedia.org/wiki/Polychoric_correlation), used [parallel analysis](https://en.wikipedia.org/wiki/Parallel_analysis) to determine the number of factors, and applied promax rotation. I then fit a [confirmatory factor analysis](https://en.wikipedia.org/wiki/Confirmatory_factor_analysis) (CFA) using manually refined item-factor assignments.

---

## **Factor Analysis Results**  

### **Cis Men (15 Factors)**

For cis men, parallel analysis yielded 17 factors. However, when analyzing the factors, one was incoherent and another was redundant / completely subsumed by another factor, so I ended up having 15 factors.

1. **Nonhumans & Transformation** (monsters, furries, transformations)
2. **Romance & Sensuality** (romance, sensuality, makeouts)
3. **Domination & Coercion** (sadism, dominance, coercion)
4. **Incest & Ageplay** (incest, ageplay, pedophilia)
5. **Group & Public Sex** (group sex, voyeurism, exhibitionism)
6. **Bodily Filth** (scat, urine, messiness)
7. **Homosexuality** (men, gay sex, masculinity)
8. **Huge Breasts & Butts** (giant breasts/butts, implants, bimbos)
9. **Genderplay** (genderplay, sissification, futa)
10. **Toys** (pain toys, electric toys, sounding)
11. **Sexual Fluids & Breeding** (semen, creampies, breeding)
12. **Violence & Death** (violence, death, body horror)
13. **Ethnicities** (Black people, Asian people, other ethnicities)
14. **Femininity** (hyperfemininity, pigtails, skirts)
15. **Clothing & Sensation** (high heels, latex/leather, textures)

### **Cis Women (15 Factors)**

For cis women, parallel analysis yielded 15 factors:

1. **Bodily Filth & Disgust** (scat, feedism, diapers)
2. **Romance & Sensuality** (romance, sensuality, gentleness)
3. **Submission & Masochism** (submission, pain, obedience)
4. **Nonhumans & Transformation** (monsters, furries, transformations)
5. **Incest & Ageplay** (incest, ageplay, pedophilia)
6. **Genderplay** (genderplay, transformation, pegging)
7. **Cum & Masculinity** (semen, creampies, masculinity)
8. **Clothing & Sensation** (clothing, high heels, latex/leather)
9. **Ethnicities** (white people, Black people, Asian people)
10. **Women / Femininity** (women, lesbians, femininity)
11. **Huge Breasts & Butts** (giant breasts/butts, implants, bimbos)
12. **Toys** (pain toys, electric toys, sounding)
13. **Group & Public Sex** (group sex, voyeurism, free use)
14. **Horror & Violence** (blood, brutality, body horror)
15. **Nonconsent** (coercion, rapeplay, mindbreak)

### **Trans Women (13 Factors)**

For trans women, parallel analysis yielded 13 factors:

1. **Nonhumans & Transformation** (monsters, furries, transformations)
2. **Romance & Sensuality** (romance, sensuality, makeouts)
3. **Submission & Coercion** (submission, humiliation, coercion)
4. **Sexual Fluids & Group Sex** (semen, bukkake, group sex)
5. **Toys & Sensation** (latex/leather, pain toys, electric toys)
6. **Men / Masculinity** (men, gay sex, masculinity)
7. **Women & Genderplay** (women, genderplay, sissification)
8. **Incest & Ageplay** (incest, ageplay, pedophilia)
9. **Bodily Filth** (scat, urine, armpits)
10. **Huge Breasts & Butts** (giant breasts/butts, implants, bimbos)
11. **Horror & Violence** (executions, brutality, body horror)
12. **Dominance & Sadism** (giving pain, being dominant, sadomasochism)
13. **Ethnicities** (white people, Black people, Asian people)

### **Trans Men (14 Factors)**

For trans men, parallel analysis yielded 14 factors:

1. **Nonconsent** (forced breeding, rapeplay, coercion)
2. **Romance & Sensuality** (gentleness, sensuality, romance)
3. **Women / Femininity** (women, lesbians, femininity)
4. **Nonhumans & Transformation** (monsters, furries, transformations)
5. **Horror & Violence** (blood, brutality, executions)
6. **Bodily Filth & Disgust** (scat, diapers, urine)
7. **Huge Breasts & Butts** (giant breasts/butts, breast milk, implants)
8. **Submission & Masochism** (submission, pain, choking)
9. **Cum & Men** (men, semen, anal sex)
10. **Toys & Sensation** (electric toys, pain toys, textures)
11. **Genderplay** (sissification, genderplay, futa)
12. **Incest & Ageplay** (incest, ageplay, bestiality)
13. **Feminine Clothing** (skirts, pigtails, high heels)
14. **Ethnicities** (white people, Black people, Asian people)

---

## **Factor Similarities**

[Tucker's congruence coefficient](https://en.wikipedia.org/wiki/Congruence_coefficient) ($r_c$) compares the pattern of item loadings between two factors. Values closer to 1 indicate more similar patterns. For each factor below, the table reports the closest-matching factor in each other group. The matchings aren't symmetric: one factor can be another factor's closest match even when the reverse is not true.

<style>
.factor-similarity-key {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  margin: 0.8rem 0 1rem;
  color: #5c667a;
  font-size: 0.88rem;
}
.factor-similarity-key span {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}
.factor-similarity-key i {
  display: inline-block;
  width: 0.85rem;
  height: 0.85rem;
  border: 1px solid rgba(27, 31, 35, 0.16);
  border-radius: 3px;
}
.factor-similarity-table {
  margin-bottom: 1rem;
  font-size: 0.86rem;
}
.factor-similarity-table th,
.factor-similarity-table td {
  padding: 0.5rem 0.65rem;
  vertical-align: top;
}
.factor-similarity-table th[scope="row"] {
  min-width: 165px;
}
.factor-similarity-table td {
  min-width: 175px;
}
.factor-similarity-high {
  background: #dafbe1 !important;
}
.factor-similarity-fair {
  background: #fff8c5 !important;
}
.factor-similarity-limited {
  background: #ffebe9 !important;
}
</style>

<div class="factor-similarity-key" aria-label="Tucker congruence interpretation key">
  <span><i class="factor-similarity-high" aria-hidden="true"></i>≥ .95: highly congruent</span>
  <span><i class="factor-similarity-fair" aria-hidden="true"></i>.85–.94: fairly congruent</span>
  <span><i class="factor-similarity-limited" aria-hidden="true"></i>&lt; .85: limited congruence</span>
</div>

<details>
  <summary class="h3" style="margin: 16px 0 8px; line-height: 1.25;">Cis Men</summary>
  <table class="factor-similarity-table">
    <thead>
      <tr>
        <th scope="col">Cis Men factor</th>
        <th scope="col">Closest Cis Women factor</th>
        <th scope="col">Closest Trans Men factor</th>
        <th scope="col">Closest Trans Women factor</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Nonhumans &amp; Transformation</th>
        <td class="factor-similarity-high">Nonhumans &amp; Transformation (0.974)</td>
        <td class="factor-similarity-high">Nonhumans &amp; Transformation (0.988)</td>
        <td class="factor-similarity-high">Nonhumans &amp; Transformation (0.981)</td>
      </tr>
      <tr>
        <th scope="row">Romance &amp; Sensuality</th>
        <td class="factor-similarity-high">Romance &amp; Sensuality (0.999)</td>
        <td class="factor-similarity-high">Romance &amp; Sensuality (0.999)</td>
        <td class="factor-similarity-high">Romance &amp; Sensuality (1.000)</td>
      </tr>
      <tr>
        <th scope="row">Domination &amp; Coercion</th>
        <td class="factor-similarity-fair">Nonconsent (0.850)</td>
        <td class="factor-similarity-limited">Nonconsent (0.685)</td>
        <td class="factor-similarity-high">Submission &amp; Coercion (0.978)</td>
      </tr>
      <tr>
        <th scope="row">Incest &amp; Ageplay</th>
        <td class="factor-similarity-high">Incest &amp; Ageplay (0.989)</td>
        <td class="factor-similarity-high">Incest &amp; Ageplay (0.992)</td>
        <td class="factor-similarity-high">Incest &amp; Ageplay (0.995)</td>
      </tr>
      <tr>
        <th scope="row">Group &amp; Public Sex</th>
        <td class="factor-similarity-fair">Group &amp; Public Sex (0.933)</td>
        <td class="factor-similarity-limited">Nonconsent (0.658)</td>
        <td class="factor-similarity-fair">Sexual Fluids &amp; Group Sex (0.908)</td>
      </tr>
      <tr>
        <th scope="row">Bodily Filth</th>
        <td class="factor-similarity-high">Bodily Filth &amp; Disgust (0.959)</td>
        <td class="factor-similarity-high">Bodily Filth &amp; Disgust (0.989)</td>
        <td class="factor-similarity-high">Bodily Filth (0.987)</td>
      </tr>
      <tr>
        <th scope="row">Homosexuality</th>
        <td class="factor-similarity-limited">Genderplay (0.113)</td>
        <td class="factor-similarity-limited">Cum &amp; Men (0.763)</td>
        <td class="factor-similarity-fair">Men / Masculinity (0.928)</td>
      </tr>
      <tr>
        <th scope="row">Huge Breasts &amp; Butts</th>
        <td class="factor-similarity-high">Huge Breasts &amp; Butts (0.959)</td>
        <td class="factor-similarity-fair">Huge Breasts &amp; Butts (0.918)</td>
        <td class="factor-similarity-fair">Huge Breasts &amp; Butts (0.948)</td>
      </tr>
      <tr>
        <th scope="row">Genderplay</th>
        <td class="factor-similarity-limited">Genderplay (0.825)</td>
        <td class="factor-similarity-fair">Genderplay (0.904)</td>
        <td class="factor-similarity-limited">Women &amp; Genderplay (0.844)</td>
      </tr>
      <tr>
        <th scope="row">Toys</th>
        <td class="factor-similarity-high">Toys (0.974)</td>
        <td class="factor-similarity-fair">Toys &amp; Sensation (0.870)</td>
        <td class="factor-similarity-limited">Toys &amp; Sensation (0.830)</td>
      </tr>
      <tr>
        <th scope="row">Sexual Fluids &amp; Breeding</th>
        <td class="factor-similarity-fair">Cum &amp; Masculinity (0.935)</td>
        <td class="factor-similarity-limited">Cum &amp; Men (0.835)</td>
        <td class="factor-similarity-limited">Sexual Fluids &amp; Group Sex (0.391)</td>
      </tr>
      <tr>
        <th scope="row">Violence &amp; Death</th>
        <td class="factor-similarity-fair">Horror &amp; Violence (0.941)</td>
        <td class="factor-similarity-high">Horror &amp; Violence (0.951)</td>
        <td class="factor-similarity-high">Horror &amp; Violence (0.976)</td>
      </tr>
      <tr>
        <th scope="row">Ethnicities</th>
        <td class="factor-similarity-high">Ethnicities (0.973)</td>
        <td class="factor-similarity-fair">Ethnicities (0.933)</td>
        <td class="factor-similarity-high">Ethnicities (0.957)</td>
      </tr>
      <tr>
        <th scope="row">Femininity</th>
        <td class="factor-similarity-limited">Women / Femininity (0.799)</td>
        <td class="factor-similarity-limited">Feminine Clothing (0.799)</td>
        <td class="factor-similarity-limited">Women &amp; Genderplay (0.593)</td>
      </tr>
      <tr>
        <th scope="row">Clothing &amp; Sensation</th>
        <td class="factor-similarity-fair">Clothing &amp; Sensation (0.890)</td>
        <td class="factor-similarity-limited">Feminine Clothing (0.754)</td>
        <td class="factor-similarity-limited">Toys &amp; Sensation (0.703)</td>
      </tr>
    </tbody>
  </table>
</details>

<details>
  <summary class="h3" style="margin: 16px 0 8px; line-height: 1.25;">Cis Women</summary>
  <table class="factor-similarity-table">
    <thead>
      <tr>
        <th scope="col">Cis Women factor</th>
        <th scope="col">Closest Cis Men factor</th>
        <th scope="col">Closest Trans Men factor</th>
        <th scope="col">Closest Trans Women factor</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Bodily Filth &amp; Disgust</th>
        <td class="factor-similarity-high">Bodily Filth (0.959)</td>
        <td class="factor-similarity-high">Bodily Filth &amp; Disgust (0.953)</td>
        <td class="factor-similarity-fair">Bodily Filth (0.927)</td>
      </tr>
      <tr>
        <th scope="row">Romance &amp; Sensuality</th>
        <td class="factor-similarity-high">Romance &amp; Sensuality (0.999)</td>
        <td class="factor-similarity-high">Romance &amp; Sensuality (0.999)</td>
        <td class="factor-similarity-high">Romance &amp; Sensuality (0.999)</td>
      </tr>
      <tr>
        <th scope="row">Submission &amp; Masochism</th>
        <td class="factor-similarity-limited">Domination &amp; Coercion (0.730)</td>
        <td class="factor-similarity-fair">Submission &amp; Masochism (0.929)</td>
        <td class="factor-similarity-limited">Submission &amp; Coercion (0.814)</td>
      </tr>
      <tr>
        <th scope="row">Nonhumans &amp; Transformation</th>
        <td class="factor-similarity-high">Nonhumans &amp; Transformation (0.974)</td>
        <td class="factor-similarity-high">Nonhumans &amp; Transformation (0.984)</td>
        <td class="factor-similarity-high">Nonhumans &amp; Transformation (0.988)</td>
      </tr>
      <tr>
        <th scope="row">Incest &amp; Ageplay</th>
        <td class="factor-similarity-high">Incest &amp; Ageplay (0.989)</td>
        <td class="factor-similarity-high">Incest &amp; Ageplay (0.988)</td>
        <td class="factor-similarity-fair">Incest &amp; Ageplay (0.948)</td>
      </tr>
      <tr>
        <th scope="row">Genderplay</th>
        <td class="factor-similarity-limited">Genderplay (0.825)</td>
        <td class="factor-similarity-limited">Genderplay (0.821)</td>
        <td class="factor-similarity-limited">Women &amp; Genderplay (0.771)</td>
      </tr>
      <tr>
        <th scope="row">Cum &amp; Masculinity</th>
        <td class="factor-similarity-fair">Sexual Fluids &amp; Breeding (0.935)</td>
        <td class="factor-similarity-fair">Cum &amp; Men (0.915)</td>
        <td class="factor-similarity-fair">Sexual Fluids &amp; Group Sex (0.915)</td>
      </tr>
      <tr>
        <th scope="row">Clothing &amp; Sensation</th>
        <td class="factor-similarity-fair">Clothing &amp; Sensation (0.890)</td>
        <td class="factor-similarity-fair">Feminine Clothing (0.932)</td>
        <td class="factor-similarity-limited">Toys &amp; Sensation (0.616)</td>
      </tr>
      <tr>
        <th scope="row">Ethnicities</th>
        <td class="factor-similarity-high">Ethnicities (0.973)</td>
        <td class="factor-similarity-high">Ethnicities (0.990)</td>
        <td class="factor-similarity-high">Ethnicities (0.981)</td>
      </tr>
      <tr>
        <th scope="row">Women / Femininity</th>
        <td class="factor-similarity-limited">Femininity (0.799)</td>
        <td class="factor-similarity-high">Women / Femininity (0.985)</td>
        <td class="factor-similarity-limited">Women &amp; Genderplay (0.512)</td>
      </tr>
      <tr>
        <th scope="row">Huge Breasts &amp; Butts</th>
        <td class="factor-similarity-high">Huge Breasts &amp; Butts (0.959)</td>
        <td class="factor-similarity-fair">Huge Breasts &amp; Butts (0.850)</td>
        <td class="factor-similarity-fair">Huge Breasts &amp; Butts (0.901)</td>
      </tr>
      <tr>
        <th scope="row">Toys</th>
        <td class="factor-similarity-high">Toys (0.974)</td>
        <td class="factor-similarity-fair">Toys &amp; Sensation (0.872)</td>
        <td class="factor-similarity-limited">Toys &amp; Sensation (0.773)</td>
      </tr>
      <tr>
        <th scope="row">Group &amp; Public Sex</th>
        <td class="factor-similarity-fair">Group &amp; Public Sex (0.933)</td>
        <td class="factor-similarity-limited">Nonconsent (0.735)</td>
        <td class="factor-similarity-limited">Sexual Fluids &amp; Group Sex (0.807)</td>
      </tr>
      <tr>
        <th scope="row">Horror &amp; Violence</th>
        <td class="factor-similarity-fair">Violence &amp; Death (0.941)</td>
        <td class="factor-similarity-high">Horror &amp; Violence (0.968)</td>
        <td class="factor-similarity-high">Horror &amp; Violence (0.954)</td>
      </tr>
      <tr>
        <th scope="row">Nonconsent</th>
        <td class="factor-similarity-fair">Domination &amp; Coercion (0.850)</td>
        <td class="factor-similarity-fair">Nonconsent (0.900)</td>
        <td class="factor-similarity-limited">Submission &amp; Coercion (0.747)</td>
      </tr>
    </tbody>
  </table>
</details>

<details>
  <summary class="h3" style="margin: 16px 0 8px; line-height: 1.25;">Trans Women</summary>
  <table class="factor-similarity-table">
    <thead>
      <tr>
        <th scope="col">Trans Women factor</th>
        <th scope="col">Closest Cis Men factor</th>
        <th scope="col">Closest Cis Women factor</th>
        <th scope="col">Closest Trans Men factor</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Nonhumans &amp; Transformation</th>
        <td class="factor-similarity-high">Nonhumans &amp; Transformation (0.981)</td>
        <td class="factor-similarity-high">Nonhumans &amp; Transformation (0.988)</td>
        <td class="factor-similarity-high">Nonhumans &amp; Transformation (0.987)</td>
      </tr>
      <tr>
        <th scope="row">Romance &amp; Sensuality</th>
        <td class="factor-similarity-high">Romance &amp; Sensuality (1.000)</td>
        <td class="factor-similarity-high">Romance &amp; Sensuality (0.999)</td>
        <td class="factor-similarity-high">Romance &amp; Sensuality (1.000)</td>
      </tr>
      <tr>
        <th scope="row">Submission &amp; Coercion</th>
        <td class="factor-similarity-high">Domination &amp; Coercion (0.978)</td>
        <td class="factor-similarity-limited">Submission &amp; Masochism (0.814)</td>
        <td class="factor-similarity-limited">Submission &amp; Masochism (0.764)</td>
      </tr>
      <tr>
        <th scope="row">Sexual Fluids &amp; Group Sex</th>
        <td class="factor-similarity-fair">Group &amp; Public Sex (0.908)</td>
        <td class="factor-similarity-limited">Group &amp; Public Sex (0.807)</td>
        <td class="factor-similarity-fair">Cum &amp; Men (0.874)</td>
      </tr>
      <tr>
        <th scope="row">Toys &amp; Sensation</th>
        <td class="factor-similarity-limited">Toys (0.830)</td>
        <td class="factor-similarity-limited">Toys (0.773)</td>
        <td class="factor-similarity-fair">Toys &amp; Sensation (0.905)</td>
      </tr>
      <tr>
        <th scope="row">Men / Masculinity</th>
        <td class="factor-similarity-fair">Homosexuality (0.928)</td>
        <td class="factor-similarity-limited">Women / Femininity (0.387)</td>
        <td class="factor-similarity-fair">Cum &amp; Men (0.899)</td>
      </tr>
      <tr>
        <th scope="row">Women &amp; Genderplay</th>
        <td class="factor-similarity-limited">Genderplay (0.844)</td>
        <td class="factor-similarity-limited">Genderplay (0.771)</td>
        <td class="factor-similarity-limited">Genderplay (0.669)</td>
      </tr>
      <tr>
        <th scope="row">Incest &amp; Ageplay</th>
        <td class="factor-similarity-high">Incest &amp; Ageplay (0.995)</td>
        <td class="factor-similarity-fair">Incest &amp; Ageplay (0.948)</td>
        <td class="factor-similarity-high">Incest &amp; Ageplay (0.965)</td>
      </tr>
      <tr>
        <th scope="row">Bodily Filth</th>
        <td class="factor-similarity-high">Bodily Filth (0.987)</td>
        <td class="factor-similarity-fair">Bodily Filth &amp; Disgust (0.927)</td>
        <td class="factor-similarity-high">Bodily Filth &amp; Disgust (0.988)</td>
      </tr>
      <tr>
        <th scope="row">Huge Breasts &amp; Butts</th>
        <td class="factor-similarity-fair">Huge Breasts &amp; Butts (0.948)</td>
        <td class="factor-similarity-fair">Huge Breasts &amp; Butts (0.901)</td>
        <td class="factor-similarity-fair">Huge Breasts &amp; Butts (0.895)</td>
      </tr>
      <tr>
        <th scope="row">Horror &amp; Violence</th>
        <td class="factor-similarity-high">Violence &amp; Death (0.976)</td>
        <td class="factor-similarity-high">Horror &amp; Violence (0.954)</td>
        <td class="factor-similarity-fair">Horror &amp; Violence (0.909)</td>
      </tr>
      <tr>
        <th scope="row">Dominance &amp; Sadism</th>
        <td class="factor-similarity-fair">Domination &amp; Coercion (0.901)</td>
        <td class="factor-similarity-fair">Genderplay (0.902)</td>
        <td class="factor-similarity-limited">Submission &amp; Masochism (0.355)</td>
      </tr>
      <tr>
        <th scope="row">Ethnicities</th>
        <td class="factor-similarity-high">Ethnicities (0.957)</td>
        <td class="factor-similarity-high">Ethnicities (0.981)</td>
        <td class="factor-similarity-high">Ethnicities (0.988)</td>
      </tr>
    </tbody>
  </table>
</details>

<details>
  <summary class="h3" style="margin: 16px 0 8px; line-height: 1.25;">Trans Men</summary>
  <table class="factor-similarity-table">
    <thead>
      <tr>
        <th scope="col">Trans Men factor</th>
        <th scope="col">Closest Cis Men factor</th>
        <th scope="col">Closest Cis Women factor</th>
        <th scope="col">Closest Trans Women factor</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Nonconsent</th>
        <td class="factor-similarity-limited">Domination &amp; Coercion (0.685)</td>
        <td class="factor-similarity-fair">Nonconsent (0.900)</td>
        <td class="factor-similarity-limited">Submission &amp; Coercion (0.639)</td>
      </tr>
      <tr>
        <th scope="row">Romance &amp; Sensuality</th>
        <td class="factor-similarity-high">Romance &amp; Sensuality (0.999)</td>
        <td class="factor-similarity-high">Romance &amp; Sensuality (0.999)</td>
        <td class="factor-similarity-high">Romance &amp; Sensuality (1.000)</td>
      </tr>
      <tr>
        <th scope="row">Women / Femininity</th>
        <td class="factor-similarity-limited">Femininity (0.836)</td>
        <td class="factor-similarity-high">Women / Femininity (0.985)</td>
        <td class="factor-similarity-limited">Women &amp; Genderplay (0.486)</td>
      </tr>
      <tr>
        <th scope="row">Nonhumans &amp; Transformation</th>
        <td class="factor-similarity-high">Nonhumans &amp; Transformation (0.988)</td>
        <td class="factor-similarity-high">Nonhumans &amp; Transformation (0.984)</td>
        <td class="factor-similarity-high">Nonhumans &amp; Transformation (0.987)</td>
      </tr>
      <tr>
        <th scope="row">Horror &amp; Violence</th>
        <td class="factor-similarity-high">Violence &amp; Death (0.951)</td>
        <td class="factor-similarity-high">Horror &amp; Violence (0.968)</td>
        <td class="factor-similarity-fair">Horror &amp; Violence (0.909)</td>
      </tr>
      <tr>
        <th scope="row">Bodily Filth &amp; Disgust</th>
        <td class="factor-similarity-high">Bodily Filth (0.989)</td>
        <td class="factor-similarity-high">Bodily Filth &amp; Disgust (0.953)</td>
        <td class="factor-similarity-high">Bodily Filth (0.988)</td>
      </tr>
      <tr>
        <th scope="row">Huge Breasts &amp; Butts</th>
        <td class="factor-similarity-fair">Huge Breasts &amp; Butts (0.918)</td>
        <td class="factor-similarity-fair">Huge Breasts &amp; Butts (0.850)</td>
        <td class="factor-similarity-fair">Huge Breasts &amp; Butts (0.895)</td>
      </tr>
      <tr>
        <th scope="row">Submission &amp; Masochism</th>
        <td class="factor-similarity-limited">Domination &amp; Coercion (0.730)</td>
        <td class="factor-similarity-fair">Submission &amp; Masochism (0.929)</td>
        <td class="factor-similarity-limited">Submission &amp; Coercion (0.764)</td>
      </tr>
      <tr>
        <th scope="row">Cum &amp; Men</th>
        <td class="factor-similarity-limited">Homosexuality (0.763)</td>
        <td class="factor-similarity-fair">Cum &amp; Masculinity (0.915)</td>
        <td class="factor-similarity-fair">Men / Masculinity (0.899)</td>
      </tr>
      <tr>
        <th scope="row">Toys &amp; Sensation</th>
        <td class="factor-similarity-fair">Toys (0.870)</td>
        <td class="factor-similarity-fair">Toys (0.872)</td>
        <td class="factor-similarity-fair">Toys &amp; Sensation (0.905)</td>
      </tr>
      <tr>
        <th scope="row">Genderplay</th>
        <td class="factor-similarity-fair">Genderplay (0.904)</td>
        <td class="factor-similarity-limited">Genderplay (0.821)</td>
        <td class="factor-similarity-limited">Women &amp; Genderplay (0.669)</td>
      </tr>
      <tr>
        <th scope="row">Incest &amp; Ageplay</th>
        <td class="factor-similarity-high">Incest &amp; Ageplay (0.992)</td>
        <td class="factor-similarity-high">Incest &amp; Ageplay (0.988)</td>
        <td class="factor-similarity-high">Incest &amp; Ageplay (0.965)</td>
      </tr>
      <tr>
        <th scope="row">Feminine Clothing</th>
        <td class="factor-similarity-limited">Femininity (0.799)</td>
        <td class="factor-similarity-fair">Clothing &amp; Sensation (0.932)</td>
        <td class="factor-similarity-limited">Women &amp; Genderplay (0.039)</td>
      </tr>
      <tr>
        <th scope="row">Ethnicities</th>
        <td class="factor-similarity-fair">Ethnicities (0.933)</td>
        <td class="factor-similarity-high">Ethnicities (0.990)</td>
        <td class="factor-similarity-high">Ethnicities (0.988)</td>
      </tr>
    </tbody>
  </table>
</details>

The most consistent factors across groups are Romance & Sensuality ($r_c = .999-1.000$), Nonhumans & Transformation ($r_c = .974-.988$), and Incest & Ageplay ($r_c = .948-.995$). Bodily Filth/Disgust ($r_c = .927-.989$), Ethnicities ($r_c = .933-.990$), and Horror/Violence ($r_c = .909-.976$) are also consistently recognizable, though their exact compositions vary somewhat. The largest cross-group differences involve gendered attraction, BDSM, group sex, sexual fluids, clothing, and sensation.

---

## **Higher-Order Factor Correlations**  

Since the factors are themselves correlated, I performed a second factor analysis to determine how strongly each factor loads onto a hypothetical "general kink" factor. A major problem is that all the items are 'facing' the same direction. This means we can't determine how much of the observed positive manifold is due to acquiescence bias versus an actual general kinkiness that influences all items. So, when looking at the general kink loadings, remember that they are most likely inflated.

<style>
.higher-order-layout {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(15rem, 1fr);
  gap: 1.25rem;
  align-items: start;
  margin: 1rem 0;
}
.higher-order-layout figure {
  margin: 0;
}
.higher-order-layout img {
  width: 100%;
  height: auto;
}
.higher-order-loadings h4 {
  margin: 0 0 0.5rem;
}
.higher-order-loadings ul {
  margin: 0;
  padding-left: 1.15rem;
  font-size: 0.9rem;
  line-height: 1.35;
}
.higher-order-loadings li {
  margin: 0.2rem 0;
}
@media (max-width: 900px) {
  .higher-order-layout {
    grid-template-columns: 1fr;
  }
  .higher-order-loadings ul {
    columns: 2;
    column-gap: 2rem;
  }
  .higher-order-loadings li {
    break-inside: avoid;
  }
}
@media (max-width: 600px) {
  .higher-order-loadings ul {
    columns: 1;
  }
}
</style>

<details>
  <summary class="h3" style="margin: 16px 0 8px; line-height: 1.25;">Cis Men</summary>
  <div class="higher-order-layout">
    <figure>
      <img src="/assets/images/kink-factors/cis_men/cfa_factor_correlations.png" loading="lazy" alt="CFA factor-correlation matrix for Cis Men.">
    </figure>
    <div class="higher-order-loadings">
      <h4>General-kink loadings</h4>
      <ul>
        <li>Sexual Fluids &amp; Breeding (0.837)</li>
        <li>Toys (0.818)</li>
        <li>Domination &amp; Coercion (0.789)</li>
        <li>Nonhumans &amp; Transformation (0.771)</li>
        <li>Clothing &amp; Sensation (0.760)</li>
        <li>Group &amp; Public Sex (0.759)</li>
        <li>Bodily Filth (0.717)</li>
        <li>Violence &amp; Death (0.714)</li>
        <li>Incest &amp; Ageplay (0.709)</li>
        <li>Genderplay (0.703)</li>
        <li>Femininity (0.689)</li>
        <li>Huge Breasts &amp; Butts (0.682)</li>
        <li>Ethnicities (0.597)</li>
        <li>Homosexuality (0.461)</li>
        <li>Romance &amp; Sensuality (0.405)</li>
      </ul>
    </div>
  </div>
</details>

<details>
  <summary class="h3" style="margin: 16px 0 8px; line-height: 1.25;">Cis Women</summary>
  <div class="higher-order-layout">
    <figure>
      <img src="/assets/images/kink-factors/cis_women/cfa_factor_correlations.png" loading="lazy" alt="CFA factor-correlation matrix for Cis Women.">
    </figure>
    <div class="higher-order-loadings">
      <h4>General-kink loadings</h4>
      <ul>
        <li>Clothing &amp; Sensation (0.858)</li>
        <li>Toys (0.853)</li>
        <li>Group &amp; Public Sex (0.840)</li>
        <li>Huge Breasts &amp; Butts (0.816)</li>
        <li>Nonconsent (0.807)</li>
        <li>Genderplay (0.805)</li>
        <li>Horror &amp; Violence (0.785)</li>
        <li>Nonhumans &amp; Transformation (0.762)</li>
        <li>Incest &amp; Ageplay (0.751)</li>
        <li>Submission &amp; Masochism (0.739)</li>
        <li>Bodily Filth &amp; Disgust (0.736)</li>
        <li>Cum &amp; Masculinity (0.697)</li>
        <li>Ethnicities (0.648)</li>
        <li>Women / Femininity (0.621)</li>
        <li>Romance &amp; Sensuality (0.336)</li>
      </ul>
    </div>
  </div>
</details>

<details>
  <summary class="h3" style="margin: 16px 0 8px; line-height: 1.25;">Trans Men</summary>
  <div class="higher-order-layout">
    <figure>
      <img src="/assets/images/kink-factors/trans_men/cfa_factor_correlations.png" loading="lazy" alt="CFA factor-correlation matrix for Trans Men.">
    </figure>
    <div class="higher-order-loadings">
      <h4>General-kink loadings</h4>
      <ul>
        <li>Feminine Clothing (0.854)</li>
        <li>Genderplay (0.849)</li>
        <li>Nonconsent (0.801)</li>
        <li>Toys &amp; Sensation (0.783)</li>
        <li>Cum &amp; Men (0.782)</li>
        <li>Submission &amp; Masochism (0.764)</li>
        <li>Incest &amp; Ageplay (0.756)</li>
        <li>Horror &amp; Violence (0.725)</li>
        <li>Nonhumans &amp; Transformation (0.714)</li>
        <li>Bodily Filth &amp; Disgust (0.697)</li>
        <li>Ethnicities (0.658)</li>
        <li>Women / Femininity (0.656)</li>
        <li>Huge Breasts &amp; Butts (0.634)</li>
        <li>Romance &amp; Sensuality (0.423)</li>
      </ul>
    </div>
  </div>
</details>

<details>
  <summary class="h3" style="margin: 16px 0 8px; line-height: 1.25;">Trans Women</summary>
  <div class="higher-order-layout">
    <figure>
      <img src="/assets/images/kink-factors/trans_women/cfa_factor_correlations.png" loading="lazy" alt="CFA factor-correlation matrix for Trans Women.">
    </figure>
    <div class="higher-order-loadings">
      <h4>General-kink loadings</h4>
      <ul>
        <li>Sexual Fluids &amp; Group Sex (0.881)</li>
        <li>Toys &amp; Sensation (0.864)</li>
        <li>Submission &amp; Coercion (0.806)</li>
        <li>Women &amp; Genderplay (0.804)</li>
        <li>Huge Breasts &amp; Butts (0.800)</li>
        <li>Bodily Filth (0.800)</li>
        <li>Horror &amp; Violence (0.795)</li>
        <li>Nonhumans &amp; Transformation (0.780)</li>
        <li>Ethnicities (0.724)</li>
        <li>Incest &amp; Ageplay (0.706)</li>
        <li>Men / Masculinity (0.677)</li>
        <li>Dominance &amp; Sadism (0.596)</li>
        <li>Romance &amp; Sensuality (0.447)</li>
      </ul>
    </div>
  </div>
</details>

The loading patterns seem to align with intuition: factors loading weakly on the general kink factor (e.g. Romance & Sensuality, Homosexuality) are less likely to be labeled as “kinks” than factors loading strongly (e.g. Toys, Group & Public Sex). We can't say much though, since our inability to extract an acquiescence factor means all the items are a bit contaminated.

---

## **Visualizations**

The following plots are what I call "Tailcalled diagrams". We create a standardized (mean=0, SD=1) latent variable summarizing the displayed items in the bottom of the plot. The rows below the histogram show the median response to each question for a given level of the latent variable.

<style>
.kink-arousal-key {
  display: inline-grid;
  grid-template-columns: 0.85rem auto;
  align-items: center;
  gap: 0.35rem 0.6rem;
  margin: 0.65rem 0 0.75rem;
  padding: 0.75rem 1rem;
  color: #24292f;
  font-size: 0.9rem;
  line-height: 1.25;
  background: #f6f8fa;
  border: 1px solid #d0d7de;
  border-radius: 6px;
}
.kink-arousal-key strong {
  grid-column: 1 / -1;
  margin-bottom: 0.15rem;
  font-size: 0.85rem;
  letter-spacing: 0.02em;
}
.kink-arousal-key i {
  display: inline-block;
  width: 0.85rem;
  height: 0.85rem;
  border: 1px solid rgba(27, 31, 35, 0.18);
  border-radius: 3px;
}
</style>

<div class="kink-arousal-key" aria-label="Tailcalled diagram response-color key">
  <strong>Response scale</strong>
  <i style="background: #a50026;" aria-hidden="true"></i><span>Not arousing</span>
  <i style="background: #f46d43;" aria-hidden="true"></i><span>Slightly arousing</span>
  <i style="background: #fee08b;" aria-hidden="true"></i><span>Somewhat arousing</span>
  <i style="background: #d9ef8b;" aria-hidden="true"></i><span>Moderately arousing</span>
  <i style="background: #66bd63;" aria-hidden="true"></i><span>Very arousing</span>
  <i style="background: #006837;" aria-hidden="true"></i><span>Extremely arousing</span>
</div>

<details>
  <summary class="h3" style="margin: 16px 0 8px; line-height: 1.25;">Cis Men</summary>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Nonhumans & Transformation</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_men/nonhumans_transformation.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Men: Nonhumans & Transformation.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Romance & Sensuality</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_men/romance_sensuality.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Men: Romance & Sensuality.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Domination & Coercion</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_men/domination_coercion.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Men: Domination & Coercion.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Incest & Ageplay</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_men/incest_ageplay.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Men: Incest & Ageplay.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Group & Public Sex</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_men/group_public_sex.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Men: Group & Public Sex.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Bodily Filth</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_men/bodily_filth.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Men: Bodily Filth.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Homosexuality</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_men/homosexuality.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Men: Homosexuality.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Huge Breasts & Butts</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_men/huge_breasts_butts.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Men: Huge Breasts & Butts.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Genderplay</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_men/genderplay.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Men: Genderplay.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Toys</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_men/toys.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Men: Toys.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Sexual Fluids & Breeding</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_men/sexual_fluids_breeding.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Men: Sexual Fluids & Breeding.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Violence & Death</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_men/violence_death.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Men: Violence & Death.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Ethnicities</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_men/ethnicities.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Men: Ethnicities.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Femininity</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_men/femininity.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Men: Femininity.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Clothing & Sensation</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_men/clothing_sensation.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Men: Clothing & Sensation.">
  </figure>
</details>

</details>

<details>
  <summary class="h3" style="margin: 16px 0 8px; line-height: 1.25;">Cis Women</summary>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Bodily Filth & Disgust</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_women/bodily_filth_disgust.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Women: Bodily Filth & Disgust.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Romance & Sensuality</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_women/romance_sensuality.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Women: Romance & Sensuality.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Submission & Masochism</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_women/submission_masochism.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Women: Submission & Masochism.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Nonhumans & Transformation</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_women/nonhumans_transformation.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Women: Nonhumans & Transformation.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Incest & Ageplay</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_women/incest_ageplay.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Women: Incest & Ageplay.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Genderplay</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_women/genderplay.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Women: Genderplay.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Cum & Masculinity</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_women/cum_masculinity.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Women: Cum & Masculinity.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Clothing & Sensation</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_women/clothing_sensation.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Women: Clothing & Sensation.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Ethnicities</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_women/ethnicities.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Women: Ethnicities.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Women / Femininity</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_women/women_femininity.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Women: Women / Femininity.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Huge Breasts & Butts</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_women/huge_breasts_butts.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Women: Huge Breasts & Butts.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Toys</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_women/toys.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Women: Toys.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Group & Public Sex</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_women/group_public_sex.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Women: Group & Public Sex.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Horror & Violence</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_women/horror_violence.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Women: Horror & Violence.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Nonconsent</summary>
  <figure>
    <img src="/assets/images/kink-factors/cis_women/nonconsent.png" width="700" loading="lazy" alt="Tailcalled diagram for Cis Women: Nonconsent.">
  </figure>
</details>

</details>

<details>
  <summary class="h3" style="margin: 16px 0 8px; line-height: 1.25;">Trans Women</summary>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Nonhumans & Transformation</summary>
  <figure>
    <img src="/assets/images/kink-factors/trans_women/nonhumans_transformation.png" width="700" loading="lazy" alt="Tailcalled diagram for Trans Women: Nonhumans & Transformation.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Romance & Sensuality</summary>
  <figure>
    <img src="/assets/images/kink-factors/trans_women/romance_sensuality.png" width="700" loading="lazy" alt="Tailcalled diagram for Trans Women: Romance & Sensuality.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Submission & Coercion</summary>
  <figure>
    <img src="/assets/images/kink-factors/trans_women/submission_coercion.png" width="700" loading="lazy" alt="Tailcalled diagram for Trans Women: Submission & Coercion.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Sexual Fluids & Group Sex</summary>
  <figure>
    <img src="/assets/images/kink-factors/trans_women/sexual_fluids_group_sex.png" width="700" loading="lazy" alt="Tailcalled diagram for Trans Women: Sexual Fluids & Group Sex.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Toys & Sensation</summary>
  <figure>
    <img src="/assets/images/kink-factors/trans_women/toys_sensation.png" width="700" loading="lazy" alt="Tailcalled diagram for Trans Women: Toys & Sensation.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Men / Masculinity</summary>
  <figure>
    <img src="/assets/images/kink-factors/trans_women/men_masculinity.png" width="700" loading="lazy" alt="Tailcalled diagram for Trans Women: Men / Masculinity.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Women & Genderplay</summary>
  <figure>
    <img src="/assets/images/kink-factors/trans_women/women_genderplay.png" width="700" loading="lazy" alt="Tailcalled diagram for Trans Women: Women & Genderplay.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Incest & Ageplay</summary>
  <figure>
    <img src="/assets/images/kink-factors/trans_women/incest_ageplay.png" width="700" loading="lazy" alt="Tailcalled diagram for Trans Women: Incest & Ageplay.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Bodily Filth</summary>
  <figure>
    <img src="/assets/images/kink-factors/trans_women/bodily_filth.png" width="700" loading="lazy" alt="Tailcalled diagram for Trans Women: Bodily Filth.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Huge Breasts & Butts</summary>
  <figure>
    <img src="/assets/images/kink-factors/trans_women/huge_breasts_butts.png" width="700" loading="lazy" alt="Tailcalled diagram for Trans Women: Huge Breasts & Butts.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Horror & Violence</summary>
  <figure>
    <img src="/assets/images/kink-factors/trans_women/horror_violence.png" width="700" loading="lazy" alt="Tailcalled diagram for Trans Women: Horror & Violence.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Dominance & Sadism</summary>
  <figure>
    <img src="/assets/images/kink-factors/trans_women/dominance_sadism.png" width="700" loading="lazy" alt="Tailcalled diagram for Trans Women: Dominance & Sadism.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Ethnicities</summary>
  <figure>
    <img src="/assets/images/kink-factors/trans_women/ethnicities.png" width="700" loading="lazy" alt="Tailcalled diagram for Trans Women: Ethnicities.">
  </figure>
</details>

</details>

<details>
  <summary class="h3" style="margin: 16px 0 8px; line-height: 1.25;">Trans Men</summary>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Nonconsent</summary>
  <figure>
    <img src="/assets/images/kink-factors/trans_men/nonconsent.png" width="700" loading="lazy" alt="Tailcalled diagram for Trans Men: Nonconsent.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Romance & Sensuality</summary>
  <figure>
    <img src="/assets/images/kink-factors/trans_men/romance_sensuality.png" width="700" loading="lazy" alt="Tailcalled diagram for Trans Men: Romance & Sensuality.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Women / Femininity</summary>
  <figure>
    <img src="/assets/images/kink-factors/trans_men/women_femininity.png" width="700" loading="lazy" alt="Tailcalled diagram for Trans Men: Women / Femininity.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Nonhumans & Transformation</summary>
  <figure>
    <img src="/assets/images/kink-factors/trans_men/nonhumans_transformation.png" width="700" loading="lazy" alt="Tailcalled diagram for Trans Men: Nonhumans & Transformation.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Horror & Violence</summary>
  <figure>
    <img src="/assets/images/kink-factors/trans_men/horror_violence.png" width="700" loading="lazy" alt="Tailcalled diagram for Trans Men: Horror & Violence.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Bodily Filth & Disgust</summary>
  <figure>
    <img src="/assets/images/kink-factors/trans_men/bodily_filth_disgust.png" width="700" loading="lazy" alt="Tailcalled diagram for Trans Men: Bodily Filth & Disgust.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Huge Breasts & Butts</summary>
  <figure>
    <img src="/assets/images/kink-factors/trans_men/huge_breasts_butts.png" width="700" loading="lazy" alt="Tailcalled diagram for Trans Men: Huge Breasts & Butts.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Submission & Masochism</summary>
  <figure>
    <img src="/assets/images/kink-factors/trans_men/submission_masochism.png" width="700" loading="lazy" alt="Tailcalled diagram for Trans Men: Submission & Masochism.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Cum & Men</summary>
  <figure>
    <img src="/assets/images/kink-factors/trans_men/cum_men.png" width="700" loading="lazy" alt="Tailcalled diagram for Trans Men: Cum & Men.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Toys & Sensation</summary>
  <figure>
    <img src="/assets/images/kink-factors/trans_men/toys_sensation.png" width="700" loading="lazy" alt="Tailcalled diagram for Trans Men: Toys & Sensation.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Genderplay</summary>
  <figure>
    <img src="/assets/images/kink-factors/trans_men/genderplay.png" width="700" loading="lazy" alt="Tailcalled diagram for Trans Men: Genderplay.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Incest & Ageplay</summary>
  <figure>
    <img src="/assets/images/kink-factors/trans_men/incest_ageplay.png" width="700" loading="lazy" alt="Tailcalled diagram for Trans Men: Incest & Ageplay.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Feminine Clothing</summary>
  <figure>
    <img src="/assets/images/kink-factors/trans_men/feminine_clothing.png" width="700" loading="lazy" alt="Tailcalled diagram for Trans Men: Feminine Clothing.">
  </figure>
</details>

<details>
  <summary class="h4" style="margin: 8px 0; line-height: 1.25;">Ethnicities</summary>
  <figure>
    <img src="/assets/images/kink-factors/trans_men/ethnicities.png" width="700" loading="lazy" alt="Tailcalled diagram for Trans Men: Ethnicities.">
  </figure>
</details>

</details>

---

## **Conclusion** 

So, we can see that three of the factors Aella mentioned (Romance & Sensuality, Nonhumans & Transformation, and Incest & Ageplay) are highly consistent across gender groups. Two others (Bodily Filth/Disgust and Huge Breasts & Butts) are fairly consistent, as are two factors I found that Aella didn’t: Ethnicities and Horror & Violence. The remaining items tend to split or combine into factors differently across groups. This is an example of why we can't assume that latent factors are the same across groups.
