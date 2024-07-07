export function initThermometer() {
    const tempDisplay = document.getElementById('temperature-display');
    const increaseBtn = document.getElementById('increase-btn');
    const decreaseBtn = document.getElementById('decrease-btn');
    const mercury = document.getElementById('mercury');

    let temperature = parseInt(localStorage.getItem('temperature')) || 0;
    updateThermometer(temperature);

    function updateThermometer(temp) {
        temperature = temp;
        tempDisplay.textContent = `${temperature}°C`;
        mercury.style.height = `${(temperature / 23) * 100}%`;
        localStorage.setItem('temperature', temperature);
    }

    increaseBtn.addEventListener('click', () => {
        if (temperature < 23) updateThermometer(temperature + 1);
    });

    decreaseBtn.addEventListener('click', () => {
        if (temperature > 0) updateThermometer(temperature - 1);
    });
}
