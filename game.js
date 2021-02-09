let board = document.getElementById('board');
let tiles = [];
let numOfSerfs = 1;
let currentFoodPool = 25;
let currentWoodPool = 25;
let currentOrePool = 25;
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
    setHtmlTiles()
}


function setHtmlTiles () {
    let document_tiles = document.getElementsByClassName('tile');
    for (let i = 0; i < document_tiles.length; i++) {
        let rowPos = document_tiles[i].getAttribute('data-row');
        let colPos = document_tiles[i].getAttribute('data-col');
        document_tiles[i].classList.add(tiles[rowPos][colPos].tileType);
    }
}


function setGameFieldSize(board, rows, cols) {
    board.style.width = (board.dataset.cellWidth * rows) + 'px';
    board.style.height = (board.dataset.cellHeight * cols) + 'px';
}

function initGame() {
    drawBoard();
    setUpTiles();
    setInterval(FixedUpdate,3000);

}


function FixedUpdate() {

    let income = calcResourceIncomePerTurn();
    let fieldIncome = income[0]
    let mountainIncome = income[1]
    let forestIncome = income[2]

    console.log(fieldIncome, mountainIncome, forestIncome);

}

function calcResourceIncomePerTurn() {
    let numOfWorkedFields = document.querySelectorAll(".worked-field").length;
    let numOfWorkedMountains = document.querySelectorAll(".worked-mountain").length;
    let numOfWorkedForests = document.querySelectorAll(".worked-forest").length;

    let fieldIncome = numOfWorkedFields;
    let mountainIncome = numOfWorkedMountains;
    let forestIncome = numOfWorkedForests;

    return [fieldIncome, mountainIncome, forestIncome];
}

function calcResourceConsumptionPerTurn() {
    let foodConsumption = numOfSerfs;
    // let woodConsumption = numOfSerfs*3; //winter
    return foodConsumption;
}



function Tile(tileType, resourceAmount, hasWorker = false, hasProductionImprovement = false, hasBuilding = false) {
    this.tileType = tileType;
    this.resourceAmount = resourceAmount;
    this.hasWorker = hasWorker;
    this.hasProductionImprovement = hasProductionImprovement;
    this.hasBuilding = hasBuilding;

}