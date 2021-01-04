import fs from 'fs';
import { join } from "path";
import { __PROJ_NAME } from "../index";
import { List } from '../interfaces/List';
import { ArrayList } from '../lib/ArrayList';

type MetaDataObject = {
    id: number,
    position: number,
    path: number[],
    label: string,
};

// the delimiting object that denotes the end of a metadata object
const META_DATA_DELIMITER = ';';

const dataModelInstances: Map<number, DataModel> = new Map<number, DataModel>();

export class DataModel implements List<DataModel> {
    private parent: DataModel | null = null;
    private children: ArrayList<DataModel> = new ArrayList<DataModel>();
    private metadata: MetaDataObject;

    public static getDataModelById(id: number): DataModel {
        DataModel.errorAndHaltProgramIfIdDoesNotExist(id);
        return dataModelInstances.get(id)!;
    }
    private static errorAndHaltProgramIfIdDoesNotExist(id: number) {
        if (!dataModelInstances.has(id))
            throw new Error(`Cannot`);
    }

    public get id() {
        return this.metadata.id;
    }
    public get position() {
        return this.metadata.position;
    }
    public get path() {
        return this.metadata.path;
    }
    public get label() {
        return this.metadata.label;
    }

    public set id(id: number) {
        this.metadata.id = id;
        this.save();
    }
    public set position(position: number) {
        this.metadata.position = position;
        this.save();
    }
    public set path(path: number[]) {
        this.metadata.path = path;
        this.save();
    }
    public set label(label: string) {
        this.metadata.label = label;
    }

    private get filePath() {
        return join(__PROJ_NAME, this.id.toString());
    }

    constructor(id: number, position: number, label: string) {
        this.metadata = { id, position, path: [-1], label };
        this.createFileIfNonexistant();
    }

    public get(index: number): DataModel {
        return this.children.get(index);
    }
    public set(index: number, model: DataModel): void {
        throw new Error('Cannot set a location')
    }

    public insertModelBefore(model: DataModel) {        
        console.log(model);
        
        if (model.parent) {
            model.parent.remove(model);
        }
        if (this.parent) {
            this.parent.add(model, this.parent.indexOf(this));
        } else {
            throw new Error('Cannot perform operation on orphan datamodel');
        }
    }
    public insertModelAfter(model: DataModel) {        
        if (model.parent) {
            model.parent.remove(model);
        }

        if (this.parent) {
            this.parent.add(model, this.parent.indexOf(this) + 1);
        } else {
            throw new Error('Cannot perform operation on orphan datamodel');
        }
    }

    public add(model: DataModel): void;
    public add(model: DataModel, index: number): void;
    public add(model: DataModel, index?: number): void {
        if (index === undefined)
            this.children.add(model);
        else
            this.children.add(model, index);

        this.adopt(model);

        this.updateChildrenFileLocationMetaData();
    }

    public remove(model: DataModel): void;
    public remove(index: number): void;
    public remove(predicate: DataModel | number): void {

        if (typeof predicate === 'number') {
            this.children.get(predicate).orphanize();
            this.children.remove(predicate);
        } else {
            predicate.orphanize();
            this.children.remove(predicate);
        }
        
        this.updateChildrenFileLocationMetaData();
    }

    public indexOf(model: DataModel) {
        return this.children.indexOf(model);
    }

    // controls "parent" metadata when "adopting"
    private adopt(model: DataModel) {
        model.parent = this;
        model.path = [...this.path, this.id];
    }

    private orphanize() {
        this.parent = null;
        this.path = [];
    }

    public serialize(): string {
        return JSON.stringify(this.metadata + META_DATA_DELIMITER);
    }
    public static deserialize(serializedStringFileContent: string): MetaDataObject {
        const endOfSerializedObject = serializedStringFileContent.indexOf(META_DATA_DELIMITER);
        const serializedString = serializedStringFileContent.substring(0, endOfSerializedObject);
        const deserializedObject = JSON.parse(serializedString) as MetaDataObject;
        return deserializedObject;
    }

    private updateChildrenFileLocationMetaData(): void {
        this.children.forEach((child, index) => {
            child.position = index;
        });
    }
    
    public save(): void {
        this.writeToFile(this.serialize());
    }

    /**
     * 
     * @param content Strings that will be written, separated by a new line
     */
    private writeToFile(...content: string[]) {
        fs.writeFileSync(this.filePath, content.join('\n'));
    }

    private createFileIfNonexistant() {
        if (!fs.existsSync(this.filePath))
            this.save();
        else
            console.log(`File "${this.label}" exists. Not creating a new one.`);
    }
    
    public deleteFile() {
        fs.unlinkSync(this.filePath);
    }
}