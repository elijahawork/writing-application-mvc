import { HeightMap } from "../../maps/HeightMap";
import { Model } from "../Model";

export class FileTimelineModel extends Model {
    timelines: { [timelineId: number]: number }[];

    constructor(id: number, timelines: { [timelineId: number]: number }[]) {
        super(id, 'timeline');
        this.timelines = timelines;
    }
}