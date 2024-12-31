// FILE: utils/scripts/bumbaCrush.js

// Define candyElements globally so that all functions can access it
let candyElements = []; // Initialize as empty array

// Utility function to remove all candy color classes
function removeCandyColorClasses(candyDiv) {
  candyDiv.classList.remove('candy-0', 'candy-1', 'candy-2', 'candy-3', 'candy-4', 'candy-5');
}

export function initBumbaCrush() {
  const gridEl = document.getElementById('crush-grid');
  const scoreEl = document.getElementById('crush-score-value');
  const resetBtn = document.getElementById('crush-reset-btn');
  const rows = 8;
  const cols = 8;
  const candyTypes = 6; // Number of candy types (6 for colors)
  let board = [];
  let score = 0;
  let selectedCell = null; // store { row, col }
  let isProcessing = false; // Flag to prevent overlapping actions

  const candyImages = [
    "images/candies/candy0.png",
    "images/candies/candy1.png",
    "images/candies/candy2.png",
    "images/candies/candy3.png",
    "images/candies/candy4.png",
    "images/candies/candy5.png"
  ];

  // Array to track available candy images (true if loaded)
  const availableImages = [];

  // Preload candy images and mark availability
  const preloadImages = () => {
    return Promise.all(
      candyImages.map(src => {
        return new Promise(resolve => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            availableImages.push(src);
            resolve(true);
          };
          img.onerror = () => {
            availableImages.push(null);
            console.warn(`Failed to load image: ${src}`);
            resolve(false);
          };
        });
      })
    );
  };

  // Initialize touch variables
  let touchStartX = 0;
  let touchStartY = 0;

  // Detect swipe gestures on mobile
  gridEl.addEventListener('touchstart', (e) => {
    if (isProcessing) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });

  gridEl.addEventListener('touchend', (e) => {
    if (isProcessing) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Threshold to determine if it's a swipe
    const swipeThreshold = 30; // pixels

    let direction = null;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > swipeThreshold) {
        direction = deltaX > 0 ? 'right' : 'left';
      }
    } else {
      if (Math.abs(deltaY) > swipeThreshold) {
        direction = deltaY > 0 ? 'down' : 'up';
      }
    }

    if (direction && selectedCell) {
      handleSwipe(direction);
    }
  });

  // Handle swipe based on direction
  async function handleSwipe(direction) {
    isProcessing = true;
    const targetCell = getAdjacentCell(selectedCell.row, selectedCell.col, direction);
    if (targetCell) {
      try {
        await swap(selectedCell.row, selectedCell.col, targetCell.row, targetCell.col);
        const matched = await resolveMatches();
        if (!matched) {
          // If no match, swap back
          await swap(targetCell.row, targetCell.col, selectedCell.row, selectedCell.col);
          await updateCandyPositions();
        }
        if (!hasValidMoves()) {
          alert('No more moves!');
        }
      } catch (error) {
        console.error(error);
      }
    }
    selectedCell = null;
    isProcessing = false;
  }

  // Function to get the adjacent cell based on the swipe direction
  function getAdjacentCell(row, col, direction) {
    if (direction === 'right' && col < cols - 1) {
      return { row, col: col + 1 };
    }
    if (direction === 'left' && col > 0) {
      return { row, col: col - 1 };
    }
    if (direction === 'down' && row < rows - 1) {
      return { row: row + 1, col };
    }
    if (direction === 'up' && row > 0) {
      return { row: row - 1, col };
    }
    return null;
  }

  // Function to detect matches on the board
  function detectMatches(boardToCheck) {
    let foundMatch = false;
    // Array to store matched cells
    const matches = [];

    // Check Horizontal Matches
    for (let r = 0; r < rows; r++) {
      let matchLength = 1;
      for (let c = 1; c < cols; c++) {
        if (boardToCheck[r][c] === boardToCheck[r][c - 1] && boardToCheck[r][c] !== null) {
          matchLength++;
        } else {
          if (matchLength >= 3) {
            foundMatch = true;
            for (let k = 0; k < matchLength; k++) {
              matches.push({ row: r, col: c - 1 - k });
            }
          }
          matchLength = 1;
        }
      }
      if (matchLength >= 3) {
        foundMatch = true;
        for (let k = 0; k < matchLength; k++) {
          matches.push({ row: r, col: cols - 1 - k });
        }
      }
    }

    // Check Vertical Matches
    for (let c = 0; c < cols; c++) {
      let matchLength = 1;
      for (let r = 1; r < rows; r++) {
        if (boardToCheck[r][c] === boardToCheck[r - 1][c] && boardToCheck[r][c] !== null) {
          matchLength++;
        } else {
          if (matchLength >= 3) {
            foundMatch = true;
            for (let k = 0; k < matchLength; k++) {
              matches.push({ row: r - 1 - k, col: c });
            }
          }
          matchLength = 1;
        }
      }
      if (matchLength >= 3) {
        foundMatch = true;
        for (let k = 0; k < matchLength; k++) {
          matches.push({ row: rows - 1 - k, col: c });
        }
      }
    }

    // Remove duplicate matches
    const uniqueMatches = Array.from(new Set(matches.map(JSON.stringify)), JSON.parse);

    return { foundMatch, uniqueMatches };
  }

  // Function to check if there are any valid moves left
  function hasValidMoves() {
    // Deep clone the board
    const boardCopy = board.map(row => row.slice());

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Swap Right
        if (c < cols - 1) {
          swapInBoard(boardCopy, r, c, r, c + 1);
          const { foundMatch } = detectMatches(boardCopy);
          if (foundMatch) {
            return true;
          }
          // Swap back
          swapInBoard(boardCopy, r, c + 1, r, c);
        }
        // Swap Down
        if (r < rows - 1) {
          swapInBoard(boardCopy, r, c, r + 1, c);
          const { foundMatch } = detectMatches(boardCopy);
          if (foundMatch) {
            return true;
          }
          // Swap back
          swapInBoard(boardCopy, r + 1, c, r, c);
        }
      }
    }
    return false;
  }

  // Helper function to swap two cells in a given board
  function swapInBoard(boardToSwap, r1, c1, r2, c2) {
    [boardToSwap[r1][c1], boardToSwap[r2][c2]] = [boardToSwap[r2][c2], boardToSwap[r1][c1]];
  }

  // Function to create the initial board
  async function createBoard() {
    await preloadImages();

    let hasInitialMatches;
    let attempts = 0;
    const maxAttempts = 1000; // Prevent infinite loops

    do {
      if (attempts++ > maxAttempts) {
        throw new Error("Unable to generate a valid board without initial matches.");
      }
      board = [];
      gridEl.innerHTML = '';
      score = 0; // Reset score
      scoreEl.textContent = '0';

      // Fill data with random candies
      for (let r = 0; r < rows; r++) {
        const rowData = [];
        for (let c = 0; c < cols; c++) {
          rowData.push(randomCandy());
        }
        board.push(rowData);
      }

      // Check for any initial matches
      hasInitialMatches = detectMatches(board).foundMatch;
    } while (hasInitialMatches || !hasValidMoves());

    console.log("Board created without initial matches:", board);
    console.log("Initial Score:", score);

    // Initialize candyElements as a 2D array
    candyElements = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => null)
    );

    // Create candy elements in the DOM
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const candyId = board[r][c];
        const candyDiv = document.createElement('div');
        candyDiv.classList.add('candy-cell', `candy-${candyId}`);

        // Set initial position
        candyDiv.style.left = `${(c / cols) * 100}%`;
        candyDiv.style.top = `${(r / rows) * 100}%`;

        // Assign candy image or fallback
        if (availableImages[candyId]) {
          const img = document.createElement('img');
          img.src = availableImages[candyId];
          img.alt = `Candy ${candyId}`;
          img.classList.add('candy-img');
          candyDiv.appendChild(img);

          // Remove background color classes since image is present
          removeCandyColorClasses(candyDiv);
        } else {
          // If no image, set a fallback background color
          candyDiv.style.backgroundColor = getCandyColor(candyId);
        }

        candyDiv.dataset.row = r;
        candyDiv.dataset.col = c;
        candyDiv.addEventListener('click', onCandyClick);
        gridEl.appendChild(candyDiv);

        // Store reference
        candyElements[r][c] = candyDiv;
      }
    }
  }

  // Function to generate a random candy
  function randomCandy() {
    return Math.floor(Math.random() * candyTypes);
  }

  // Function to get candy color based on ID (fallback)
  function getCandyColor(id) {
    const colors = [
      '#FF6961', // Red
      '#77DD77', // Green
      '#FDFD96', // Yellow
      '#84B6F4', // Blue
      '#FDCAE1', // Pink
      '#F5DEB3'  // Beige
    ];
    return colors[id];
  }

  // Function to handle candy clicks
  async function onCandyClick(e) {
    if (isProcessing) return;
    const div = e.currentTarget;
    const row = parseInt(div.dataset.row);
    const col = parseInt(div.dataset.col);

    if (!selectedCell) {
      selectedCell = { row, col };
      div.classList.add('selected');
    } else {
      const firstDiv = gridEl.querySelector(
        `[data-row="${selectedCell.row}"][data-col="${selectedCell.col}"]`
      );
      if (firstDiv) firstDiv.classList.remove('selected');

      if (isAdjacent(selectedCell.row, selectedCell.col, row, col)) {
        isProcessing = true;
        try {
          await swap(selectedCell.row, selectedCell.col, row, col);
          const matched = await resolveMatches();
          if (!matched) {
            // If no match, swap back
            await swap(row, col, selectedCell.row, selectedCell.col);
            await updateCandyPositions();
          }
          if (!hasValidMoves()) {
            alert('No more moves!');
          }
        } catch (error) {
          console.error(error);
        }
        isProcessing = false;
      }
      selectedCell = null;
    }
  }

  // Function to check if two cells are adjacent
  function isAdjacent(r1, c1, r2, c2) {
    return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
  }

  // Function to swap two candies with animation
  function swap(r1, c1, r2, c2) {
    return new Promise((resolve) => {
      if (r1 === r2 && c1 === c2) {
        resolve();
        return;
      }

      // Swap in the board array
      [board[r1][c1], board[r2][c2]] = [board[r2][c2], board[r1][c1]];

      // Swap in the candyElements array
      [candyElements[r1][c1], candyElements[r2][c2]] = [candyElements[r2][c2], candyElements[r1][c1]];

      // Update data attributes
      candyElements[r1][c1].dataset.row = r1;
      candyElements[r1][c1].dataset.col = c1;
      candyElements[r2][c2].dataset.row = r2;
      candyElements[r2][c2].dataset.col = c2;

      // Animate the swap using CSS transitions
      candyElements[r1][c1].style.transition = 'top 0.3s ease, left 0.3s ease';
      candyElements[r2][c2].style.transition = 'top 0.3s ease, left 0.3s ease';

      // Update positions
      candyElements[r1][c1].style.top = `${(r1 / rows) * 100}%`;
      candyElements[r1][c1].style.left = `${(c1 / cols) * 100}%`;
      candyElements[r2][c2].style.top = `${(r2 / rows) * 100}%`;
      candyElements[r2][c2].style.left = `${(c2 / cols) * 100}%`;

      // Wait for the transition to end
      let transitionsCompleted = 0;
      const transitionEndHandler = () => {
        transitionsCompleted++;
        if (transitionsCompleted === 2) {
          candyElements[r1][c1].removeEventListener('transitionend', transitionEndHandler);
          candyElements[r2][c2].removeEventListener('transitionend', transitionEndHandler);
          resolve();
        }
      };

      candyElements[r1][c1].addEventListener('transitionend', transitionEndHandler);
      candyElements[r2][c2].addEventListener('transitionend', transitionEndHandler);
    });
  }

  // Function to resolve matches on the board
  async function resolveMatches() {
    let foundMatch;
    do {
      const { foundMatch: matchFound, uniqueMatches } = detectMatches(board);
      if (matchFound) {
        foundMatch = true;

        // Apply pop class to all matched candies
        uniqueMatches.forEach(match => {
          const { row, col } = match;
          const candyDiv = candyElements[row][col];
          if (candyDiv) {
            candyDiv.classList.add('pop');
            // Update score
            score += 10;
            scoreEl.textContent = score;
          }
        });

        // Wait for pop animations to complete
        await new Promise(resolve => setTimeout(resolve, 300)); // Match the CSS animation duration

        // Remove the matched candies from the board and DOM
        uniqueMatches.forEach(match => {
          const { row, col } = match;
          const candyDiv = candyElements[row][col];
          if (candyDiv) {
            gridEl.removeChild(candyDiv);
            board[row][col] = null;
            candyElements[row][col] = null;
          }
        });

        // Apply gravity and refill
        await applyGravity();
        await refill();
      } else {
        foundMatch = false;
      }
    } while (foundMatch);
    return foundMatch;
  }

  // Function to apply gravity to the board
  function applyGravity() {
    return new Promise((resolve) => {
      for (let c = 0; c < cols; c++) {
        let pointer = rows - 1;
        for (let r = rows - 1; r >= 0; r--) {
          if (board[r][c] !== null) {
            if (r !== pointer) {
              board[pointer][c] = board[r][c];
              board[r][c] = null;

              // Move the candy element to the new position
              const candyDiv = candyElements[r][c];
              candyElements[pointer][c] = candyDiv;
              candyElements[r][c] = null;

              // Update data attributes
              candyDiv.dataset.row = pointer;
              candyDiv.dataset.col = c;

              // Animate the fall
              candyDiv.style.transition = 'top 0.3s ease';
              candyDiv.style.top = `${(pointer / rows) * 100}%`;
            }
            pointer--;
          }
        }
      }

      // Wait for gravity animations to complete
      setTimeout(() => {
        resolve();
      }, 300); // Match the CSS transition duration
    });
  }

  // Function to refill the board with new candies
  function refill() {
    return new Promise((resolve) => {
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          if (board[r][c] === null) {
            const newCandyId = randomCandy();
            board[r][c] = newCandyId;

            // Create new candy element
            const candyDiv = document.createElement('div');
            candyDiv.classList.add('candy-cell', `candy-${newCandyId}`);
            candyDiv.style.left = `${(c / cols) * 100}%`;
            candyDiv.style.top = `${(-1 / rows) * 100}%`; // Start above the grid

            // Assign candy image or fallback
            if (availableImages[newCandyId]) {
              const img = document.createElement('img');
              img.src = availableImages[newCandyId];
              img.alt = `Candy ${newCandyId}`;
              img.classList.add('candy-img');
              candyDiv.appendChild(img);

              // Remove background color classes since image is present
              removeCandyColorClasses(candyDiv);
            } else {
              // If no image, set a fallback background color
              candyDiv.style.backgroundColor = getCandyColor(newCandyId);
            }

            candyDiv.dataset.row = r;
            candyDiv.dataset.col = c;
            candyDiv.addEventListener('click', onCandyClick);
            gridEl.appendChild(candyDiv);

            // Store reference
            candyElements[r][c] = candyDiv;

            // Animate the falling
            // Using requestAnimationFrame to ensure the initial position is set before transition
            requestAnimationFrame(() => {
              candyDiv.style.transition = 'top 0.5s ease';
              candyDiv.style.top = `${(r / rows) * 100}%`;
            });
          }
        }
      }

      // Wait for refill animations to complete
      setTimeout(() => {
        resolve();
      }, 500); // Match the CSS transition duration
    });
  }

  // Function to update candy positions after gravity and refill
  function updateCandyPositions() {
    // No need to recreate all candies. Positions are updated through CSS transitions.
    // Ensure that the candyElements array correctly reflects the current board state.
    // This function can be used for any additional updates if necessary.
  }

  // Function to load candy images with fallback
  function loadCandyImages(candyId) {
    return availableImages[candyId];
  }

  // Initialize the board
  createBoard();

  // Event Listener for Reset Button
  resetBtn.addEventListener('click', async () => {
    if (isProcessing) return;
    isProcessing = true;
    // Reset the board
    gridEl.innerHTML = '';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        candyElements[r][c] = null;
      }
    }
    score = 0;
    scoreEl.textContent = '0';
    selectedCell = null;
    try {
      await createBoard();
    } catch (error) {
      console.error(error);
    }
    isProcessing = false;
  });
}
