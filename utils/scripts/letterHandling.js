import { sendLettersPageEmail } from './email.js';

/**
 * Initializes the letters by creating links and setting up event listeners.
 * Supports both date-formatted filenames and named filenames.
 *
 * @param {Array<string>} letters - Array of letter filenames (with or without the .txt extension).
 * @param {HTMLElement} letterLinksContainer - Container to hold the letter links.
 * @param {HTMLElement} letterContentContainer - Container to display the letter content.
 * @param {HTMLElement} letterTitle - Element to display the letter title.
 * @param {HTMLElement} letterContent - Element to display the letter content.
 * @param {HTMLElement} backToLettersBtn - Button to navigate back to the letters list.
 */
export function initLetters(
    letters,
    letterLinksContainer,
    letterContentContainer,
    letterTitle,
    letterContent,
    backToLettersBtn
) {
    // Validate all required DOM elements and letters array
    if (
        !letters ||
        !letterLinksContainer ||
        !letterContentContainer ||
        !letterTitle ||
        !letterContent ||
        !backToLettersBtn
    ) {
        console.error('Letter handling elements are missing in the DOM.');
        return;
    }

    letters.forEach((letter) => {
        // **Modification 1:** Strip '.txt' extension if present
        const filename = letter.endsWith('.txt') ? letter.slice(0, -4) : letter;

        const letterLink = document.createElement('a');
        const displayName = getLetterDisplayName(filename);
        letterLink.textContent = displayName;
        letterLink.href = "#";
        letterLink.classList.add('letter-link');
        letterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loadLetter(
                filename,
                letterLinksContainer,
                letterContentContainer,
                letterTitle,
                letterContent
            );
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

/**
 * Loads the content of a selected letter and updates the UI accordingly.
 *
 * @param {string} letterFilename - The filename of the letter without the .txt extension.
 * @param {HTMLElement} letterLinksContainer - Container holding the letter links.
 * @param {HTMLElement} letterContentContainer - Container to display the letter content.
 * @param {HTMLElement} letterTitle - Element to display the letter title.
 * @param {HTMLElement} letterContent - Element to display the letter content.
 */
function loadLetter(
    letterFilename,
    letterLinksContainer,
    letterContentContainer,
    letterTitle,
    letterContent
) {
    fetch(`letters/${letterFilename}.txt`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then((data) => {
            letterLinksContainer.style.display = 'none';
            letterContentContainer.style.display = 'block';

            const displayName = getLetterDisplayName(letterFilename);

            if (isDateFormatted(letterFilename)) {
                letterTitle.innerHTML = `<h2>Lettera del giorno ${displayName}</h2>`;
            } else {
                letterTitle.innerHTML = `<h2>${displayName}</h2>`;
            }

            letterContent.innerHTML = `<p style="font-style: italic;">${sanitizeContent(data)}</p>`;
        })
        .catch((error) => {
            letterContent.textContent = 'Failed to load letter content.';
            console.error('Error loading letter:', error);
        });
}

/**
 * Determines if a filename is date-formatted based on the prefix and length.
 *
 * @param {string} filename - The filename without the .txt extension.
 * @returns {boolean} - True if the filename is date-formatted, else false.
 */
function isDateFormatted(filename) {
    // **Modification 2:** Adjusted regex to match filenames with or without 'letter_' prefix
    // If your date-formatted filenames always start with 'letter_', keep the original regex
    const datePattern = /^letter_\d{8}$/;
    return datePattern.test(filename);
}

/**
 * Generates a display name for the letter based on its filename.
 * If the filename is date-formatted, it returns the formatted date.
 * Otherwise, it replaces underscores with spaces and capitalizes words.
 *
 * @param {string} filename - The filename without the .txt extension.
 * @returns {string} - The formatted display name.
 */
function getLetterDisplayName(filename) {
    console.log(`Generating display name for: ${filename}`); // **Modification 3:** Added logging for debugging
    if (isDateFormatted(filename)) {
        return formatDateFromFilename(filename);
    } else {
        // Replace underscores with spaces and capitalize each word
        return filename
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());
    }
}

/**
 * Formats a date from a date-formatted filename.
 * Expected format: 'letter_ddmmyyyy'
 *
 * @param {string} filename - The filename starting with 'letter_' followed by date digits.
 * @returns {string} - The formatted date as 'dd/mm/yyyy'.
 */
function formatDateFromFilename(filename) {
    const parts = filename.split('_');
    if (parts.length !== 2 || parts[1].length !== 8) {
        console.warn(`Filename "${filename}" does not match expected date format.`);
        return filename; // Fallback to the original filename
    }

    const datePart = parts[1];
    const day = datePart.slice(0, 2);
    const month = datePart.slice(2, 4);
    const year = datePart.slice(4, 8);
    return `${day}/${month}/${year}`;
}

/**
 * Sanitizes the letter content to prevent potential XSS attacks.
 *
 * @param {string} content - The raw letter content fetched from the server.
 * @returns {string} - The sanitized content.
 */
function sanitizeContent(content) {
    const div = document.createElement('div');
    div.textContent = content;
    return div.innerHTML;
}
