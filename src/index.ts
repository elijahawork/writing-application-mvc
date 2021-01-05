import fs from 'fs';
import { join } from "path";
import { TextArea } from './view/text-area/TextArea';
import { Caret } from './view/text-area/Caret';
import { MenuController } from './controller/MenuController';

export const __PROJ_NAME = join(__dirname, 'protected');

var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
export function init() {
    //initialize the elements
    console.log("TESTING. PRINTED FROM WITHIN INDEX.TS");
    let textArea:TextArea = new TextArea(8);

    textArea.updateElements();
    /*
    const eleList = document.querySelectorAll(".caret");
    console.log("setting attribute style to opacity of 0. eleList.length="+eleList.length+" eleList="+eleList);
    for (let i=0; i<eleList.length; i++) {
        eleList[i].setAttribute('style', 'opacity: 0.1');
    }
    */
   
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
    // init();
    test();
}

function createProjectFolderIfNonexistant() {
    if (!fs.existsSync(__PROJ_NAME))
        fs.mkdirSync(__PROJ_NAME);
}

// run all testing code in here.
function test() {
    let id = -1;
    const manuscript = MenuController.from(id++, 0, 'Manuscript');
    const act1 = MenuController.from(id++, 0, 'Act I');
    const chapter1 = MenuController.from(id++, 0, 'Chapter I');
    const chapter2 = MenuController.from(id++, 0, 'Chapter II');
    manuscript.add(act1);
    act1.add(chapter1);
    manuscript.add(chapter2);

    console.log({manuscript, act1, chapter1});
    
    

    document.querySelector('.column')?.appendChild(manuscript.menuView.htmlElement);

}