let board = document.getElementById('board')
initGame();

 function drawBoard () {

  this.setGameFieldSize(board, 5, 5);
  let cellIndex = 0
  for (let row = 0; row < 5; row++) {
   const rowElement = this.addRow(board);
   for (let col = 0; col < 5; col++) {
    this.addCell(rowElement, row, col);
    cellIndex++;
   }
  }
 }

 function addRow (board) {
        board.insertAdjacentHTML(
            'beforeend',
            '<div class="row"></div>'
        );
        return board.lastElementChild;
    }

 function addCell (rowElement, row, col) {
        rowElement.insertAdjacentHTML(
            'beforeend',
            `<div class="tile"
                        data-row="${row}"
                        data-col="${col}"></div>`);
    }

 function setGameFieldSize (board, rows, cols) {
        board.style.width = (board.dataset.cellWidth * rows) + 'px';
        board.style.height = (board.dataset.cellHeight * cols) + 'px';
    }

function initGame() {
drawBoard()
    // Your game can start here, but define separate functions, don't write everything in here :)

}


 function FixedUpdate (){


 }