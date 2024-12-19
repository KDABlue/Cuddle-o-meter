// utils/scripts/bumboSignal.js

import { getLocationAndTime } from './locationHelper.js'; // New helper to fetch location and time

export function initBumboSignal(coverBtn, triggerBtn) {
    console.log('Initializing Bumbo Signal Module');

    // Step 1: Disable the trigger button until cover button is clicked
    triggerBtn.disabled = true; // Ensure it's disabled initially
    console.log('Trigger button initially disabled');

    coverBtn.addEventListener('click', () => {
        console.log('Cover button clicked - Hiding cover and enabling trigger button');
        coverBtn.style.display = 'none'; // Hides the cover button
        triggerBtn.disabled = false;     // Enables the trigger button
    });

    // Step 2: Set up the trigger button click handler
    triggerBtn.addEventListener('click', async () => {
        console.log('Trigger button clicked - Confirming action');
        const confirmation = confirm("Are you sure you want to send the signal?");
        if (confirmation) {
            try {
                console.log('Fetching location and time');
                // Fetch current location and time
                const { latitude, longitude, timestamp } = await getLocationAndTime();

                // Format the email content
                const emailContent = `Bumba è in pericolo, si trova alle coordinate ${latitude}, ${longitude} al tempo ${timestamp}`;
                console.log(`Email content prepared: ${emailContent}`);

                // Send the email using EmailJS
                emailjs.send('service_pjs2xtf', 'template_98i850b', {
                    message: emailContent
                }).then(() => {
                    alert("Emergency signal sent successfully!");
                    console.log("Emergency signal sent successfully!");
                }).catch((error) => {
                    alert("Failed to send the signal. Please try again.");
                    console.error("EmailJS Error:", error);
                });
            } catch (error) {
                alert("Location permission is required to send the signal.");
                console.error("Location Error:", error);
            }
        } else {
            console.log('User canceled sending the signal');
        }
    });
}
