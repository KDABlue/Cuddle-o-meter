// utils/scripts/titleColorChanger.js

export function initTitleColorChanger(titleElement) {
    if (!titleElement) {
        console.error('Title element is missing in the DOM.');
        return;
    }

    const colors = ['red', 'green', 'blue', 'orange', 'purple'];
    let currentColorIndex = 0;

    // Add transition property for smooth color change
    titleElement.style.transition = 'color 1s ease';

    setInterval(() => {
        titleElement.style.color = colors[currentColorIndex];
        currentColorIndex = (currentColorIndex + 1) % colors.length;
    }, 1500); // Change color every 2 seconds
}
