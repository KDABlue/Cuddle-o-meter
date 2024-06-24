document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentPages = document.querySelectorAll('.content-page');
    const tempDisplay = document.getElementById('temperature-display');
    const increaseBtn = document.getElementById('increase-btn');
    const decreaseBtn = document.getElementById('decrease-btn');
    const title = document.getElementById('title');
    const mercury = document.getElementById('mercury');

    // Initialize temperature from localStorage or default to 0
    let temperature = parseInt(localStorage.getItem('temperature')) || 0;
    updateThermometer(temperature);

    // Function to update thermometer display, mercury height, and localStorage
    function updateThermometer(temp) {
        temperature = temp;
        tempDisplay.textContent = `${temperature}°C`;
        mercury.style.height = `${(temperature / 23) * 100}%`;
        localStorage.setItem('temperature', temperature);
    }

    // Event listeners for buttons with range limits
    increaseBtn.addEventListener('click', () => {
        if (temperature < 23) updateThermometer(temperature + 1);
    });

    decreaseBtn.addEventListener('click', () => {
        if (temperature > 0) updateThermometer(temperature - 1);
    });

    // Function to change title color every few seconds
    function changeTitleColor() {
        const colors = ['red', 'green', 'blue', 'orange', 'purple'];
        let currentColorIndex = 0;

        setInterval(() => {
            title.style.color = colors[currentColorIndex];
            currentColorIndex = (currentColorIndex + 1) % colors.length;
        }, 2000); // Change color every 2 seconds
    }

    changeTitleColor();

    // Navigation functionality
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showPage(targetId);
        });
    });

    function showPage(id) {
        contentPages.forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(id).classList.add('active');
    }

    // Initially show the home page
    show
