export function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const statusMessage = document.getElementById('status-message');

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
            })
            .catch((error) => {
                console.error('Failed to send email.', error);
                showStatusMessage('error', 'Failed to send message. Please try again later.');
            });
    });

    function showStatusMessage(type, message) {
        statusMessage.textContent = message;
        statusMessage.className = type;
    }
}
