import { CustomElement } from "../CustomElement";

const WAIT_TIME = 1000;//1 second
//for now we only have one Caret object
export class Caret extends CustomElement<'span'> {

    constructor() {
        super('span', 'caret');
        this.htmlElement.innerHTML = '|';

    }

}