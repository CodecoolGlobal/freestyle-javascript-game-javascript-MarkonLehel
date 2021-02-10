let board = document.getElementById('board');
let tiles = [];
let numOfSerfs = 1;
let currentFoodPool = 5;
let currentWoodPool = 25;
let currentOrePool = 25;
let turnCount = 0;
let isWinter = false;
let gameIsRunning = true;
let serfKillCounter = 0;
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
    setUpHtmlTiles()
}

function setUpHtmlTiles() {
    let document_tiles = document.getElementsByClassName('tile');
    for (let i = 0; i < document_tiles.length; i++) {
        let rowPos = document_tiles[i].getAttribute('data-row');
        let colPos = document_tiles[i].getAttribute('data-col');
        document_tiles[i].classList.add(tiles[rowPos][colPos].tileType);

        initDragAndDrop(document_tiles[i]);

    }
}

function initDragAndDrop(tile) {
    tile.addEventListener('dragover', dragOverTile);
    tile.addEventListener('dragenter', dragEnterTile);
    tile.addEventListener('dragleave', dragLeaveTile);
    tile.addEventListener('drop', dropOnTile);
}

function setGameFieldSize(board, rows, cols) {
    board.style.width = (board.dataset.cellWidth * rows) + 'px';
    board.style.height = (board.dataset.cellHeight * cols) + 'px';
}

function initGame() {
    drawBoard();
    setUpTiles();
    initBuildingEvents();
    createSerfAt(2, 2);
    setInterval(FixedUpdate, 2000);

}

function FixedUpdate() {
    if (gameIsRunning) {
        checkForGameOver();
        updateResourcesAndSerfs();
        updateTurnCounter();

    }
}


function updateTurnCounter() {
    turnCount++;
    let turnCounter = document.getElementById('turn-counter');
    turnCounter.innerHTML = turnCount.toString();

}

//Resource
//TODO: Tiles with house dont contribute to food production
function calcResourceIncomePerTurn() {
    let fieldIncome = 0;
    let forestIncome = 0;
    let mountainIncome = 0;

    for (const row of tiles) {
        {
            for (const tile of row) {
                {
                    if (tile.hasWorker) {
                        if (tile.tileType === 'field') {
                            fieldIncome += tile.resourceAmount + (tile.hasProductionImprovement * 2)

                        } else if (tile.tileType === 'forest') {
                            forestIncome += tile.resourceAmount + (tile.hasProductionImprovement * 2)
                        } else if (tile.tileType === 'mountain') {
                            mountainIncome += tile.resourceAmount + (tile.hasProductionImprovement * 2)
                        }
                    }
                }
            }
        }
    }
    return [fieldIncome, mountainIncome, forestIncome];
}

function calcResourceConsumptionPerTurn() {
    // let woodConsumption = numOfSerfs*3; //winter
    return [numOfSerfs];
}

function updateResourcesAndSerfs() {
    let income = calcResourceIncomePerTurn();
    let consumption = calcResourceConsumptionPerTurn()

    let fieldIncome = income[0];
    let mountainIncome = income[1];
    let forestIncome = income[2];
    let serfsSpawned = 0;

    let foodConsumption = consumption[0];
    let foodChange = fieldIncome - foodConsumption;




    currentFoodPool = currentFoodPool + foodChange;
    if (currentFoodPool < 0) {
        currentFoodPool = 0;
        killRandomSerf();
    }
    currentWoodPool = currentWoodPool + forestIncome;
    currentOrePool = currentOrePool + mountainIncome;
    numOfSerfs = numOfSerfs + serfsSpawned;
    updateResourceDisplay()
}


function updateResourceDisplay(){
    let foodCounter = document.getElementById("food-counter");
    let woodCounter = document.getElementById("wood-counter");
    let oreCounter = document.getElementById("ore-counter");
    let serfCounter = document.getElementById("serf-counter");

    foodCounter.innerHTML = currentFoodPool.toString();
    woodCounter.innerHTML = currentWoodPool.toString();
    oreCounter.innerHTML = currentOrePool.toString();
    serfCounter.innerHTML = numOfSerfs.toString();
}
//Gameplay

function initBuildingEvents() {
    let buildingIcons = document.getElementsByClassName('building');
    for (const building of buildingIcons) {
        building.addEventListener('dragstart', buildingDragStart);
        building.addEventListener('dragend', buildingDragEnd);
    }
}

