---
layout: page
title: Quizzes
permalink: /quizzes/
---
<h1>All Quizzes</h1>
<ul>
  {% for post in site.quizzes %}
    <li>
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      ({{ post.date | date: "%b %-d, %Y" }})
    </li>
  {% endfor %}
</ul>