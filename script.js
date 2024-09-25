document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav ul li a');
    const contentPages = document.querySelectorAll('.content-page');
    const tempDisplay = document.getElementById('temperature-display');
    const increaseBtn = document.getElementById('increase-btn');
    const decreaseBtn = document.getElementById('decrease-btn');
    const title = document.getElementById('title');
    const mercury = document.getElementById('mercury');
    const selectableImages = document.querySelectorAll('.selectable-image');
    const selectedImageContainer = document.getElementById('selected-image-container');
    const selectedImage = document.getElementById('selected-image');
    const imageMessage = document.getElementById('image-message');
    const countdown = document.getElementById('countdown');
    const contactForm = document.getElementById('contact-form');
    const statusMessage = document.getElementById('status-message');
    const letterLinksContainer = document.getElementById('letter-links-container');
    const letterContentContainer = document.getElementById('letter-content-container');
    const letterTitle = document.getElementById('letter-title');
    const letterContent = document.getElementById('letter-content');
    const backToLettersBtn = document.getElementById('back-to-letters-btn');

    const letters = [
        'letter_25092024',
    ];

    let temperature = parseInt(localStorage.getItem('temperature')) || 0;
    updateThermometer(temperature);

    function updateThermometer(temp) {
        temperature = temp;
        tempDisplay.textContent = `${temperature}°C`;
        mercury.style.height = `${(temperature / 23) * 100}%`;
        localStorage.setItem('temperature', temperature);
    }

    increaseBtn.addEventListener('click', () => {
        if (temperature < 23) updateThermometer(temperature + 1);
    });

    decreaseBtn.addEventListener('click', () => {
        if (temperature > 0) updateThermometer(temperature - 1);
    });

    function changeTitleColor() {
        const colors = ['red', 'green', 'blue', 'orange', 'purple'];
        let currentColorIndex = 0;

        setInterval(() => {
            title.style.color = colors[currentColorIndex];
            currentColorIndex = (currentColorIndex + 1) % colors.length;
        }, 2000); // Change color every 2 seconds
    }

    changeTitleColor();

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showPage(targetId);

            // Hide all navigation links except 'Indietro'
            navLinks.forEach(nav => {
                if (!nav.closest('.back-arrow')) {
                    nav.style.display = 'none';
                }
            });

            // Ensure 'Indietro' button is displayed
            document.querySelector('.back-arrow').style.display = 'block';
        });
    });

    document.querySelector('.back-arrow a').addEventListener('click', function(event) {
        // Prevent default action
        event.preventDefault();

        // Show all navigation links
        navLinks.forEach(nav => {
            nav.style.display = 'block';
        });

        // Reset the displayed content to home
        showPage('home');

        // Hide 'Indietro' button
        document.querySelector('.back-arrow').style.display = 'none';
    });

    function sendLettersPageEmail() {
        const emailParams = {
            to_email: 'marcus.scienza@gmail.com',
            subject: 'Bumba-Hub Letters Page Opened',
            message: `The letters page was opened on Bumba-Hub.`
        };

        emailjs.send('service_pjs2xtf', 'template_98i850b', emailParams)
            .then((response) => {
                console.log('Letters page email sent successfully!', response.status, response.text);
            })
            .catch((error) => {
                console.error('Failed to send Letters page email.', error);
            });
    }

    function showPage(id) {
        contentPages.forEach(page => {
            page.classList.remove('active');
        });

        document.getElementById(id).classList.add('active');

        if (id === 'letters1') {
            sendLettersPageEmail();
        }
    }

    showPage('home');

    let canSelectImage = true; // Flag to track if user can select an image
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

    letters.forEach(letter => {
        const letterLink = document.createElement('a');
        const letterDate = formatDateFromFilename(letter);
        letterLink.textContent = letterDate;
        letterLink.href = "#";
        letterLink.classList.add('letter-link');
        letterLink.addEventListener('click', () => loadLetter(letter));
        letterLinksContainer.appendChild(letterLink);
        letterLinksContainer.appendChild(document.createElement('br')); // Add line break
    });

    function loadLetter(letterFilename) {
        fetch(`letters/${letterFilename}.txt`)
            .then(response => response.text())
            .then(data => {
                letterLinksContainer.style.display = 'none';
                letterContentContainer.style.display = 'block';

                // Display letter content with header and italics
                letterTitle.innerHTML = `<h2>Lettera del giorno ${formatDateFromFilename(letterFilename)}</h2>`;
                letterContent.innerHTML = `<p style="font-style: italic;">${data}</p>`;
            })
            .catch(error => {
                letterContent.textContent = 'Failed to load letter content.';
            });
    }

    backToLettersBtn.addEventListener('click', () => {
        letterContentContainer.style.display = 'none';
        letterLinksContainer.style.display = 'block';
    });

    function formatDateFromFilename(filename) {
        const datePart = filename.split('_')[1];
        const day = datePart.slice(0, 2);
        const month = datePart.slice(2, 4);
        const year = datePart.slice(4, 8);
        return `${day}/${month}/${year}`;
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

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const emailParams = {
            to_email: formData.get('email'),
            message: formData.get('message')
        };
        emailjs.send('service_pjs2xtf', 'template_9zw57fl', emailParams)
            .then((response) => {
                console.log('Email sent successfully!', response.status, response.text);
                showStatusMessage('success', 'Message sent successfully!');
                contactForm.reset();
            }, (error) => {
                console.error('Failed to send email.', error);
                showStatusMessage('error', 'Failed to send message. Please try again later.');
            });
    });

    function showStatusMessage(type, message) {
        statusMessage.textContent = message;
        statusMessage.className = type;
    }
});