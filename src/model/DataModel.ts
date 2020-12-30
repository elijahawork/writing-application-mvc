import fs from 'fs';
import { join } from "path";
import { __PROJ_NAME } from "../index";
import { List } from '../interfaces/List';

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
    parent: DataModel | null = null;
    private children: DataModel[] = [];
    public static getDataModelById(id: number): DataModel {
        DataModel.errorAndHaltProgramIfIdDoesNotExist(id);
        return dataModelInstances.get(id)!;
    }
    private metadata: MetaDataObject;

    constructor(id: number, position: number, label: string) {
        this.metadata = { id, position, path: [-1], label };
        this.memoizeInstance();
        this.createFileIfNonexistant();
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

    private static errorAndHaltProgramIfIdDoesNotExist(id: number) {
        if (!dataModelInstances.has(id))
            throw new Error(`Cannot`);
    }

    private memoizeInstance() {
        dataModelInstances.set(this.id, this);
    }

    
    public get(index: number): DataModel {
        return this;    
    }
    
    public set(index: number, model: DataModel): void {

    }

    public add(model: DataModel, index: number): void;
    public add(model: DataModel): void;
    public add(model: DataModel, index?: number): void {

    }
    
    public remove(model: DataModel): void;
    public remove(index: number): void;
    public remove(predicate: DataModel | number) {

    }

    private updateChildrenPositions() {
        this.children.forEach((child, index) => {
            child.position = index;
        });
    }

    public save() {
        const currentMetaDataAndTextContent = this.combineCurrentMetaDataStateAndContent();
        this.writeMetaDataAndContentToFile(currentMetaDataAndTextContent);
    }
    
    private writeMetaDataAndContentToFile(content: string) {
        const filePath = this.getFilePath();
        this.writeStringToFile(filePath, content);
    }

    private writeStringToFile(filePath: string, content: string) {
        fs.writeFileSync(filePath, content);
    }

    private combineCurrentMetaDataStateAndContent() {
        const currentMetaDataObject = this.metaDataToJSON();
        const textContent = this.getTextContent();
        return currentMetaDataObject + textContent;
    }

    public getTextContent() {
        const metaDataAndFileContent = this.getMetaDataAndTextContent();
        const fileContent = metaDataAndFileContent.substring(metaDataAndFileContent.indexOf(META_DATA_DELIMITER) + 1);
        return fileContent;
    }
    
    private getMetaDataAndTextContent() {
        this.createFileIfNonexistant();
        return fs.readFileSync(this.getFilePath(), 'utf-8');
    }

    private createFileIfNonexistant() {
        if (!fs.existsSync(this.getFilePath()))
            fs.writeFileSync(this.getFilePath(), this.metaDataToJSON());
    }

    private getFilePath() {
        return join(__PROJ_NAME, this.id.toString());
    }

    public metaDataToJSON() {
        return `${JSON.stringify(this.metadata)}${META_DATA_DELIMITER}`;
    }

    public deletePath() {
        this.path = [];
    }

    public deleteFile() {
        fs.unlinkSync(this.getFilePath());
    }
}