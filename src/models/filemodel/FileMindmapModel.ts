import { Model } from "../Model";

export class FileMindmapModel extends Model {
    public readonly mindmaps: number[] = [];

    constructor(id: number) {
        super(id, 'mmaps');
    }

}