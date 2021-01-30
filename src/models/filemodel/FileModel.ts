import { existsSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";
import { Model } from "../Model";
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
        if (!allIDsMatch(metadata.id, content, mindmap, timeline))
            throw new Error(`Not all IDs match.`);

        if (!existsSync(metadata.folderPath))
            mkdirSync(metadata.folderPath);
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

    static read(path: string) {
        const [content, metadata, maps, timeline] = readdirSync(path).sort().map(ext=>join(path, ext));
        const mcontent = FileContentModel.read(content);
        const mmetadata = FileMetadataModel.read(metadata);
        const mmaps = FileMindmapModel.read(maps);
        const mtimeline = FileTimelineModel.read(timeline);
        return new FileModel(mmetadata, mcontent, mmaps, mtimeline);
    }
}

function allIDsMatch(expectedID: number, ...models: Model[]) {
    return models.findIndex(model => model.id !== expectedID) === -1;
}
