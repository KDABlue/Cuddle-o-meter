// script.js

import { initThermometer } from './utils/scripts/thermometer.js';
import { initImageSelection } from './utils/scripts/imageSelection.js';
import { initLetters } from './utils/scripts/letterHandling.js';
import { initNavigation } from './utils/scripts/uiNavigation.js';
import { initTitleColorChanger } from './utils/scripts/titleColorChanger.js'; // New Module
import { initContactForm } from './utils/scripts/contactFormHandler.js'; // New Module

document.addEventListener('DOMContentLoaded', () => {
    // Navigation Elements
    const navLinks = document.querySelectorAll('nav ul li a');
    const contentPages = document.querySelectorAll('.content-page');
    const backToLettersBtn = document.getElementById('back-to-letters-btn');

    // Thermometer Elements
    const tempDisplay = document.getElementById('temperature-display');
    const increaseBtn = document.getElementById('increase-btn'); // Corrected ID
    const decreaseBtn = document.getElementById('decrease-btn'); // Corrected ID
    const mercury = document.getElementById('mercury');

    // Image Selection Elements
    const selectableImages = document.querySelectorAll('.selectable-image'); // Corrected class
    const selectedImage = document.getElementById('selected-image');
    const imageMessage = document.getElementById('image-message');
    const countdown = document.getElementById('countdown');

    // Letter Handling Elements
    const letterLinksContainer = document.getElementById('letter-links-container');
    const letterContentContainer = document.getElementById('letter-content-container');
    const letterTitle = document.getElementById('letter-title');
    const letterContent = document.getElementById('letter-content');

    // Title Element
    const title = document.getElementById('title');

    // Contact Form Elements
    const contactForm = document.getElementById('contact-form');
    const statusMessage = document.getElementById('status-message');

    // Initialize Modules
    initThermometer(increaseBtn, decreaseBtn, tempDisplay, mercury);
    initImageSelection(selectableImages, selectedImage, imageMessage, countdown);
    initNavigation(navLinks, contentPages);

    const letters = [
        'letter_25092024',
        'letter_26092024',
        'letter_27092024',
        'letter_28092024',
        'letter_29092024',
        'letter_30092024',
    ];
    initLetters(letters, letterLinksContainer, letterContentContainer, letterTitle, letterContent, backToLettersBtn);

    // Initialize Title Color Changer
    initTitleColorChanger(title);

    // Initialize Contact Form Submission
    initContactForm(contactForm, statusMessage);
});
