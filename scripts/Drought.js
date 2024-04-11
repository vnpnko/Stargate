import {Cell} from "./Cell.js";

export class Drought extends Cell {
    constructor(x, y) {
        super(x, y);
        this.bgImage = 'url("Assets/Drought.png")';
    }
}