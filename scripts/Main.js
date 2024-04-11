import { Player } from './Player.js';
import { OasisMarker } from './OasisMarker.js';
import { Sand } from './Sand.js';
import {Oasis} from "./Oasis.js";
import {Drought} from "./Drought.js";
import {Item} from "./Item.js";

const matrix = document.getElementById('matrix');

window.onload = function() {
    document.getElementById('startForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const numPlayers = document.getElementById('numPlayers').value;
        document.getElementById('startModal').style.display = 'none';

        for (let i = 1; i <= numPlayers; i++) {
            document.getElementById(`player_${i}`).style.display = 'block';
        }
    });
}

function getRandomSet(length) {
    let set = new Set();
    while (set.size < length) {
        let i = Math.floor(Math.random() * 5);
        let j = Math.floor(Math.random() * 5);

        if(set.has(`${i},${j}`) || (i === 2 && j === 2)){
            continue;
        }
        set.add(`${i},${j}`);
    }
    return set;
}

let locations = getRandomSet(7);


let player;

function createLevel() {
    let hasDrought = false;
    let cells = [];
    for (let i = 0; i < 5; i++) {
        let row = [];
        for (let j = 0; j < 5; j++) {
            let cell;
            if (i === 2 && j === 2) {
                cell = new Player(i, j);
                player = new Player(i, j, new Sand(i, j));
            } else if (locations.has(`${i},${j}`)) {
                if (locations.size > 3){
                    if(hasDrought === false){
                        cell = new OasisMarker(i, j, 'Drought');
                        hasDrought = true;
                    } else{
                        cell = new OasisMarker(i, j, 'Oasis');
                    }
                } else {
                    cell = new Item(i, j, locations.size);
                }
                locations.delete(`${i},${j}`);
            } else {
                cell = new Sand(i, j);
            }
            row.push(cell);
        }
        cells.push(row);
    }
    return cells;
}

const currentMatrix = createLevel();

function updateMap(cells) {
    cells.forEach(row => {
        row.forEach(cell => {
            const div = document.createElement('div');
            div.classList.add('cell', 'w-20', 'h-20', 'bg-yellow-200');

            if(cell instanceof OasisMarker) {
                div.id = `OasisMarker/${cell.markerType}`;
            } else {
                div.id = cell.constructor.name;
            }

            if(cell instanceof Sand) {
                div.classList.add(cell.bgColor);
            } else if(cell instanceof Item && cell.hidden === true) {
                div.classList.add('bg-yellow-300');
            } else {
                div.style.backgroundImage = cell.bgImage;
            }


            div.style.backgroundSize = 'cover';
            matrix.appendChild(div);
        });
    });
}

updateMap(currentMatrix);

window.addEventListener('keydown', function(event) {
    const key = event.key;
    const validKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

    if (validKeys.includes(key) && numPlayers > 0) {
        const oldCell = currentMatrix[player.x][player.y];
        const oldLoc = player.loc;

        if (key === 'ArrowLeft' && player.y > 0) {
            player.moveLeft();
        } else if (key === 'ArrowRight' && player.y < 4) {
            player.moveRight();
        } else if (key === 'ArrowUp' && player.x > 0) {
            player.moveUp();
        } else if (key === 'ArrowDown' && player.x < 4) {
            player.moveDown();
        } else {
            return;
        }

        player.loc = currentMatrix[player.x][player.y];
        currentMatrix[player.x][player.y] = new Player(player.x, player.y, player.loc);
        currentMatrix[oldCell.x][oldCell.y] = oldLoc;

        matrix.innerHTML = '';
        updateMap(currentMatrix);
    }

    if (key === ' ') {
        if (player.loc instanceof OasisMarker) {
            if(player.loc.markerType === 'Oasis'){
                player.loc = new Oasis(player.x, player.y);
            } else {
                player.loc = new Drought(player.x, player.y);
            }
        }
        if (player.loc instanceof Item && player.loc.hidden === true) {
            player.loc.hidden = false;
        }
    }
});

