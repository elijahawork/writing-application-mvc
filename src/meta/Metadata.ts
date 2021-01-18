import { Serializable } from "../interfaces/Serializable";

export const metadataIdMap = new Map<number, Metadata>();

export class Metadata implements Serializable {
    public id: number;
    public goalWords: number;
    public  notes: string;

    constructor(id: number, goalWords: number, notes: string) {
        this.id = id;
        this.goalWords = goalWords;
        this.notes = notes;
        metadataIdMap.set(id, this);
    }

    public serialize() {
        return JSON.stringify(this);
    }
}