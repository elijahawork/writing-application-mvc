import IStoryDivisionSchema from '../schema/IStoryDivisionSchema';
import AbstractModel from './AbstractModel';

class StoryDivisonModel extends AbstractModel<IStoryDivisionSchema> {
  protected EXT: string = 'stdv';
  protected model: IStoryDivisionSchema;

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
  public get parentId() {
    return this.model.parentId;
  }
  public get label() {
    return this.model.label;
  }
  public get content() {
    return this.model.content;
  }

  constructor(storyDivisionObject: IStoryDivisionSchema) {
    super();
    this.model = storyDivisionObject;
  }
}

export default StoryDivisonModel;
