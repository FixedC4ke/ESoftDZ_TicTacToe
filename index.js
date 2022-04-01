const cellSize = 150;
const fieldSize = 3;
let resetBtn = document.querySelector(".reset-button");

let crossSvg = document.querySelector("#cross");
crossSvg.style.width = cellSize;
crossSvg.style.height = cellSize;

let circleSvg = document.querySelector("#circle");
circleSvg.style.width = cellSize;
circleSvg.style.height = cellSize;

let circleTurn = false;
let field = document.querySelector(".game-field");
let history = [];

function myAlert(msg, duration) {
  var el = document.createElement("div");
  el.setAttribute(
    "style",
    "position:absolute;width:100%;top:50%;text-align:center;background-color:white"
  );
  el.innerHTML = msg;
  setTimeout(() => {
    field.removeChild(el);
  }, duration);
  field.appendChild(el);
}

function resetGame() {
  Array.from(field.children).forEach((child) => {
    child.innerHTML = "";
    child.style.fill = "black";
  });
  circleTurn = false;
  history = [];
  field.style.pointerEvents = "auto";
}

function markCombination(indicies) {
  indicies.forEach((index) => {
    field.children[index].style.fill = "green";
  });
}

function endGame() {
  field.style.pointerEvents = "none";
  setTimeout(resetGame, 5000);
}

function checkForWinners(turnData) {
  let { index, row, col, circleTurn } = turnData;
  let winChecks = [
    history
      .filter((x) => x.row === row && x.circleTurn === circleTurn)
      .map((elem) => elem.index), //клетки игрока по горизонтали
    history
      .filter((x) => x.col === col && x.circleTurn === circleTurn)
      .map((elem) => elem.index), //клетки игрока по вертикали
    history
      .filter((x) => x.col === x.row && x.circleTurn === circleTurn)
      .map((elem) => elem.index), //клетки игрока по диагонали слева направо
    history
      .filter(
        (x) =>
          (Math.abs(x.col - x.row) === fieldSize - 1 ||
            x.index === Math.floor((fieldSize * fieldSize) / 2)) &&
          x.circleTurn === circleTurn
      )
      .map((elem) => elem.index), //клетки игрока по диагонали справа налево
  ];
  for (combination of winChecks) {
    if (combination.length === fieldSize) {
      //если комбинация выигрышная
      markCombination(combination);
      myAlert(
        "Winner - " + (circleTurn ? "circle" : "cross") + "! Reset in 5s...",
        5000
      );
      endGame();
      return;
    }
  }
  if (history.length >= fieldSize * fieldSize) {
    myAlert("No one wins! Reset in 5s...", 5000);
    endGame();
  }
}

field.addEventListener("click", (e) => {
  if (e.target.children.length === 0) {
    e.target.innerHTML += (circleTurn ? circleSvg : crossSvg).outerHTML;
    let index = Array.from(field.children).indexOf(e.target);
    let row = Math.floor(index / fieldSize);
    let col = index % fieldSize;
    let turnData = { index, row, col, circleTurn };
    history.push(turnData);

    checkForWinners(turnData);

    circleTurn = !circleTurn;
  }
});

resetBtn.addEventListener("click", resetGame);
