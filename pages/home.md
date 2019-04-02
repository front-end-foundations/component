---
layout: layouts/layout.html
pageTitle: Home
tags:
  - nav
navTitle: Home
date: 2010-01-01
permalink: /
---

{% for page in collections.pages %}
  <h2><a href="{{ page.url }}">{{ page.data.pageTitle | upcase }}</a></h2>
  <em>{{ page.date | date: "%Y-%m-%d" }}</em>
{% endfor %}