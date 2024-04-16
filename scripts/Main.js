import { Player } from './Player.js';
import { OasisMarker } from './OasisMarker.js';
import { Sand } from './Sand.js';
import { Hole } from './Hole.js';
import { Clue } from './Clue.js';
import { Oasis } from "./Oasis.js";
import { Drought } from "./Drought.js";
import { Item } from "./Item.js";
import { createLevel, updateMap } from "./Map.js";

const matrix = document.getElementById('matrix');

let numPlayers;
let players = [];
let gameStarted = false;
let foundItems = 0;
let currentMatrix;
let currentPlayer;
let gameTime = 0;
let timerId;

function startGameTimer() {
    timerId = setInterval(function() {
        gameTime++;
        let minutes = Math.floor(gameTime / 60);
        let seconds = gameTime % 60;
        document.getElementById('timer').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
}

function stopGameTimer() {
    clearInterval(timerId);
}

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
        startGameTimer();
        currentMatrix = createLevel(numPlayers, players);

        updateMap(currentMatrix, matrix);
        currentPlayer = numPlayers - 1;
    });
}


window.addEventListener('keydown', function (event) {
    if (foundItems === 3) {
        alert("You won! Players found all three parts");
        gameStarted = false;
        stopGameTimer()
    }
    for (let player of players) {
        if (player.water === 0 && player.actions === 1) {
            alert("Game Over! A player has run out of water");
            gameStarted = false;
            stopGameTimer()
        }
    }

    const key = event.key;
    const validKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

    if(gameStarted === true && players[currentPlayer].actions > 0){
        if (validKeys.includes(key)) {
            let oldCell = currentMatrix[players[currentPlayer].x][players[currentPlayer].y];
            let oldLoc = players[currentPlayer].loc;

            if (key === 'ArrowLeft' && players[currentPlayer].y > 0) {
                players[currentPlayer].moveLeft();
            } else if (key === 'ArrowRight' && players[currentPlayer].y < 4) {
                players[currentPlayer].moveRight();
            } else if (key === 'ArrowUp' && players[currentPlayer].x > 0) {
                players[currentPlayer].moveUp();
            } else if (key === 'ArrowDown' && players[currentPlayer].x < 4) {
                players[currentPlayer].moveDown();
            } else {
                return;
            }

            players[currentPlayer].loc = currentMatrix[players[currentPlayer].x][players[currentPlayer].y];
            currentMatrix[players[currentPlayer].x][players[currentPlayer].y] = new Player(players[currentPlayer].x, players[currentPlayer].y, players[currentPlayer].loc, players[currentPlayer].name);
            currentMatrix[oldCell.x][oldCell.y] = oldLoc;

            updateMap(currentMatrix, matrix);
        }

        if (key === ' ') {
            console.log(foundItems);
            if(players[currentPlayer].loc instanceof Item && players[currentPlayer].loc.hidden === true) {
                foundItems++;
            }

            if (players[currentPlayer].loc instanceof OasisMarker) {
                if (players[currentPlayer].loc.markerType === 'Oasis') {
                    players[currentPlayer].loc = new Oasis(players[currentPlayer].x, players[currentPlayer].y);
                } else {
                    players[currentPlayer].loc = new Drought(players[currentPlayer].x, players[currentPlayer].y);
                }
            } else if (players[currentPlayer].loc instanceof Oasis) {
                if(players[currentPlayer].water < 6){
                    players[currentPlayer].water++;
                }
            } else if ((players[currentPlayer].loc instanceof Item || players[currentPlayer].loc instanceof Clue) && players[currentPlayer].loc.hidden === true) {
                players[currentPlayer].loc.hidden = false;
            } else {
                players[currentPlayer].loc = new Hole(players[currentPlayer].x, players[currentPlayer].y);
            }
            players[currentPlayer].actions--;
        }

        players[currentPlayer].updateWater();
        document.getElementById(`actions ${currentPlayer + 1}`).getElementsByTagName('p')[0].textContent = players[currentPlayer].actions;
        document.getElementById(`water ${currentPlayer + 1}`).getElementsByTagName('p')[0].textContent = players[currentPlayer].water;

        if(players[currentPlayer].actions === 3){
            if(currentPlayer === 0) {
                currentPlayer = numPlayers - 1;
            } else {
                currentPlayer = (currentPlayer - 1) % numPlayers;
            }
        }
    }
});

