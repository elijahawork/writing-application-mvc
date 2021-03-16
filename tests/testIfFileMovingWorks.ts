import { inspect } from 'util';
import API from '../src/api/API';
import Project from '../src/util/Project';

export function testIfFileMovingWorks(
  projectModifier: API.ProjectTupleModifier
) {
  Project.useProject(projectModifier);

  const tree = Project.generateTreeOfStoryDivisions(
    Project.getRootStoryDivision()
  );

  console.log(inspect(tree, false, null, false));

  Project.moveStoryDivisionTo(
    Project.getStoryDivisionById(2)!,
    Project.getStoryDivisionById(0)!
  );

  // this purely tests if the TS is changing the VM's data, not the actual serialized information

  const newTree = Project.generateTreeOfStoryDivisions(
    Project.getRootStoryDivision()
  );

  console.log(inspect(newTree, false, null, false));
}
