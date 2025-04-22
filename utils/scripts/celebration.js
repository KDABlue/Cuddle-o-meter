// utils/scripts/celebration.js
export function initCelebration(navLink) {
    const overlay = document.getElementById('celebration-overlay');
    const videoContainer = document.getElementById('celebration-video-container');
    const video = document.getElementById('celebration-video');
  
    navLink.addEventListener('click', () => {
      // give the page time to activate the .content-page
      setTimeout(() => {
        // wait 6 seconds before starting the fade‑out
        setTimeout(() => {
          overlay.style.opacity = '0';
        }, 6000);
  
        // after the opacity transition ends, hide overlay & show video
        overlay.addEventListener('transitionend', () => {
          overlay.style.display = 'none';
          videoContainer.style.display = 'flex';
          video.play();
        }, { once: true });
  
      }, 0);
    });
  }
  