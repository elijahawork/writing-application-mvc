import { readFileSync } from "fs";
import { parse } from "path";
import { Model } from "../Model";
import { FileTimelineModel } from "./FileTimelineModel";

export class FileMindmapModel extends Model {
    public readonly mindmaps: number[];

    constructor(id: number, mindmaps: number[]) {
        super(id, 'mmaps');
        this.mindmaps = mindmaps;
    }

    static read(path: string) {
        if (parse(path).name === 'mmaps') {
            const jsonContent = readFileSync(path, 'utf-8');
            const { id, mindmaps } = JSON.parse(jsonContent) as FileMindmapModel;
            return new FileMindmapModel(id, mindmaps);
        } else {
            throw new TypeError('Cannot read. Ext is not correct');
        }
    }

}