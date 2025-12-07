---
layout: generic
title: Comprendre le son
permalink: /technologie/comprendre-le-son
description: Découvrez la nature du son et comment il peut se transformer en musique.
---


<ul>
  {% for item in site.technologie %}
    <li>
      <a href="{{ item.url }}">{{ item.title }}</a><br>
      {{ item.description }}
    </li>
  {% endfor %}
</ul>