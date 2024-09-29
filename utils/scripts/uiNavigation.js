// utils/scripts/uiNavigation.js

import { sendLettersPageEmail } from './email.js';

export function initNavigation(navLinks, contentPages) {
    if (!navLinks || !contentPages) {
        console.error('Navigation elements are missing in the DOM.');
        return;
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showPage(targetId, contentPages);

            // Hide all navigation links except 'Indietro'
            navLinks.forEach(nav => {
                if (!nav.closest('.back-arrow')) {
                    nav.style.display = 'none';
                }
            });

            // Ensure 'Indietro' button is displayed
            const backArrow = document.querySelector('.back-arrow');
            if (backArrow) {
                backArrow.style.display = 'block';
            }
        });
    });

    const backArrowLink = document.querySelector('.back-arrow a');
    if (backArrowLink) {
        backArrowLink.addEventListener('click', function(event) {
            event.preventDefault();
            navLinks.forEach(nav => {
                nav.style.display = 'block';
            });
            showPage('home', contentPages);
            const backArrow = document.querySelector('.back-arrow');
            if (backArrow) {
                backArrow.style.display = 'none';
            }
        });
    }
}

function showPage(id, contentPages) {
    contentPages.forEach(page => {
        page.classList.remove('active');
    });

    const targetPage = document.getElementById(id);
    if (targetPage) {
        targetPage.classList.add('active');

        if (id === 'letters1') {
            sendLettersPageEmail();
        }
    } else {
        console.error(`Page with id "${id}" not found.`);
    }
}
