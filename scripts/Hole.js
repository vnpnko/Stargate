import {Cell} from "./Cell.js";

export class Hole extends Cell {
    constructor(x, y) {
        super(x, y);
        this.bgImage = 'url("Assets/Hole.png")';
    }
}