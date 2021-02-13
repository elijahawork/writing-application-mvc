import { writeFileSync } from 'fs';
import { join } from 'path';
import { __PROJ_NAME } from '../..';
import IEventArc from '../interface/IEventArc';

class EventArcModel {
  private static EXT = 'eam';
  private readonly model: IEventArc;

  private get filePath() {
    return join(__PROJ_NAME, `${this.id}.${EventArcModel.EXT}`);
  }

  public set id(v) {
    this.model.id = v;
    this.updateFile();
  }
  public get id() {
    return this.model.id;
  }
  public set eventImportanceMap(v) {
    this.model.eventImportanceMap = v;
    this.updateFile();
  }
  public get eventImportanceMap(): Record<number, number> {
    return this.model.eventImportanceMap;
  }

  constructor(eventArcObject: IEventArc) {
    this.model = eventArcObject;
  }

  private updateFile() {
    writeFileSync(this.filePath, JSON.stringify(this.model));
  }
}

export default EventArcModel;
