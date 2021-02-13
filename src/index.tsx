import { join } from 'path';
import Log from './logs/Log';

export const __PROJ_NAME = join(__dirname, '..', 'protected');
export const __PROJECT_ROOT_ID = -1;
export const __LOG_PATH = join(__dirname, '..', 'logs');
export const log = Log.create();

function init() {}
function test() {}

export function main() {
  test();
  init();
}
