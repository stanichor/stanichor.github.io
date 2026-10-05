---
layout: home
---
{% include about-content.md %}

{% assign favorites = site.posts | where: "favorite", true %}
<h2>My Favorites</h2>
<ul>
  {% for post in favorites %}
    <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

<div class="home-category-grid">
  {% for category in site.data.home_categories %}
    {% assign category_posts = site.categories[category.slug] %}
    <section class="home-category">
      <h2>{{ category.title }}</h2>
      <ul>
        {% for post in category_posts %}
          <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
        {% endfor %}
      </ul>
    </section>
  {% endfor %}
  {% assign interactives = site.interactives | sort: "date" | reverse %}
  <section class="home-category">
    <h2>Interactives</h2>
    <ul>
      {% for interactive in interactives %}
        <li><a href="{{ interactive.url | relative_url }}">{{ interactive.title }}</a></li>
      {% endfor %}
    </ul>
  </section>
</div>