function createSerfAt(row, col) {
    let document_tiles = document.getElementsByClassName('tile');
    let index = row * 5 + col;
    let tile = document_tiles[index];
    console.log(document_tiles);
    tile.insertAdjacentHTML('beforeend', '<div class="serf" draggable="true"></div>')
    let serfObject = document_tiles[index].childNodes[0]
    serfObject.addEventListener('dragstart', serfDragStart);
    serfObject.addEventListener('dragend', serfDragEnd);
    toggleTileWorkerStatus(tiles[row][col]);

}

function Tile(tileType, resourceAmount, hasWorker = false, hasProductionImprovement = false, hasBuilding = false) {
    this.tileType = tileType;
    this.resourceAmount = resourceAmount;
    this.hasWorker = hasWorker;
    this.hasProductionImprovement = hasProductionImprovement;
    this.hasBuilding = hasBuilding;
}

function toggleTileWorkerStatus(tile) {
    tile.hasWorker = !tile.hasWorker;

}

function killRandomSerf() {
    let serfs = document.getElementsByClassName('serf');
    if (serfs.length !== 0) {
        let unluckySerfIndex = Math.floor(Math.random() * serfs.length);
        serfs[unluckySerfIndex].classList.add('dead');
        let serfToDelete = document.getElementsByClassName('dead')[0];
        serfToDelete.remove();
        serfKillCounter++;
        numOfSerfs--;
    }
}

function placeBuilding (row, col, building) {
    console.log(row,col);
    if (currentWoodPool >= 30 && currentOrePool >= 30 && gameIsRunning){
        let tile = tiles[row][col];
        let docTiles = document.getElementsByClassName('tile');
        console.log(+row * 5 + +col);
        let buildTile = docTiles[+row * 5 + +col];
        tile.hasBuilding = true;
        if (building === 'house') {
            buildTile.classList.add('house');
        } else if (building === 'farm'){
            buildTile.classList.add('farm');
            tile.hasProductionImprovement = true;
        } else if (building === 'mine'){
            buildTile.classList.add('mine');
            tile.hasProductionImprovement = true;
        } else if (building === 'logger'){
            buildTile.classList.add('logger');
            tile.hasProductionImprovement = true;
        }
        currentOrePool -= 30;
        currentWoodPool -= 30;
        updateResourceDisplay()
    } else {
        //Let the user know not enough resources
    }
}

//TODO:
function checkForGameOver() {
    if (numOfSerfs === 0 || turnCount > 140) {
        alert('Game Over!');
        gameIsRunning = false;
    }
}

//Dragging stuff
//Serf
let parentTile;

function serfDragStart(event) {
    event.dataTransfer.setData('text', "serf");
    this.classList.add('dragged');
    setTimeout(() => (this.classList.add('opaque')), 0);
    let row = this.parentNode.getAttribute('data-row');
    let col = this.parentNode.getAttribute('data-col');
    parentTile = tiles[row][col];

}


function serfDragEnd() {
    let serf = document.querySelector('.dragged');
    serf.classList.remove('dragged');
    serf.classList.remove('opaque');
}

//Building

function buildingDragStart(event) {
    event.dataTransfer.setData('text', "building");
    let buildingType = this.getAttribute('building-type');
    event.dataTransfer.setData('type', buildingType);
    this.classList.add('dragged');
    console.log(event.dataTransfer.items);

}

function buildingDragEnd() {
    let building = document.querySelector('.dragged');
    building.classList.remove('dragged');
}

//Tiles

function dragOverTile(event) {
    event.preventDefault();
}

function dragEnterTile(event) {
    event.preventDefault();
}

function dragLeaveTile() {
}

function dropOnTile(event) {
    let row = this.getAttribute('data-row');
    let col = this.getAttribute('data-col');
    let tile = tiles[row][col]
    //If serf
    if (event.dataTransfer.getData('text') === 'serf') {
        if (!tile.hasWorker) {
            let serf = document.querySelector('.dragged');
            toggleTileWorkerStatus(parentTile);
            toggleTileWorkerStatus(tile);
            event.currentTarget.appendChild(serf);
        }
        //If building
    } else if (event.dataTransfer.getData('text') === 'building') {
        let buildingType = event.dataTransfer.getData('type');
        if (!tile.hasBuilding) {
            placeBuilding(row,col,buildingType);


        }
    }

}


//Tile Building










