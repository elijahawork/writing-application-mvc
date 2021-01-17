import path from 'path';
import fs from 'fs';
import { __PROJ_NAME } from '..';
import { HeightMap } from '../maps/HeightMap';
import { FileMetadata } from "../meta/FileMetadata";

export class FileModel {
    private metadata: FileMetadata;

    private children: FileModel[] = [];
    
    public get filePath() {
        return path.join(__PROJ_NAME, this.metadata.id.toString());
    }

    public get label() {
        return this.metadata.label;
    }
    public get parentId() {
        return this.metadata.parentId;
    }
    public get position() {
        return this.metadata.position;
    }
    public get templateId() {
        return this.metadata.templateId;
    }

    public set label(v) {
        this.metadata.label = v;
        this.writeToDisk();
    }
    public set parentId(v) {
        this.metadata.parentId = v;
        this.writeToDisk();
    }
    public set position(v) {
        this.metadata.position = v;
        this.writeToDisk();
    }
    public set templateId(v) {
        this.metadata.templateId = v;
        this.writeToDisk();
    }

    constructor(id: number, goalWords: number, notes: string, label: string,
        parentId: number, position: number, conceptIds: Set<number>,
        templateId: number, timeline: HeightMap) {
        
        this.metadata = new FileMetadata(id, goalWords, notes, label,
            parentId, position, conceptIds, templateId, timeline);

        this.writeToDisk();
    }

    private writeToDisk() {
        fs.writeFileSync(this.filePath, this.metadata.serialize());
    }
}