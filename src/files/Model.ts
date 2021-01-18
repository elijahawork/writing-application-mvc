import { Serializable } from '../interfaces/Serializable';
import fs from 'fs';
import path from 'path';
import { __PROJ_NAME } from '..';
import { Metadata } from "../meta/Metadata";

export abstract class Model<T extends Metadata> implements Serializable {
    protected readonly metadata: T;

    public get filePath() {
        return path.join(__PROJ_NAME, this.metadata.id.toString());
    }

    public get id() {
        return this.metadata.id;
    }
    public get goalWords() {
        return this.metadata.goalWords;
    }
    public get notes() {
        return this.metadata.notes;
    }

    public set id(v) {
        this.metadata.id = v;
        this.writeToDisk();
    }    
    public set goalWords(v) {
        this.metadata.goalWords = v;
        this.writeToDisk();
    }
    public set notes(v) {
        this.metadata.notes = v;
        this.writeToDisk();
    }

    /**
     * @description A model takes metadata and allows for modifications to be made to it,
     * stored on the harddrive 
     * @param metadata is the metadata object
     */
    constructor(metadata: T) {
        this.metadata = metadata;
        this.writeToDisk();
    }

    public writeToDisk() {
        fs.writeFileSync(this.filePath, this.serialize());
    }

    public serialize() {
        return this.metadata.serialize();
    }
    
}