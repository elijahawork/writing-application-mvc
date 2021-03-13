import IProjectSchema from '../schema/IProjectSchema';

export type RetrievalTypes = 'web' | 'fs';

interface IServe {
  /**
   * @param projectName
   * @param path
   * @param retrievalType
   * @description This retrieves the project and returns it asynchronously
   */
  fetchProjectByName(
    projectName: string,
    path: string,
    retrievalType?: RetrievalTypes
  ): Promise<IProjectSchema>;
  fetchProjectById(
    projectId: number,
    path: string,
    retrievalType?: RetrievalTypes
  ): Promise<IProjectSchema>;

  /**
   * @param project
   * @param projectName
   * @param path
   * @param retrievalType
   * @description This returns the project to its sender
   */
  serveProjectByName(
    project: IProjectSchema,
    projectName: string,
    path: string,
    retrievalType?: RetrievalTypes
  ): Promise<void>;
  /**
   * @param project
   * @param projectName
   * @param path
   * @param retrievalType
   * @description This returns the project to its sender
   */
  serveProjectById(
    project: IProjectSchema,
    projectId: number,
    path: string,
    retrievalType?: RetrievalTypes
  ): Promise<void>;
}

export default IServe;
