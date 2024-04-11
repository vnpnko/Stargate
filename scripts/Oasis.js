import {Cell} from "./Cell.js";

export class Oasis extends Cell {
    constructor(x, y) {
        super(x, y);
        this.bgImage = 'url("Assets/Oasis.png")';
    }
}