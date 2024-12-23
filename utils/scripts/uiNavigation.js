// ...existing code...

export function initNavigation(navLinks, contentPages) {
    if (!navLinks || !contentPages) {
        console.error('Navigation elements are missing in the DOM.');
        return;
    }

    // Add menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('show');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            console.log(`Navigating to: ${targetId}`); // Debugging line
            showPage(targetId, contentPages);

            // Remove hiding of nav links
            /*
            navLinks.forEach(nav => {
                if (!nav.closest('.back-arrow')) {
                    nav.style.display = 'none';
                    console.log(`Hiding navigation link: ${nav.textContent}`);
                }
            });
            */

            // Ensure 'Indietro' button is displayed
            const backArrow = document.querySelector('.back-arrow');
            if (backArrow) {
                backArrow.style.display = 'block';
                console.log('Displaying "Indietro" button');
            }

            // Hide nav menu on link click (for mobile)
            if (navLinksContainer.classList.contains('show')) {
                navLinksContainer.classList.remove('show');
            }
        });
    });

    const backArrowLink = document.querySelector('.back-arrow a');
    if (backArrowLink) {
        backArrowLink.addEventListener('click', function(event) {
            event.preventDefault();
            console.log('Back arrow clicked - Returning to Home');
            contentPages.forEach(page => {
                page.classList.remove('active');
                console.log(`Removing 'active' from: ${page.id}`);
            });

            // Show all navigation links
            navLinks.forEach(nav => {
                nav.style.display = 'block';
                console.log(`Displaying navigation link: ${nav.textContent}`);
            });

            // Hide 'Indietro' button
            const backArrow = document.querySelector('.back-arrow');
            if (backArrow) {
                backArrow.style.display = 'none';
                console.log('Hiding "Indietro" button');
            }

            // Activate Home Page
            const homePage = document.getElementById('home');
            if (homePage) {
                homePage.classList.add('active');
                console.log('Activating Home page');
            }
        });
    }
}

// ...existing code...

function showPage(targetId, contentPages) {
    let pageFound = false;
    contentPages.forEach(page => {
        if (page.id === targetId) {
            page.classList.add('active');
            console.log(`Activated page: ${page.id}`);
            pageFound = true;
        } else {
            page.classList.remove('active');
            console.log(`Deactivated page: ${page.id}`);
        }
    });

    if (!pageFound) {
        console.warn(`No page found with ID: ${targetId}`); 
    }
}
