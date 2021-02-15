import SchemaField from '../decorators/SchemaField';
import IMindMapSchema from '../schema/IMindMapSchema';
import AbstractModel from './AbstractModel';

class MindMapModel extends AbstractModel<IMindMapSchema> {
  public static readonly FILE_EXTENSION_NAME = 'mmap';

  @SchemaField
  idOfStoryDivisionsRelatedTo!: number[];

  constructor(mindMapSchema: IMindMapSchema) {
    super(MindMapModel.FILE_EXTENSION_NAME, mindMapSchema);
    this.idOfStoryDivisionsRelatedTo =
      mindMapSchema.idOfStoryDivisionsRelatedTo;
  }

  public static parse(content: string): MindMapModel {
    const schema = JSON.parse(content) as IMindMapSchema;
    const model = new MindMapModel(schema);
    return model;
  }
}

export default MindMapModel;
