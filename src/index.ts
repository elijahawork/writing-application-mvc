import fs from 'fs';
import { join } from "path";

export const __PROJ_NAME = join(__dirname, 'protected');

<<<<<<< HEAD
export function main() {
    createProjectFolderIfNonexistant();
    test();
=======
export function init() {
    //initialize the elements
    console.log("TESTING. PRINTED FROM WITHIN INDEX.TS");
    let test: TextArea = new TextArea(8);
    //const curX = test.getX();
    //console.log("test.x= " + curX);
    //var element = document.createElement("input"); 
    //document.body.appendChild(element);

    const textEditor = document.querySelector("#texteditor");
    if (textEditor != null)
    textEditor.appendChild(test.htmlElement);

    //document.body.appendChild(document.createElement("span"));
    
}
export function main() {
    createProjectFolderIfNonexistant();
    init();
>>>>>>> ea59d52... Added TextArea debug paragraph feature
}

function createProjectFolderIfNonexistant() {
    if (!fs.existsSync(__PROJ_NAME))
        fs.mkdirSync(__PROJ_NAME);
}

// run all testing code in here.
function test() {

}