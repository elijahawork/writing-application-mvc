import fs from 'fs';
import { join } from "path";
import { TextArea } from './view/text-area/TextArea';
import { Caret } from './view/text-area/Caret';
import { MenuController } from './controller/MenuController';

export const __PROJ_NAME = join(__dirname, 'protected');

var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
export function init() {
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