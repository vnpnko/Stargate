import { Player } from './Player.js';
import { OasisMarker } from './OasisMarker.js';
import { Sand } from './Sand.js';
import { Oasis } from "./Oasis.js";
import { Drought } from "./Drought.js";
import { Item } from "./Item.js";
import { createLevel, updateMap } from "./Map.js";

const matrix = document.getElementById('matrix');

let numPlayers;
let players = [];
let gameStarted = false;
let currentMatrix = createLevel(players);

updateMap(currentMatrix, matrix);

window.onload = function() {
    const setNumPlayersForm = document.getElementById('setNumPlayers');
    const setNamePlayersForm = document.getElementById('setNamePlayers');

    setNumPlayersForm.addEventListener('submit', function(event) {
        event.preventDefault();
        numPlayers = document.getElementById('numPlayers').value;
        setNumPlayersForm.style.display = 'none';

        for (let i = 1; i <= numPlayers; i++) {
            const label = document.createElement('label');
            label.htmlFor = `player_${i}-name`;
            label.textContent = `Player ${i} name: `;
            label.classList.add('text-2xl', 'm-auto');

            const input = document.createElement('input');
            input.type = 'text';
            input.id = `player_${i}-name-input`;
            input.classList.add('m-auto', 'my-2', 'px-4', 'py-2', 'text-center', 'text-2xl', 'bg-gray-300', 'rounded');

            setNamePlayersForm.appendChild(label);
            setNamePlayersForm.appendChild(input);
            setNamePlayersForm.appendChild(document.createElement('br'));
        }

        setNamePlayersForm.style.display = 'block';
    });

    setNamePlayersForm.addEventListener('submit', function(event) {
        event.preventDefault();
        for (let i = 1; i <= numPlayers; i++) {
            if (document.getElementById(`player_${i}-name-input`).value === '') {
                document.getElementById(`player_${i}-name`).textContent = `Player ${i}`;
            }else {
                document.getElementById(`player_${i}-name`).textContent = document.getElementById(`player_${i}-name-input`).value;
            }

            document.getElementById(`player_${i}`).style.display = 'block';
        }

        setNamePlayersForm.style.display = 'none';
        document.getElementById('startModal').style.display = 'none';

        gameStarted = true;
    });
}

window.addEventListener('keydown', function (event) {
    const key = event.key;
    const validKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

    if (validKeys.includes(key) && gameStarted === true) {

        let oldCell = currentMatrix[players[0].x][players[0].y];
        let oldLoc = players[0].loc;

        if (key === 'ArrowLeft' && players[0].y > 0) {
            players[0].moveLeft();
        } else if (key === 'ArrowRight' && players[0].y < 4) {
            players[0].moveRight();
        } else if (key === 'ArrowUp' && players[0].x > 0) {
            players[0].moveUp();
        } else if (key === 'ArrowDown' && players[0].x < 4) {
            players[0].moveDown();
        } else {
            return;
        }

        players[0].loc = currentMatrix[players[0].x][players[0].y];
        currentMatrix[players[0].x][players[0].y] = new Player(players[0].x, players[0].y, players[0].loc, players[0].name);
        currentMatrix[oldCell.x][oldCell.y] = oldLoc;

        updateMap(currentMatrix, matrix);
    }

    if (key === ' ') {
        if (players[0].loc instanceof OasisMarker) {
            if (players[0].loc.markerType === 'Oasis') {
                players[0].loc = new Oasis(players[0].x, players[0].y);
            } else {
                players[0].loc = new Drought(players[0].x, players[0].y);
            }
        }
        if (players[0].loc instanceof Item && players[0].loc.hidden === true) {
            players[0].loc.hidden = false;
        }
    }
});

