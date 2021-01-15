import { HeightMap } from "../maps/HeightMap";
import { Metadata } from "./Metadata";

export class FileMetadata extends Metadata {
    public label: string;
    public parentId: number;
    public position: number;
    public conceptIds: Set<number>;
    public templateId: number;
    public timeline: HeightMap;

    constructor(id: number, goalWords: number, notes: string, label: string, parentID: number, position: number, conceptIds: Set<number>, templateId: number, timeline: HeightMap) {
        super(id, goalWords, notes);
        this.label = label;
        this.parentId = parentID;
        this.position = position;
        this.conceptIds = conceptIds;
        this.templateId = templateId;
        this.timeline = timeline;
    }
}