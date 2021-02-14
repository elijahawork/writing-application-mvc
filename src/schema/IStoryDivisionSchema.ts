import ISchema from './IModelSchema';

interface IStoryDivisionSchema extends ISchema {
  id: number;
  parentId: number;
  label: string;
  content: string;
}

export default IStoryDivisionSchema;
