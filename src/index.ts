import fs from 'fs';
import { join } from "path";
import { TextArea } from './view/text-area/TextArea';
//import "src/view/text-area/TextArea";
//import TextArea from './view/text-area/TextArea';

export const __PROJ_NAME = join(__dirname, 'protected');

export function main() {
    createProjectFolderIfNonexistant();
    console.log("TESTING. PRINTED FROM WITHIN INDEX.TS");
    let test: TextArea = new TextArea(8);
    //const curX = test.getX();
    //console.log("test.x= " + curX);
}

function createProjectFolderIfNonexistant() {
    if (!fs.existsSync(__PROJ_NAME))
        fs.mkdirSync(__PROJ_NAME);
}
