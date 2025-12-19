---
layout: post
title: "Game theory does not imply we get (or do) nice things"
date: 2025-12-18
permalink: /game-theory-morality/
categories: 
---

Moral realism is false. Yet the desire to base morality on something “objective” remains. In the past, we could ground morality in God, in natural law, or in tradition. Today, these positions are much less tenable. All we have left is reason. So modern man attempts to ground morality in reason, in logic, in math. The hope is that we can derive moral rules that everyone—man, machine, and monster alike—will be bound by. And so we turn to game theory.

## Game theory does not imply that we be moral 

When grounding morality via game theory, people almost always point to the Prisoner’s Dilemma (and little else). My readers should already be familiar with the game, but I'll briefly explain it. You have two choices: cooperate or defect. No matter what your counterpart does, it is always better to defect than to cooperate. Yet both players prefer mutual cooperation to mutual defection. Under conventional decision theories, the players are doomed to mutual defection, despite a better world being tantalizingly close.

To escape this bind, we need repetition. In the Iterated Prisoner’s Dilemma, [Tit-for-Tat](https://en.wikipedia.org/wiki/Tit_for_tat) emerges as a simple yet successful strategy. Tit-for-Tat cooperates with those who previously cooperated with it, and defects against those who previously defected against it. From this, we are tempted to extract morality. If we define what is right as what is optimal, then we appear to have shown, via logic, that it is righteous to cooperate, righteous to punish evildoers, and—by modifying Tit-for-Tat to handle mistakes—even righteous to occasionally forgive. Yet if we are grounding the moral in the optimal, we should ensure that our chosen policy is actually optimal.

If you care about utility[^utility], then you *want* your opponent to cooperate while you defect. If you are playing against Cooperate-Bot[^cooperate-bot], then the optimal action—by the previous logic, the righteous action—is to defect. That doesn't sound right. It cannot be moral to defect against those who cooperate so unselfishly with us. And indeed, it is not[^nice].

At this point in the essay, I want to say, “The moral action is not necessarily the game-theoretically correct one.” But that is not quite true. The real problem is that, as [Eliezer Yudkowsky notes](https://www.lesswrong.com/posts/HFyWNBnDNEDsDNLrZ/the-true-prisoner-s-dilemma), “the standard visualization of the [Prisoner’s Dilemma](http://en.wikipedia.org/wiki/Prisoner%27s_dilemma) is fake.” The choices themselves hint at this fakeness: cooperate or defect. We do not actually want to defect; we want to cooperate. Cooperation is Good. Defection is Bad. 

As humans, we have a sense of fairness, empathy, and altruism. When playing the Prisoner’s Dilemma, we ask how to ensure mutual cooperation, and we elevate Tit-For-Tat as the pinnacle of IPD strategies, conveniently ignoring that, given the payoffs as stated, we should be trying to trick the other player into cooperating while we defect, repeatedly. If one considers a *true* Prisoner’s Dilemma[^true-pd]–that is, one in which the specified payoffs reflect our actual human preferences–then one really does want to take the game-theoretically correct action. 

The moral action *is* the game-theoretically correct one ...if you actually take care to calculate payoffs according to your actual preferences, which includes your moral values. These values are not grounded in game theory; they come from a source outside of it and are merely taken as inputs. And you really do have to calculate: labeling the “good” action as Cooperate and the “bad” action as Defect is not enough. In any case, there are many more games than the Prisoner’s Dilemma and its variants, but the same logic holds for all of them.

## Game theory does not imply that others be moral

Even if we can use game theory to justify our acting kindly towards others, it offers no guarantee that *others* will act kindly towards us. Optimal strategies cut both ways. Game theory does not promise fairness; it only describes equilibria among agents with power and preferences. You only get the outcomes that you[^friends] have the power to enforce.

People often point to Shapley values as a universal definition of fairness that even aliens would supposedly invent. And they may even be right; Shapley values do have attractive mathematical properties. But nothing obligates an agent to distribute gains according to them. The same is true of Nash bargaining solutions, Pareto efficiency, or any other cooperative ideal. These are descriptions of outcomes that can arise under certain assumptions, not moral requirements. If an agent can secure a better payoff by ignoring these norms, game theory gives them no reason not to. If someone is too weak, too uncoordinated, or too replaceable to demand their fair share, it is entirely possible that they simply will not get what they “deserve.”

## What game theory is good for

Game theory is good for many things. It can help us predict how interactions will unfold, given certain conditions. It can help us design systems so that particular outcomes occur, given certain conditions. It can tell us what the optimal action is, given certain conditions and already-fixed preferences. And it can even help explain why we have the values that we do.

But it cannot justify those values. Values do not need to be justified. Values are not justified. They simply are.

[^utility]: Utility is, definitionally, all you care about.
[^cooperate-bot]: Cooperate-Bot is an agent that always cooperates, no matter what.
[^nice]: At least, under certain moral theories. But I'm assuming you're a nice person. If you're not, you probably don't need to read this essay.
[^true-pd]: Yudkowsky describes a scenario in which Player 1 is some humane intelligence, while Player 2 is an UnFriendly AI. For some contrived reason, 4 billion human beings are suffering from a fatal illness that can only be cured by substance S, which just so happens to be incredibly inefficient for making paperclips. For more contrived reasons, we've got to play the Prisoner's Dilemma and the payoffs are as follows. Mutual cooperation leads to 2 billion human lives saved and 2 paperclips made. Mutual defection leads to 1 billion human lives saved and 1 paperclip made. If Player 1 defects while Player 2 cooperates, 3 billion human lives are saved, while 0 paperclips are made. If Player 1 cooperats while Player 2 defects, 0 human lives are saved while 3 paperclips are made.
[^friends]: Or agents sympathetic to your interests.