import IModel from './IModel';

interface IEventArc extends IModel {
  eventImportanceMap: Record<number, number>;
}

export default IEventArc;
