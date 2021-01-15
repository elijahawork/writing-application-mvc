import { Serializable } from "../interfaces/Serializable";
import { HeightMap } from "../maps/HeightMap";
import { Metadata } from "./Metadata";

export class FileMetadata extends Metadata {
    _label: string;
    _parentId: number;
    _position: number;
    _conceptIds: Set<number>;
    _templateId: number;
    _timeline: HeightMap;

    constructor(id: number, goalWords: number, notes: string, label: string, parentID: number, position: number, conceptIds: number[], templateId: number, timeline: HeightMap) {
        super(id, goalWords, notes);
        this._label = label;
        this._parentId = parentID;
        this._position = position;
        this._conceptIds = new Set(conceptIds);
        this._templateId = templateId;
        this._timeline = timeline;
        this.writeToDisk();
    }

    public set label(v: string) {
        this._label = v;
        this.writeToDisk();
    }
    public set parentId(v: number) {
        this._parentId = v;
        this.writeToDisk();
    }
    public set position(v: number) {
        this._position = v;
        this.writeToDisk();
    }
    public set templateId(v: number) {
        this._templateId = v;
        this.writeToDisk();
    }    
    
    public get label() {
        return this._label;
    }    
    public get parentId() {
        return this._parentId;
    }
    public get position() {
        return this._position;
    }
    public get templateId() {
        return this._templateId;
    }
    private get conceptIds(): number[] {
        return [...this._conceptIds];
    }

    public joinConcept(concept: Metadata) {
        this.conceptIds.push(concept.id);
        this.writeToDisk();
    }
    public leaveConcept(concept: Metadata) {
        this._conceptIds.delete(concept.id);
        this.writeToDisk();
    }
    public joinTimeline(timeline: Metadata, height: number) {
        this._timeline.set(timeline.id, height);
        this.writeToDisk();
    }
    public leaveTimeline(timeline: Metadata) {
        this._timeline.delete(timeline.id);
        this.writeToDisk();
    }

    public serialize() {
        const { id, goalWords, notes, label, parentId, position, conceptIds, templateId, _timeline } = this;
        return JSON.stringify({ id, goalWords, notes, label, parentId, position, conceptIds, templateId, timeline: _timeline.serialize() });
    }
}