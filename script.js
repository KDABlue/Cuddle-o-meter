// script.js

import { initThermometer } from './utils/scripts/thermometer.js';
import { initImageSelection } from './utils/scripts/imageSelection.js';
import { initLetters } from './utils/scripts/letterHandling.js';
import { initNavigation } from './utils/scripts/uiNavigation.js';
import { initTitleColorChanger } from './utils/scripts/titleColorChanger.js'; 
import { initContactForm } from './utils/scripts/contactFormHandler.js'; 
import { initWordDisplay } from './utils/scripts/wordDisplay.js';
import { initBumboSignal } from './utils/scripts/bumboSignal.js';
import { initPotatograd } from './utils/scripts/potatograd.js';
import { initPuzzle } from './utils/scripts/puzzle.js';
import { initBumbaRun } from './utils/scripts/bumbaRun.js'; // Import the Bumba Run module
import { initBumbaCrush } from './utils/scripts/bumbaCrush.js';

const phrases = [
    "Bumbo! Bumbo! Bumbo!", 
    "Cibo! Cibo! Cibo!", 
    "Nuuuuu", 
    "Io bumba", 
    "Meowwwww", 
    "Coccoleeee",
    "Altre coccole",
    "Baciniii",
    "Mi accompagni al bagno?",
    "Bumba pancia piena di ragu",
    "Paruraaaa",
];

initWordDisplay(document.body, phrases);


// When DOM is fully loaded:
document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup Navigation
    const navLinks = document.querySelectorAll('nav ul li a.nav-link, nav ul li a.letters-link');
    const contentPages = document.querySelectorAll('.content-page');
    console.log('All content-pages found:', contentPages);

    initNavigation(navLinks, contentPages);

    // 2. Initialize Thermometer
    const tempDisplay = document.getElementById('temperature-display');
    const increaseBtn = document.getElementById('increase-btn');
    const decreaseBtn = document.getElementById('decrease-btn');
    const mercury = document.getElementById('mercury');
    initThermometer(increaseBtn, decreaseBtn, tempDisplay, mercury);

    // 3. Initialize Image Selection
    const selectableImages = document.querySelectorAll('.selectable-image');
    const selectedImage = document.getElementById('selected-image');
    const imageMessage = document.getElementById('image-message');
    const countdown = document.getElementById('countdown');
    initImageSelection(selectableImages, selectedImage, imageMessage, countdown);

    // 4. Initialize Letters
    const letters = [
        'letter_25092024',
        'letter_26092024',
        'letter_27092024',
        'letter_28092024',
        'letter_29092024',
        'letter_30092024',
        'letter_02102024',
        'letter_03102024',
        'letter_15102024',
        'letter_18102024',
        'letter_19102024',
        'letter_20102024',
        'letter_26102024',
        'letter_02112024',
        'letter_09112024',
        'letter_17112024',
        'La_laurea.txt',
        'Il_Natale.txt',
        'Il_Capodanno.txt',
        'Il_Passato_e_il_Futuro.txt'
    ];
    const letterLinksContainer = document.getElementById('letter-links-container');
    const letterContentContainer = document.getElementById('letter-content-container');
    const letterTitle = document.getElementById('letter-title');
    const letterContent = document.getElementById('letter-content');
    const backToLettersBtn = document.getElementById('back-to-letters-btn');
    initLetters(letters, letterLinksContainer, letterContentContainer, letterTitle, letterContent, backToLettersBtn);

    // 5. Initialize Title Color Changer
    const title = document.getElementById('title');
    initTitleColorChanger(title);

    // 6. Initialize Contact Form
    const contactForm = document.getElementById('contact-form');
    const statusMessage = document.getElementById('status-message');
    initContactForm(contactForm, statusMessage); 

    // 7. Initialize BumboSignal
    initBumboSignal();
    initPotatograd();

    // 8. Initialize Puzzle
    initPuzzle();

    // 9. Initialize Bumba Run
    initBumbaRun();


    initBumbaCrush();
    // 10. Click the "Indietro" button
    const backArrowLink = document.querySelector('.back-arrow a');
    if (backArrowLink) {
        backArrowLink.click();
    }
});
