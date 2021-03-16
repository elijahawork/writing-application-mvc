import { join } from 'path';
import API from '../src/api/API';
import { __PROJ_NAME } from '../src/index';

export async function generatePresetProject(): Promise<API.ProjectTupleModifier> {
  return API.newProjectFS(
    join(__PROJ_NAME, 'Project.aesop'),
    {
      eventArcs: [],
      id: -3,
      label: 'Project',
      mindMaps: [],
      storyDivisions: [
        {
          content: '',
          id: -1,
          label: 'Manuscript',
          parentId: -2,
          position: 0,
        },
        {
          content: '',
          id: 0,
          label: 'Child 0',
          parentId: -1,
          position: 0,
        },
        {
          content: '',
          id: 2,
          label: 'Child 2',
          parentId: 0,
          position: 0,
        },
        {
          content: '',
          id: 1,
          label: 'Child 1',
          parentId: -1,
          position: 0,
        },
        {
          content: '',
          id: 3,
          label: 'Child 3',
          parentId: 1,
          position: 0,
        },
      ],
    }
  );
}
