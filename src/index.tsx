import { access, promises } from 'fs';
import { join } from 'path';
import React from 'react';
import reactDOM from 'react-dom';
import { inspect } from 'util';
import API from './api/API';
import IProjectSchema from './schema/IProjectSchema';
import Project, { StoryDivisionTree } from './util/Project';
import App from './view/App';

const ROOT_ELEMENT = document.getElementById('root')!;

// ensure that the element has actually loaded
console.assert(ROOT_ELEMENT);

// this is a development directory only
// this is used for testing whether or not the files actually work
const __PROJ_NAME = join(__dirname, '..', 'protected');

(async () => {
  // creates the project directory
  // if the project directory does not exist

  // this works by attempting to access the directory
  // if the directory does not exists, it throws an error
  // and if there is an error, than that is truthy
  // and that means that because no directory exists
  // it can be made safely
  // and then it makes the directory
  access(__PROJ_NAME, async (pathDoesNotExist) => {
    if (pathDoesNotExist) {
      await promises.mkdir(__PROJ_NAME);
    }

    // const [project, setProject] = await API.newProjectFS(
    //   join(__PROJ_NAME, 'Project.aesop'),
    //   {
    //     eventArcs: [],
    //     id: -3,
    //     label: 'Project',
    //     mindMaps: [],
    //     storyDivisions: [
    //       {
    //         content: '',
    //         id: -1,
    //         label: 'Manuscript',
    //         parentId: -2,
    //         position: 0
    //       },
    //       {
    //         content: '',
    //         id: 0,
    //         label: 'Child 0',
    //         parentId: -1,
    //         position: 0
    //       },
    //       {
    //         content: '',
    //         id: 2,
    //         label: 'Child 2',
    //         parentId: 0,
    //         position: 0
    //       },
    //       {
    //         content: '',
    //         id: 1,
    //         label: 'Child 1',
    //         parentId: -1,
    //         position: 0
    //       },
    //       {
    //         content: '',
    //         id: 3,
    //         label: 'Child 3',
    //         parentId: 1,
    //         position: 0
    //       },
    //     ],
    //   }
    // );

    const [project, setProject] = await API.openProjectFS(
      join(__PROJ_NAME, 'Project.aesop')
    );

    Project.useProject([project, setProject]);

    const tree = Project.generateTreeOfStoryDivisions(
      Project.getRootStoryDivision()
    );

    console.log(inspect(tree, false, null, false));

    Project.moveStoryDivisionTo(
      Project.getStoryDivisionById(2)!,
      Project.getStoryDivisionById(0)!
    );

    const newTree = Project.generateTreeOfStoryDivisions(
      Project.getRootStoryDivision()
    );

    console.log(inspect(newTree, false, null, false));

    loadProjectIntoView(project, newTree);

    setTimeout(() => {
      console.log('Running update');

      Project.moveStoryDivisionTo(
        Project.getStoryDivisionById(2)!,
        Project.getStoryDivisionById(3)!
      );

      const newTree = Project.generateTreeOfStoryDivisions(
        Project.getRootStoryDivision()
      );

      console.log(inspect(newTree.childDivisions, false, null, false));
    }, 1000);
  });
})();
function loadProjectIntoView(
  project: IProjectSchema,
  rootStoryDivisionTree: StoryDivisionTree
) {
  reactDOM.render(
    <App
      projectSettings={project}
      rootStoryDivisionTree={rootStoryDivisionTree}
    />,
    ROOT_ELEMENT
  );
}
