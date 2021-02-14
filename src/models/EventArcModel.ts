import IEventArcSchema from '../schema/IEventArcSchema';
import AbstractModel from './AbstractModel';

class EventArcModel extends AbstractModel<IEventArcSchema> {
  protected readonly EXT: string = 'evrc';
  protected readonly model: IEventArcSchema;

  public set eventImportanceMap(v) {
    this.model.eventImportanceMap = v;
    this.updateFile();
  }
  public get eventImportanceMap(): Record<number, number> {
    return this.model.eventImportanceMap;
  }

  constructor(eventArcObject: IEventArcSchema) {
    super();
    this.model = eventArcObject;
  }
}

export default EventArcModel;
