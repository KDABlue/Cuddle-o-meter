// FILE 3: candyCrush.js
export function initBumbaCrush() {
  const gridEl = document.getElementById('crush-grid');
  const scoreEl = document.getElementById('crush-score-value');
  const resetBtn = document.getElementById('crush-reset-btn');

  const rows = 8;
  const cols = 8;
  const candyTypes = 6; // 6 colors
  let board = [];
  let score = 0;

  let selectedCell = null; // store { row, col }

  // Create board, but keep retrying until there's at least one valid move and no initial matches
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

  function onCandyClick(e) {
    const div = e.currentTarget;
    const row = parseInt(div.dataset.row);
    const col = parseInt(div.dataset.col);

    if (!selectedCell) {
      selectedCell = { row, col };
      div.style.outline = '2px solid #fff';
    } else {
      const firstDiv = gridEl.querySelector(
        `[data-row="${selectedCell.row}"][data-col="${selectedCell.col}"]`
      );
      if (firstDiv) firstDiv.style.outline = 'none';

      if (isAdjacent(selectedCell.row, selectedCell.col, row, col)) {
        swap(selectedCell.row, selectedCell.col, row, col);
        updateCandyPositions();

        if (!resolveMatches()) {
          swap(selectedCell.row, selectedCell.col, row, col);
          updateCandyPositions();
        } else {
          // Keep resolving until no new matches
          while (resolveMatches()) {}
          updateCandyPositions();
          if (!hasValidMoves()) {
            alert('No more moves!');
          }
        }
      }
      selectedCell = null;
    }
  }

  function isAdjacent(r1, c1, r2, c2) {
    return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
  }

  function swap(r1, c1, r2, c2) {
    const temp = board[r1][c1];
    board[r1][c1] = board[r2][c2];
    board[r2][c2] = temp;
  }

  // Detects if there are any matches on the provided board without modifying it
  // ...existing code...

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
        // Remove this "break;"
        // break;
      }
    }
    // Remove this "if (foundMatch) break;"
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
        // Remove this "break;"
        // break;
      }
    }
    // Remove this "if (foundMatch) break;"
  }

  return foundMatch;
}

// ...existing code...

  // Detects and resolves matches on the actual board by setting matched cells to null
  function resolveMatchesOnBoard() {
    let foundMatch = false;

    // Horizontal Matches
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols - 2; c++) {
        const candy = board[r][c];
        if (
          candy !== null &&
          candy === board[r][c + 1] &&
          candy === board[r][c + 2]
        ) {
          let matchLen = 3;
          while (c + matchLen < cols && board[r][c + matchLen] === candy) {
            matchLen++;
          }
          for (let k = 0; k < matchLen; k++) {
            board[r][c + k] = null;
          }
          score += matchLen * 10;
          scoreEl.textContent = score;
          foundMatch = true;
          c += matchLen - 1;
        }
      }
    }

    // Vertical Matches
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows - 2; r++) {
        const candy = board[r][c];
        if (
          candy !== null &&
          candy === board[r + 1][c] &&
          candy === board[r + 2][c]
        ) {
          let matchLen = 3;
          while (r + matchLen < rows && board[r + matchLen][c] === candy) {
            matchLen++;
          }
          for (let k = 0; k < matchLen; k++) {
            board[r + k][c] = null;
          }
          score += matchLen * 10;
          scoreEl.textContent = score;
          foundMatch = true;
          r += matchLen - 1;
        }
      }
    }

    console.log("Board after resolving matches:", board);
    console.log("Current Score:", score);

    return foundMatch;
  }

  function resolveMatches() {
    const matched = resolveMatchesOnBoard();
    if (matched) {
      applyGravity();
      refill();
      updateCandyPositions();
    }
    return matched;
  }

  function applyGravity() {
    for (let c = 0; c < cols; c++) {
      for (let r = rows - 1; r >= 0; r--) {
        if (board[r][c] === null) {
          for (let nr = r - 1; nr >= 0; nr--) {
            if (board[nr][c] !== null) {
              board[r][c] = board[nr][c];
              board[nr][c] = null;
              break;
            }
          }
        }
      }
    }
    console.log("Board after applying gravity:", board);
  }

  function refill() {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c] === null) {
          board[r][c] = randomCandy();
        }
      }
    }
    console.log("Board after refill:", board);
  }

  function updateCandyPositions() {
    console.log("Updating candy positions with board:", board);
    
    // First, remove all existing candy elements
    gridEl.innerHTML = '';
    
    // Recreate candy elements based on the updated board
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const candyId = board[r][c];
        const candyDiv = document.createElement('div');
        candyDiv.classList.add('candy-cell');
        
        if (candyId !== null) {
          candyDiv.classList.add(`candy-${candyId}`);
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
  

  function hasValidMoves() {
    // Deep clone the board
    const boardCopy = board.map(row => row.slice());

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Swap Right
        if (c < cols - 1) {
          swapInBoard(boardCopy, r, c, r, c + 1);
          if (detectMatches(boardCopy)) {
            return true;
          }
          // Swap back
          swapInBoard(boardCopy, r, c + 1, r, c);
        }
        // Swap Down
        if (r < rows - 1) {
          swapInBoard(boardCopy, r, c, r + 1, c);
          if (detectMatches(boardCopy)) {
            return true;
          }
          // Swap back
          swapInBoard(boardCopy, r + 1, c, r, c);
        }
      }
    }
    return false;
  }

  function swapInBoard(boardToSwap, r1, c1, r2, c2) {
    const temp = boardToSwap[r1][c1];
    boardToSwap[r1][c1] = boardToSwap[r2][c2];
    boardToSwap[r2][c2] = temp;
  }

  resetBtn.addEventListener('click', () => {
    createBoard();
  });

  createBoard();
}
