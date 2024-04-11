import {Cell} from "./Cell.js";

export class Player extends Cell {
    constructor(x, y, loc) {
        super(x, y);
        this.bgImage = 'url("Assets/Player.png")';
        this.loc = loc;
        this.acrions = 3;
        this.water = 6;
    }
    moveLeft() {
        this.acrions -= 1;
        this.y -= 1;
    }
    moveRight() {
        this.acrions -= 1;
        this.y += 1;
    }
    moveUp() {
        this.acrions -= 1;
        this.x -= 1;
    }
    moveDown() {
        this.acrions -= 1;
        this.x += 1;
    }
}

