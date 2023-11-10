let count = 0;

const createItem = () => {
  const item = {
    isMine: Math.round(Math.random()) === 1,
    // isMine: false,
    isFlagged: false,
    isRevealed: false,
    countAdjacentMines: 0,
  };

  // if (count < 10) {
  //   item.isMine = true;
  //   ++count;
  // }

  return item;
};

const makeBoard = (columns, rows /* , onCreate */) => {
  console.log(`Creating board with ${columns} x ${rows} cells`);

  const mineCount = Math.round((columns * rows) / 4); // 20% of cells are mines

  const board = {
    _items: Array.from({ length: columns * rows }, () => createItem()),
    _isRevialing: false,

    revealAll: () => {
      board._isRevialing = true;
      board._items.forEach((item, index) => {
        const row = Math.floor(index / rows);
        const column = index % rows;

        board.reveal(column, row);
      });
      board._isRevialing = false;
    },
    _revealZero: (column, row) => {
      // Check top cell
      if (row > 0) {
        board.reveal(column, row - 1);
      }

      // Check left cell
      if (column > 0) {
        board.reveal(column - 1, row);
      }

      // Check bottom cell
      if (row < rows - 1) {
        board.reveal(column, row + 1);
      }

      // Check right cell
      if (column < columns - 1) {
        board.reveal(column + 1, row);
      }
    },
    reveal: (column, row) => {
      const index = rows * row + column;

      // console.log(`Revealing cell ${index} [${column}, ${row}]`);

      const item = board._items[index];

      if (item.isFlagged || item.isRevealed) {
        return;
      }

      item.isRevealed = true;

      if (item.isMine) {
        if (!board._isRevialing) {
          board.revealAll();
        }

        board.onMine(column, row);
        return;
      }

      if (!board._isRevialing && item.isRevealed && item.countAdjacentMines === 0) {
        board._revealZero(column, row);
      }

      board.onReveal(column, row, item);
    },
    flag: (column, row) => {
      const index = rows * row + column;

      const item = board._items[index];

      if (item.isFlagged) {
        console.log(`Unflagging cell ${index} [${column}, ${row}]`);

        item.isFlagged = false;

        board.onUnflug(column, row);
      } else {
        console.log(`Flagging cell ${index} [${column}, ${row}]`);

        item.isFlagged = true;
        board.onFlug(column, row)
      }
    },

    onMine: (column, row) => {},
    onReveal: (column, row, item) => {},
    onFlug: (column, row) => {},
    onUnflug: (column, row) => {},
  };

  board._items.forEach((item, index) => {
    if (item.isMine) {
      return;
    }

    const row = Math.floor(index / rows);
    const column = index % rows;

    // console.log(`Checking cell ${index} [${column}, ${row}]`);

    if (row > 0) {
      item.countAdjacentMines += board._items[index - rows].isMine ? 1 : 0; // top

      if (column > 0) {
        item.countAdjacentMines += board._items[index - rows - 1].isMine ? 1 : 0; // top-left
      }

      if (column < columns - 1) {
        item.countAdjacentMines += board._items[index - rows + 1].isMine ? 1 : 0; // top-right
      }
    }

    if (column < columns - 1) {
      item.countAdjacentMines += board._items[index + 1].isMine ? 1 : 0; // right
    }

    if (row < rows - 1) {
      item.countAdjacentMines += board._items[index + rows].isMine ? 1 : 0; // bottom

      if (column > 0) {
        item.countAdjacentMines += board._items[index + rows - 1].isMine ? 1 : 0; // bottom-left
      }

      if (column < columns - 1) {
        item.countAdjacentMines += board._items[index + rows + 1].isMine ? 1 : 0; // bottom-right
      }
    }

    if (column > 0) {
      item.countAdjacentMines += board._items[index - 1].isMine ? 1 : 0; // left
    }
  });

  return board;
};
