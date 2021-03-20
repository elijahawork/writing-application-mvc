import API from '../api/API';
import IProjectSchema from '../schema/IProjectSchema';
import IStoryDivisionSchema from '../schema/IStoryDivisionSchema';
import { Nullable } from '../types/CustomUtilTypes';

export type StoryDivisionTree = {
  storyDivision: Readonly<IStoryDivisionSchema>;
  childDivisions: StoryDivisionTree[];
};

// this is a map of all the ids to their corresponding schema
namespace Project {
  let project: Nullable<IProjectSchema> = null;
  let setProject: Nullable<API.ProjectTupleModifier[1]> = null;

  export namespace StoryDivision {
    export type StoryDivisionID = number;

    export namespace API {
      export function relabel(
        storyDivision: IStoryDivisionSchema,
        newLabel: string
      ): void {
        console.assert(usingProject());

        storyDivision.label = newLabel;

        setProject!({
          storyDivisions: project!.storyDivisions,
        });
      }

      export function remove(storyDivision: IStoryDivisionSchema): void {
        setProject!({
          storyDivisions: project!.storyDivisions.filter(
            (comparisonDivision) => comparisonDivision !== storyDivision
          ),
        });

        Registry.unregister(storyDivision);
      }
      export function add(storyDivision: IStoryDivisionSchema): void {
        console.assert(usingProject());

        setProject!({
          storyDivisions: [...project!.storyDivisions, storyDivision],
        });

        Registry.register(storyDivision);
      }

      export function move(
        storyDivisionChild: IStoryDivisionSchema,
        storyDivisionParent: IStoryDivisionSchema
      ): void {
        console.assert(usingProject());

        storyDivisionChild.parentId = storyDivisionParent.id;
        setProject!({
          storyDivisions: project!.storyDivisions,
        });
      }
    }
    export namespace Registry {
      let registry: Record<StoryDivisionID, IStoryDivisionSchema> = {};

      export function getUniqueID() {
        let id: Nullable<number> = null;

        const idCount = Object.values(
          Project.StoryDivision.Registry.getRegistry()
        ).length;
        // there is a very very very very ... very small chance that this could cause an infinite loop
        // this should be considered a possible bug and fixed in later versions
        while (
          Project.StoryDivision.Registry.isRegistered(
            (id = Math.floor(Math.random() * 2 * idCount))
          )
        );

        return id!;
      }

      export function getRegistry(): Record<
        StoryDivisionID,
        Readonly<IStoryDivisionSchema>
      > {
        return registry;
      }

      export function clear() {
        registry = {};
      }
      export function unregister(storyDivision: IStoryDivisionSchema) {
        delete registry[storyDivision.id];
      }
      export function registerProjectDivisions() {
        console.assert(usingProject());

        for (const division of project!.storyDivisions) {
          register(division);
        }
      }

      export function register(storyDivision: IStoryDivisionSchema): void {
        console.assert(!isRegistered(storyDivision.id));

        registry[storyDivision.id] = storyDivision;
      }
      export function isRegistered(storyDivisionID: StoryDivisionID): boolean {
        return !!registry[storyDivisionID];
      }

      export function getById(id: number): Readonly<IStoryDivisionSchema> {
        console.assert(isRegistered(id));

        return registry[id];
      }
    }
    export namespace Util {
      /**
       *
       * @param storyDivision is the division to run through
       * @returns all the immediate children (not grandchildren) of the provided story division
       */
      export function deriveImmediateChildrenArray(
        storyDivision: IStoryDivisionSchema
      ): ReadonlyArray<Readonly<IStoryDivisionSchema>> {
        console.assert(usingProject());
        console.assert(
          Project.StoryDivision.Registry.isRegistered(storyDivision.id),
          `Story division provided is not in project "${project?.label}"`
        );

        const children: IStoryDivisionSchema[] = [];

        // iterate through every registered story division and add any
        // immediate children
        Object.values(Project.StoryDivision.Registry.getRegistry()).forEach(
          (schema) => {
            if (schema.parentId === storyDivision.id) children.push(schema);
          }
        );

        return children;
      }
      export function deriveTreeOfStoryDivisions(
        storyDivision: IStoryDivisionSchema
      ): Readonly<StoryDivisionTree> {
        const children = deriveImmediateChildrenArray(storyDivision);

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
            return deriveTreeOfStoryDivisions(child);
          });

          return {
            storyDivision,
            childDivisions: mappedChildren,
          };
        }
      }
      /**
       * @returns the root story division ID
       * This function *should* return whichever story division contains every child but is not contained itself
       * but that would take a moment to program and i'm lazy so rn i'm just going to make it so a root
       * has to have the id of -1.
       * This should be patched in a later update
       */
      export function getRootID() {
        const rootID = -1;

        console.assert(
          Project.StoryDivision.Registry.isRegistered(rootID),
          'There is no root for project'
        );

        return rootID;
      }
      export function compare(
        storyDivision1: IStoryDivisionSchema,
        storyDivision2: IStoryDivisionSchema
      ) {
        return storyDivision1.position - storyDivision2.position;
      }
    }
  }

  /**
   * @param projectTuple is the project that the functions should all be using
   * @description Sets the current project for all the functions to use
   */
  export function useProject(projectTuple: API.ProjectTupleModifier) {
    [project, setProject] = projectTuple;

    Project.StoryDivision.Registry.registerProjectDivisions();
  }

  function usingProject(): boolean {
    return project !== null;
  }
}

export default Project;
