// utils/scripts/puzzle.js

export function initPuzzle() {
  const puzzleSelector = document.getElementById('puzzle-selector');
  const puzzleContainer = document.getElementById('puzzle-container');
  const imageGallery = document.querySelectorAll('.select-puzzle-image');
  const puzzleGrid = document.querySelector('.puzzle-grid');
  const resetBtn = document.getElementById('reset-puzzle-btn');
  const backToSelectorBtn = document.getElementById('back-to-selector-btn');

  const n = 5; // Always 5 rows/columns
  let selectedImage = '';
  let pieces = [];

  // Shuffle array
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Handle image selection
  imageGallery.forEach(img => {
    img.addEventListener('click', () => {
      selectedImage = img.src;
      startPuzzle(selectedImage);
    });
  });

  // Start the puzzle
  function startPuzzle(imageSrc) {
    // Prevent multiple initializations
    if (puzzleGrid.dataset.initialized === 'true') return;

    puzzleSelector.style.display = 'none';
    puzzleContainer.style.display = 'block';
    puzzleGrid.innerHTML = ''; // Clear any existing pieces
    pieces = [];

    // Set the entire grid's background (for reference or styling)
    puzzleGrid.style.backgroundImage = `url(${imageSrc})`;
    puzzleGrid.style.backgroundSize = '100% 100%';

    // Create pieces
    for (let i = 0; i < n * n; i++) {
      const piece = document.createElement('div');
      piece.classList.add('puzzle-piece');
      piece.style.backgroundImage = `url(${imageSrc})`;
      // Each puzzle-piece is 1/25 of the entire image → background-size 500% 500% in CSS
      // We'll calculate the correct background position in percentages:
      const row = Math.floor(i / n);
      const col = i % n;
      // For a 5×5, the positions in percent increments go 0%, 25%, 50%, 75%, 100%
      // This is 4 intervals across 5 slots → (col / (n - 1)) * 100
      const xPercent = (col / (n - 1)) * 100; 
      const yPercent = (row / (n - 1)) * 100;
      piece.style.backgroundPosition = `${xPercent}% ${yPercent}%`;

      piece.dataset.correctIndex = i;
      piece.dataset.currentIndex = i;

      // Drag events
      piece.setAttribute('draggable', 'true');
      piece.addEventListener('dragstart', dragStart);
      piece.addEventListener('dragover', dragOver);
      piece.addEventListener('drop', drop);
      piece.addEventListener('dragenter', dragEnter);
      piece.addEventListener('dragleave', dragLeave);

      puzzleGrid.appendChild(piece);
      pieces.push(piece);
    }

    // Shuffle pieces in the DOM
    shuffle(pieces);
    pieces.forEach(piece => puzzleGrid.appendChild(piece));

    // Mark as initialized
    puzzleGrid.dataset.initialized = 'true';
  }

  let draggedPiece = null;

  function dragStart(e) {
    draggedPiece = this;
    setTimeout(() => {
      this.style.opacity = '0.5';
    }, 0);
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function dragEnter(e) {
    e.preventDefault();
    this.style.border = '2px solid #547980';
  }

  function dragLeave() {
    this.style.border = '1px dashed #000';
  }

  function drop() {
    this.style.border = '1px dashed #000';
    if (draggedPiece !== this) {
      // Swap the pieces in the DOM
      const draggedIndex = Array.from(puzzleGrid.children).indexOf(draggedPiece);
      const droppedIndex = Array.from(puzzleGrid.children).indexOf(this);

      puzzleGrid.insertBefore(draggedPiece, this);
      puzzleGrid.insertBefore(this, puzzleGrid.children[draggedIndex]);

      // Swap dataset indices
      const temp = draggedPiece.dataset.currentIndex;
      draggedPiece.dataset.currentIndex = this.dataset.currentIndex;
      this.dataset.currentIndex = temp;

      checkCompletion();
    }
    draggedPiece.style.opacity = '1';
    draggedPiece = null;
  }

  // Reset Puzzle
  resetBtn.addEventListener('click', () => {
    if (selectedImage) {
      puzzleGrid.innerHTML = '';
      pieces = [];
      puzzleGrid.dataset.initialized = 'false'; // Allow re-initialization
      startPuzzle(selectedImage);
    }
  });

  // Back to Image Selector
  backToSelectorBtn.addEventListener('click', () => {
    puzzleContainer.style.display = 'none';
    puzzleSelector.style.display = 'block';
    puzzleGrid.innerHTML = '';
    pieces = [];
    puzzleGrid.dataset.initialized = 'false';
  });

  // Check if puzzle is completed
  function checkCompletion() {
    const allCorrect = Array.from(puzzleGrid.children).every((piece, index) => {
      return parseInt(piece.dataset.correctIndex) === index;
    });

    if (allCorrect) {
      setTimeout(() => {
        // Display a congratulatory message
        const congrats = document.createElement('div');
        congrats.innerText = '🎉 Brava Bimba hai finito il puzzle! 🎉';
        congrats.style.position = 'fixed';
        congrats.style.top = '50%';
        congrats.style.left = '50%';
        congrats.style.transform = 'translate(-50%, -50%)';
        congrats.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        congrats.style.color = '#fff';
        congrats.style.padding = '20px';
        congrats.style.borderRadius = '10px';
        congrats.style.zIndex = '1000';
        document.body.appendChild(congrats);

        // Confetti animation (requires 'confetti' library)
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        // Remove the message after 5 seconds
        setTimeout(() => {
          document.body.removeChild(congrats);
        }, 5000);
      }, 100);
    }
  }
}
