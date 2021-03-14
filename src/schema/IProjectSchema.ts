import IEventArcSchema from './IEventArcSchema';
import IMindMapSchema from './IMindMapSchema';
import IModelSchema from './IModelSchema';
import IStoryDivisionSchema from './IStoryDivisionSchema';

const projectKeys = ['label', 'eventArcs', 'mindMaps', 'storyDivisions'];

interface IProjectSchema extends IModelSchema {
  // the name of the project that shows up to the user
  label: string;
  eventArcs: IEventArcSchema[];
  mindMaps: IMindMapSchema[];
  // these are all the files that are nested
  storyDivisions: IStoryDivisionSchema[];
}

export function isIProjectSchema(schema: any) {
  return Object.keys(schema).every((key) => key in projectKeys);
}

export default IProjectSchema;
