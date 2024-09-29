// utils/scripts/imageSelection.js

import { sendEmail } from './email.js';

export function displaySelectedImage(selectedImage, imageMessage) {
    const storedImageSrc = localStorage.getItem('selectedImageSrc');
    const storedImageAlt = localStorage.getItem('selectedImageAlt');

    if (storedImageSrc && storedImageAlt) {
        selectedImage.src = storedImageSrc;
        selectedImage.alt = storedImageAlt;
        selectedImage.style.display = 'block';
        imageMessage.textContent = `Congratulazioni, oggi sei ${storedImageAlt}`;
    }
}

export function initImageSelection(selectableImages, selectedImage, imageMessage, countdown) {
    if (!selectableImages || !selectedImage || !imageMessage || !countdown) {
        console.error('Image selection elements are missing in the DOM.');
        return;
    }

    let canSelectImage = true;
    let lastSelectionTime = localStorage.getItem('lastSelectionTime');

    if (lastSelectionTime) {
        const now = Date.now();
        const timeDiff = now - parseInt(lastSelectionTime, 10);
        if (timeDiff < 24 * 60 * 60 * 1000) {
            canSelectImage = false;
            const remainingTime = 24 * 60 * 60 * 1000 - timeDiff;
            startCountdown(remainingTime, countdown);
            displaySelectedImage(selectedImage, imageMessage);
        }
    }

    selectableImages.forEach(image => {
        image.addEventListener('click', () => {
            if (canSelectImage) {
                const now = Date.now();
                if (!lastSelectionTime || now - parseInt(lastSelectionTime, 10) > 24 * 60 * 60 * 1000) {
                    handleImageSelection(image, selectedImage, imageMessage, countdown);
                    lastSelectionTime = now;
                    localStorage.setItem('lastSelectionTime', now);
                } else {
                    alert('You can only select one image every 24 hours.');
                }
            } else {
                alert('You can only select one image every 24 hours.');
            }
        });
    });
}

function handleImageSelection(image, selectedImage, imageMessage, countdown) {
    const imageName = image.alt;
    selectedImage.src = image.src;
    selectedImage.alt = imageName;
    selectedImage.style.display = 'block';
    imageMessage.textContent = `Congratulazioni, oggi sei ${imageName}`;
    localStorage.setItem('selectedImageSrc', image.src);
    localStorage.setItem('selectedImageAlt', imageName);
    startCountdown(24 * 60 * 60 * 1000, countdown); // 24 hours in milliseconds
    sendEmail(imageName);
}

function startCountdown(duration, countdownElement) {
    let countdownTime = Math.floor(duration / 1000); // Convert milliseconds to seconds
    const interval = setInterval(() => {
        const hours = Math.floor(countdownTime / 3600);
        const minutes = Math.floor((countdownTime % 3600) / 60);
        const seconds = Math.floor(countdownTime % 60);
        countdownElement.textContent = `Remaining time: ${hours}h ${minutes}m ${seconds}s`;
        if (countdownTime <= 0) {
            clearInterval(interval);
            countdownElement.textContent = 'Time is up!';
            localStorage.removeItem('lastSelectionTime');
            localStorage.removeItem('selectedImageSrc');
            localStorage.removeItem('selectedImageAlt');
        }
        countdownTime--;
    }, 1000);
}