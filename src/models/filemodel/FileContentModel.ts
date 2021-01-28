import { readFileSync } from "fs";
import { parse } from "path";
import { Model } from "../Model";
import { FileTimelineModel } from "./FileTimelineModel";

export class FileContentModel extends Model {
    // for speedy recovery of data
    private _content: string;

    set content(content: string) {
        this._content = content;
        this.write();
    }
    get content() {
        return this._content;
    }

    constructor(id: number, content: string) {
        super(id, 'content');
        this._content = content;
    }

    
    static read(path: string) {
        if (parse(path).name === 'content') {
            const jsonContent = readFileSync(path, 'utf-8');
            const { id, _content } = JSON.parse(jsonContent) as FileContentModel;
            return new FileContentModel(id, _content);
        } else {
            throw new TypeError('Cannot read. Ext is not correct');
        }
    }

}