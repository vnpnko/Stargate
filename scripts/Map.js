import { Player } from './Player.js';
import { OasisMarker } from './OasisMarker.js';
import { Sand } from './Sand.js';
import { Clue } from './Clue.js';
import { Oasis } from "./Oasis.js";
import { Drought } from "./Drought.js";
import { Item } from "./Item.js";

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let objects = [];
for (let i = 0; i < 3; i++) {
    objects.push(`Item ${i+1}`);
    objects.push(`OasisMarker Oasis`);
}
objects.push(`OasisMarker Drought`);
shuffleArray(objects);

export function createLevel(numPlayers, players) {
    let cells = [];
    for (let i = 0; i < 5; i++) {
        let row = [];
        for (let j = 0; j < 5; j++) {
            let cell = new Sand(i, j);
            row.push(cell);
        }
        cells.push(row);
    }
    // for(let i = 0; i < numPlayers; i++) {
    //     if(i === 1) {
    //         players.push(new Player(2, 2, new Sand(2, 2), `player${i+1}`));
    //         cells[2][2] = new Player(2, 2, new Sand(2, 2), `player${i+1}`);
    //     } else {
    //         const player = players[i-1];
    //         players.push(new Player(2, 2, new Player(player.x, player.y, player.loc, player.name), `player${i+1}`));
    //         cells[2][2] = new Player(2, 2,new Player(player.x, player.y, player.loc, player.name), `player${i+1}`);
    //     }
    // }

    cells[2][2] = new Player(2, 2, new Sand(2, 2), 'player1');
    players.push(new Player(2, 2, new Sand(2, 2), 'player1'));
    while (objects.length !== 0) {
        const i = Math.floor(Math.random() * 5);
        const j = Math.floor(Math.random() * 5);

        if (cells[i][j] instanceof Sand) {
            const firstArg = objects[0].split(' ')[0];
            const secondArg = objects[0].split(' ')[1];
            if(firstArg === 'Item') {
                cells[i][j] = new Item(i, j, parseInt(secondArg));

                let rowClue = false;
                let colClue = false;
                for(let x = 0; x < 5; x++){
                    if(cells[x][j] instanceof Sand && colClue === false){
                        if(x > i) {
                            cells[x][j] = new Clue(x, j, parseInt(secondArg), 'UP')
                        } else {
                            cells[x][j] = new Clue(x, j, parseInt(secondArg), 'DOWN')
                        }
                        colClue = true;
                    }
                    if(cells[i][x] instanceof Sand && rowClue === false){
                        if(x > j) {
                            cells[i][x] = new Clue(i, x, parseInt(secondArg), 'LEFT')
                        } else {
                            cells[i][x] = new Clue(i, x, parseInt(secondArg), 'RIGHT')
                        }
                        rowClue = true;
                    }
                }
            } else {
                if(secondArg === 'Drought') {
                    cells[i][j] = new OasisMarker(i, j, 'Drought');
                } else {
                    cells[i][j] = new OasisMarker(i, j, 'Oasis');
                }
            }
            objects.shift();
        }
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
            } else if ((cell instanceof Item || cell instanceof Clue) && cell.hidden === true) {
                div.classList.add('bg-yellow-300');
            } else {
                div.style.backgroundImage = cell.bgImage;
            }

            div.style.backgroundSize = 'cover';
            matrix.appendChild(div);
        });
    });
}