---
layout: post
title: "Modeling the General Kink Factor"
date: 2025-11-27
permalink: /general-kink-factor/
categories: 
---

Surveys of sexual interests frequently show a positive manifold: many items correlate positively with one another.

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/general-kink-factor/item-corr.png" width="700" alt="Alt text">
    </figure>
</div>

There are three conceptually distinct reasons this can happen.
1. First, method variance (e.g., [acquiescence](https://stanichor.net/acquiescence/)[^acquiescence], socially desirable responding, question wording) can induce spurious positive correlations across otherwise unrelated items.
2. Second, there may be a substantive general tendency toward endorsing a wide range of sexual interests. Some people may genuinely be more sexually curious and therefore endorse many different items.
3. Third, items may share domain overlap (e.g., two items tap similar kinks), producing genuine inter-item correlations that are not strictly "general."

These three sources have different implications and need to be handled differently.
- If the manifold is mainly methodological, failing to model it will inflate correlations among factors, leading to misleadingly high factor-factor correlations.
- If it is substantive, modeling it as a legitimate general factor is appropriate and will produce more informative analyses.
- If the manifold reflects domain overlap, the correct fix is to allow cross-loadings (permitting items to load on multiple factors).

Since I already allow cross-loadings and since the datasets I work with often make it difficult to test for or model methodological issues, this post will focus on modeling the general factor, whether it is substantive or methodological, that accounts for the positive manifold in sexual interest items.

There are several ways one might model the general factor of sexual interests: 
1. A general factor with equal loadings on all items. Furthermore, the general sexual interest factor may be correlated (Model 1a) or uncorrelated (Model 1b) with other specific factors.
2. A general factor with freely varying loadings. Again, this factor may be correlated (Model 2a) or uncorrelated (Model 2b) with the other specific factors.
3. A higher-order factor that influences only the lower-order factors, not individual items (Model 3).

I test these models using items from Tailcalled’s Gender Satisfaction survey. First, let’s examine the factor correlation matrix and the factor partial correlation matrix. 

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/general-kink-factor/factor-corr-base.png" width="400" alt="Alt text">
        <img src="/assets/images/general-kink-factor/partial-factor-corr-base.png" width="400" alt="Alt text">
        <figcaption>The factor correlation (left) and the factor partial correlation (right) matrices.</figcaption>
    </figure>
</div>

<details>
  <summary>BDSM Interest Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>Sexual arousal [Being treated as a slave by your partner] (0.86)</li>
      <li>Sexual arousal [Treating your partner as a slave] (0.81)</li>
      <li>Sexual arousal [Insulting or humiliating your partner] (0.79)</li>
      <li>Sexual arousal [Tying up your partner using rope] (0.78)</li>
      <li>Sexual arousal [Being treated roughly by your partner in bed, e.g. spanked, pulled hair, or shoved around] (0.76)</li>
      <li>Sexual arousal [Treating your partner roughly in bed, e.g. spanking, pulling hair or shoving them around] (0.75)</li>
      <li>Sexual arousal [Being tied up by your partner using rope] (0.75)</li>
      <li>Sexual arousal [Being insulted or humiliated by your partner] (0.72)</li>
    </ul>
  </div>
</details>

<details>
  <summary>Masculine Gender Norm Endorsement Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>Do you think being male is an important part of your personality? (0.76)</li>
      <li>Do you think it is important for men to be manly and women to be womanly? (0.71)</li>
      <li>I feel proud of being male [-] (0.69)</li>
      <li>Would you say that your personal values are linked to being male? (0.63)</li>
      <li>Do you enjoy feeling like a normal member of masculine groups of men? (0.60)</li>
      <li>I am extraordinarily happy about being male [-] (0.59)</li>
      <li>Would you be offended if people thought you were unmanly or gay? (0.57)</li>
      <li>Do you relate better to masculine things or feminine things (0.54)</li>
      <li>I fit the gender roles for men well [-] (0.50)</li>
      <li>Do you believe men have an obligation to take care of and protect women? (0.48)</li>
      <li>Do you feel you have learned a lot of lessons about how to succeed as a man? (0.46)</li>
      <li>Do you feel like women are prone to excessively overthinking things? (0.45)</li>
      <li>I like to behave sexually as a man [-] (0.44)</li>
      <li>Male gender norms (0.42)</li>
      <li>Do you feel like people can choose their gender? (-0.41)</li>
      <li>How psychologically different do you feel men and women are? (0.33)</li>
      <li>Do you feel young women tend to have a lot of unnecessary drama? (More than young men) (0.32)</li>
    </ul>
  </div>
</details>

<details>
  <summary>Masculine Gender Role Insecurity Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>I feel like people judge me for having an insufficiently masculine body [-] (0.73)</li>
      <li>I try but fail to fit in with the roles society applies to men [-] (0.69)</li>
      <li>I find it impractical that I am male [-] (0.67)</li>
      <li>Being male makes me feel unsafe [-] (0.66)</li>
      <li>I feel that I am not taken seriously because I am male [-] (0.62)</li>
      <li>I wish I had an easier time fitting in among men [-] (0.61)</li>
      <li>Being male makes me feel ugly [-] (0.60)</li>
      <li>I am envious when I see women expressing their gender in ways that I cannot [-] (0.60)</li>
      <li>I behave in gender nonconforming/feminine ways to the point where I "stick out" [-] (0.52)</li>
      <li>I feel ashamed of my feminine traits [-] (0.43)</li>
      <li>I feel that my performance of certain behaviors goes unappreciated because I am male [-] (0.42)</li>
      <li>I would have more friends if I was a woman [-] (0.42)</li>
      <li>I fit the gender roles for men well [-] (-0.38)</li>
    </ul>
  </div>
</details>

<details>
  <summary>Homosexuality Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>Sexual arousal [Having sex with a masculine man] (0.78)</li>
      <li>Sexual arousal [Having sex with a skinny, sensitive, dreamy and artistic man] (0.76)</li>
      <li>Sexual arousal [Having sex with a feminine woman] (-0.46)</li>
    </ul>
  </div>
</details>

<details>
  <summary>Autogynephilia Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>Cross-gender fetishism screener [Behaving in a feminine way, or entering feminine spaces] (0.82)</li>
      <li>Cross-gender fetishism screener [Being seen as a woman by others, or having sex with a man as a woman] (0.78)</li>
      <li>Cross-gender fetishism screener [Wearing women's clothes or makeup or other feminine accessories] (0.77)</li>
      <li>Cross-gender fetishism screener [Having a female body or female body parts] (0.74)</li>
      <li>Cross-gender fetishism screener [Having female physiological functions, such as menstruating, lactating or being pregnant] (0.66)</li>
      <li>Sexual arousal [Making out with someone whose sex you cannot tell] (0.65)</li>
      <li>Sexual arousal [Having sex with a male-to-female transsexual] (0.65)</li>
      <li>Sexual arousal [Imagining being a woman and having lesbian sex with another woman] (0.56)</li>
    </ul>
  </div>
</details>

<br>
You'll notice that all the factors are fairly correlated with one another, and the *partial* correlations remain relatively strong; in fact, they seem *too* strong. It seems unlikely that the BDSM Interest factor, for instance, has such strong direct relationships with every other factor. More generally, all factors retain sizable partial correlations with one another. Hopefully, modeling the general factor will yield correlation matrices that make more sense.

## Evaluating the Models

### Model 3

Model 3 assumes that all common variance among items is mediated through the lower-order factors, and that the correlations among those factors are then explained by a higher-order factor. This structure implies a specific constraint: if an item does not load on any lower-order factor, it should not share common variance with items that do[^residual]. Any covariance between items must flow upward through a factor they share, whether a lower-order factor or the higher-order general factor.

However, in this dataset, several items that do not load on any lower-order factor are nevertheless positively correlated with items that do. A higher-order model does not fit this pattern. Because the higher-order factor influences items only indirectly, through their lower-order factors, any item that does not load on a lower-order factor has no path through which the higher-order factor could affect it[^residual]. As a result, the model predicts zero (or near-zero) correlations between such orphan items and factor-loading items, which contradicts observed data.

This indicates that the general covariance structure is not fully mediated by the lower-order factors and therefore cannot be captured by a standard higher-order model. A model with a general factor operating directly at the item level (e.g., Models 1a/1b or Models 2a/2b) is required to explain the pattern of correlations.

### Model 2b

Right off the bat, I'm wary of this model. It's very similar to a bifactor model, which are notoriously prone to overfitting[^bi-factor]. Nevertheless, let's see what our factor correlation matrix and factor partial correlation matrix look like.

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/general-kink-factor/factor-corr-2b.png" width="400" alt="Alt text">
        <img src="/assets/images/general-kink-factor/partial-factor-corr-2b.png" width="400" alt="Alt text">
        <figcaption>The factor correlation (left) and the factor partial correlation (right) matrices for Model 2b.</figcaption>
    </figure>
</div>

<details>
  <summary>General Kink Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>Sexual arousal [Having sex with a skinny, sensitive, dreamy and artistic man] (0.77)</li>
      <li>Sexual arousal [Having sex with a masculine man] (0.76)</li>
      <li>Sexual arousal [Being insulted or humiliated by your partner] (0.68)</li>
      <li>Sexual arousal [Making out with someone whose sex you cannot tell] (0.67)</li>
      <li>Sexual arousal [Being treated as a slave by your partner] (0.62)</li>
      <li>Sexual arousal [Being treated roughly by your partner in bed, e.g. spanked, pulled hair, or shoved around] (0.62)</li>
      <li>Sexual arousal [Having sex with a male-to-female transsexual] (0.59)</li>
      <li>Sexual arousal [Insulting or humiliating your partner] (0.52)</li>
      <li>Sexual arousal [Having casual sex with a stranger] (0.49)</li>
      <li>Cross-gender fetishism screener [Being seen as a woman by others, or having sex with a man as a woman] (0.47)</li>
      <li>Sexual arousal [Treating your partner as a slave] (0.44)</li>
      <li>Sexual arousal [Having sex with a tomboyish or masculine woman] (0.44)</li>
      <li>Sexual arousal [Being tied up by your partner using rope] (0.40)</li>
      <li>Cross-gender fetishism screener [Behaving in a feminine way, or entering feminine spaces] (0.36)</li>
      <li>Sexual arousal [Treating your partner roughly in bed, e.g. spanking, pulling hair or shoving them around] (0.35)</li>
      <li>Sexual arousal [Imagining being a woman and having lesbian sex with another woman] (0.31)</li>
      <li>Cross-gender fetishism screener [Wearing women's clothes or makeup or other feminine accessories] (0.30)</li>
      <li>Sexual arousal [Tying up your partner using rope] (0.28)</li>
      <li>Cross-gender fetishism screener [Having female physiological functions, such as menstruating, lactating or being pregnant] (0.23)</li>
      <li>Cross-gender fetishism screener [Having a female body or female body parts] (0.20)</li>
      <li>Sexual arousal [Having sex with a feminine woman] (-0.19)</li>
      <li>Sexual arousal [Feeling emotional attachment or affection during sex] (0.14)</li>
    </ul>
  </div>
</details>

<details>
  <summary>BDSM Interest Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>Sexual arousal [Tying up your partner using rope] (0.71)</li>
      <li>Sexual arousal [Treating your partner roughly in bed, e.g. spanking, pulling hair or shoving them around] (0.63)</li>
      <li>Sexual arousal [Treating your partner as a slave] (0.62)</li>
      <li>Sexual arousal [Being tied up by your partner using rope] (0.55)</li>
      <li>Sexual arousal [Insulting or humiliating your partner] (0.52)</li>
      <li>Sexual arousal [Being treated as a slave by your partner] (0.49)</li>
      <li>Sexual arousal [Being treated roughly by your partner in bed, e.g. spanked, pulled hair, or shoved around] (0.38)</li>
      <li>Sexual arousal [Being insulted or humiliated by your partner] (0.27)</li>
    </ul>
  </div>
</details>

<details>
  <summary>Masculine Gender Norm Endorsement Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>Do you think being male is an important part of your personality? (0.77)</li>
      <li>I feel proud of being male [-] (0.70)</li>
      <li>Do you think it is important for men to be manly and women to be womanly? (0.69)</li>
      <li>Would you say that your personal values are linked to being male? (0.62)</li>
      <li>Do you enjoy feeling like a normal member of masculine groups of men? (0.60)</li>
      <li>I am extraordinarily happy about being male [-] (0.58)</li>
      <li>Would you be offended if people thought you were unmanly or gay? (0.57)</li>
      <li>Do you relate better to masculine things or feminine things (0.53)</li>
      <li>I fit the gender roles for men well [-] (0.48)</li>
      <li>Do you believe men have an obligation to take care of and protect women? (0.48)</li>
      <li>Do you feel you have learned a lot of lessons about how to succeed as a man? (0.47)</li>
      <li>Do you feel like women are prone to excessively overthinking things? (0.45)</li>
      <li>I like to behave sexually as a man [-] (0.43)</li>
      <li>Male gender norms (0.41)</li>
      <li>Do you feel like people can choose their gender? (-0.40)</li>
      <li>How psychologically different do you feel men and women are? (0.33)</li>
      <li>Do you feel young women tend to have a lot of unnecessary drama? (More than young men) (0.32)</li>
    </ul>
  </div>
</details>

<details>
  <summary>Masculine Gender Role Insecurity Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>I feel like people judge me for having an insufficiently masculine body [-] (0.75)</li>
      <li>I try but fail to fit in with the roles society applies to men [-] (0.69)</li>
      <li>I find it impractical that I am male [-] (0.67)</li>
      <li>Being male makes me feel unsafe [-] (0.65)</li>
      <li>I feel that I am not taken seriously because I am male [-] (0.61)</li>
      <li>I wish I had an easier time fitting in among men [-] (0.61)</li>
      <li>Being male makes me feel ugly [-] (0.61)</li>
      <li>I am envious when I see women expressing their gender in ways that I cannot [-] (0.59)</li>
      <li>I behave in gender nonconforming/feminine ways to the point where I "stick out" [-] (0.50)</li>
      <li>I feel ashamed of my feminine traits [-] (0.43)</li>
      <li>I feel that my performance of certain behaviors goes unappreciated because I am male [-] (0.42)</li>
      <li>I would have more friends if I was a woman [-] (0.42)</li>
      <li>I fit the gender roles for men well [-] (-0.37)</li>
    </ul>
  </div>
</details>

<details>
  <summary>Homosexuality Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>Sexual arousal [Having sex with a masculine man] (0.14)</li>
      <li>Sexual arousal [Having sex with a skinny, sensitive, dreamy and artistic man] (0.14)</li>
      <li>Sexual arousal [Having sex with a feminine woman] (-0.10)</li>
    </ul>
  </div>
</details>

<details>
  <summary>Autogynephilia Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>Cross-gender fetishism screener [Having a female body or female body parts] (0.70)</li>
      <li>Cross-gender fetishism screener [Behaving in a feminine way, or entering feminine spaces] (0.65)</li>
      <li>Cross-gender fetishism screener [Wearing women's clothes or makeup or other feminine accessories] (0.63)</li>
      <li>Cross-gender fetishism screener [Being seen as a woman by others, or having sex with a man as a woman] (0.53)</li>
      <li>Cross-gender fetishism screener [Having female physiological functions, such as menstruating, lactating or being pregnant] (0.50)</li>
      <li>Sexual arousal [Imagining being a woman and having lesbian sex with another woman] (0.35)</li>
      <li>Sexual arousal [Having sex with a male-to-female transsexual] (0.21)</li>
      <li>Sexual arousal [Making out with someone whose sex you cannot tell] (0.14)</li>
    </ul>
  </div>
</details>

<br>
The biggest problem with this model is what it does to the Homosexuality factor. Previously, it had strong loadings with absolute magnitudes ranging from 0.46 to 0.78. Now the items barely load at all, and instead load strongly on the general factor, which is not ideal. A similar issue appears for other factors, especially the BDSM Interest and Autogynephilia factors. Previously all their loadings were at least 0.72 and 0.56 respectively, but in this model all BDSM Interest items fall below 0.72, and for the Autogynephilia factor five out of eight items fall below 0.56. This also isn't ideal.

Why does this happen? In bifactor-like models, factors defined by only a few items, or whose items correlate with many others, often have their variance reassigned to the general factor. The model can fit the covariance structure more effectively by letting the general factor absorb most of the shared variance. As a result, factors like Homosexuality, BDSM Interest, and Autogynephilia end up with much smaller loadings even though their items within each factor are clearly related to one another as seen in simpler models.

### Model 2a

Model 2a is almost the same as Model 2b, except that the general factor is allowed to correlate with the other factors. I doubt this will improve things, but for the sake of thoroughness, let's see what we get.

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/general-kink-factor/factor-corr-2a.png" width="400" alt="Alt text">
        <img src="/assets/images/general-kink-factor/partial-factor-corr-2a.png" width="400" alt="Alt text">
        <figcaption>The factor correlation (left) and the factor partial correlation (right) matrices for Model 2a.</figcaption>
    </figure>
</div>

<details>
  <summary>General Kink Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>Sexual arousal [Having sex with a skinny, sensitive, dreamy and artistic man] (0.76)</li>
      <li>Sexual arousal [Having sex with a masculine man] (0.73)</li>
      <li>Sexual arousal [Making out with someone whose sex you cannot tell] (0.60)</li>
      <li>Sexual arousal [Being insulted or humiliated by your partner] (0.57)</li>
      <li>Sexual arousal [Having sex with a male-to-female transsexual] (0.47)</li>
      <li>Sexual arousal [Being treated roughly by your partner in bed, e.g. spanked, pulled hair, or shoved around] (0.47)</li>
      <li>Sexual arousal [Having casual sex with a stranger] (0.44)</li>
      <li>Sexual arousal [Having sex with a tomboyish or masculine woman] (0.43)</li>
      <li>Sexual arousal [Being treated as a slave by your partner] (0.41)</li>
      <li>Sexual arousal [Insulting or humiliating your partner] (0.29)</li>
      <li>Cross-gender fetishism screener [Being seen as a woman by others, or having sex with a man as a woman] (0.24)</li>
      <li>Sexual arousal [Having sex with a feminine woman] (-0.21)</li>
      <li>Sexual arousal [Treating your partner as a slave] (0.21)</li>
      <li>Sexual arousal [Imagining being a woman and having lesbian sex with another woman] (0.19)</li>
      <li>Cross-gender fetishism screener [Behaving in a feminine way, or entering feminine spaces] (0.18)</li>
      <li>Sexual arousal [Being tied up by your partner using rope] (0.18)</li>
      <li>Sexual arousal [Treating your partner roughly in bed, e.g. spanking, pulling hair or shoving them around] (0.15)</li>
      <li>Cross-gender fetishism screener [Having female physiological functions, such as menstruating, lactating or being pregnant] (0.14)</li>
      <li>Cross-gender fetishism screener [Wearing women's clothes or makeup or other feminine accessories] (0.14)</li>
      <li>Sexual arousal [Feeling emotional attachment or affection during sex] (0.13)</li>
      <li>Sexual arousal [Tying up your partner using rope] (0.09)</li>
      <li>Cross-gender fetishism screener [Having a female body or female body parts] (0.08)</li>
    </ul>
  </div>
</details>

<details>
  <summary>BDSM Interest Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>Sexual arousal [Tying up your partner using rope] (0.79)</li>
      <li>Sexual arousal [Treating your partner as a slave] (0.76)</li>
      <li>Sexual arousal [Treating your partner roughly in bed, e.g. spanking, pulling hair or shoving them around] (0.74)</li>
      <li>Sexual arousal [Being tied up by your partner using rope] (0.69)</li>
      <li>Sexual arousal [Insulting or humiliating your partner] (0.68)</li>
      <li>Sexual arousal [Being treated as a slave by your partner] (0.68)</li>
      <li>Sexual arousal [Being treated roughly by your partner in bed, e.g. spanked, pulled hair, or shoved around] (0.52)</li>
      <li>Sexual arousal [Being insulted or humiliated by your partner] (0.39)</li>
    </ul>
  </div>
</details>

<details>
  <summary>Masculine Gender Norm Endorsement Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>Do you think being male is an important part of your personality? (0.77)</li>
      <li>I feel proud of being male [-] (0.70)</li>
      <li>Do you think it is important for men to be manly and women to be womanly? (0.70)</li>
      <li>Would you say that your personal values are linked to being male? (0.62)</li>
      <li>Do you enjoy feeling like a normal member of masculine groups of men? (0.60)</li>
      <li>I am extraordinarily happy about being male [-] (0.58)</li>
      <li>Would you be offended if people thought you were unmanly or gay? (0.57)</li>
      <li>Do you relate better to masculine things or feminine things (0.54)</li>
      <li>I fit the gender roles for men well [-] (0.48)</li>
      <li>Do you believe men have an obligation to take care of and protect women? (0.47)</li>
      <li>Do you feel you have learned a lot of lessons about how to succeed as a man? (0.46)</li>
      <li>Do you feel like women are prone to excessively overthinking things? (0.45)</li>
      <li>I like to behave sexually as a man [-] (0.43)</li>
      <li>Do you feel like people can choose their gender? (-0.41)</li>
      <li>Male gender norms (0.40)</li>
      <li>How psychologically different do you feel men and women are? (0.32)</li>
      <li>Do you feel young women tend to have a lot of unnecessary drama? (More than young men) (0.31)</li>
    </ul>
  </div>
</details>

<details>
  <summary>Masculine Gender Role Insecurity Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>I feel like people judge me for having an insufficiently masculine body [-] (0.75)</li>
      <li>I try but fail to fit in with the roles society applies to men [-] (0.69)</li>
      <li>I find it impractical that I am male [-] (0.67)</li>
      <li>Being male makes me feel unsafe [-] (0.66)</li>
      <li>I wish I had an easier time fitting in among men [-] (0.61)</li>
      <li>I feel that I am not taken seriously because I am male [-] (0.60)</li>
      <li>Being male makes me feel ugly [-] (0.60)</li>
      <li>I am envious when I see women expressing their gender in ways that I cannot [-] (0.60)</li>
      <li>I behave in gender nonconforming/feminine ways to the point where I "stick out" [-] (0.53)</li>
      <li>I feel ashamed of my feminine traits [-] (0.43)</li>
      <li>I feel that my performance of certain behaviors goes unappreciated because I am male [-] (0.42)</li>
      <li>I would have more friends if I was a woman [-] (0.41)</li>
      <li>I fit the gender roles for men well [-] (-0.38)</li>
    </ul>
  </div>
</details>

<details>
  <summary>Homosexuality Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>Sexual arousal [Having sex with a masculine man] (0.17)</li>
      <li>Sexual arousal [Having sex with a skinny, sensitive, dreamy and artistic man] (0.14)</li>
      <li>Sexual arousal [Having sex with a feminine woman] (-0.11)</li>
    </ul>
  </div>
</details>

<details>
  <summary>Autogynephilia Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>Cross-gender fetishism screener [Behaving in a feminine way, or entering feminine spaces] (0.76)</li>
      <li>Cross-gender fetishism screener [Having a female body or female body parts] (0.75)</li>
      <li>Cross-gender fetishism screener [Wearing women's clothes or makeup or other feminine accessories] (0.74)</li>
      <li>Cross-gender fetishism screener [Being seen as a woman by others, or having sex with a man as a woman] (0.69)</li>
      <li>Cross-gender fetishism screener [Having female physiological functions, such as menstruating, lactating or being pregnant] (0.56)</li>
      <li>Sexual arousal [Imagining being a woman and having lesbian sex with another woman] (0.44)</li>
      <li>Sexual arousal [Having sex with a male-to-female transsexual] (0.33)</li>
      <li>Sexual arousal [Making out with someone whose sex you cannot tell] (0.22)</li>
    </ul>
  </div>
</details>

<br>
Allowing the general factor to correlate with the specific factors resulted in items loading more highly on their factors, which is a nice surprise. However, the model's behavior with respect to the Homosexuality factor has not meaningfully changed, with its items loading very weakly on the Homosexuality factor while loading highly on the general factor.

### Model 1b

I have more hope for this model because it is similar to the one I use to model acquiescence bias, and that approach has produced reasonable results in my experience. Let's see how it performs.

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/general-kink-factor/factor-corr-1b.png" width="400" alt="Alt text">
        <img src="/assets/images/general-kink-factor/partial-factor-corr-1b.png" width="400" alt="Alt text">
        <figcaption>The factor correlation (left) and the factor partial correlation (right) matrices for Model 1b.</figcaption>
    </figure>
</div>

<details>
  <summary>General Kink Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>Sexual arousal [Having sex with a male-to-female transsexual] (0.48)</li>
      <li>Sexual arousal [Having casual sex with a stranger] (0.48)</li>
      <li>Sexual arousal [Imagining being a woman and having lesbian sex with another woman] (0.48)</li>
      <li>Cross-gender fetishism screener [Wearing women's clothes or makeup or other feminine accessories] (0.48)</li>
      <li>Cross-gender fetishism screener [Having female physiological functions, such as menstruating, lactating or being pregnant] (0.48)</li>
      <li>Sexual arousal [Tying up your partner using rope] (0.48)</li>
      <li>Cross-gender fetishism screener [Having a female body or female body parts] (0.48)</li>
      <li>Cross-gender fetishism screener [Behaving in a feminine way, or entering feminine spaces] (0.48)</li>
      <li>Sexual arousal [Having sex with a masculine man] (0.48)</li>
      <li>Sexual arousal [Being tied up by your partner using rope] (0.48)</li>
      <li>Sexual arousal [Being treated roughly by your partner in bed, e.g. spanked, pulled hair, or shoved around] (0.48)</li>
      <li>Cross-gender fetishism screener [Being seen as a woman by others, or having sex with a man as a woman] (0.48)</li>
      <li>Sexual arousal [Having sex with a feminine woman] (0.48)</li>
      <li>Sexual arousal [Feeling emotional attachment or affection during sex] (0.48)</li>
      <li>Sexual arousal [Having sex with a skinny, sensitive, dreamy and artistic man] (0.48)</li>
      <li>Sexual arousal [Being insulted or humiliated by your partner] (0.48)</li>
      <li>Sexual arousal [Treating your partner as a slave] (0.48)</li>
      <li>Sexual arousal [Treating your partner roughly in bed, e.g. spanking, pulling hair or shoving them around] (0.48)</li>
      <li>Sexual arousal [Being treated as a slave by your partner] (0.48)</li>
      <li>Sexual arousal [Having sex with a tomboyish or masculine woman] (0.48)</li>
      <li>Sexual arousal [Insulting or humiliating your partner] (0.48)</li>
      <li>Sexual arousal [Making out with someone whose sex you cannot tell] (0.48)</li>
    </ul>
  </div>
</details>

<details>
  <summary>BDSM Interest Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>Sexual arousal [Being treated as a slave by your partner] (0.66)</li>
      <li>Sexual arousal [Treating your partner as a slave] (0.61)</li>
      <li>Sexual arousal [Insulting or humiliating your partner] (0.59)</li>
      <li>Sexual arousal [Tying up your partner using rope] (0.58)</li>
      <li>Sexual arousal [Treating your partner roughly in bed, e.g. spanking, pulling hair or shoving them around] (0.56)</li>
      <li>Sexual arousal [Being treated roughly by your partner in bed, e.g. spanked, pulled hair, or shoved around] (0.55)</li>
      <li>Sexual arousal [Being tied up by your partner using rope] (0.54)</li>
      <li>Sexual arousal [Being insulted or humiliated by your partner] (0.51)</li>
    </ul>
  </div>
</details>

<details>
  <summary>Masculine Gender Norm Endorsement Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>Do you think being male is an important part of your personality? (0.76)</li>
      <li>Do you think it is important for men to be manly and women to be womanly? (0.71)</li>
      <li>I feel proud of being male [-] (0.71)</li>
      <li>Would you say that your personal values are linked to being male? (0.64)</li>
      <li>Do you enjoy feeling like a normal member of masculine groups of men? (0.61)</li>
      <li>I am extraordinarily happy about being male [-] (0.59)</li>
      <li>Would you be offended if people thought you were unmanly or gay? (0.57)</li>
      <li>Do you relate better to masculine things or feminine things (0.54)</li>
      <li>Do you believe men have an obligation to take care of and protect women? (0.49)</li>
      <li>I fit the gender roles for men well [-] (0.49)</li>
      <li>Do you feel you have learned a lot of lessons about how to succeed as a man? (0.46)</li>
      <li>Do you feel like women are prone to excessively overthinking things? (0.45)</li>
      <li>I like to behave sexually as a man [-] (0.43)</li>
      <li>Do you feel like people can choose their gender? (-0.43)</li>
      <li>Male gender norms (0.41)</li>
      <li>How psychologically different do you feel men and women are? (0.33)</li>
      <li>Do you feel young women tend to have a lot of unnecessary drama? (More than young men) (0.32)</li>
    </ul>
  </div>
</details>

<details>
  <summary>Masculine Gender Role Insecurity Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>I feel like people judge me for having an insufficiently masculine body [-] (0.75)</li>
      <li>I find it impractical that I am male [-] (0.69)</li>
      <li>I try but fail to fit in with the roles society applies to men [-] (0.68)</li>
      <li>Being male makes me feel unsafe [-] (0.66)</li>
      <li>I feel that I am not taken seriously because I am male [-] (0.62)</li>
      <li>I wish I had an easier time fitting in among men [-] (0.62)</li>
      <li>Being male makes me feel ugly [-] (0.61)</li>
      <li>I am envious when I see women expressing their gender in ways that I cannot [-] (0.61)</li>
      <li>I behave in gender nonconforming/feminine ways to the point where I "stick out" [-] (0.53)</li>
      <li>I feel ashamed of my feminine traits [-] (0.44)</li>
      <li>I feel that my performance of certain behaviors goes unappreciated because I am male [-] (0.42)</li>
      <li>I fit the gender roles for men well [-] (-0.42)</li>
      <li>I would have more friends if I was a woman [-] (0.41)</li>
    </ul>
  </div>
</details>

<details>
  <summary>Homosexuality Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>Sexual arousal [Having sex with a masculine man] (0.62)</li>
      <li>Sexual arousal [Having sex with a skinny, sensitive, dreamy and artistic man] (0.58)</li>
      <li>Sexual arousal [Having sex with a feminine woman] (-0.54)</li>
    </ul>
  </div>
</details>

<details>
  <summary>Autogynephilia Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>Cross-gender fetishism screener [Behaving in a feminine way, or entering feminine spaces] (0.62)</li>
      <li>Cross-gender fetishism screener [Being seen as a woman by others, or having sex with a man as a woman] (0.58)</li>
      <li>Cross-gender fetishism screener [Wearing women's clothes or makeup or other feminine accessories] (0.56)</li>
      <li>Cross-gender fetishism screener [Having a female body or female body parts] (0.54)</li>
      <li>Cross-gender fetishism screener [Having female physiological functions, such as menstruating, lactating or being pregnant] (0.48)</li>
      <li>Sexual arousal [Having sex with a male-to-female transsexual] (0.35)</li>
      <li>Sexual arousal [Making out with someone whose sex you cannot tell] (0.32)</li>
      <li>Sexual arousal [Imagining being a woman and having lesbian sex with another woman] (0.24)</li>
    </ul>
  </div>
</details>

<br>
With respect to the BDSM Interest and Autogynephilia factors, this model is better than Models 2b and worse than 2a. However, regarding the Homosexuality factor, this model is much better than Models 2b and 2a; the factor loadings are *much* stronger.

### Model 1a

Since Model 1b worked relatively well, it is natural to ask what happens when the general factor is allowed to correlate with the other factors. The direction and strength of such correlations would be especially informative.

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/general-kink-factor/factor-corr-1a.png" width="400" alt="Alt text">
        <img src="/assets/images/general-kink-factor/partial-factor-corr-1a.png" width="400" alt="Alt text">
        <figcaption>The factor correlation (left) and the factor partial correlation (right) matrices for Model 1a.</figcaption>
    </figure>
</div>

<details>
  <summary>General Kink Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>Sexual arousal [Feeling emotional attachment or affection during sex] (0.39)</li>
      <li>Sexual arousal [Being insulted or humiliated by your partner] (0.39)</li>
      <li>Sexual arousal [Having sex with a tomboyish or masculine woman] (0.39)</li>
      <li>Sexual arousal [Having sex with a feminine woman] (0.39)</li>
      <li>Sexual arousal [Making out with someone whose sex you cannot tell] (0.39)</li>
      <li>Sexual arousal [Having sex with a skinny, sensitive, dreamy and artistic man] (0.39)</li>
      <li>Sexual arousal [Being treated as a slave by your partner] (0.39)</li>
      <li>Sexual arousal [Being treated roughly by your partner in bed, e.g. spanked, pulled hair, or shoved around] (0.39)</li>
      <li>Sexual arousal [Treating your partner roughly in bed, e.g. spanking, pulling hair or shoving them around] (0.39)</li>
      <li>Sexual arousal [Tying up your partner using rope] (0.39)</li>
      <li>Cross-gender fetishism screener [Being seen as a woman by others, or having sex with a man as a woman] (0.39)</li>
      <li>Cross-gender fetishism screener [Having female physiological functions, such as menstruating, lactating or being pregnant] (0.39)</li>
      <li>Sexual arousal [Treating your partner as a slave] (0.39)</li>
      <li>Cross-gender fetishism screener [Wearing women's clothes or makeup or other feminine accessories] (0.39)</li>
      <li>Sexual arousal [Insulting or humiliating your partner] (0.39)</li>
      <li>Cross-gender fetishism screener [Behaving in a feminine way, or entering feminine spaces] (0.39)</li>
      <li>Cross-gender fetishism screener [Having a female body or female body parts] (0.39)</li>
      <li>Sexual arousal [Being tied up by your partner using rope] (0.39)</li>
      <li>Sexual arousal [Having sex with a masculine man] (0.39)</li>
      <li>Sexual arousal [Imagining being a woman and having lesbian sex with another woman] (0.39)</li>
      <li>Sexual arousal [Having sex with a male-to-female transsexual] (0.39)</li>
      <li>Sexual arousal [Having casual sex with a stranger] (0.39)</li>
    </ul>
  </div>
</details>

<details>
  <summary>BDSM Interest Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>Sexual arousal [Being treated as a slave by your partner] (0.73)</li>
      <li>Sexual arousal [Treating your partner as a slave] (0.69)</li>
      <li>Sexual arousal [Insulting or humiliating your partner] (0.64)</li>
      <li>Sexual arousal [Tying up your partner using rope] (0.64)</li>
      <li>Sexual arousal [Treating your partner roughly in bed, e.g. spanking, pulling hair or shoving them around] (0.62)</li>
      <li>Sexual arousal [Being tied up by your partner using rope] (0.61)</li>
      <li>Sexual arousal [Being treated roughly by your partner in bed, e.g. spanked, pulled hair, or shoved around] (0.60)</li>
      <li>Sexual arousal [Being insulted or humiliated by your partner] (0.56)</li>
    </ul>
  </div>
</details>

<details>
  <summary>Masculine Gender Norm Endorsement Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>Do you think being male is an important part of your personality? (0.78)</li>
      <li>I feel proud of being male [-] (0.71)</li>
      <li>Do you think it is important for men to be manly and women to be womanly? (0.70)</li>
      <li>Would you say that your personal values are linked to being male? (0.63)</li>
      <li>Do you enjoy feeling like a normal member of masculine groups of men? (0.61)</li>
      <li>I am extraordinarily happy about being male [-] (0.59)</li>
      <li>Would you be offended if people thought you were unmanly or gay? (0.58)</li>
      <li>Do you relate better to masculine things or feminine things (0.55)</li>
      <li>I fit the gender roles for men well [-] (0.48)</li>
      <li>Do you believe men have an obligation to take care of and protect women? (0.48)</li>
      <li>Do you feel you have learned a lot of lessons about how to succeed as a man? (0.46)</li>
      <li>Do you feel like women are prone to excessively overthinking things? (0.45)</li>
      <li>I like to behave sexually as a man [-] (0.45)</li>
      <li>Do you feel like people can choose their gender? (-0.44)</li>
      <li>Male gender norms (0.41)</li>
      <li>How psychologically different do you feel men and women are? (0.33)</li>
      <li>Do you feel young women tend to have a lot of unnecessary drama? (More than young men) (0.32)</li>
    </ul>
  </div>
</details>

<details>
  <summary>Masculine Gender Role Insecurity Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>I feel like people judge me for having an insufficiently masculine body [-] (0.75)</li>
      <li>I try but fail to fit in with the roles society applies to men [-] (0.69)</li>
      <li>I find it impractical that I am male [-] (0.67)</li>
      <li>Being male makes me feel unsafe [-] (0.67)</li>
      <li>I wish I had an easier time fitting in among men [-] (0.62)</li>
      <li>I feel that I am not taken seriously because I am male [-] (0.62)</li>
      <li>Being male makes me feel ugly [-] (0.61)</li>
      <li>I am envious when I see women expressing their gender in ways that I cannot [-] (0.60)</li>
      <li>I behave in gender nonconforming/feminine ways to the point where I "stick out" [-] (0.53)</li>
      <li>I feel ashamed of my feminine traits [-] (0.45)</li>
      <li>I fit the gender roles for men well [-] (-0.43)</li>
      <li>I feel that my performance of certain behaviors goes unappreciated because I am male [-] (0.42)</li>
      <li>I would have more friends if I was a woman [-] (0.42)</li>
    </ul>
  </div>
</details>

<details>
  <summary>Homosexuality Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>Sexual arousal [Having sex with a masculine man] (0.65)</li>
      <li>Sexual arousal [Having sex with a skinny, sensitive, dreamy and artistic man] (0.63)</li>
      <li>Sexual arousal [Having sex with a feminine woman] (-0.55)</li>
    </ul>
  </div>
</details>

<details>
  <summary>Autogynephilia Factor</summary>
  <div style="margin-left: 15px; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
    <ul style="margin-bottom: 0;">
      <li>Cross-gender fetishism screener [Behaving in a feminine way, or entering feminine spaces] (0.67)</li>
      <li>Cross-gender fetishism screener [Being seen as a woman by others, or having sex with a man as a woman] (0.64)</li>
      <li>Cross-gender fetishism screener [Wearing women's clothes or makeup or other feminine accessories] (0.61)</li>
      <li>Cross-gender fetishism screener [Having a female body or female body parts] (0.60)</li>
      <li>Cross-gender fetishism screener [Having female physiological functions, such as menstruating, lactating or being pregnant] (0.49)</li>
      <li>Sexual arousal [Having sex with a male-to-female transsexual] (0.46)</li>
      <li>Sexual arousal [Making out with someone whose sex you cannot tell] (0.44)</li>
      <li>Sexual arousal [Imagining being a woman and having lesbian sex with another woman] (0.34)</li>
    </ul>
  </div>
</details>

<br>
Model 1a[^lex-luthor] seems to work the best. The loadings on the specific factors are higher than in Model 1b, and allowing the general factor to correlate with the other factors produces factor correlations that make sense. In the partial correlation matrix, the factors most strongly associated with the general factor are BDSM Interest and Autogynephilia. This makes sense: both of these domains are tightly tied to "kink-like" or paraphilic sexual interests, so a broad tendency toward unusual or intense sexual interests would naturally connect to them. One might initially expect the Homosexuality factor to have a high partial correlation with the general factor, since it is also composed of sexual arousal items. However, homosexuality is not really a kink[^gay] in the way that BDSM or autogynephilia are.

That said, Model 1a relies on an equal-loading general factor, which behaves very much like a method factor (similar to an acquiescence factor). In reality, I don't expect all sexual interest items to load equally on such a factor. Still, modeling things this way produces coherent results, and the general factor can still be *thought of as* a convenient statistical summary of how kinky someone is.

## Takeaways
Bi-factor models performed poorly in this dataset, while equal-loading models performed surprisingly well. My decision to model acquiescence bias with an equal-loading model is therefore somewhat justified. Explicitly modeling sources of covariance produces clearer and more informative results. Analyses that include many sexual-interest items should probably try to model the general factor of sexual interests as well. 

For another perspective on how to handle this general factor, see Tailcalled's post: [Controlling for the general factor of paraphilia](https://surveyanon.wordpress.com/2021/01/13/controlling-for-the-general-factor-of-paraphilia/).

[^residual]: Assuming no residual correlations between items, which I generally do not model in my analyses.
[^acquiescence]: Sexual interest items tend to "face" in the same direction. Items are generally of the form "How arousing do you find X?" with answers from "Not at all" to "Extremely." Because of this, we cannot distinguish between the general kink factor and acquiescence bias.
[^bi-factor]: [One simulation study](https://www.annualreviews.org/content/journals/10.1146/annurev-clinpsy-050718-095522) generated data from three different conditions: a correlated-factors structure, a bifactor structure, and a condition with minimal structure. In all three cases, the bifactor model outperformed the true data-generating model on likelihood-based fit indices. A model that explains everything explains nothing.
[^lex-luthor]: In the words of [Lex Luthor](https://www.youtube.com/watch?v=mdZ8wtsSvwI), "1A! 1A! 1A!!!"
[^gay]: I'm not quite sure how to explain this, but it seems true.
