import { Serializable } from "../interfaces/Serializable";

export class Metadata implements Serializable {
    public id: number;
    public goalWords: number;
    public  notes: string;

    constructor(id: number, goalWords: number, notes: string) {
        this.id = id;
        this.goalWords = goalWords;
        this.notes = notes;
    }

    public serialize() {
        return JSON.stringify(this);
    }
}