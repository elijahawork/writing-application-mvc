import IModel from './IModel';

interface IStoryDivision extends IModel {
  id: number;
  parentId: number;
  label: string;
  content: string;
}

export default IStoryDivision;
