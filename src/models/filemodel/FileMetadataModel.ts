import { readFileSync } from "fs";
import { parse } from "path";
import { Model } from "../Model";

export class FileMetadataModel extends Model {
    readonly position: number;
    readonly wordCount: number;
    readonly label: string;
    readonly notes: string;
    readonly childrenIds: number[];

    constructor(id: number, position: number, wordCount: number, label: string, notes: string, childrenIds: number[]) {
        super(id, 'metadata');
        this.position = position;
        this.wordCount = wordCount;
        this.label = label;
        this.notes = notes;
        this.childrenIds = childrenIds;
    }

    static read(path: string) {
        if (parse(path).name === 'metadata') {
            const jsonContent = readFileSync(path, 'utf-8');
            const { id, position, wordCount, label, notes, childrenIds } = JSON.parse(jsonContent) as FileMetadataModel;
            return new FileMetadataModel(id, position, wordCount, label, notes, childrenIds);
        } else {
            throw new TypeError('Cannot read. Ext is not correct');
        }
    }

}