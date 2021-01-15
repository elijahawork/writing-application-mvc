export class Metadata {
    public id: number;
    public goalWords: number;
    public  notes: string;

    constructor(id: number, goalWords: number, notes: string) {
        this.id = id;
        this.goalWords = goalWords;
        this.notes = notes;
    }    
}