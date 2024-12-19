// utils/scripts/bumboSignal.js

import { sendBumboSignalEmail } from './email.js';

export function initBumboSignal() {
    const glassCover = document.getElementById('glass-cover');
    const bumboButton = document.getElementById('bumbo-button');

    if (!glassCover || !bumboButton) {
        console.error('Bumbo-Segnale elements are missing in the DOM.');
        return;
    }

    glassCover.addEventListener('click', () => {
        glassCover.style.display = 'none';
        bumboButton.style.display = 'inline-block';
    });

    bumboButton.addEventListener('click', () => {
        sendBumboSignalEmail();
        bumboButton.disabled = true;
        bumboButton.textContent = 'Segnale Inviato!';
    });
}