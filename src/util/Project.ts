import API from '../api/API';
import IProjectSchema from '../schema/IProjectSchema';
import IStoryDivisionSchema from '../schema/IStoryDivisionSchema';
import { Nullable } from '../types/CustomUtilTypes';

export type StoryDivisionTree = {
  storyDivision: Readonly<IStoryDivisionSchema>;
  childDivisions: StoryDivisionTree[];
};

let currentProject: Nullable<IProjectSchema>;
let currentSetProject: Nullable<API.ProjectTupleModifier[1]>;

// this is a map of all the ids to their corresponding schema
let storyDivisionRegistry: Record<number, IStoryDivisionSchema> = {};
namespace Project {
  export function generateUntitledStoryDivision(
    // set the default parent to the root
    parentId = getRootStoryDivision().id
  ): IStoryDivisionSchema {
    const id = generateUniqueStoryDivisionID();

    const newStoryDivision = {
      id,
      content: '',
      // it is of an
      label: 'Untitled',
      parentId: parentId,
      // this will put this element in the last position in the root
      // story division
      position: getImmediateChildren(getRootStoryDivision()).length,
    };

    return newStoryDivision;
  }

  export function addStoryDivision(
    storyDivision: IStoryDivisionSchema
  ): Readonly<IProjectSchema> {
    console.assert(usingProject());
    currentSetProject!({
      storyDivisions: [...currentProject!.storyDivisions, storyDivision],
    });

    registerStoryDivision(storyDivision);

    return currentProject!;
  }
  export function generateTreeOfStoryDivisions(
    storyDivision: IStoryDivisionSchema
  ): Readonly<StoryDivisionTree> {
    const children = getImmediateChildren(storyDivision);

    // this is a base case
    // for when there are no children
    if (children.length === 0) {
      return {
        storyDivision,
        childDivisions: [],
      };
      // when there are children
      // we will need to approach this recursively
    } else {
      // this is a recursive tree structure
      const mappedChildren = children.map((child) => {
        return generateTreeOfStoryDivisions(child);
      });

      return {
        storyDivision,
        childDivisions: mappedChildren,
      };
    }
  }
  export function getStoryDivisionById(
    id: number
  ): Readonly<IStoryDivisionSchema> {
    console.assert(storyDivisionRegistry[id]);
    return storyDivisionRegistry[id];
  }

  export function moveStoryDivisionTo(
    storyDivisionChild: IStoryDivisionSchema,
    storyDivisionParent: IStoryDivisionSchema
  ): Readonly<IProjectSchema> {
    console.assert(usingProject());

    storyDivisionChild.parentId = storyDivisionParent.id;

    currentSetProject!({
      storyDivisions: currentProject!.storyDivisions,
    });

    return currentProject!;
  }

  /**
   *
   * @returns the root story division registry
   * This function *should* return whichever story division contains every child but is not contained itself
   * but that would take a moment to program and i'm lazy so rn i'm just going to make it so a root
   * has to have the id of -1.
   * This should be patched in a later update
   */
  export function getRootStoryDivision(): Readonly<IStoryDivisionSchema> {
    console.assert(storyDivisionRegistry[-1], 'There is no root for project');
    return storyDivisionRegistry[-1];
  }
  /**
   *
   * @param projectTuple is the project that the functions should all be using
   * @description Sets the current project for all the functions to use
   */
  export function useProject(projectTuple: API.ProjectTupleModifier) {
    const [project, setProject] = projectTuple;
    currentProject = project;
    currentSetProject = setProject;
    registerAllStoryDivisionsInProject();
  }
  /**
   *
   * @param storyDivision is the division to run through
   * @returns all the immediate children (not grandchildren) of the provided story division
   */
  export function getImmediateChildren(
    storyDivision: IStoryDivisionSchema
  ): ReadonlyArray<Readonly<IStoryDivisionSchema>> {
    console.assert(usingProject());
    console.assert(
      storyDivisionExistsInProject(storyDivision),
      `Story division provided is not in project "${currentProject?.label}"`
    );

    const children: IStoryDivisionSchema[] = [];

    // iterate through every registered story division and add any
    // immediate children
    Object.values(storyDivisionRegistry).forEach((schema) => {
      if (schema.parentId === storyDivision.id) children.push(schema);
    });

    return children;
  }

  function storyDivisionExistsInProject(
    storyDivision: IStoryDivisionSchema
  ): boolean {
    return storyDivisionRegistry[storyDivision.id] === storyDivision;
  }

  function usingProject(): boolean {
    return currentProject !== null;
  }

  function registerAllStoryDivisionsInProject(): void {
    console.assert(usingProject());

    currentProject!.storyDivisions.forEach((storyDivision) =>
      registerStoryDivision(storyDivision)
    );
  }
  function registerStoryDivision(storyDivision: IStoryDivisionSchema): void {
    console.assert(storyDivisionAlreadyRegistered(storyDivision));

    storyDivisionRegistry[storyDivision.id] = storyDivision;
  }

  function storyDivisionAlreadyRegistered(storyDivision: IStoryDivisionSchema) {
    return storyDivisionIDAlreadyRegistered(storyDivision.id);
  }

  function storyDivisionIDAlreadyRegistered(storyDivisionId: number) {
    return !!storyDivisionRegistry[storyDivisionId];
  }

  function generateUniqueStoryDivisionID() {
    let id: Nullable<number> = null;
    const idCount = Object.values(storyDivisionRegistry).length;
    // there is a very very very very ... very small chance that this could cause an infinite loop
    // this should be considered a possible bug and fixed in later versions
    while (
      !storyDivisionIDAlreadyRegistered(
        (id = Math.floor(Math.random() * 2 * idCount))
      )
    );

    return id!;
  }
}

export default Project;
