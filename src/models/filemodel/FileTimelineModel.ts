import { readFileSync } from "fs";
import { parse } from "path";
import { HeightMap } from "../../maps/HeightMap";
import { Model } from "../Model";

export class FileTimelineModel extends Model {
    timelines: { [timelineId: number]: number }[];

    constructor(id: number, timelines: { [timelineId: number]: number }[]) {
        super(id, 'timeline');
        this.timelines = timelines;
    }

    static read(path: string) {
        if (parse(path).name === 'timeline') {
            const jsonContent = readFileSync(path, 'utf-8');
            const { id, timelines } = JSON.parse(jsonContent) as FileTimelineModel;
            return new FileTimelineModel(id, timelines);
        } else {
            throw new TypeError('Cannot read. Ext is not correct');
        }
    }
}