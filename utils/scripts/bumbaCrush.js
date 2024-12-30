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

  const candyImages = [
    "images/candy0.png",
    "images/candy1.png",
    "images/candy2.png",
    "images/candy3.png",
    "images/candy4.png",
    "images/candy5.png"
  ];

  // Check if images are available
  const loadCandyImages = (candyId) => {
    const img = new Image();
    img.src = candyImages[candyId];
    return img.complete ? img.src : null;
  };

  let touchStartX = 0;
  let touchStartY = 0;

  // Detect swipe gestures on mobile
  gridEl.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });

  gridEl.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        // Swipe right
        if (selectedCell) {
          const targetCell = getAdjacentCell(selectedCell.row, selectedCell.col, 'right');
          if (targetCell) {
            swap(selectedCell.row, selectedCell.col, targetCell.row, targetCell.col);
            updateCandyPositions();
          }
        }
      } else {
        // Swipe left
        if (selectedCell) {
          const targetCell = getAdjacentCell(selectedCell.row, selectedCell.col, 'left');
          if (targetCell) {
            swap(selectedCell.row, selectedCell.col, targetCell.row, targetCell.col);
            updateCandyPositions();
          }
        }
      }
    } else {
      if (deltaY > 0) {
        // Swipe down
        if (selectedCell) {
          const targetCell = getAdjacentCell(selectedCell.row, selectedCell.col, 'down');
          if (targetCell) {
            swap(selectedCell.row, selectedCell.col, targetCell.row, targetCell.col);
            updateCandyPositions();
          }
        }
      } else {
        // Swipe up
        if (selectedCell) {
          const targetCell = getAdjacentCell(selectedCell.row, selectedCell.col, 'up');
          if (targetCell) {
            swap(selectedCell.row, selectedCell.col, targetCell.row, targetCell.col);
            updateCandyPositions();
          }
        }
      }
    }
  });

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

    // Check Horizontal Matches
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols - 2; c++) {
        const candy = boardToCheck[r][c];
        if (
          candy !== null &&
          candy === boardToCheck[r][c + 1] &&
          candy === boardToCheck[r][c + 2]
        ) {
          foundMatch = true;
          // You can mark the matched cells as null or flag them for removal later
        }
      }
    }

    // Check Vertical Matches
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows - 2; r++) {
        const candy = boardToCheck[r][c];
        if (
          candy !== null &&
          candy === boardToCheck[r + 1][c] &&
          candy === boardToCheck[r + 2][c]
        ) {
          foundMatch = true;
          // Same for vertical matches
        }
      }
    }

    return foundMatch;
  }

  function createBoard() {
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
      hasInitialMatches = detectMatches(board);
    } while (hasInitialMatches || !hasValidMoves());

    console.log("Board created without initial matches:", board);
    console.log("Initial Score:", score);

    // Create candy elements in the DOM
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const candyId = board[r][c];
        const candyDiv = document.createElement('div');
        candyDiv.classList.add('candy-cell', `candy-${candyId}`);

        // Check if the image is available, if not use colors
        const imgSrc = loadCandyImages(candyId);
        if (imgSrc) {
          const img = document.createElement('img');
          img.src = imgSrc;
          img.classList.add('candy-img');
          candyDiv.appendChild(img);
        } else {
          candyDiv.style.backgroundColor = getCandyColor(candyId);
        }

        candyDiv.dataset.row = r;
        candyDiv.dataset.col = c;
        candyDiv.style.left = `${(c / cols) * 100}%`;
        candyDiv.style.top = `${(r / rows) * 100}%`;
        candyDiv.addEventListener('click', onCandyClick);
        gridEl.appendChild(candyDiv);
      }
    }
  }

  function randomCandy() {
    return Math.floor(Math.random() * candyTypes);
  }

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

  function updateCandyPositions() {
    console.log("Updating candy positions with board:", board);
    
    // Remove existing candy elements
    gridEl.innerHTML = '';
    
    // Recreate candy elements based on the updated board
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const candyId = board[r][c];
        const candyDiv = document.createElement('div');
        candyDiv.classList.add('candy-cell');

        // Check if the image is available, if not use colors
        const imgSrc = loadCandyImages(candyId);
        if (imgSrc) {
          const img = document.createElement('img');
          img.src = imgSrc;
          img.classList.add('candy-img');
          candyDiv.appendChild(img);
        } else {
          candyDiv.style.backgroundColor = getCandyColor(candyId);
        }

        candyDiv.dataset.row = r;
        candyDiv.dataset.col = c;
        candyDiv.style.left = `${(c / cols) * 100}%`;
        candyDiv.style.top = `${(r / rows) * 100}%`;
        candyDiv.addEventListener('click', onCandyClick);
        gridEl.appendChild(candyDiv);
      }
    }
  }

  resetBtn.addEventListener('click', () => {
    createBoard();
  });

  createBoard();
}
