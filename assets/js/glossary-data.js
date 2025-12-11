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
            // Only process <p> elements (ignore headings, lists, etc.)
            const contentSelector = 'p:not([data-glossary-applied])';
            const terms = Object.keys(glossary);

            // helper: escape term for safe use in RegExp (handles characters like +, #, etc.)
            function escapeRegExp(s) {
                return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            }
            
            // sort by length so longer terms are matched before substrings
            const termsSorted = terms.slice().sort((a, b) => b.length - a.length);
            const regex = new RegExp(`\\b(${termsSorted.map(escapeRegExp).join('|')})\\b`, 'gi');

            // track which glossary keys we've already replaced (only first instance per page)
            const replaced = new Set();
            // map lowercased match -> canonical key in glossary for fast lookup
            const keyMap = {};
            terms.forEach(k => { keyMap[k.toLowerCase()] = k; });

            // Walk text nodes inside each <p> and replace only text nodes (preserve inline markup)
            document.querySelectorAll(contentSelector).forEach(p => {
                const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, null, false);
                const toReplace = [];
                while (walker.nextNode()) {
                    const node = walker.currentNode;
                    if (!node.nodeValue || !regex.test(node.nodeValue)) continue;
                    // reset regex.lastIndex because we reuse it
                    regex.lastIndex = 0;
                    const newHtml = node.nodeValue.replace(regex, (match) => {
                        const lc = match.toLowerCase();
                        const termKey = keyMap[lc];
                        if (!termKey || replaced.has(termKey)) return match;
                        replaced.add(termKey);
                        const definition = glossary[termKey];
                        return `<span class="glossary-term" data-definition="${definition}">${match}</span>`;
                    });
                    if (newHtml !== node.nodeValue) toReplace.push({ node, newHtml });
                }

                // Perform replacements (replace text nodes with fragment containing HTML)
                toReplace.forEach(({ node, newHtml }) => {
                    const span = document.createElement('span');
                    span.innerHTML = newHtml;
                    const frag = document.createDocumentFragment();
                    while (span.firstChild) frag.appendChild(span.firstChild);
                    node.parentNode.replaceChild(frag, node);
                });

                p.setAttribute('data-glossary-applied', 'true');
            });
        }
        
        // --- 3. Custom Tooltip Implementation (JS) ---
        function setupTooltips() {
            // create single tooltip element
            const tooltip = document.createElement('div');
            tooltip.classList.add('glossary-tooltip');

            // ensure tooltip doesn't affect layout or steal pointer events
            tooltip.style.position = 'absolute';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.opacity = '0';
            tooltip.style.transition = 'opacity 140ms ease';
            tooltip.style.display = 'none';
            tooltip.style.zIndex = '9999';

            document.body.appendChild(tooltip);

            let hideTimer = null;

            // helper to show tooltip for a term element
            function showTooltipFor(term, event) {
                if (!term) return;
                // cancel pending hide
                if (hideTimer) {
                    clearTimeout(hideTimer);
                    hideTimer = null;
                }

                const definition = term.getAttribute('data-definition') || '';
                tooltip.textContent = definition;
                tooltip.style.display = 'block';
                tooltip.style.opacity = '0'; // ensure transition runs

                // position after browser has laid out the tooltip content to avoid reflow/mouseleave
                requestAnimationFrame(() => {
                    const rect = term.getBoundingClientRect();
                    const tooltipW = tooltip.offsetWidth;
                    const tooltipH = tooltip.offsetHeight;
                    const scrollX = window.scrollX || window.pageXOffset;
                    const scrollY = window.scrollY || window.pageYOffset;

                    // center horizontally on term; place below with small offset
                    let left = rect.left + rect.width / 2 - tooltipW / 2 + scrollX;
                    let top = rect.bottom + 12 + scrollY;

                    // clamp to viewport
                    if (left < 8 + scrollX) left = 8 + scrollX;
                    if (left + tooltipW > window.innerWidth - 8 + scrollX) left = window.innerWidth - tooltipW - 8 + scrollX;
                    // if bottom would go off screen, show above the term
                    if (top + tooltipH > window.innerHeight + scrollY - 8) {
                        top = rect.top - tooltipH - 12 + scrollY;
                    }

                    tooltip.style.left = `${left}px`;
                    tooltip.style.top = `${top}px`;
                    // small delay to ensure layout stable
                    requestAnimationFrame(() => { tooltip.style.opacity = '1'; });
                });
            }

            // helper to hide tooltip (with small delay to avoid flicker)
            function hideTooltip() {
                if (hideTimer) clearTimeout(hideTimer);
                tooltip.style.opacity = '0';
                hideTimer = setTimeout(() => {
                    tooltip.style.display = 'none';
                    hideTimer = null;
                }, 180);
            }

            // attach listeners (mouseenter/mouseleave + focus/blur for keyboard)
            document.querySelectorAll('.glossary-term').forEach(term => {
                // make terms keyboard-focusable for accessibility
                if (!term.hasAttribute('tabindex')) term.setAttribute('tabindex', '0');

                term.addEventListener('mouseenter', (e) => showTooltipFor(term, e));
                term.addEventListener('mouseleave', () => hideTooltip());
                term.addEventListener('focus', (e) => showTooltipFor(term, e));
                term.addEventListener('blur', () => hideTooltip());

                // update position if mouse moves within the term (keeps tooltip aligned)
                term.addEventListener('mousemove', (e) => {
                    // small optimization: reposition only if tooltip visible
                    if (tooltip.style.display === 'block') showTooltipFor(term, e);
                });
            });

            // hide tooltip on scroll/resize to avoid mismatch
            window.addEventListener('scroll', () => {
                if (tooltip.style.display === 'block') hideTooltip();
            }, { passive: true });
            window.addEventListener('resize', () => {
                if (tooltip.style.display === 'block') hideTooltip();
            });
        }

        // Run both functions once the document is fully loaded
        document.addEventListener('DOMContentLoaded', () => {
            applyGlossaryLinks();
            setupTooltips();
        });
