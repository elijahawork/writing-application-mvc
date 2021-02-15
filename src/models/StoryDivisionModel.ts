import SchemaField from '../decorators/SchemaField';
import IStoryDivisionSchema from '../schema/IStoryDivisionSchema';
import AbstractModel from './AbstractModel';

class StoryDivisonModel extends AbstractModel<IStoryDivisionSchema> {
  public static readonly FILE_EXTENSION_NAME = 'stdv';
  
  @SchemaField
  parentId: number;
  @SchemaField
  label: string;
  @SchemaField
  content: string;

  constructor(storyDivisionSchema: IStoryDivisionSchema) {
    super(StoryDivisonModel.FILE_EXTENSION_NAME, storyDivisionSchema);
    this.parentId = storyDivisionSchema.parentId;
    this.label = storyDivisionSchema.label;
    this.content = storyDivisionSchema.content;
  }

  public static parse(content: string): StoryDivisonModel {
    const schema = JSON.parse(content) as IStoryDivisionSchema;
    const model = new StoryDivisonModel(schema);
    return model;
  }
}

export default StoryDivisonModel;
