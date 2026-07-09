---
layout: page
title: Interactives
permalink: /interactives/
redirect_from:
  - /quizzes/
---
<h1>All Interactives</h1>
<ul>
  {% for post in site.interactives %}
    <li>
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      ({{ post.date | date: "%b %-d, %Y" }})
    </li>
  {% endfor %}
</ul>
