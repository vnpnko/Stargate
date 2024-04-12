import {Cell} from "./Cell.js";

export class Player extends Cell {
    constructor(x, y, loc, name) {
        super(x, y);
        this.bgImage = 'url("Assets/Player.png")';
        this.name = name;
        this.loc = loc;
        this.actions = 3;
        this.water = 6;
    }
    moveLeft() {
        this.actions -= 1;
        this.y -= 1;
    }
    moveRight() {
        this.actions -= 1;
        this.y += 1;
    }
    moveUp() {
        this.actions -= 1;
        this.x -= 1;
    }
    moveDown() {
        this.actions -= 1;
        this.x += 1;
    }
}

