import ISchema from './IModelSchema';

interface IMindMapSchema extends ISchema {
  idOfStoryDivisionsRelatedTo: number[];
}

export default IMindMapSchema;
