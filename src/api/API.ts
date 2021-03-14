import { PathLike } from 'fs';
import { readFile } from 'fs/promises';
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
  async function openProjectFS(path: PathLike): Promise<IProjectSchema> {
    useFSPath(path);
    return parseProjectJSON(await getProjectJSON());
  }
  function parseProjectJSON(projectJSON: string): IProjectSchema {
    const parsedProjectSchema = JSON.parse(projectJSON);

    console.assert(isIProjectSchema(parsedProjectSchema));

    return parsedProjectSchema as IProjectSchema;
  }
  async function getProjectJSON(): Promise<string> {
    console.assert(typeof fileSystemPath === 'string');

    return readFile(fileSystemPath!, 'utf-8');
  }
  /**
   *
   * @param path is the path that the server is looking towards
   */
  function useFSPath(path: PathLike) {
    fileSystemPath = path;
  }
}
export default API;
