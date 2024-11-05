export function initWordDisplay(container, phrases) {
    function displayRandomWord() {
        // Select a random phrase from the list
        const phrase = phrases[Math.floor(Math.random() * phrases.length)];
        
        // Create a new element to display the phrase
        const wordElement = document.createElement('div');
        wordElement.classList.add('random-word');
        wordElement.textContent = phrase;

        // Random styles for positioning, color, and rotation
        const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`;
        const randomRotation = Math.floor(Math.random() * 120 - 60); // Between -60 and +60 degrees
        const randomTop = `${Math.floor(Math.random() * 80)}%`;
        const randomLeft = `${Math.floor(Math.random() * 80)}%`;

        wordElement.style.color = randomColor;
        wordElement.style.transform = `rotate(${randomRotation}deg)`;
        wordElement.style.position = 'absolute';
        wordElement.style.top = randomTop;
        wordElement.style.left = randomLeft;

        // Add fade-in effect
        wordElement.style.opacity = 0;
        container.appendChild(wordElement);
        setTimeout(() => {
            wordElement.style.opacity = 1;
        }, 100);

        // Remove the element after a delay to avoid clutter
        setTimeout(() => {
            wordElement.remove();
        }, 3000); // Remove after 3 seconds
    }

    // Display a new word every 2 seconds
    setInterval(displayRandomWord, 1000);
}
