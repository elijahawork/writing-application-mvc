import SchemaField from '../decorators/SchemaField';
import IEventArcSchema from '../schema/IEventArcSchema';
import AbstractModel from './AbstractModel';

class EventArcModel extends AbstractModel<IEventArcSchema> {
  public static readonly FILE_EXTENSION_NAME = 'evrc';
  
  @SchemaField
  eventImportanceMap!: Record<number, number>;

  constructor(eventArcSchema: IEventArcSchema) {
    super(EventArcModel.FILE_EXTENSION_NAME, eventArcSchema);
    this.eventImportanceMap = this.eventImportanceMap;
  }
  
  public static parse(content: string): EventArcModel {
    const schema = JSON.parse(content) as IEventArcSchema;
    const model = new EventArcModel(schema);
    return model;
  }
}

export default EventArcModel;
