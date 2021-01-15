import { FileMetadata } from "../meta/FileMetadata";
import { Metadata } from "../meta/Metadata";

export class File {
    metadata: FileMetadata;
    children: File[];
    
    constructor(id: number, goalWords: number, notes: string, label: string, parent: number, concepts, templateId, timeline, children) {
        this.metadata = new FileMetadata(id, goalWords, notes, label, parent, concepts, templateId, timeline);

    }


}