import fs from 'fs';
import { join } from "path";
import { __PROJ_NAME } from "../index";
import { List } from '../interfaces/List';
import { ArrayList } from '../lib/ArrayList';

export type MetaDataObject = {
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
    public static deserialize(serializedStringFileContent: string): MetaDataObject {
        const endOfSerializedObject =
            serializedStringFileContent.indexOf(META_DATA_DELIMITER);
        const serializedString =
            serializedStringFileContent.substring(0, endOfSerializedObject);
        const deserializedObject =
            JSON.parse(serializedString) as MetaDataObject;
        return deserializedObject;
    }
    public static generateID() {
        let id = dataModelInstances.values.length;
        console.log(dataModelInstances);
        
        console.log('Generating id, starting with', id);
        
        while (dataModelInstances.has(id)) {
            id++;
        }
        return id;
    }
    private static errorAndHaltProgramIfIdDoesNotExist(id: number) {
        if (!dataModelInstances.has(id))
            throw new Error(`DataModel with id "${id}" does not exist.`);
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
        this.save();
        this.memoize();
    }

    public get(index: number): DataModel {
        return this.children.get(index);
    }
    public set(index: number, model: DataModel): void {
        throw new Error('Cannot set a location')
    }
    public insertModelBefore(model: DataModel) {        
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
        if (index === undefined) {
            this.children.add(model);
        } else {
            this.children.add(model, index);
        }
        this.adopt(model);
        this.updateChildrenFilePositionMetaData();
    }
    public remove(model: DataModel): void;
    public remove(index: number): void;
    public remove(predicate: DataModel | number): void {
        if (typeof predicate === 'number') {
            const child = this.children.get(predicate);
            child.orphanize();
            this.children.remove(predicate);
        } else {
            predicate.orphanize();
            this.children.remove(predicate);
        }
        
        this.updateChildrenFilePositionMetaData();
    }
    public indexOf(model: DataModel) {
        return this.children.indexOf(model);
    }
    public serialize(): string {
        return JSON.stringify(this.metadata) + META_DATA_DELIMITER;
    }
    public save(): void {
        this.writeToFile(this.serialize());
    }
    public delete() {
        fs.unlinkSync(this.filePath);
        dataModelInstances.delete(this.id);
        this.children.forEach(model => model.delete());
    }

    private adopt(model: DataModel) {
        model.parent = this;
        model.path = [...this.path, this.id];
    }
    private orphanize() {
        this.parent = null;
        this.path = [];
    }
    private memoize() {
        dataModelInstances.set(this.id, this);
    }
    private updateChildrenFilePositionMetaData(): void {
        this.children.forEach((child, index) => {
            child.position = index;
        });
    }    
    private writeToFile(...content: string[]) {
        fs.writeFileSync(this.filePath, content.join('\n'));
    }
    private createFileIfNonexistant() {
        if (!fs.existsSync(this.filePath))
            this.save();
        else
            console.log(`File "${this.label}" exists. Not creating a new one.`);
    }    
}