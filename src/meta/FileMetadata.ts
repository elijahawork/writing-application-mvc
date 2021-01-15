import { Serializable } from "../interfaces/Serializable";
import { HeightMap } from "../maps/HeightMap";
import { Metadata } from "./Metadata";

export class FileMetadata extends Metadata implements Serializable {
    label: string;
    parentId: number;
    conceptIds: number[];
    templateId: number;
    timeline: HeightMap;

    constructor(id: number, goalWords: number, notes: string, label: string, parent: number, concepts: number[], templateId: number, timeline: HeightMap) {
        super(id, goalWords, notes);
        this.label = label;
        this.parentId = parent;
        this.conceptIds = concepts;
        this.templateId = templateId;
        this.timeline = timeline;
    }

}