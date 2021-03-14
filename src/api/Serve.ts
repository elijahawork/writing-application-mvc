import { userInfo } from 'os';
import IProjectSchema from '../schema/IProjectSchema';
import IServe, { RetrievalTypes as CommunicationType } from './IServe';

type EncryptedString = string;

type ServerUserAuth = {
  userId: number;
  userPassword: EncryptedString;
};

// this determines what type of communication the computer will be doing to modify information
// i.e. whether it will be modifying online or using the inbuilt os file system.
type CommunicationType = 'web' | 'fs';

abstract class Serve {
  static async serveProject(
    project: IProjectSchema,
    auth: ServerUserAuth,
    retrievalType: 'web'
  ): Promise<void>;
  static async serveProject(
    project: IProjectSchema,
    path: string,
    retrievalType: 'fs'
  ): Promise<void>;
  static async serveProject(
    project: IProjectSchema,
    path: string | ServerUserAuth,
    retrievalType: CommunicationType
  ): Promise<void> {
    
  }

  /**
   * @param projectName
   * @param path
   * @param retrievalType defaults to web
   */
  static async fetchProjectByName(
    projectName: string,
    auth: ServerUserAuth,
    retrievalType: 'web'
  ): Promise<IProjectSchema>;
  static async fetchProjectByName(
    projectName: string,
    path: string,
    retrievalType: 'fs'
  ): Promise<IProjectSchema>;
  static async fetchProjectByName(
    projectName: string,
    path: string | ServerUserAuth,
    retrievalType: CommunicationType = 'web'
  ): Promise<IProjectSchema> {}

  static async fetchProjectById(
    projectId: number,
    auth: ServerUserAuth,
    retrievalType: 'web'
  ): Promise<void>;
  static async fetchProjectById(
    projectId: number,
    path: string,
    retrievalType: 'fs'
  ): Promise<void>;
  static async fetchProjectById(
    projectId: number,
    path: string | ServerUserAuth,
    retrievalType: CommunicationType = 'web'
  ): Promise<IProjectSchema> {}
}
