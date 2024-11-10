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
            console.log(`Navigating to: ${targetId}`); // Debugging line
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
            contentPages.forEach(page => {
                page.classList.remove('active');
            });

            // Show all navigation links
            navLinks.forEach(nav => {
                nav.style.display = 'block';
            });

            // Hide 'Indietro' button
            const backArrow = document.querySelector('.back-arrow');
            if (backArrow) {
                backArrow.style.display = 'none';
            }
        });
    }
}

function showPage(targetId, contentPages) {
    contentPages.forEach(page => {
        if (page.id === targetId) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });
}