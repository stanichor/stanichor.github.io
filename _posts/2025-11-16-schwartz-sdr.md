---
layout: post
title: "Schwartz Values and Social Desirability"
date: 2025-11-16
permalink: /schwartz-sdr/
categories: 
---

Shalom Schwartz's [Theory of Basic Human Values](https://en.wikipedia.org/wiki/Theory_of_basic_human_values) states that there are ten basic human values that act as guiding principles in people's lives. These values are: universalism, benevolence, conformity, tradition, security, power, achievement, hedonism, stimulation, and self-direction. There used to be another value—spirituality—but it was later rejected as one of the basic human values.

A study[^1] on Schwartz values and social desirability responding offers an opportunity to examine how self-reports of these values are affected by the tendency to present oneself favorably. The study draws on three questionnaires: a short version of the Balanced Inventory of Desirable Responding (BIDR), the Schwartz Value Survey (SVS), and the Portrait Values Questionnaire (PVQ). The BIDR measures two components of social desirability responding—impression management and self-deceptive enhancement—and both the SVS and PVQ attempt to measure Schwartz values through different item formats.

## Data

In the study, 224 Italian respondents completed three questionnaires: the short version of the Balanced Inventory of Desirable Responding (BIDR), the Schwartz Value Survey (SVS), and the Portrait Values Questionnaire (PVQ). 
- The BIDR is a 16-item scale intended to measure impression management and self-deceptive enhancement, two aspects of social desirability responding. It contains items such as "I have some pretty awful habits" (reverse-scored) and "I always obey laws, even if I’m unlikely to get caught".
- The SVS includes 58 items which contain a single value each along with a brief explanation in parentheses intended to clarify the meaning of the value, for example, "AN EXCITING LIFE (stimulating experiences)". Respondents are asked to rate the importance of each of the values on a 9-point scale from -1 (opposed to my values) to 7 (of supreme importance). 
- The PVQ includes 40 descriptions of a person and their desires, for example, "He/She likes surprises. It is important to him/her to have an exciting life." Respondents rate their self-reported similarity to each description on a scale from 1 (not like me at all) to 6 (very much like me).

## Factor Structure

### Acquiescence Bias

While testing for acquiescence bias, I found that it made up a large proportion of the variance in responses. For the BIDR, it explained 4% of the variance. For the SVS, it explained 39% of the variance. For the PVQ, it explained 31% of the variance. For the SVS and PVQ, there likely does not reflect acquiescence bias *per se*, but rather there are differences in personal "zero points" for the rating scales. Some people rate the average item as "not important", while others rate the average item as "very important". This is one reason Schwartz recommends re-centering responses by subtracting each person’s mean score. I scored the SVS and PVQ accordingly and kept an explicit acquiescence factor for the BIDR.

### Value Means

Values have different levels of endorsement. Using the scoring method discussed above (re-centering responses by subtracting each person’s mean score) yields the following value means (the SVS and PVQ value means are displayed separately):

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/schwartz-sdr/svs-means.png" width="600" alt="Alt text">
    </figure>
</div>

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/schwartz-sdr/pvq-means.png" width="600" alt="Alt text">
    </figure>
</div>

After re-centering, some values rose above the average personal baseline and others fell below it. Universalism, Benevolence, and Self-Direction consistently rated above participants’ average value ratings. Tradition, Power, and Stimulation fell below them. The SVS and PVQ show similar patterns despite their different item formats.

### Social Desirability Responding

First, I modeled each factor (Social Desirability + the values) as correlated, while the value items load only on their respective values and the BIDR items load only on social desirability and an acquiescence bias. This yields the following factor correlation matrix: 

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/schwartz-sdr/factor-corr.png" width="600" alt="Alt text">
    </figure>
</div>

When all value factors and the social desirability factor are allowed to correlate, there are small-to-moderate correlations between social desirability and the value factors. Achievement and Hedonism showed the strongest correlations with social desirability, and the other values show weaker correlations. To see which specific items contribute to these correlations, I estimated item-level loadings by modeling each value factor together with the BIDR items while fixing the social desirability loadings to those obtained previously.

Below, I summarize each value factor. The tables list estimated loadings on the value factor and on the social desirability factor.

#### Social Desirability

