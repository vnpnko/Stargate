import {Cell} from "./Cell.js";

export class Sand extends Cell {
    constructor(x, y) {
        super(x, y);
        this.bgColor = "bg-yellow-300";
    }
}