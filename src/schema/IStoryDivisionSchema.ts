import ISchema from './IModelSchema';

interface IStoryDivisionSchema extends ISchema {
  id: number;
  parentId: number;
  label: string;
  content: string;
  // position in the ordered list of its parent
  position: number;
}

export default IStoryDivisionSchema;
