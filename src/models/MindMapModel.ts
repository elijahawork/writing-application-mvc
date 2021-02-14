import IMindMapSchema from '../schema/IMindMapSchema';
import AbstractModel from './AbstractModel';

class MindMapModel extends AbstractModel<IMindMapSchema> {
  protected readonly EXT: string = 'mmap';
  protected readonly model: IMindMapSchema;

  public set idOfStoryDivisionsRelatedTo(v) {
    this.model.idOfStoryDivisionsRelatedTo = v;
    this.updateFile();
  }
  public get idOfStoryDivisionsRelatedTo(): number[] {
    return this.model.idOfStoryDivisionsRelatedTo;
  }

  constructor(mindMapObject: IMindMapSchema) {
    super();
    this.model = mindMapObject;
  }
}

export default MindMapModel;
