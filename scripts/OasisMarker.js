import {Cell} from "./Cell.js";

export class OasisMarker extends Cell {
    constructor(x, y, markerType) {
        super(x, y);
        this.markerType = markerType;
        this.bgImage = 'url("Assets/Oasis marker.png")';
    }
}