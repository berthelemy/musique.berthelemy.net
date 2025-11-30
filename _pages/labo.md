---
layout: default
title: Laboratoire
permalink: /labo
---

<ul>
  {% for lab in site.labo %}
    <li>
      <a href="{{ lab.url }}">{{ lab.title }}</a>
    </li>
  {% endfor %}
</ul>