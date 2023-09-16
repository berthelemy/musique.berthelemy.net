---
title: Ressources
permalink: /ressources
layout: default
---
{% for ressource in site.ressources %}
<h3><a href="{{ ressource.url | relative_url }}">{{ ressource.title }}</a></h3>
<p>{{ ressource.tagline }}</p>
<p>Niveau: {{ resource.difficulty }}</p>
{% endfor %}