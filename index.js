//Инициализация
const maxFieldSize = 21; //максимально возможная размерность поля
const defaultFieldSize = 3; //размер поля по умолчанию (кол-во строк/столбцов)
const defaultCellSize = 150; //размер клетки в пикселях
const crossSvg = document.querySelector("#cross"); //svg крестика
const circleSvg = document.querySelector("#circle"); //svg нолика

let field = document.querySelector(".game-field");
let cell = document.querySelector(".game-field_cell");
let circleTurn = false; //Текущий ход (true, если ходит игрок, играющий за "нолики")
let history = []; //История ходов
let fieldSize = defaultFieldSize;
let cellSize = defaultCellSize;
let resetBtn = document.querySelector(".reset-button");
resetBtn.value = "Новая игра";

cell.style.width = cellSize;
cell.style.height = cellSize;
crossSvg.style.width = cellSize;
crossSvg.style.height = cellSize;
circleSvg.style.width = cellSize;
circleSvg.style.height = cellSize;

let mainDiv = document.querySelector("div");

//Добавление комбобокса для выбора размера поля
let comboSize = document.createElement("select");
comboSize.className = "reset-button";
mainDiv.appendChild(comboSize);

let option;
option = document.createElement("option");
option.innerHTML =
  "Выберите размер поля (кол-во строк/столбцов, 3 по умолчанию)";
option.selected = true;
option.disabled = true;
comboSize.appendChild(option);
for (var i = defaultFieldSize; i <= maxFieldSize; i = i + 2) {
  //добавление вариантов размера поля от стандартного до максимального
  option = document.createElement("option");
  option.innerHTML = i;
  option.value = i;
  comboSize.appendChild(option);
}

//Добавление кнопки отмены хода
let undoTurnBtn = document.createElement("input");
undoTurnBtn.type = "button";
undoTurnBtn.value = "Отменить ход";
undoTurnBtn.className = "reset-button";
mainDiv.appendChild(undoTurnBtn);

//Функция для кастомных алертов, закрывающихся через некоторое время
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

//Функция изменения размера поля + размера клеток
function changeFieldSize(size) {
  let cellClone;
  cellSize =
    defaultCellSize / (size === defaultFieldSize ? 1 : size - defaultFieldSize);
  cell.style.width = cellSize;
  cell.style.height = cellSize;
  crossSvg.style.width = cellSize;
  crossSvg.style.height = cellSize;
  circleSvg.style.width = cellSize;
  circleSvg.style.height = cellSize;
  field.innerHTML = "";
  field.style.gridTemplateColumns = `repeat(${size}, auto)`;
  fieldSize = size;
  resetGame();
  for (let i = 0; i < size * size; i++) {
    cellClone = cell.cloneNode();
    field.appendChild(cellClone);
  }
}

function resetGame() { //Новая игра
  Array.from(field.children).forEach((child) => {
    child.innerHTML = "";
    child.style.fill = "black";
  });
  circleTurn = false;
  history = [];
  field.style.pointerEvents = "auto";
}

function markCombination(indicies) {
  //подсветить комбинацию
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
          (x.col + x.row === fieldSize - 1 ||
            x.index === Math.floor((fieldSize * fieldSize) / 2)) &&
          x.circleTurn === circleTurn
      )
      .map((elem) => elem.index), //клетки игрока по диагонали справа налево
  ];
  for (combination of winChecks) {
    console.log(combination, fieldSize);
    if (combination.length === fieldSize) {
      //если комбинация выигрышная
      markCombination(combination);
      myAlert(
        "Победитель - игрок, игравший за" +
          (circleTurn ? '"нолики"' : '"крестики"') +
          "! Новая игра начнется через 5 секунд...",
        5000
      );
      endGame();
      return;
    }
  }
  if (history.length >= fieldSize * fieldSize) {
    myAlert("Ничья! Новая игра начнется через 5 секунд...", 5000);
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

comboSize.addEventListener("change", (e) => {
  changeFieldSize(parseInt(e.target.value));
});

undoTurnBtn.addEventListener("click", () => {
  if (history.length > 0) {
    let lastTurn = history.pop();
    field.children[lastTurn.index].innerHTML = "";
    circleTurn = !circleTurn;
  } else {
    myAlert("Еще не было сделано ни одного хода!", 1000);
  }
});
