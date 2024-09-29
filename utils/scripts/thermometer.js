// utils/scripts/thermometer.js

export let temperature = parseInt(localStorage.getItem('temperature')) || 0;

export function updateThermometer(temp, tempDisplay, mercury) {
    temperature = temp;
    tempDisplay.textContent = `${temperature}°C`;
    mercury.style.height = `${(temperature / 23) * 100}%`;
    localStorage.setItem('temperature', temperature);
}

export function initThermometer(increaseBtn, decreaseBtn, tempDisplay, mercury) {
    if (!increaseBtn || !decreaseBtn || !tempDisplay || !mercury) {
        console.error('Thermometer elements are missing in the DOM.');
        return;
    }

    updateThermometer(temperature, tempDisplay, mercury);

    increaseBtn.addEventListener('click', () => {
        if (temperature < 23) updateThermometer(temperature + 1, tempDisplay, mercury);
    });

    decreaseBtn.addEventListener('click', () => {
        if (temperature > 0) updateThermometer(temperature - 1, tempDisplay, mercury);
    });
}
