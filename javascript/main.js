import { initThermometer } from './thermometer.js';
import { changeTitleColor } from './titleColor.js';
import { initNavigation } from './navigation.js';
import { initImageSelection } from './imageSelection.js';
import { initContactForm } from './contactForm.js';

document.addEventListener('DOMContentLoaded', () => {
    initThermometer();
    changeTitleColor();
    initNavigation();
    initImageSelection();
    initContactForm();
});