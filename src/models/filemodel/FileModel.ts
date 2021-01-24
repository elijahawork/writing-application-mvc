import { Metadata, metadataIdMap } from "../../meta/Metadata";
import { FileContentModel } from "./FileContentModel";
import { FileMetadataModel } from "./FileMetadataModel";
import { FileMindmapModel } from "./FileMindmapModel";
import { FileTimelineModel } from "./FileTimelineModel";

export class FileModel {
    readonly metadata: FileMetadataModel;
    readonly content: FileContentModel;
    readonly mindmap: FileMindmapModel;
    readonly timeline: FileTimelineModel;

    constructor(
        metadata: FileMetadataModel,
        content: FileContentModel,
        mindmap: FileMindmapModel,
        timeline: FileTimelineModel
    ) {
        this.metadata = metadata;
        this.content = content;
        this.mindmap = mindmap;
        this.timeline = timeline;
    }

    write() {
        this.metadata.write();
        this.content.write();
        this.mindmap.write();
        this.timeline.write();
    }
}