| | Loading |
|-|-|
| I have some pretty awful habits [R] | -0.54 |
| I sometimes tell lies, if I have to [R] | -0.49 |
| I always obey laws, even if I'm unlikely to get caught | 0.48 |
| There have been occasions when I have taken advantage of someone [R] | -0.47 |
| I have done things that I don't tell other people about [R] | -0.39 |
| I have taken sick leave from work or school even though I wasn't really sick [R] | -0.33 |
| I have never dropped litter on the street | 0.31 |
| I have said something bad about a friend behind his or her back [R] | -0.27 |
| I always know why I like things | 0.17 |
| I am fully in control of my own fate | 0.16 |
| I never regret my decisions | 0.07 |
| It's all right with me if some people happen to dislike me | -0.07 |
| Once I've made up my mind, other people can seldom change my opinion | -0.07 |
| I am a completely rational person | 0.07 |
| I am very confident in my judgements | -0.04 |
| My first impressions of people usually turn out to be right | -0.01 |

The BIDR items behaved as expected. Confessions of dishonesty ("I sometimes tell lies, if I have to [R]") and mention of manipulative behavior ("I have taken advantage of someone [R]") loaded strongly and negatively; claims of strict rule-following ("I always obey laws, even if I’m unlikely to get caught") loaded positively. Several items, however, barely registered on the factor.

#### Universalism

| | Social Desirability | Universalism |
|-|-|-|
| **SVS Items** | | |
| PROTECTING THE ENVIRONMENT (preserving nature) | -0.18 | 0.75 |
| SOCIAL JUSTICE (correcting injustice, care for the weak) | 0.17 | 0.65 |
| A WORLD AT PEACE (free of war and conflict) | 0.19 | 0.64 |
| BROADMINDED (tolerant of different ideas and beliefs) | 0.19 | 0.59 |
| A WORLD OF BEAUTY (beauty of nature and the arts) | -0.42 | 0.49 |
| EQUALITY (equal opportunity for all) | 0.40 | 0.46 |
| UNITY WITH NATURE (fitting into nature) | -0.42 | 0.42 |
| WISDOM (a mature understanding of life) | 0.16 | 0.37 |
| **PVQ Items** | | |
| He/She believes all the worlds' people should live in harmony. Promoting peace among all groups in the world is important to him/her. | 0.15 | 0.83 |
| He/She strongly believes that people should care for nature. Looking after the environment is important to him/her. | 0.02 | 0.81 |
| It is important to him/her to adapt to nature and to fit into it. He/She believes that people should not change nature. | -0.32 | 0.71 |
| He/She wants everyone to be treated justly, even people he/she doesn't know. It is important to him/her to protect the weak in society. | 0.51 | 0.53 |
| It is important to him/her to listen to people who are different from him/her. Even when he/she disagrees with them, he/she still wants to understand them. | 0.27 | 0.48 |
| He/She thinks it is important that every person in the world be treated equally. He/She wants justice for everybody, even for people he/she doesn't know. | 0.51 | 0.44 |


Items relating to equality, justice, and concern for other people loaded positively on the social desirability factor. Items relating to nature loaded negatively. This split surprised me, and I'm unsure why it occurs. Nonetheless, most items loaded strongly on the universalism factor.

#### Benevolence

| | Social Desirability | Benevolence |
|-|-|-|
| **SVS Items** | | |
| LOYAL (faithful to my friends, group) | -0.02 | 0.85 |
| HONEST (genuine, sincere) | 0.10 | 0.83 |
| RESPONSIBLE (dependable, reliable) | 0.03 | 0.78 |
| HELPFUL (working for the welfare of others) | 0.26 | 0.64 |
| FORGIVING (willing to pardon others) | 0.42 | -0.01 |
| **PVQ Items** | | |
| It is important to him/her to respond to the needs of others. He/She tries to support those he/she knows. | 0.11 | 0.83 |
| It is important to him/her to be loyal to his/her friends. He/She wants to devote himself/herself to people close to him/her. | 0.04 | 0.78 |
| It's very important to him/her to help the people around him/her. He/She wants to care for other people. | 0.21 | 0.72 |
| Forgiving people who might have wronged him/her is important to him/her. He/She tries to see what is good in them and not to hold a grudge. | 0.33 | -0.21 |

