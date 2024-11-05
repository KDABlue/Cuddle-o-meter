export async function getLocationAndTime() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            return reject(new Error("Geolocation is not supported by your browser."));
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude.toFixed(5);
                const longitude = position.coords.longitude.toFixed(5);
                const timestamp = new Date().toLocaleString();
                resolve({ latitude, longitude, timestamp });
            },
            (error) => reject(error)
        );
    });
}
