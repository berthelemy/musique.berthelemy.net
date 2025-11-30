---
layout: null
permalink: /assets/js/glossary-data.js
---
// --- 1. Data Preparation (Glossary) ---
// Define the glossary object using Jekyll's data and Liquid filtering
const glossary = {
{%- assign data = site.data.glossary -%}
{%- for item in data -%}
    "{{ item.term | upcase }}": "{{ item.definition | escape }}",
{%- endfor -%}
};


        

        // --- 2. Text Replacement and Element Creation ---
        function applyGlossaryLinks() {
            // Select elements to search within, excluding scripts, styles, and already linked/processed elements
            const contentSelector = 'body *:not(script):not(style):not(a):not(span.glossary-term):not([data-glossary-applied])';
            const terms = Object.keys(glossary);
            
            // Create a regular expression to match whole words (case-insensitive)
            // The `\\b` ensures a whole word match (e.g., prevents matching 'CSS' inside 'PROCESS')
            const regex = new RegExp(`\\b(${terms.join('|')})\\b`, 'gi'); 

            document.querySelectorAll(contentSelector).forEach(element => {
                // Only process elements that contain pure text and have no other child elements
                if (element.children.length === 0) {
                    let content = element.innerHTML;
                    
                    // Replace the term
                    content = content.replace(regex, (match) => {
                        // Find the key in the glossary (using the case-insensitive match for lookup)
                        const termKey = terms.find(key => key.toLowerCase() === match.toLowerCase());
                        const definition = glossary[termKey];
                        
                        // Wrap the match in a span with the necessary class and data attribute
                        return `<span class="glossary-term" data-definition="${definition}">${match}</span>`;
                    });

                    element.innerHTML = content;
                    // Mark the element as processed to prevent re-processing
                    element.setAttribute('data-glossary-applied', 'true');
                }
            });
        }
        
        // --- 3. Custom Tooltip Implementation (JS) ---
        function setupTooltips() {
            // 1. Create the persistent tooltip element once
            const tooltip = document.createElement('div');
            tooltip.classList.add('glossary-tooltip');
            document.body.appendChild(tooltip);

            // 2. Add event listeners to all glossarized terms
            document.querySelectorAll('.glossary-term').forEach(term => {
                const definition = term.getAttribute('data-definition');

                term.addEventListener('mouseenter', (event) => {
                    // Update content and position
                    tooltip.textContent = definition;
                    tooltip.style.opacity = '1'; // Show it
                    tooltip.style.display = 'block';

                    const rect = event.target.getBoundingClientRect();
                    const scrollY = window.scrollY;
                    const tooltipHeight = tooltip.offsetHeight;
                    const tooltipWidth = tooltip.offsetWidth;

                    // Calculate position to center it horizontally and place it below the term
                    let leftPos = rect.left + (rect.width / 2) - (tooltipWidth / 2);
                    let topPos = rect.bottom + scrollY + 8; // 8px offset below the term

                    // Basic check to keep it from going off the right edge
                    if (leftPos + tooltipWidth > window.innerWidth) {
                        leftPos = window.innerWidth - tooltipWidth - 10;
                    }
                    // Basic check to keep it from going off the left edge
                    if (leftPos < 10) {
                        leftPos = 10;
                    }

                    tooltip.style.left = `${leftPos}px`;
                    tooltip.style.top = `${topPos}px`;
                });

                term.addEventListener('mouseleave', () => {
                    // Hide the tooltip
                    tooltip.style.opacity = '0';
                    // Delay setting display to 'none' to allow transition to complete
                    setTimeout(() => {
                        tooltip.style.display = 'none';
                    }, 200); 
                });
            });
        }

        // Run both functions once the document is fully loaded
        document.addEventListener('DOMContentLoaded', () => {
            applyGlossaryLinks();
            setupTooltips();
        });
    