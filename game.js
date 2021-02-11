let board = document.getElementById('board');
let tiles = [];

let numOfSerfs = 1;
let currentFoodPool = 999;
let currentWoodPool = 100;
let currentOrePool = 100;

let turnCount = 99;

let isWinter = false;
let turnToWinter = 100;
let gameIsRunning = true;

let serfKillCounter = 0;

let fieldIncome = 0;
let forestIncome = 0;
let mountainIncome = 0;
let foodChange = 0;
let woodChange = 0;

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


//Winter
function changeToWinter() {
    let winterTransitionImage = document.getElementById('winter-transition');
    let tiles = document.getElementsByClassName('tile');
    let serfs = document.getElementsByClassName('serf');
    winterTransitionImage.classList.add('going');

    setTimeout(() => (setWinterAttributes()), 700);
    function setWinterAttributes() {
        for (const tile of tiles) {
        tile.classList.add('winter');
    }
    for (const serf of serfs) {
        serf.classList.add('winter');
    }
    }

}


function FixedUpdate() {
    if (gameIsRunning) {
        checkForGameOver();
        updateResourcesAndSerfs();
        updateTurn();
    }
}


function updateTurn() {
    turnCount++;
    let turnCounter = document.getElementById('turn-counter');
    turnCounter.innerHTML = turnCount.toString();
    if (turnCount === turnToWinter) {
        isWinter = true;
        changeToWinter()
    }

}


//Resource
function calcResourceIncomePerTurn() {
    fieldIncome = 0;
    forestIncome = 0;
    mountainIncome = 0;

    for (let row = 0; row < tiles.length; row++) {
        {
            for (let col = 0; col < tiles.length; col++) {
                {
                    let tile = tiles[row][col];
                    if (tile.hasWorker && tile.tileType !== 'village') {
                        let tileIncome = 0;
                        let htmlTile = document.getElementsByClassName('tile')[+row * 5 + +col];
                        let popupMessage = document.createElement('p');
                        popupMessage.classList.add("resource-income-num");
                        if (tile.tileType === 'field') {
                            tileIncome = tile.resourceAmount + (tile.hasProductionImprovement * 2);
                            if (isWinter) {
                                tileIncome = 1
                            }
                            fieldIncome += tileIncome;
                        } else if (tile.tileType === 'forest') {
                            tileIncome = tile.resourceAmount + (tile.hasProductionImprovement * 2);
                            forestIncome += tileIncome;
                        } else if (tile.tileType === 'mountain') {
                            tileIncome = tile.resourceAmount + (tile.hasProductionImprovement * 2);
                            mountainIncome += tileIncome;
                        }
                        popupMessage.innerHTML = `+${tileIncome}`;
                        htmlTile.prepend(popupMessage);
                        setTimeout(() => (popupMessage.classList.add('float')), 0);
                        setTimeout(() => (htmlTile.childNodes[0].remove()), 1900);
                    }
                }
            }
        }
    }
}

function calcResourceConsumptionPerTurn() {
    let woodConsumption = 0
    if (isWinter) {
        woodConsumption = numOfSerfs * 3; //winter
    }
    return [numOfSerfs, woodConsumption];
}

function updateResourcesAndSerfs() {
    calcResourceIncomePerTurn()
    let consumption = calcResourceConsumptionPerTurn()
    let serfsSpawned = 0;
    let foodConsumption = consumption[0];
    let woodConsumption = consumption[1];
    foodChange = fieldIncome - foodConsumption;
    woodChange = forestIncome - woodConsumption;
    console.log(foodChange,woodChange);

    currentFoodPool = currentFoodPool + foodChange;
    currentWoodPool = currentWoodPool + woodChange;
    currentOrePool = currentOrePool + mountainIncome;
    if (currentFoodPool < 0) {
        currentFoodPool = 0;
        killRandomSerf();
    }

    if (currentWoodPool < 0) {
        currentWoodPool = 0;
        killRandomSerf();
    }

    numOfSerfs = numOfSerfs + serfsSpawned;
    updateResourceDisplay()
}


