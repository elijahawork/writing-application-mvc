import { writeFileSync } from 'fs';
import { join } from 'path';
import { __PROJ_NAME } from '..';
import IMindMapSchema from '../schema/IMindMapSchema';

class MindMapModel {
  private static EXT = 'mm';
  private readonly model: IMindMapSchema;

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

  constructor(mindMapObject: IMindMapSchema) {
    this.model = mindMapObject;
  }

  private updateFile() {
    writeFileSync(this.filePath, JSON.stringify(this.model));
  }
}

export default MindMapModel;
