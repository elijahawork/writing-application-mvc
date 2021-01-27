import { writeFile } from "fs";
import { join } from "path";
import { __PROJ_NAME } from "..";

export abstract class Model {
    readonly id: number;
    readonly ext: string;

    constructor(id: number, ext: string) {
        this.id = id;
        this.ext = ext;
    }

    write() {
        writeFile(join(__PROJ_NAME, this.id.toString(), this.ext), this.serialize(), (err) => {
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