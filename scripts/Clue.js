import {Cell} from "./Cell.js";

export class Clue extends Cell {
    constructor(x, y, item, direction) {
        super(x, y);
        this.item = item;
        this.direction = direction;
        this.bgImage = `url("Assets/Item ${this.item} - clue_${this.direction}.png")`;
        this.hidden = true;
    }
}