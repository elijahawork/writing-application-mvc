import fs from 'fs';
import { join } from "path";
import { TextArea } from './view/text-area/TextArea';
import { Caret } from './view/text-area/Caret';

export const __PROJ_NAME = join(__dirname, 'protected');

var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
export function init() {
    //initialize the elements
    console.log("TESTING. PRINTED FROM WITHIN INDEX.TS");
    let textArea:TextArea = new TextArea(8);
    textArea.updateElements();
    //let caretDiv: Caret = new Caret();
    
    //const curX = test.getX();
    //console.log("test.x= " + curX);
    //var element = document.createElement("input"); 
    //document.body.appendChild(element);

    const textEditor = document.querySelector("#texteditor");
    if (textEditor != null) {
        textEditor.appendChild(textArea.htmlElement);
    }
    //document.body.appendChild(document.createElement("span"));
    
    //requestAnimationFrame(init);
}
export function main() {
    createProjectFolderIfNonexistant();
    init();
}

function createProjectFolderIfNonexistant() {
    if (!fs.existsSync(__PROJ_NAME))
        fs.mkdirSync(__PROJ_NAME);
}

// run all testing code in here.
function test() {

}