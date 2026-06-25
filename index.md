---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---
{% include about-content.md %}

{% assign section_titles = 
  "rationalist:Rationalist Related,
   psychometrics-theoretical:Psychometrics (Theoretical),
   psychometrics-practical:Psychometrics (Practical),
   media-analysis:Media Analysis,
   rant:Rants,
   other:Other" | split: "," %}

<h2>My Favorites</h2>

<ul>
  {% assign favorites = site.posts | where: "favorite", true %}
  {% for post in favorites %}
    <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

{% for section_pair in section_titles %}
  {% assign parts = section_pair | strip | split: ":" %}
  {% assign section_key = parts[0] %}
  {% assign section_title = parts[1] %}

  <h2>{{ section_title }}</h2>

  <ul>
    {% assign section_posts = site.posts | where: "section", section_key %}
    {% for post in section_posts %}
      <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
    {% endfor %}
  </ul>
{% endfor %}