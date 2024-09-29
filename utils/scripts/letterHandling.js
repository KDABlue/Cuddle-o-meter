// utils/scripts/letterHandling.js

import { sendLettersPageEmail } from './email.js';

export function initLetters(letters, letterLinksContainer, letterContentContainer, letterTitle, letterContent, backToLettersBtn) {
    if (!letters || !letterLinksContainer || !letterContentContainer || !letterTitle || !letterContent || !backToLettersBtn) {
        console.error('Letter handling elements are missing in the DOM.');
        return;
    }

    letters.forEach(letter => {
        const letterLink = document.createElement('a');
        const letterDate = formatDateFromFilename(letter);
        letterLink.textContent = letterDate;
        letterLink.href = "#";
        letterLink.classList.add('letter-link');
        letterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loadLetter(letter, letterLinksContainer, letterContentContainer, letterTitle, letterContent);
            sendLettersPageEmail();
        });
        letterLinksContainer.appendChild(letterLink);
        letterLinksContainer.appendChild(document.createElement('br'));
    });

    backToLettersBtn.addEventListener('click', () => {
        letterContentContainer.style.display = 'none';
        letterLinksContainer.style.display = 'block';
    });
}

function loadLetter(letterFilename, letterLinksContainer, letterContentContainer, letterTitle, letterContent) {
    fetch(`letters/${letterFilename}.txt`)
        .then(response => response.text())
        .then(data => {
            letterLinksContainer.style.display = 'none';
            letterContentContainer.style.display = 'block';
            letterTitle.innerHTML = `<h2>Lettera del giorno ${formatDateFromFilename(letterFilename)}</h2>`;
            letterContent.innerHTML = `<p style="font-style: italic;">${data}</p>`;
        })
        .catch(error => {
            letterContent.textContent = 'Failed to load letter content.';
            console.error('Error loading letter:', error);
        });
}

function formatDateFromFilename(filename) {
    const datePart = filename.split('_')[1];
    const day = datePart.slice(0, 2);
    const month = datePart.slice(2, 4);
    const year = datePart.slice(4, 8);
    return `${day}/${month}/${year}`;
}