Items about helping friends and supporting close others loaded well on the benevolence factor. Items about forgiveness did not: they loaded weakly or negatively on benevolence and moderately on social desirability. People may treat forgiveness as an admirable trait they believe they "should" claim rather than as one that reflects what they actually value.

#### Tradition

| | Social Desirability | Tradition |
|-|-|-|
| **SVS Items** | | |
| DEVOUT (holding to religious faith & belief) | 0.05 | 0.87 |
| RESPECT FOR TRADITION (preservation of time honoured customs) | -0.01 | 0.53 |
| ACCEPTING MY PORTION IN LIFE (submitting to life's circumstances) | 0.01 | 0.47 |
| MODERATE (avoiding extremes of feeling & action) | 0.01 | 0.43 |
| HUMBLE (modest, self effacing) | 0.37 | -0.09 |
| **PVQ Items** | | |
| Religious belief is important to him/her. He/She tries hard to do what his/her religion requires. | 0.10 | 0.84 |
| He/She believes it is best to do things in traditional ways. It is important to him/her to follow the customs he/she has learned. | 0.03 | 0.59 |
| He/She thinks it's important not to ask for more than what you have. He/She believes that people should be satisfied with what they have. | 0.21 | 0.38 |
| It is important to him/her to be humble and modest. He/She tries not to draw attention to himself/herself. | 0.23 | -0.06 |

Religiosity dominated the tradition factor. Items that express deference to customs or acceptance of one’s circumstances loaded moderately. Items about humility and modesty did not load on tradition and loaded only mildly on social desirability. Modesty does not seem central to traditionalist values, at least in Italy.

#### Conformity

| | Social Desirability | Conformity |
|-|-|-|
| **SVS Items** | | |
| POLITENESS (courtesy, good manners) | 0.14 | 0.78 |
| HONOURING OF PARENTS AND ELDERS (showing respect) | 0.20 | 0.55 |
| SELF DISCIPLINE (self restraint, resistance to temptation) | 0.07 | -0.25 |
| OBEDIENT (dutiful, meeting obligations) | 0.31 | -0.51 |
| **PVQ Items** | | |
| It is important to him/her to be polite to other people all the time. He/She tries never to disturb or irritate others. | 0.20 | 0.69 |
| It is important to him/her to be obedient. He/She believes he/she should always show respect to his/her parents and to older people. | 0.33 | 0.57 |
| It is important to him/her always to behave properly. He/She wants to avoid doing anything people would say is wrong. | 0.33 | -0.10 |
| He/She believes that people should do what they're told. He/She thinks people should follow rules at all times, even when no-one is watching. | 0.38 | -0.43 |

Politeness and respect for parents or elders loaded well on the conformity factor. Items about obedience and self-discipline loaded negatively. This surprised me. It may be that politeness and respect of parents/elders are more about social harmony, while self-discipline and obedience are more related to some other value. The PVQ items had weak-to-moderate positive loadings on the social desirability factor.

#### Security

| | Social Desirability | Security |
|-|-|-|
| **SVS Items** | | |
| NATIONAL SECURITY (protection of my nation from enemies) | 0.03 | 0.74 |
| SOCIAL ORDER (stability of society) | 0.04 | 0.64 |
| CLEAN (neat, tidy) | 0.17 | 0.30 |
| FAMILY SECURITY (safety for loved ones) | 0.05 | -0.12 |
| RECIPROCATION OF FAVOURS (avoidance of indebtedness) | 0.01 | -0.16 |
| **PVQ Items** | | |
| It is very important to him/her that his/her country be safe from threats from within and without. He/She is concerned that social order be protected. | 0.07 | 0.68 |
| Having a stable government is important to him/her. He/She is concerned that the social order be protected. | 0.13 | 0.65 |
| It is important to him/her to live in secure surroundings. He/She avoids anything that might endanger his/her safety. | 0.12 | 0.52 |
| It is important to him/her that things be organized and clean. He/She doesn't want things to be a mess. | 0.10 | 0.12 |
| He/She tries hard to avoid getting sick. Staying healthy is very important to him/her. | 0.08 | 0.10 |

National security and social order items loaded strongly on the security factor. Items about family security, cleanliness, and avoiding illness loaded weakly. Respondents appear to interpret "security" in societal terms more than in personal or domestic terms.

#### Power

| | Social Desirability | Power |
|-|-|-|
| **SVS Items** | | |
| AUTHORITY (the right to lead or command) | 0.03 | 0.85 |
| SOCIAL POWER (control over others, dominance) | -0.03 | 0.83 |
| WEALTH (material possessions, money) | -0.06 | 0.67 |
| PRESERVING MY PUBLIC IMAGE (protecting my "face") | 0.02 | 0.57 |
| OBSERVING SOCIAL NORMS (to maintain face) | 0.56 | 0.15 |
| **PVQ Items** | | |
| It is important to him/her to be in charge and tell others what to do. He/She wants people to do what he/she says. | 0.04 | 0.84 |
| It is important to him/her to be rich. He/She wants to have a lot of money and expensive things. | -0.02 | 0.72 |
| He/She always wants to be the one who makes the decisions. He/She likes to be the leader. | 0.08 | 0.66 |

Authority, leadership, and wealth all loaded strongly on the power factor. The item on "observing social norms" behaved differently: it loaded weakly on power but moderately on social desirability. Respondents might be treating "observing social norms" as an aspect of conformity rather than as an aspect of power.

#### Achievement

| | Social Desirability | Achievement |
|-|-|-|
| **SVS Items** | | |
| SUCCESSFUL (achieving goals) | 0.08 | 0.72 |
| AMBITIOUS (hard working, aspiring) | 0.15 | 0.66 |
| INFLUENTIAL (having an impact on people and events) | -0.15 | 0.48 |
| CAPABLE (competent, effective, efficient) | 0.24 | 0.46 |
| **PVQ Items** | | |
| Getting ahead in life is important to him/her. He/She strives to do better than others. | 0.00 | 0.80 |
| Being very successful is important to him/her. He/She likes to impress other people. | -0.21 | 0.71 |
| He/She thinks it is important to be ambitious. He/She wants to show how capable he/she is. | 0.08 | 0.69 |
| It's very important to him/her to show his/her abilities. He/She wants people to admire what he/she does. | -0.14 | 0.60 |

All items produced strong loadings on the achievement factor. Items that imply a desire to impress others loaded negatively on social desirability. This may be because claiming that one wants admiration appears boastful; respondents may downplay that desire even if they endorse other achievement-related goals.

#### Hedonism

| | Social Desirability | Hedonism |
|-|-|-|
| **SVS Items** | | |
| ENJOYING LIFE (enjoying food, sex, leisure, etc) | -0.04 | 0.81 |
| PLEASURE (gratification of desires) | 0.04 | 0.77 |
| SELF-INDULGENT (doing pleasant things) | 0.16 | 0.69 |
| **PVQ Items** | | |
| Enjoying life's pleasures is important to him/her. He/She likes to 'spoil' himself/herself. | 0.01 | 0.83 |
| He/She seeks every chance he/she can to have fun. It is important to him/her to do things that give him/her pleasure. | -0.03 | 0.76 |
| He/She really wants to enjoy life. Having a good time is very important to him/her. | -0.08 | 0.69 |

Hedonism items loaded strongly on their factor and showed minimal loadings on social desirability. Respondents appear comfortable admitting that pleasure matters to them.

#### Stimulation

| | Social Desirability | Stimulation |
|-|-|-|
| **SVS Items** | | |
| DARING (seeking adventure, risk) | -0.04 | 0.81 |
| AN EXCITING LIFE (stimulating experiences) | 0.01 | 0.80 |
| A VARIED LIFE (filled with challenge, novelty and change) | 0.10 | 0.76 |
| **PVQ Items** | | |
| He/She likes to take risks. He/She is always looking for adventures. | -0.02 | 0.78 |
| He/She thinks it is important to do lots of different things in life. He/She always looks for new things to try. | 0.03 | 0.69 |
| He/She likes surprises. It is important to him/her to have an exciting life. | 0.11 | 0.49 |

Stimulation items loaded cleanly on their factor and showed minimal loadings on social desirability. Respondents appear comfortable admitting that adventure, novelty, and excitement matter to them.

#### Self-Direction

| | Social Desirability | Self-Direction |
|-|-|-|
| **SVS Items** | | |
| INDEPENDENT (self reliant, self sufficient) | 0.07 | 0.81 |
| FREEDOM (freedom of action and thought) | 0.03 | 0.73 |
| CHOOSING OWN GOALS (selecting own purposes) | 0.06 | 0.72 |
| CURIOUS (interested in everything, exploring) | 0.02 | 0.69 |
| CREATIVITY (uniqueness, imagination) | 0.04 | 0.39 |
| **PVQ Items** | | |
| It is important to him/her to be independent. He/She likes to rely on himself/herself. | 0.08 | 0.82 |
| He/She thinks it's important to be interested in things. He/She likes to be curious and to try to understand all sorts of things. | -0.02 | 0.73 |
| It is important to him/her to make his/her own decisions about what he/she does. He/She likes to be free to plan and to choose his/her activities for himself/herself. | 0.05 | 0.47 |
| Thinking up new ideas and being creative is important to him/her. He/She likes to do things in his/her own original way. | -0.05 | 0.24 |

Independence, freedom, and curiosity loaded strongly on the self-direction factor. Creativity items loaded weakly. Items displayed minimal loadings on social desirability.

#### Spirituality

| | Social Desirability | Spirituality |
|-|-|-|
| **SVS Items** | | |
| TRUE FRIENDSHIP (close, supportive friends) | -0.01 | 0.79 |
| SELF RESPECT (belief in one's own worth) | -0.01 | 0.75 |
| INNER HARMONY (at peace with myself) | 0.02 | 0.73 |
| HEALTHY (not being sick physically or mentally) | 0.07 | 0.73 |
| MEANING IN LIFE (a purpose in life) | 0.11 | 0.71 |
| INTELLIGENT (logical, thinking) | 0.08 | 0.58 |
| PRIVACY (the right to have a private sphere) | 0.15 | 0.55 |
| MATURE LOVE (deep emotional & spiritual intimacy) | 0.12 | 0.48 |
| SENSE OF BELONGING (feeling that others care about me) | -0.07 | 0.20 |
| SOCIAL RECOGNITION (respect, approval by others) | -0.05 | 0.11 |
| A SPIRITUAL LIFE (emphasis on spiritual not material matters) | 0.11 | -0.52 |

Items about friendship, self-respect, inner harmony, and meaning formed a loose cluster. The one item that explicitly referenced a spiritual life ("emphasis on spiritual not material matters") loaded negatively. The factor seems to capture personal stability and emotional groundedness rather than spirituality as ordinarily understood.

## D&D Alignments

[Easydamus](https://easydamus.com/alignmentreal.html) has noticed that Schwartz values align somewhat with D&D alignments, allowing for a "positive" alignment system—that is, one where there are no clearly 'bad' alignments. They map alignments to values as follows: 
- Lawful Good - Conformity/Tradition and Benevolence
- Neutral Good - Benevolence and Universalism
- Chaotic Good - Universalism and Self-Direction
- Chaotic Neutral - Self-Direction and Stimulation
- Chaotic Evil - Hedonism
- Neutral Evil - Achievement and Power
- Lawful Evil - Power and Security
- Lawful Neutral - Security and Conformity/Tradition

Schwartz also notes that the values can be organized into four higher-order groups. 
- Openness to change: Self-direction, Stimulation
- Self-enhancement: Hedonism, Achievement, Power
- Conservation: Security, Conformity, Tradition
- Self-transcendence: Benevolence, Universalism

These higher-order groups map nicely onto the axes of the D&D alignment system. 
- Self-transcendence vs. self-enhancement aligns with the good–evil dimension: prioritizing the welfare of others versus pursuing personal advantage.
- Openness to change vs. conservation parallels the chaos–law dimension: favoring autonomy and novelty versus stability, order, and tradition.

Easydamus has made a diagram that conveys this quite neatly:

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/schwartz-sdr/easydamus-alignment.png" width="600" alt="Alt text">
    </figure>
</div>

Though the correspondence is informal, it's still interesting to note.

[^1]: [Value priorities, impression management and self-deceptive enhancement: Once again, much substance and a little bit of style](/assets/pdfs/doi-10.1080_00224545.2020.1778619.pdf)