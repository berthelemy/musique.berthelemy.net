---
title: Leçons pour les débutants
permalink: /debutants
layout: no-sidebar
image: 
image-alt: 
---
{% assign lecons-sorted = site.lecons | sort: "auteur" %}
{% assign events = item_types.event.published_items | nested_sort:"contents.starts_at" %}
{% for lecon in site.lecons %}
{% if lecons.active != false and lecons.niveau == "debutant" %}

<h3><a href="{{ lecon.url | relative_url }}">{{ lecon.title }}</a></h3>
<p>Auteur: {{ lecon.auteur }}</p>
{% endif %}
{% endfor %}