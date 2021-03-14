import { PathLike } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import IProjectSchema, { isIProjectSchema } from '../schema/IProjectSchema';

type EncryptedString = string;
type ProjectId = number;

type ServerUserAuth = {
  userId: number;
  userPassword: EncryptedString;
};

// this determines what type of communication the computer will be doing to modify information
// i.e. whether it will be modifying online or using the inbuilt os file system.
type CommunicationType = 'web' | 'fs';

type Nullable<T> = T | null;

/**
 * @deprecated
 */
let userAuthentication: Nullable<ServerUserAuth> = null;

let fileSystemPath: Nullable<PathLike> = null;

namespace API {
  /**
   *
   * @param path is the path to the project to open
   * @returns a tuple of the project schema and a function to set the project value
   */
  async function openProjectFS(
    path: PathLike
  ): Promise<
    [project: IProjectSchema, setProject: (project: IProjectSchema) => void]
  > {
    useFSPath(path);

    const project = parseProjectJSON(await getProjectJSON());

    return [project, returnProjectFS];
  }
  /**
   * 
   * @param project is the project schema to write
   */
  async function returnProjectFS(project: IProjectSchema): Promise<void> {
    console.assert(usingFS());

    return writeFile(fileSystemPath!, JSON.stringify(project));
  }
  function parseProjectJSON(projectJSON: string): IProjectSchema {
    const parsedProjectSchema = JSON.parse(projectJSON);

    console.assert(isIProjectSchema(parsedProjectSchema));

    return parsedProjectSchema as IProjectSchema;
  }
  async function getProjectJSON(): Promise<string> {
    console.assert(usingFS());

    return readFile(fileSystemPath!, 'utf-8');
  }
  /**
   *
   * @param path is the path that the server is looking towards
   */
  function useFSPath(path: PathLike) {
    fileSystemPath = path;
  }
  function usingFS() {
    return typeof fileSystemPath === 'string';
  }
}
export default API;
