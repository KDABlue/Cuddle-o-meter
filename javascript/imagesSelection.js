export function initImageSelection() {
    const selectableImages = document.querySelectorAll('.selectable-image');
    const selectedImageContainer = document.getElementById('selected-image-container');
    const selectedImage = document.getElementById('selected-image');
    const imageMessage = document.getElementById('image-message');
    const countdown = document.getElementById('countdown');

    let canSelectImage = true;
    let lastSelectionTime = localStorage.getItem('lastSelectionTime');

    if (lastSelectionTime) {
        const now = new Date().getTime();
        const timeDiff = now - parseInt(lastSelectionTime);
        if (timeDiff < 24 * 60 * 60 * 1000) {
            canSelectImage = false;
            const remainingTime = 24 * 60 * 60 * 1000 - timeDiff;
            startCountdown(remainingTime);
            displaySelectedImage(); // Display previously selected image
        }
    }

    function displaySelectedImage() {
        const storedImageSrc = localStorage.getItem('selectedImageSrc');
        const storedImageAlt = localStorage.getItem('selectedImageAlt');

        if (storedImageSrc && storedImageAlt) {
            selectedImage.src = storedImageSrc;
            selectedImage.alt = storedImageAlt;
            selectedImage.style.display = 'block';
            const imageName = storedImageAlt;
            imageMessage.textContent = `Congratulazioni, oggi sei ${imageName}`;
        }
    }

    selectableImages.forEach(image => {
        image.addEventListener('click', () => {
            if (canSelectImage) {
                const now = new Date().getTime();
                if (!lastSelectionTime || now - parseInt(lastSelectionTime) > 24 * 60 * 60 * 1000) {
                    handleImageSelection(image);
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

    function handleImageSelection(image) {
        const imageName = image.alt;
        selectedImage.src = image.src;
        selectedImage.alt = imageName;
        selectedImage.style.display = 'block';
        imageMessage.textContent = `Congratulazioni, oggi sei ${imageName}`;
        localStorage.setItem('selectedImageSrc', image.src);
        localStorage.setItem('selectedImageAlt', imageName);
        startCountdown(24 * 60 * 60 * 1000); // Start countdown for 24 hours
        lastSelectionTime = new Date().getTime();
        localStorage.setItem('lastSelectionTime', lastSelectionTime);
        canSelectImage = false;
        sendEmail(imageName);
    }

    function startCountdown(duration) {
        let countdownTime = duration / 1000; // Convert milliseconds to seconds
        const interval = setInterval(() => {
            const hours = Math.floor(countdownTime / 3600);
            const minutes = Math.floor((countdownTime % 3600) / 60);
            const seconds = Math.floor(countdownTime % 60); // Fix decimals by flooring
            countdown.textContent = `Remaining time: ${hours}h ${minutes}m ${seconds}s`;
            if (countdownTime <= 0) {
                clearInterval(interval);
                countdown.textContent = 'Time is up!';
                canSelectImage = true; // Enable image selection after cooldown
            }
            countdownTime--;
        }, 1000);
    }

    function sendEmail(imageName) {
        const emailParams = {
            to_email: 'marcus.scienza@gmail.com',
            subject: 'Bumba-Hub Daily Image Selection',
            message: `Congratulazioni, oggi sei ${imageName}`
        };

        emailjs.send('service_pjs2xtf', 'template_98i850b', emailParams)
            .then((response) => {
                console.log('Email sent successfully!', response.status, response.text);
            })
            .catch((error) => {
                console.error('Failed to send email.', error);
            });
    }
}