function updateResourceDisplay() {
    let foodCounter = document.getElementById("food-counter");
    let woodCounter = document.getElementById("wood-counter");
    let oreCounter = document.getElementById("ore-counter");
    let serfCounter = document.getElementById("serf-counter");

    let foodIncomeCounter = document.getElementById("food-income");
    let woodIncomeCounter = document.getElementById("wood-income");
    let oreIncomeCounter = document.getElementById("ore-income");

    let woodChangeMessage = woodChange;
    let foodChangeMessage = foodChange;
    let mountainIncomeMessage = mountainIncome;


    if (foodChange >= 0) {
        if (foodChange !== 0) {
            foodChangeMessage = '+' + foodChange;
        }
        foodIncomeCounter.classList.remove('negative')
    } else {
        foodIncomeCounter.classList.add('negative');
    }
    if (woodChange >= 0) {
        if (woodChange !== 0) {
            woodChangeMessage = '+' + woodChange
        }
        woodIncomeCounter.classList.remove('negative')
    } else {
        woodIncomeCounter.classList.add('negative');
    }

    if (mountainIncome !== 0) {
        mountainIncomeMessage = '+' + mountainIncome;
    }

    oreIncomeCounter.innerHTML = mountainIncomeMessage;
    woodIncomeCounter.innerHTML = woodChangeMessage;
    foodIncomeCounter.innerHTML = foodChangeMessage;

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
    tile.insertAdjacentHTML('beforeend', '<div class="serf" draggable="true"></div>')
    let serfObject = document_tiles[index].childNodes[0]
    serfObject.addEventListener('dragstart', serfDragStart);
    serfObject.addEventListener('dragend', serfDragEnd);
    toggleTileWorkerStatus(tiles[row][col]);
    numOfSerfs++;
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

function placeBuilding(row, col, building) {
    console.log(building);
    if (currentWoodPool >= 30 && currentOrePool >= 30 && gameIsRunning) {
        let tile = tiles[row][col];
        let docTiles = document.getElementsByClassName('tile');
        console.log(+row * 5 + +col);
        let buildTile = docTiles[+row * 5 + +col];
        if (building === 'house' && tile.tileType === 'field') {
            buildTile.classList.add('house');
            tile.hasBuilding = true;
        } else if (building === 'farm' && tile.tileType === 'field') {
            buildTile.classList.add('farm');
            tile.hasBuilding = true;
            tile.hasProductionImprovement = true;
        } else if (building === 'mine' && tile.tileType === 'mountain') {
            buildTile.classList.add('mine');
            tile.hasBuilding = true;
            tile.hasProductionImprovement = true;
        } else if (building === 'logger' && tile.tileType === 'forest') {
            buildTile.classList.add('logger');
            tile.hasBuilding = true;
            tile.hasProductionImprovement = true;
        }
        if (tile.hasBuilding) {
            currentOrePool -= 30;
            currentWoodPool -= 30;
            updateResourceDisplay();
        }

    } else {
        //Let the user know not enough resources
    }
}


//Scoreboard and endgame things
function scoreBoard() {
    let scoreBoard = document.getElementById('scoreboard')
    const toInsert = "<table class='table table-striped table-dark' style='width: 70%;'>\n" +
        "            <thead>\n" +
        "                <tr>\n" +
        "                    <th scope='col'></th>\n" +
        "                    <th scope='col'>Food</th>\n" +
        "                    <th scope='col'>Wood</th>\n" +
        "                    <th scope='col'>Ore</th>\n" +
        "                    <th scope='col'>Serfs</th>\n" +
        "                    <th scope='col'>Killed serfs</th>\n" +
        "                    <th scope='col'>Turns</th>\n" +
        "                </tr>\n" +
        "            </thead>\n" +
        "            <tbody>\n" +
        "                <tr>\n" +
        "                    <th scope='row'>Statistics</th>\n" +
        "                    <td id='food'></td>\n" +
        "                    <td id='wood'></td>\n" +
        "                    <td id='ore'></td>\n" +
        "                    <td id='serfs'></td>\n" +
        "                    <td id='killed_serfs'></td>\n" +
        "                    <td id='turns'></td>\n" +
        "                </tr>\n" +
        "            </tbody>\n" +
        "        </table>\n" +
        "        <table class='table table-striped table-dark' style='width: 30%;'>\n" +
        "           <tbody>\n" +
        "               <tr>\n" +
        "               <th scope='row'>Score</th>\n" +
        "               <td id='score'></td>\n" +
        "               </tr>\n" +
        "           </tbody>\n" +
        "        </table>"
    scoreBoard.insertAdjacentHTML("beforeend", toInsert);

    let food = document.getElementById('food')
    let wood = document.getElementById('wood')
    let ore = document.getElementById('ore')
    let serfs = document.getElementById('serfs')
    let turns = document.getElementById('turns')
    let killedSerfs = document.getElementById('killed_serfs')
    let score = document.getElementById('score')
    food.innerHTML = currentFoodPool+1;
    wood.innerHTML = currentWoodPool;
    ore.innerHTML = currentOrePool;
    serfs.innerHTML = numOfSerfs;
    killedSerfs.innerHTML = serfKillCounter;
    turns.innerHTML = turnCount+1;
    // Add the buildings number to this
    score.innerHTML = (numOfSerfs * 10 + currentOrePool + currentWoodPool + currentFoodPool)

}

//TODO:
function checkForGameOver() {
    if (numOfSerfs === 0 || turnCount > 140) {
        alert('Game Over!');
        gameIsRunning = false;
        scoreBoard();
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
    let dragImage = new Image();
    dragImage.src = 'Sprites/BuildIcon.png';
    event.dataTransfer.setDragImage(dragImage, 0, 0);
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
            placeBuilding(row, col, buildingType);


        }
    }

}


//Tile Building










