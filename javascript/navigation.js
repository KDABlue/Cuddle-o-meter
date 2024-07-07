export function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentPages = document.querySelectorAll('.content-page');

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showPage(targetId);

            // Hide all navigation links except 'Indietro'
            navLinks.forEach(nav => {
                if (!nav.closest('.back-arrow')) {
                    nav.style.display = 'none';
                }
            });

            // Ensure 'Indietro' button is displayed
            document.querySelector('.back-arrow').style.display = 'block';
        });
    });

    document.querySelector('.back-arrow a').addEventListener('click', function(event) {
        
        event.preventDefault();
+
        navLinks.forEach(nav => {
            nav.style.display = 'block';
        });

        showPage('home');

        document.querySelector('.back-arrow').style.display = 'none';
    });

    function showPage(id) {
        contentPages.forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(id).classList.add('active');
    }

    showPage('home');
}
