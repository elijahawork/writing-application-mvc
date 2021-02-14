import SchemaField from '../decorators/SchemaField';
import IStoryDivisionSchema from '../schema/IStoryDivisionSchema';
import AbstractModel from './AbstractModel';

class StoryDivisonModel extends AbstractModel<IStoryDivisionSchema> {
  @SchemaField
  parentId: number;
  @SchemaField
  label: string;
  @SchemaField
  content: string;

  constructor(storyDivisionObject: IStoryDivisionSchema) {
    super('stdv', storyDivisionObject);
    this.parentId = storyDivisionObject.parentId;
    this.label = storyDivisionObject.label;
    this.content = storyDivisionObject.content;
  }
}

export default StoryDivisonModel;
