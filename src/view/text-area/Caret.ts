import { CustomElement } from "../CustomElement";

const WAIT_TIME = 1000;//1 second
//for now we only have one Caret object
export class Caret extends CustomElement<'span'> {

    constructor() {
        super('span', 'caret');
        this.htmlElement.innerHTML = '|';

    }

    public blink() {
        const ele = document.querySelector("span.caret");
        var cursor:boolean = true;
        setInterval(function() {
            if (cursor) {
                ele?.setAttribute('style', 'opacity: 0');
                cursor = false;
            } else {
                ele?.setAttribute('style', 'opacity: 1');
                cursor = true;
            }
        }, WAIT_TIME);

    }
}