import { CustomElement } from "../CustomElement";

//for now we only have one TextArea object
export class TextArea extends CustomElement<'div'> {
    x: number;

    constructor(x: number) {
        super('div')
        this.x = x;
        const el = document.createElement('span');
        this.htmlElement.appendChild(el);
    }

    public getX() {
        return this.x;
    }
}

console.log("TESTING. PRINTED FROM INSIDE TEXTAREA.TS");
var text: TextArea = new TextArea(9);
console.log("x=" + text.getX());
