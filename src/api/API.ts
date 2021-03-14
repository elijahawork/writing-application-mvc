import { PathLike, promises } from 'fs';
import IProjectSchema, { isIProjectSchema } from '../schema/IProjectSchema';
import { Nullable } from '../types/CustomUtilTypes';

type EncryptedString = string;

let fileSystemPath: Nullable<PathLike> = null;
let project: Nullable<IProjectSchema> = null;

namespace API {
  /**
   * @description This is a tuple type that returns the initial project as a view only object and a method to set the value
   */
  export type ProjectTupleModifier = Promise<
    [project: Readonly<IProjectSchema>, setProject: typeof updateProjectFS]
  >;
  /**
   *
   * @param path is the path to create the project file
   * @param project is the project as a javascript object
   * @returns the project and a method to set the value as a tuple
   */
  export async function newProjectFS(
    path: PathLike,
    project: IProjectSchema
  ): ProjectTupleModifier {
    useFSPath(path);

    await writeProjectFS(project);

    return await openProjectFS(path);
  }
  /**
   *
   * @param path is the path to the project to open
   * @returns the project and a method to set the value as a tuple
   */
  export async function openProjectFS(path: PathLike): ProjectTupleModifier {
    useFSPath(path);

    const projectJSON = await getProjectJSON();
    project = parseProjectJSON(projectJSON);

    return [project, updateProjectFS];
  }
  /**
   *
   * @param project is the project schema to write
   */
  async function writeProjectFS(project: IProjectSchema): Promise<void> {
    console.assert(usingFS());

    promises.writeFile(fileSystemPath!, JSON.stringify(project));
  }
  /**
   *
   * @param newProjectEntries A JS object with new entries to replace the past ones
   */
  async function updateProjectFS<K extends keyof IProjectSchema>(
    newProjectEntries: Pick<IProjectSchema, K>
  ): Promise<IProjectSchema> {
    console.assert(project);
    
    for (const key in newProjectEntries) {
      project![key] = newProjectEntries[key];
    }

    await writeProjectFS(project!);
    return project!;
  }

  /**
   *
   * @param projectJSON is a serialized json project schema
   * @returns the deserialized form of the project schema as a javascript object
   */
  function parseProjectJSON(projectJSON: string): IProjectSchema {
    const parsedProjectSchema = JSON.parse(projectJSON);

    console.assert(isIProjectSchema(parsedProjectSchema));

    return parsedProjectSchema as IProjectSchema;
  }
  /**
   *
   * @returns the json at the specified fs path
   */
  async function getProjectJSON(): Promise<string> {
    console.assert(usingFS());

    return promises.readFile(fileSystemPath!, 'utf-8');
  }
  /**
   *
   * @param path is the path that the server is looking towards
   */
  function useFSPath(path: PathLike) {
    fileSystemPath = path;
  }
  /**
   *
   * @returns a boolean representing whether the file system is what the api is using
   */
  function usingFS() {
    return typeof fileSystemPath === 'string';
  }
}
export default API;
