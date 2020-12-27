import { CustomElement } from "../CustomElement";

//for now we only have one TextArea object
export class TextArea {
    x: number;

    constructor(x: number) {
        this.x = x;
    }

    public getX() {
        return this.x;
    }
}

var text: TextArea = new TextArea(9);
console.log("x=" + text.getX());

