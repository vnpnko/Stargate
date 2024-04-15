import { Player } from './Player.js';
import { OasisMarker } from './OasisMarker.js';
import { Sand } from './Sand.js';
import { Oasis } from "./Oasis.js";
import { Drought } from "./Drought.js";
import { Item } from "./Item.js";

const MAP_SIZE = 5;
const OBJECT_LOCATIONS = 7;

export function getRandomSet(length) {
    let set = new Set();
    while (set.size < length) {
        const i = Math.floor(Math.random() * 5);
        const j = Math.floor(Math.random() * 5);

        if (set.has(`${i},${j}`) || (i === 2 && j === 2)) {
            continue;
        }
        set.add(`${i},${j}`);
    }
    return set;
}

export function createLevel(players) {
    let hasDrought = false;
    let cells = [];
    let locations = getRandomSet(OBJECT_LOCATIONS);

    for (let i = 0; i < MAP_SIZE; i++) {
        let row = [];
        for (let j = 0; j < MAP_SIZE; j++) {
            let cell;
            if (i === Math.floor(MAP_SIZE / 2) && j === Math.floor(MAP_SIZE / 2)) {
                const currName = document.getElementById(`player_${1}-name`).textContent;
                cell = new Player(i, j, new Sand(i, j), currName);
                players.push(new Player(i, j, new Sand(i, j), currName));
                // players.push(cell);
            } else if (locations.has(`${i},${j}`)) {
                if (locations.size > 3) {
                    if (hasDrought === false) {
                        cell = new OasisMarker(i, j, 'Drought');
                        hasDrought = true;
                    } else {
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

export function updateMap(cells, matrix) {
    matrix.innerHTML = '';

    cells.forEach(row => {
        row.forEach(cell => {
            const div = document.createElement('div');
            div.classList.add('cell', 'w-20', 'h-20', 'bg-yellow-200');

            if (cell instanceof OasisMarker) {
                div.id = `OasisMarker/${cell.markerType}`;
            } else {
                div.id = cell.constructor.name;
            }

            if (cell instanceof Sand) {
                div.classList.add(cell.bgColor);
            } else if (cell instanceof Item && cell.hidden === true) {
                div.classList.add('bg-yellow-300');
            } else {
                div.style.backgroundImage = cell.bgImage;
            }

            div.style.backgroundSize = 'cover';
            matrix.appendChild(div);
        });
    });
}