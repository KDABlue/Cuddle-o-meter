// utils/scripts/potatograd.js
export function initPotatograd() {
  // A simple confetti "launch" function
  function launchConfetti() {
    // Duration of the confetti effect (in ms)
    const duration = 5000;
    const end = Date.now() + duration;

    // This animates multiple bursts by scheduling them within the duration
    (function frame() {
      // "Shit load" means we can push as many confetti bursts as we want
      // Here's a random example to fill the screen quickly:
      confetti({
        particleCount: 50,
        startVelocity: 30,
        spread: 360,            // full circle
        origin: {
          x: Math.random(),     // random x
          y: Math.random()      // random y
        }
      });
      // Continue firing confetti bursts until the set time is over
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }

  const potatogradPage = document.getElementById('potatograd');

  // Watch for class changes on the potatograd page container.
  // Once the 'active' class is added, we know the page is shown.
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        if (potatogradPage.classList.contains('active')) {
          // If it’s becoming active, launch the confetti!
          launchConfetti();
        }
      }
    });
  });

  // Observe only attribute changes (the 'class' attribute) on the potatograd page
  observer.observe(potatogradPage, { attributes: true, attributeFilter: ['class'] });
}
