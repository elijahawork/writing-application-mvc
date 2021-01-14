import fs from 'fs';
import { join } from "path";

export const __PROJ_NAME = join(__dirname, 'protected');
export const __PROJECT_ROOT_ID = -1;

function init() { }
function test() { }

export function main() {
    test();
    init();
}