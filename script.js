document.addEventListener('DOMContentLoaded', () => {
    const tempDisplay = document.getElementById('temperature-display');
    const increaseBtn = document.getElementById('increase-btn');
    const decreaseBtn = document.getElementById('decrease-btn');

    // Initialize temperature from localStorage or default to 0
    let temperature = parseInt(localStorage.getItem('temperature')) || 0;
    tempDisplay.textContent = `${temperature}°C`;

    // Function to update temperature display and localStorage
    function updateTemperature(newTemp) {
        temperature = newTemp;
        tempDisplay.textContent = `${temperature}°C`;
        localStorage.setItem('temperature', temperature);
    }

    // Event listeners for buttons
    increaseBtn.addEventListener('click', () => updateTemperature(temperature + 1));
    decreaseBtn.addEventListener('click', () => updateTemperature(temperature - 1));
});

