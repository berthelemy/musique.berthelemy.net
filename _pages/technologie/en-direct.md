---
layout: generic
title: Spectacle en direct
permalink: /technologie/en-direct
description: 
category: en-direct
---
<div class="row justify-content-center g-5">

        {%- for item in site.technologie -%}
        {%- if item.active == true and item.category == page.category -%}
        <div class="col-md-6" data-aos="fade-right" data-aos-delay="100">
            <div class="service-item">
              <div class="service-icon">
                <i class="bi bi-music-note-beamed"></i>
              </div>
              <div class="service-content">
                <h3>{{ item.title}}</h3>
                <p>{{ item.description }}</p>
                <a href="{{ item.url }}" class="service-link stretched-link">
                  <span>En plus</span>
                  <i class="bi bi-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>




{%- endif -%}
{%- endfor -%}