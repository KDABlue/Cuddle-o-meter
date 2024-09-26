export function startCountdown(duration) {
    const countdown = document.getElementById('countdown');
    let countdownTime = duration / 1000; // Convert milliseconds to seconds
    const interval = setInterval(() => {
        const hours = Math.floor(countdownTime / 3600);
        const minutes = Math.floor((countdownTime % 3600) / 60);
        const seconds = Math.floor(countdownTime % 60); 
        countdown.textContent = `Remaining time: ${hours}h ${minutes}m ${seconds}s`;
        if (countdownTime <= 0) {
            clearInterval(interval);
            countdown.textContent = 'Time is up!';
        }
        countdownTime--;
    }, 1000);
}
