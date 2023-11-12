const settings = {
  grid: {
    horizontalCount: 9,
    verticalCount: 9,
    size: 30,
    color: "#6b7280",
  },
  item: {
    hidden: {
      borderTopLeft: "#d4d4d4",
      borderBottomRight: "#737373",
      color: "#a3a3a3",
    },
    mine: {
      color: "#e11d48",
    },
    0: {
      color: "black",
    },
    1: {
      color: "#4f46e5",
    },
    2: {
      color: "#16a34a",
    },
    3: {
      color: "#e11d48",
    },
    4: {
      color: "#581c87",
    },
    5: {
      color: "#881337",
    },
    6: {
      color: "#059669",
    },
    7: {
      color: "#171717",
    },
    8: {
      color: "#fafafa",
    },
  },
};

const timerBlock = document.getElementById("timer");
const mineCountBlock = document.getElementById("mineCount");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const isHorizontalOrientation = window.innerHeight < window.innerWidth;

canvas.height = settings.grid.verticalCount * settings.grid.size;
canvas.width = settings.grid.horizontalCount * settings.grid.size;

const countHorizontalLines = Math.round(canvas.width / settings.grid.size);
const countVerticalLines = Math.round(canvas.height / settings.grid.size);

// const drawHorizontalLines = (count) => {
//   for (let i = 0; i < count; ++i) {
//     const y = Math.round(canvas.height / count) * i;
//     ctx.beginPath();
//     ctx.strokeStyle = settings.grid.color;
//     ctx.moveTo(0, y);
//     ctx.lineTo(canvas.width, y);
//     ctx.stroke();
//   }
// };

// const drawVerticalLines = (count) => {
//   for (let i = 0; i < count; ++i) {
//     const x = Math.round(canvas.width / count) * i;
//     ctx.beginPath();
//     ctx.strokeStyle = settings.grid.color;
//     ctx.moveTo(x, 0);
//     ctx.lineTo(x, canvas.height);
//     ctx.stroke();
//   }
// };

const drawHiddenItem = (x, y) => {
  ctx.fillStyle = settings.item.hidden.borderBottomRight;
  ctx.fillRect(x, y, settings.grid.size, settings.grid.size);
  
  ctx.beginPath()

  ctx.moveTo(x, y + settings.grid.size);
  ctx.lineTo(x, y)
  ctx.lineTo(x + settings.grid.size, y);

  ctx.fillStyle = settings.item.hidden.borderTopLeft;
  ctx.fill();

  ctx.fillStyle = settings.item.hidden.color;
  ctx.fillRect(x+4,y+4, settings.grid.size -8, settings.grid.size -8);
};

const drawRevealedItem = (x, y, color, count) => {
  ctx.fillStyle = settings.item.hidden.color;
  ctx.fillRect(
    column * settings.grid.size,
    row * settings.grid.size,
    settings.grid.size,
    settings.grid.size
  );

  ctx.fillStyle = settings.item.hidden.color;
  ctx.fillRect(
    column * settings.grid.size + 1,
    row * settings.grid.size + 1,
    settings.grid.size - 2,
    settings.grid.size - 2
  );

  if (count > 0) {
    ctx.font = "700 18px sans-serif";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      count,
      column * settings.grid.size + settings.grid.size / 2,
      row * settings.grid.size + settings.grid.size / 2
    );
  }
}

const setup = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = settings.item.hidden.color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < countHorizontalLines; ++i) {
    for (let j = 0; j < countVerticalLines; ++j) {
      drawHiddenItem(i * settings.grid.size, j * settings.grid.size);
    }
  }

  // console.log(countHorizontalLines, countVerticalLines);

  // drawHorizontalLines(countHorizontalLines);
  // drawVerticalLines(countVerticalLines);
};

setup();

const { board, reveal, flag } = createBoard(
  countHorizontalLines,
  countVerticalLines
);

mineCountBlock.innerText = (board.mineCount - board.flagCount)
  .toString()
  .padStart(3, "0");

const timer = createTimer(timerBlock);

const onLeftClick = (column, row) => {
  // console.log(`Reveal on ${column}, ${row}`);
  reveal(column, row);
};

const onRightClick = (column, row) => {
  // console.log(`Flag ${column}, ${row}`);
  flag(column, row);
};

canvas.addEventListener("contextmenu", (e) => e.preventDefault());
canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const column = Math.floor(x / settings.grid.size);
  const row = Math.floor(y / settings.grid.size);

  if (e.button === 0) {
    onLeftClick(column, row);
  } else if (e.button === 2) {
    onRightClick(column, row);
  }
});

const onReveal = (column, row, item) => {
  console.log(`[onReveal] Reveal ${column} x ${row} cell`);
};

const onMine = (column, row) => {
  console.log("[onMine] Game over");

  ctx.beginPath();
  ctx.fillStyle = settings.item.hidden.color;
  ctx.fillRect(
    column * settings.grid.size,
    row * settings.grid.size,
    settings.grid.size,
    settings.grid.size
  );

  ctx.fillStyle = settings.item.mine.color;
  ctx.fillRect(
    column * settings.grid.size + 1,
    row * settings.grid.size + 1,
    settings.grid.size - 2,
    settings.grid.size - 2
  );
};

const onSpace = (column, row, item) => {
  console.log(`[onSpace] Space on ${column}, ${row}`);

  ctx.fillStyle = settings.item.hidden.color;
  ctx.fillRect(
    column * settings.grid.size,
    row * settings.grid.size,
    settings.grid.size,
    settings.grid.size
  );

  ctx.fillStyle = settings.item.hidden.color;
  ctx.fillRect(
    column * settings.grid.size + 1,
    row * settings.grid.size + 1,
    settings.grid.size - 2,
    settings.grid.size - 2
  );

  if (item.countAdjacentMines > 0) {
    ctx.font = "700 18px sans-serif";
    ctx.fillStyle = settings.item[item.countAdjacentMines].color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      item.countAdjacentMines,
      column * settings.grid.size + settings.grid.size / 2,
      row * settings.grid.size + settings.grid.size / 2
    );
  }
};

const onStart = () => {
  console.log("[onStart]");

  timer.start();
};

const onFail = () => {
  console.log("[onFail]");

  timer.stop();
};

const onVictory = () => {
  console.log("[onVictory]");

  timer.stop();
};

const onFlug = () => {
  console.log("[onFlug]");

  mineCountBlock.innerText = (board.mineCount - board.flagCount)
    .toString()
    .padStart(3, "0");
};

const onUnflug = () => {
  console.log("[onUnflag]");

  mineCountBlock.innerText = (board.mineCount - board.flagCount)
    .toString()
    .padStart(3, "0");
};

const events = [
  { onReveal },
  { onMine },
  { onSpace },
  { onStart },
  { onFail },
  { onVictory },
  { onFlug },
  { onUnflug },
];

events.forEach((obj) => {
  const [event, callback] = Object.entries(obj)[0];
  appendEventListener(board, event, callback);
});
