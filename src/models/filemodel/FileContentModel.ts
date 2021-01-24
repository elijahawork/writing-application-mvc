import { Model } from "../Model";

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
}