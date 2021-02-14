import SchemaField from '../decorators/SchemaField';
import IEventArcSchema from '../schema/IEventArcSchema';
import AbstractModel from './AbstractModel';

class EventArcModel extends AbstractModel<IEventArcSchema> {
  @SchemaField
  eventImportanceMap!: Record<number, number>;

  constructor(eventArcObject: IEventArcSchema) {
    super('evrc', eventArcObject);
    this.eventImportanceMap = this.eventImportanceMap;
  }
}

export default EventArcModel;
