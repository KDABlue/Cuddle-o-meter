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

// utils/scripts/email.js

export function sendBumboSignalEmail() {
    // Ask the user for permission to access their GPS position
    const userConsent = confirm("Posso accedere alla tua posizione GPS per inviare le coordinate nell'email?");

    if (userConsent) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;

                    // Prepare the email parameters with coordinates
                    const emailParams = {
                        to_email: 'marcus.scienza@gmail.com',
                        subject: 'Bumbo-Segnale Attivato',
                        message: `Il Bumbo-Segnale è stato attivato!
Coordinate GPS:
Latitude: ${latitude}
Longitude: ${longitude}`
                    };

                    // Send the email using EmailJS
                    emailjs.send('service_pjs2xtf', 'template_98i850b', emailParams)
                        .then((response) => {
                            console.log('Bumbo-Segnale email sent successfully!', response.status, response.text);
                        })
                        .catch((error) => {
                            console.error('Failed to send Bumbo-Segnale email.', error);
                        });
                },
                (error) => {
                    console.error('Errore nell\'ottenere la posizione GPS:', error);
                    alert('Non è stato possibile ottenere la tua posizione GPS. L\'email verrà inviata senza le coordinate.');
                    
                    // Optionally, send the email without coordinates
                    const emailParams = {
                        to_email: 'marcus.scienza@gmail.com',
                        subject: 'Bumbo-Segnale Attivato',
                        message: `Il Bumbo-Segnale è stato attivato!`
                    };

                    emailjs.send('service_pjs2xtf', 'template_98i850b', emailParams)
                        .then((response) => {
                            console.log('Bumbo-Segnale email sent successfully without coordinates!', response.status, response.text);
                        })
                        .catch((error) => {
                            console.error('Failed to send Bumbo-Segnale email without coordinates.', error);
                        });
                }
            );
        } else {
            console.error('Geolocalizzazione non supportata da questo browser.');
            alert('La geolocalizzazione non è supportata dal tuo browser. L\'email verrà inviata senza le coordinate.');
            
            // Optionally, send the email without coordinates
            const emailParams = {
                to_email: 'marcus.scienza@gmail.com',
                subject: 'Bumbo-Segnale Attivato',
                message: `Il Bumbo-Segnale è stato attivato!`
            };

            emailjs.send('service_pjs2xtf', 'template_98i850b', emailParams)
                .then((response) => {
                    console.log('Bumbo-Segnale email sent successfully without coordinates!', response.status, response.text);
                })
                .catch((error) => {
                    console.error('Failed to send Bumbo-Segnale email without coordinates.', error);
                });
        }
    } else {
        console.log('L\'utente ha negato l\'accesso alla posizione GPS.');
        alert('Non hai acconsentito all\'accesso alla posizione GPS. L\'email verrà inviata senza le coordinate.');
        
        // Optionally, send the email without coordinates
        const emailParams = {
            to_email: 'marcus.scienza@gmail.com',
            subject: 'Bumbo-Segnale Attivato',
            message: `Il Bumbo-Segnale è stato attivato!`
        };

        emailjs.send('service_pjs2xtf', 'template_98i850b', emailParams)
            .then((response) => {
                console.log('Bumbo-Segnale email sent successfully without coordinates!', response.status, response.text);
            })
            .catch((error) => {
                console.error('Failed to send Bumbo-Segnale email without coordinates.', error);
            });
    }
}
