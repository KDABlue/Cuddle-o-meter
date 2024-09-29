// utils/scripts/contactFormHandler.js

export function initContactForm(contactForm, statusMessage) {
    if (!contactForm || !statusMessage) {
        console.error('Contact form elements are missing in the DOM.');
        return;
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
                showStatusMessage('success', 'Message sent successfully!', statusMessage);
                contactForm.reset();
            }, (error) => {
                console.error('Failed to send email.', error);
                showStatusMessage('error', 'Failed to send message. Please try again later.', statusMessage);
            });
    });
}

function showStatusMessage(type, message, statusMessageElement) {
    statusMessageElement.textContent = message;
    statusMessageElement.className = type;
}
