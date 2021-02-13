import { writeFileSync } from 'fs';
import { join } from 'path';
import { __PROJ_NAME } from '../..';
import IStoryDivision from '../interface/IStoryDivision';

class StoryDivisonModel {
  private static EXT = 'sdmeta';
  private readonly model: IStoryDivision;

  private get filePath() {
    return join(__PROJ_NAME, `${this.id}.${StoryDivisonModel.EXT}`);
  }

  public set id(v) {
    this.model.id = v;
    this.updateFile();
  }
  public set parentId(v) {
    this.model.parentId = v;
    this.updateFile();
  }
  public set label(v) {
    this.model.label = v;
    this.updateFile();
  }
  public set content(v) {
    this.model.content = v;
    this.updateFile();
  }
  public get id() {
    return this.model.id;
  }
  public get parentId() {
    return this.model.parentId;
  }
  public get label() {
    return this.model.label;
  }
  public get content() {
    return this.model.content;
  }

  constructor(storyDivisionObject: IStoryDivision) {
    this.model = storyDivisionObject;
  }

  private updateFile() {
    writeFileSync(this.filePath, JSON.stringify(this.model));
  }
}

export default StoryDivisonModel;
