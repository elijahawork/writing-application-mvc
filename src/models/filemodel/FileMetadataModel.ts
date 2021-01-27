import { Model } from "../Model";

export class FileMetadataModel extends Model {
    readonly position: number;
    readonly wordCount: number;
    readonly label: string;
    readonly notes: string;
    
    constructor(id: number, position: number, wordCount: number, label: string, notes: string) {
        super(id, 'metadata');
        this.position = position;
        this.wordCount = wordCount;
        this.label = label;
        this.notes = notes;
    }
}