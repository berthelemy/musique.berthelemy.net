---
title: Leçons
permalink: /lecons
layout: no-sidebar
image: 
image-alt: 
---
{% for accompagnement in site.accompagnements %}
{% if accompagnement.active != false %}
<h3><a href="{{ accompagnement.url | relative_url }}">{{ accompagnement.title }}</a></h3>
<p>Tonalité: {{ accompagnement.key }}</p>
<p>Type: {{ accompagnement.type }}</p>
<p>Niveau: {{ accompagnement.difficulty }}</p>
{% endif %}
{% endfor %}