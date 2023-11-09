const settings = {
  grid: {
    horizontalCount: 20,
    verticalCount: 20,
    size: 40,
    color: "#6b7280",
  },
  item: {
    hidden: {
      color: "#27272a",
    },
    mine: {
      color: "#e11d48",
    },
    0: {
      color: "black",
    },
    1: {
      color: "#27272a",
    },
    2: {
      color: "#324545",
    },
    3: {
      color: "#769782",
    },
    4: {
      color: "#678952",
    },
    5: {
      color: "#492454",
    },
    6: {
      color: "#671346",
    },
    7: {
      color: "#576966",
    },
    8: {
      color: "#655842",
    },
  },
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const isHorizontalOrientation = window.innerHeight < window.innerWidth;

canvas.height = settings.grid.verticalCount * settings.grid.size;
canvas.width = settings.grid.horizontalCount * settings.grid.size;

const countHorizontalLines = Math.round(canvas.width / settings.grid.size);
const countVerticalLines = Math.round(canvas.height / settings.grid.size);

const drawHorizontalLines = (count) => {
  for (let i = 0; i < count; ++i) {
    const y = Math.round(canvas.height / count) * i;
    ctx.beginPath();
    ctx.strokeStyle = settings.grid.color;
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
};

const drawVerticalLines = (count) => {
  for (let i = 0; i < count; ++i) {
    const x = Math.round(canvas.width / count) * i;
    ctx.beginPath();
    ctx.strokeStyle = settings.grid.color;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
};

const setup = () => {
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = settings.item.hidden.color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  console.log(countHorizontalLines, countVerticalLines);

  drawHorizontalLines(countHorizontalLines);
  drawVerticalLines(countVerticalLines);
};

setup();

const board = makeBoard(countHorizontalLines, countVerticalLines);
board.onMine = (column, row) => {
  console.log("Game over");

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

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const column = Math.floor(x / settings.grid.size);
  const row = Math.floor(y / settings.grid.size);

  board.reveal(column, row);

  // console.log(`Left clicked on ${column}, ${row}`);
});

canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const column = Math.floor(x / settings.grid.size);
  const row = Math.floor(y / settings.grid.size);

  board.flag(column, row);

  console.log(`Right clicked on ${column}, ${row}`);
});

board.onReveal = (column, row, item) => {
  ctx.fillStyle = settings.item.hidden.color;
  ctx.fillRect(
    column * settings.grid.size,
    row * settings.grid.size,
    settings.grid.size,
    settings.grid.size
  );

  ctx.fillStyle = settings.item[item.countAdjacentMines].color;
  ctx.fillRect(
    column * settings.grid.size + 1,
    row * settings.grid.size + 1,
    settings.grid.size - 2,
    settings.grid.size - 2
  );

  if (item.countAdjacentMines > 0) {
    ctx.font = "18px sans-serif";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      item.countAdjacentMines,
      column * settings.grid.size + settings.grid.size / 2,
      row * settings.grid.size + settings.grid.size / 2
    );
  }
};
