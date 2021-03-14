import IProjectSchema from '../schema/IProjectSchema';
import IStoryDivisionSchema from '../schema/IStoryDivisionSchema';
import { Nullable } from '../types/CustomUtilTypes';

let currentProject: Nullable<IProjectSchema>;

// this is a map of all the ids to their corresponding schema
let storyDivisionRegistry: Record<number, IStoryDivisionSchema> = {};

namespace Project {
  /**
   * 
   * @returns the root story division registry
   * This function *should* return whichever story division contains every child but is not contained itself
   * but that would take a moment to program and i'm lazy so rn i'm just going to make it so a root
   * has to have the id of -1.
   * This should be patched in a later update
   */
  export function getRootStoryDivision(): IStoryDivisionSchema {
    return storyDivisionRegistry[-1];
  }
  /**
   *
   * @param project is the project that the functions should all be using
   * @description Sets the current project for all the functions to use
   */
  export function useProject(project: IProjectSchema) {
    currentProject = project;
    registerAllStoryDivisionsInProject();
  }
  /**
   *
   * @param storyDivision is the division to run through
   * @returns all the immediate children (not grandchildren) of the provided story division
   */
  export function getAllImmediateChildren(
    storyDivision: IStoryDivisionSchema
  ): IStoryDivisionSchema[] {
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

  function storyDivisionExistsInProject(storyDivision: IStoryDivisionSchema) {
    return storyDivisionRegistry[storyDivision.id] === storyDivision;
  }

  function usingProject(): boolean {
    return currentProject !== null;
  }

  function registerAllStoryDivisionsInProject() {
    console.assert(usingProject());

    currentProject!.storyDivisions.forEach((storyDivision) =>
      registerStoryDivision(storyDivision)
    );
  }
  function registerStoryDivision(storyDivision: IStoryDivisionSchema) {
    console.assert(!storyDivisionAlreadyRegistered(storyDivision));

    storyDivisionRegistry[storyDivision.id] = storyDivision;
  }

  function storyDivisionAlreadyRegistered(storyDivision: IStoryDivisionSchema) {
    return storyDivisionRegistry[storyDivision.id];
  }
}

export default Project;