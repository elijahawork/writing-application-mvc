import ISchema from './IModelSchema';

interface IStoryDivisionSchema extends ISchema {
  id: number;
  parentId: number;
  label: string;
  content: string;
  position: number;
}

export default IStoryDivisionSchema;
