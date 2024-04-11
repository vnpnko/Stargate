import {Cell} from "./Cell.js";

export class Item extends Cell {
    constructor(x, y, type) {
        super(x, y);
        this.type = type;
        this.bgImage = `url("Assets/Item ${this.type}.png")`;
        this.hidden = true;
    }
}