import { join } from "path";
import React from 'react';
import reactDOM from 'react-dom';
import App from './views/App';
export const __PROJ_NAME = join(__dirname, 'protected');
export const __PROJECT_ROOT_ID = -1;

function init() { 
    reactDOM.render(<App />, document.getElementById('root'));
}
function test() { }

export function main() {
    test();
    init();
}