import fs from 'fs';
import { join } from "path";
import { __PROJ_NAME } from "../index";

type MetaDataObject = {
    id: number,
    position: number,
    path: number[],
    label: string,
};

// the delimiting object that denotes the end of a metadata object
const META_DATA_DELIMITER = ';';

const dataModelInstances: Map<number, DataModel> = new Map<number, DataModel>();

export class DataModel {
    private parent: DataModel | null = null;
    private children: DataModel[] = [];
    private metadata: MetaDataObject;

    public static getDataModelById(id: number): DataModel {
        DataModel.errorAndHaltProgramIfIdDoesNotExist(id);
        return dataModelInstances.get(id)!;
    }
    private static errorAndHaltProgramIfIdDoesNotExist(id: number) {
        if (!dataModelInstances.has(id))
            throw new Error(`Cannot`);
    }

    constructor(id: number, position: number, label: string) {
        this.metadata = { id, position, path: [-1], label };
        this.memoizeDistinctDataModelInstance();
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

    public push(dataModel: DataModel) {
        this.adopt(dataModel);
        this.children.push(dataModel);
        this.assignPathAsChild(dataModel);
        this.updateChildrenPositions();
    }

    private adopt(dataModel: DataModel) {
        this.orphanize(dataModel);
        dataModel.parent = this;
        dataModel.path = [...this.path, this.id];
    }
    private orphanize(dataModel: DataModel) {
        if (dataModel.parent)
            dataModel.remove(dataModel);
    }
    
    public remove(dataModel: DataModel) {
        dataModel.parent = null;
        this.removeModelFromArray(dataModel);
        dataModel.clearPath();
        this.updateChildrenPositions();
    }
    public save() {
        const currentMetaDataAndTextContent = this.combineCurrentMetaDataStateAndContent();
        this.writeMetaDataAndContentToFile(currentMetaDataAndTextContent);
    }    
    public insert(dataModel: DataModel, index: number) {
        this.children.splice(index, 0, dataModel);
        this.updateChildrenPositions();
    }
    public getTextContent() {
        const metaDataAndFileContent = this.getMetaDataAndTextContent();
        const fileContent = metaDataAndFileContent.substring(metaDataAndFileContent.indexOf(META_DATA_DELIMITER) + 1);
        return fileContent;
    }
    public metaDataToJSON() {
        return `${JSON.stringify(this.metadata)}${META_DATA_DELIMITER}`;
    }

    private memoizeDistinctDataModelInstance() {
        dataModelInstances.set(this.id, this);
    }
    private assignPathAsChild(dataModel: DataModel) {
        dataModel.path = [...this.path, this.id];
    }
    private clearPath() {
        this.path = [];
    }
    private removeModelFromArray(dataModel: DataModel) {
        const indexOfDataModel = this.children.indexOf(dataModel);
        this.children.splice(indexOfDataModel, 1);
    }
    private updateChildrenPositions() {
        this.children.forEach((child, index) => {
            child.position = index;
        });
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


    public deleteFile() {
        fs.unlinkSync(this.getFilePath());
    }
}