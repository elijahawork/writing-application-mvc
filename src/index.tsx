import { readdirSync, readFileSync } from 'fs';
import { join, parse } from 'path';
import React from 'react';
import ReactDOM from 'react-dom';
import Log from './log/Log';
import EventArcModel from './models/EventArcModel';
import MindMapModel from './models/MindMapModel';
import StoryDivisionModel from './models/StoryDivisionModel';
import App from './view/App';

export const __PROJ_NAME = join(__dirname, '..', 'protected');
export const __PROJECT_ROOT_ID = -1;
export const __LOG_PATH = join(__dirname, '..', 'logs');
export const log = Log.create();

export namespace ModelInfo {
  export const storageDivisionRegistry = new Map<number, StoryDivisionModel>();
  export const mindMapRegistry = new Map<number, MindMapModel>();
  export const eventArcRegistry = new Map<number, EventArcModel>();

  export function getAllStorageDivision(): void {
    const fileNames = readdirSync(__PROJ_NAME, 'utf8');

    for (const fileName of fileNames) {
      const parsedFileName = parse(fileName);
      const absoluteFilePath = join(__PROJ_NAME, fileName);

      switch (parsedFileName.ext.substring(1)) {
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

  function addStoryDivisionFromAbsolutePath(absoluteFilePath: string): void {
    const model = getStoryDivisionModelFromAbsolutePath(absoluteFilePath);
    storageDivisionRegistry.set(model.id, model);
  }
  function addEventArcFromAbsolutePath(absoluteFilePath: string): void {
    const model = getEventArcModelFromAbsolutePath(absoluteFilePath);
    eventArcRegistry.set(model.id, model);
  }
  function addMindMapFromAbsolutePath(absoluteFilePath: string): void {
    const model = getMindMapModelFromAbsolutePath(absoluteFilePath);
    mindMapRegistry.set(model.id, model);
  }
  function getStoryDivisionModelFromAbsolutePath(
    absoluteFilePath: string
  ): StoryDivisionModel {
    const schemaJSONString = getSchemaJSONStringFromPath(absoluteFilePath);
    const model = StoryDivisionModel.parse(schemaJSONString);
    return model;
  }
  function getEventArcModelFromAbsolutePath(
    absoluteFilePath: string
  ): EventArcModel {
    const schemaJSONString = getSchemaJSONStringFromPath(absoluteFilePath);
    const model = EventArcModel.parse(schemaJSONString);
    return model;
  }
  function getMindMapModelFromAbsolutePath(
    absoluteFilePath: string
  ): MindMapModel {
    const schemaJSONString = getSchemaJSONStringFromPath(absoluteFilePath);
    const model = MindMapModel.parse(schemaJSONString);
    return model;
  }
  function getSchemaJSONStringFromPath(absoluteFilePath: string) {
    return readFileSync(absoluteFilePath, 'utf8');
  }
}

function init() {
  // const manuscript = new StoryDivisionModel({
  //   content: '',
  //   id: -1,
  //   label: 'Manuscript',
  //   parentId: -2,
  // })
  ModelInfo.getAllStorageDivision();
  ReactDOM.render(<App />, document.getElementById('root'));
}
function test() {}

export function main() {
  test();
  init();
}
