import { __PROJ_NAME } from "..";
import { join } from 'path';
import fs from 'fs';
import { Serializable } from "../interfaces/Serializable";

const idMap: Map<number, Metadata> = new Map<number, Metadata>();

export class Metadata implements Serializable {
    private _id: number;
    private _goalWords: number;
    private _notes: string;
    public static getMetadataById(id: number) {
        return idMap.get(id);
    }
    public set id(v: number) {
        this._id = v;
        this.writeToDisk();
    }    
    public set goalWords(v : number) {
        this._goalWords = v;
        this.writeToDisk();
    }
    public set notes(v : string) {
        this._notes = v;
        this.writeToDisk();
    }
    public get notes() {
        return this._notes;
    }    
    public get id() {
        return this._id;
    }
    public get goalWords() {
        return this._goalWords;
    }

    get filePath() {
        return join(__PROJ_NAME, this.id.toString());
    }

    constructor(id: number, goalWords: number, notes: string) {
        this._id = id;
        this._goalWords = goalWords;
        this._notes = notes;
        this.memoize();
        this.writeToDisk();
    }
    
    private memoize() {
        idMap.set(this.id, this);
    }

    protected writeToDisk() {
        fs.writeFileSync(this.filePath, this.serialize());
    }
    public static deserialize(serializedString: string): Metadata {
        return JSON.parse(serializedString) as Metadata;
    }
    public static deserializeFromDisk(path: string) {
        return Metadata.deserialize(Metadata.readFromDisk(path));
    }
    
    private static readFromDisk(path: string): string {
        return fs.readFileSync(path, 'utf-8');
    }

    public serialize() {
        const { id, goalWords, notes } = this;
        return JSON.stringify(
            {
                id,
                goalWords,
                notes
            }
        );
    }
}