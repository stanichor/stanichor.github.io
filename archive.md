---
layout: page
title: Archive
permalink: /archive/
---
<h1>All Posts</h1>
<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      ({{ post.date | date: "%b %-d, %Y" }})
    </li>
  {% endfor %}
</ul>