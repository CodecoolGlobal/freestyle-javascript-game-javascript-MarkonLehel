let board = document.getElementById('board')
let tiles = []
initGame();

function drawBoard() {
    this.setGameFieldSize(board, 5, 5);
    let cellIndex = 0
    for (let row = 0; row < 5; row++) {
        tiles.push([]);
        const rowElement = this.addRow(board);
        for (let col = 0; col < 5; col++) {
            let tile = new Tile('none', 2)
            tiles[row].push(tile);
            this.addCell(rowElement, row, col);
            cellIndex++;
        }
    }
}

function addRow(board) {
    board.insertAdjacentHTML(
        'beforeend',
        '<div class="row"></div>'
    );
    return board.lastElementChild;
}

function addCell(rowElement, row, col) {
    rowElement.insertAdjacentHTML(
        'beforeend',
        `<div class="tile"
                        data-row="${row}"
                        data-col="${col}"></div>`);
}

function setUpTiles(fieldAmount = 12, mountainAmount = 6, forestAmount = 6) {
    let currentFields = 0;
    let currentMountains = 0;
    let currentForests = 0;


    tiles[2][2].tileType = 'village'
    while (currentFields !== fieldAmount) {

        let row = Math.floor(Math.random() * 5);
        let col = Math.floor(Math.random() * 5);
        if (tiles[row][col].tileType === 'none') {
            tiles[row][col].tileType = 'field';
            currentFields++;
        }
    }
    while (currentMountains !== mountainAmount) {
        let row = Math.floor(Math.random() * 5);
        let col = Math.floor(Math.random() * 5);
        if (tiles[row][col].tileType === 'none') {
            tiles[row][col].tileType = 'mountain';
            currentMountains++;
        }

    }

    while (currentForests !== forestAmount) {
        let row = Math.floor(Math.random() * 5);
        let col = Math.floor(Math.random() * 5);
        if (tiles[row][col].tileType === 'none') {
            tiles[row][col].tileType = 'forest';
            currentForests++;
        }

    }

    /*if (row === 2 && col === 2) {
        tiles[row][col].tileType = 'village';
    } else if (currentFields !== fieldAmount && Math.floor(Math.random() * 2)) {
        tiles[row][col].tileType = 'field';
    } else if (currentMountains !== mountainAmount && Math.floor(Math.random() * 2)) {
        tiles[row][col].tileType = 'mountain';
    } else (currentForests !== forestAmount && Math.floor(Math.random() * 2)) {
        tiles[row][col].tileType = 'forest';
    }*/
}


function setGameFieldSize(board, rows, cols) {
    board.style.width = (board.dataset.cellWidth * rows) + 'px';
    board.style.height = (board.dataset.cellHeight * cols) + 'px';
}

function initGame() {
    drawBoard()

    setUpTiles()
    console.log(tiles);

}


function FixedUpdate() {


}

function Tile(tileType, resourceAmount, hasWorker = false, hasProductionImprovement = false, hasBuilding = false) {
    this.tileType = tileType;
    this.resourceAmount = resourceAmount;
    this.hasWorker = hasWorker;
    this.hasProductionImprovement = hasProductionImprovement;
    this.hasBuilding = hasBuilding;

}