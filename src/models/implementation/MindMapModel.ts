import { writeFileSync } from 'fs';
import { join } from 'path';
import { __PROJ_NAME } from '../..';
import IMindMap from '../interface/IMindMap';

class MindMapModel {
  private static EXT = 'mm';
  private readonly model: IMindMap;

  private get filePath() {
    return join(__PROJ_NAME, `${this.id}.${MindMapModel.EXT}`);
  }

  public set id(v) {
    this.model.id = v;
    this.updateFile();
  }
  public get id() {
    return this.model.id;
  }
  public set idOfStoryDivisionsRelatedTo(v) {
    this.model.idOfStoryDivisionsRelatedTo = v;
    this.updateFile();
  }
  public get idOfStoryDivisionsRelatedTo(): number[] {
    return this.model.idOfStoryDivisionsRelatedTo;
  }

  constructor(mindMapObject: IMindMap) {
    this.model = mindMapObject;
  }

  private updateFile() {
    writeFileSync(this.filePath, JSON.stringify(this.model));
  }
}

export default MindMapModel;
