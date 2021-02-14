import SchemaField from '../decorators/SchemaField';
import IMindMapSchema from '../schema/IMindMapSchema';
import AbstractModel from './AbstractModel';

class MindMapModel extends AbstractModel<IMindMapSchema> {
  // protected readonly EXT: string = 'mmap';

  @SchemaField
  idOfStoryDivisionsRelatedTo!: number[];

  constructor(mindMapObject: IMindMapSchema) {
    super('mmap', mindMapObject);
    this.idOfStoryDivisionsRelatedTo =
      mindMapObject.idOfStoryDivisionsRelatedTo;
  }
}

export default MindMapModel;
