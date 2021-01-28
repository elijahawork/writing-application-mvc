import { readFileSync, writeFile } from "fs";
import { join } from "path";
import { __PROJ_NAME } from "..";

export abstract class Model {
    readonly id: number;
    readonly ext: string;

    constructor(id: number, ext: string) {
        this.id = id;
        this.ext = ext;
    }

    get filePath() {
        return join(this.folderPath, this.ext);
    }
    get folderPath() {
        return join(__PROJ_NAME, this.id.toString());
    }

    write() {
        writeFile(this.filePath, this.serialize(), (err) => {
            if (err) {
                console.log('Ran into error when trying to write file.');
                throw err;
            }
        });
    }

    serialize() {
        const { id, ext, ...modelComponents } = this;
        
        // remove extension from serialization
        return JSON.stringify({ id, ...modelComponents });
    }
}