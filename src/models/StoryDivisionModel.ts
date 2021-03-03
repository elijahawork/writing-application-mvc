import { ModelInfo } from '..';
import SchemaField from '../decorators/SchemaField';
import IStoryDivisionSchema from '../schema/IStoryDivisionSchema';
import AbstractModel from './AbstractModel';

class StoryDivisionModel extends AbstractModel<IStoryDivisionSchema> {
  public static readonly FILE_EXTENSION_NAME = 'stdv';

  @SchemaField
  parentId: number;
  @SchemaField
  label: string;
  @SchemaField
  content: string;

  public get children() {
    return [...ModelInfo.storageDivisionRegistry.values()].filter(e => e.parentId == this.id);
  }

  constructor(storyDivisionSchema: IStoryDivisionSchema) {
    super(StoryDivisionModel.FILE_EXTENSION_NAME, storyDivisionSchema);
    this.parentId = storyDivisionSchema.parentId;
    this.label = storyDivisionSchema.label;
    this.content = storyDivisionSchema.content;
  }

  public static parse(content: string): StoryDivisionModel {
    const schema = JSON.parse(content) as IStoryDivisionSchema;
    const model = new StoryDivisionModel(schema);
    return model;
  }
}

export default StoryDivisionModel;
