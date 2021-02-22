import { readdirSync, readFileSync } from 'fs';
import { join, parse } from 'path';
import React from 'react';
import ReactDOM from 'react-dom';
import EventArcModel from './models/EventArcModel';
import MindMapModel from './models/MindMapModel';
import StoryDivisionModel from './models/StoryDivisionModel';
import App from './view/App';

export const __PROJ_NAME = join(__dirname, '..', 'protected');
export const __PROJECT_ROOT_ID = -1;
export const __LOG_PATH = join(__dirname, '..', 'logs');
// export const log = Log.create();

export namespace ModelInfo {
  export const storageDivisionIDMap = new Map<number, StoryDivisionModel>();
  export const mindMapIDMap = new Map<number, MindMapModel>();
  export const eventArcIDMap = new Map<number, EventArcModel>();

  export function getAllStorageDivision() {
    const fileNames = readdirSync(__PROJ_NAME, 'utf8');

    for (const fileName of fileNames) {
      const parsedFileName = parse(fileName);
      const absoluteFilePath = join(__PROJ_NAME, fileName);

      switch (parsedFileName.ext) {
        case StoryDivisionModel.FILE_EXTENSION_NAME:
          {
            addStoryDivisionFromAbsolutePath(absoluteFilePath);
          }
          break;
        case MindMapModel.FILE_EXTENSION_NAME:
          {
            addMindMapFromAbsolutePath(absoluteFilePath);
          }
          break;
        case EventArcModel.FILE_EXTENSION_NAME:
          {
            addEventArcFromAbsolutePath(absoluteFilePath);
          }
          break;
        default: {
          throw new Error(
            `Unknown file extension ${parsedFileName.ext} on file ${parsedFileName.name}`
          );
        }
      }
    }
  }

  function addStoryDivisionFromAbsolutePath(absoluteFilePath: string) {
    const model = getStoryDivisionModelFromAbsolutePath(absoluteFilePath);
    storageDivisionIDMap.set(model.id, model);
  }
  function addEventArcFromAbsolutePath(absoluteFilePath: string) {
    const model = getEventArcModelFromAbsolutePath(absoluteFilePath);
    storageDivisionIDMap.set(model.id, model);
  }
  function addMindMapFromAbsolutePath(absoluteFilePath: string) {
    const model = getMindMapModelFromAbsolutePath(absoluteFilePath);
    storageDivisionIDMap.set(model.id, model);
  }
  function getStoryDivisionModelFromAbsolutePath(absoluteFilePath: string) {
    const schemaJSONString = getSchemaJSONStringFromPath(absoluteFilePath);
    const model = StoryDivisionModel.parse(schemaJSONString);
    return model;
  }
  function getEventArcModelFromAbsolutePath(absoluteFilePath: string) {
    const schemaJSONString = getSchemaJSONStringFromPath(absoluteFilePath);
    const model = StoryDivisionModel.parse(schemaJSONString);
    return model;
  }
  function getMindMapModelFromAbsolutePath(absoluteFilePath: string) {
    const schemaJSONString = getSchemaJSONStringFromPath(absoluteFilePath);
    const model = StoryDivisionModel.parse(schemaJSONString);
    return model;
  }
  function getSchemaJSONStringFromPath(absoluteFilePath: string) {
    return readFileSync(absoluteFilePath, 'utf8');
  }
}

function init() {
  ReactDOM.render(<App />, document.getElementById('root'));
}
function test() {}

export function main() {
  test();
  init();
}
