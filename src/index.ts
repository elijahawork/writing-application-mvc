import fs from 'fs';
import { join } from "path";

export const __PROJ_NAME = join(__dirname, 'protected');

export function main() {
    createProjectFolderIfNonexistant();
    test();
}

function createProjectFolderIfNonexistant() {
    if (!fs.existsSync(__PROJ_NAME))
        fs.mkdirSync(__PROJ_NAME);
}

// run all testing code in here.
function test() {

}