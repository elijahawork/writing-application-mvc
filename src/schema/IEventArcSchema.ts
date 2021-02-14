import ISchema from './IModelSchema';

interface IEventArcSchema extends ISchema {
  eventImportanceMap: Record<number, number>;
}

export default IEventArcSchema;
