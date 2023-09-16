---
title: Ressources
permalink: /ressources
layout: default
image: 
image-alt: 
---
{% for ressource in site.ressources %}
<h3><a href="{{ ressource.url | relative_url }}">{{ ressource.title }}</a></h3>
<p>{{ ressource.tagline }}</p>
<p>Type: {{ ressource.type }}</p>
<p>Niveau: {{ ressource.difficulty }}</p>
{% endfor %}