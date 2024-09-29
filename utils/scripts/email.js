// utils/scripts/email.js

export function sendEmail(imageName) {
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

export function sendLettersPageEmail() {
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