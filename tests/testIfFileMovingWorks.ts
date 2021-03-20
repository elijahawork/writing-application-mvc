import { inspect } from 'util';
import API from '../src/api/API';
import Project from '../src/util/Project';

export function testIfFileMovingWorks(
  projectModifier: API.ProjectTupleModifier
) {
  Project.useProject(projectModifier);

  const tree = Project.StoryDivision.Util.deriveTreeOfStoryDivisions(
    Project.StoryDivision.Registry.getById(
      Project.StoryDivision.Util.getRootID()
    )
  );

  console.log(inspect(tree, false, null, false));

  Project.StoryDivision.API.move(
    Project.StoryDivision.Registry.getById(2),
    Project.StoryDivision.Registry.getById(0)
  );

  // this purely tests if the TS is changing the VM's data, not the actual serialized information

  const newTree = Project.StoryDivision.Util.deriveTreeOfStoryDivisions(
    Project.StoryDivision.Registry.getById(
      Project.StoryDivision.Util.getRootID()
    )
  );

  console.log(inspect(newTree, false, null, false));
}
