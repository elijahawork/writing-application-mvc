import fs from 'fs';
import { join } from "path";
import { TextArea } from './view/text-area/TextArea';
import { Caret } from './view/text-area/Caret';
import { MenuController } from './controller/MenuController';
import { DataModel, MetaDataObject } from './model/DataModel';

export const __PROJ_NAME = join(__dirname, 'protected');
export const __PROJECT_ROOT_ID = -1;
var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
export function init() {
    const metaDataObjects = getSortedMetaDataObjects();
    const rootMetaData = getMetaDataRootFromMetaDataObjects(metaDataObjects);
    if (!rootMetaData)
        throw new Error('Could not find root metadata');
    const rootController = MenuController.from(rootMetaData.id, rootMetaData.position, rootMetaData.label);
    removeRootFromMetaDataObjects(metaDataObjects, rootMetaData);
    createControllerFamily(metaDataObjects, rootController);
    document.body.querySelector('.column')?.appendChild(rootController.menuView.htmlElement)
}
function createControllerFamily(metaDataObjects: MetaDataObject[], rootController: MenuController): void {
    const controllers: Map<number, MenuController> = new Map<number, MenuController>();
    addRootToControllers(controllers, rootController);
    turnMetaDataIntoControllerFamilyTreeAtRoot(metaDataObjects, controllers);
}

function turnMetaDataIntoControllerFamilyTreeAtRoot(metaDataObjects: MetaDataObject[], controllers: Map<number, MenuController>) {
    metaDataObjects.forEach(dat => {
        const parentName = dat.path[dat.path.length - 1];
        const controller = MenuController.from(dat.id, dat.position, dat.label);
        if (controllers.has(parentName)) {
            memoizeControllerAndPlaceItInTree(controllers, parentName, controller, dat);
        } else if (isDataOfRoot(dat)) {
            console.log('Found project root. Continuing...');
        } else {
            throw new Error(`Am I an orphan or does my parent simply not exist? ${parentName}`);
        }
    });
}

function isDataOfRoot(dat: MetaDataObject) {
    return dat.id === __PROJECT_ROOT_ID;
}

function memoizeControllerAndPlaceItInTree(controllers: Map<number, MenuController>, parentName: number, controller: MenuController, dat: MetaDataObject) {
    const parentController = controllers.get(parentName)!;
    parentController.add(controller);
    controllers.set(dat.id, controller);
}

function addRootToControllers(controllers: Map<number, MenuController>, rootController: MenuController) {
    controllers.set(rootController.dataModel.id, rootController);
}

function removeRootFromMetaDataObjects(metaDataObjects: MetaDataObject[], root: MetaDataObject): void {
    const index = metaDataObjects.indexOf(root);
    metaDataObjects.splice(index, 1);
}
function getMetaDataRootFromMetaDataObjects(metaDataObjects: MetaDataObject[]): MetaDataObject | undefined {
    return metaDataObjects.find(object => {
        return object.id === __PROJECT_ROOT_ID;
    });
}
function getSortedMetaDataObjects(): MetaDataObject[] {
    const metaDataObjects = getMetaDataObjects();

    sortByPathLength(metaDataObjects);

    return metaDataObjects;
}

function sortByPathLength(metaDataObjects: MetaDataObject[]): void {
    metaDataObjects.sort((a,b) => a.path.length - b.path.length || a.position - b.position)
}
function getMetaDataObjects() {
    const metaFileNames = retrieveMetaFileNames();

    return metaFileNames.map(metaFileName =>
        DataModel.deserialize(
            getMetaFileContent(metaFileName)
        )
    );
}
function getMetaFileContent(metaFileName: string): string {
    const filePath = join(__PROJ_NAME, metaFileName);
    return fs.readFileSync(filePath, 'utf-8');
}
function retrieveMetaFileNames(): string[] {
    const dir = fs.readdirSync(__PROJ_NAME, 'utf-8');
    return dir;
}
export function main() {
    createProjectFolderIfNonexistant();
    // test();
    init();
}

function createProjectFolderIfNonexistant() {
    if (!fs.existsSync(__PROJ_NAME))
        fs.mkdirSync(__PROJ_NAME);
}

// run all testing code in here.
function test() {
    let id = -1;
    const manuscript = MenuController.from(id++, 0, 'Manuscript');
    const act1 = MenuController.from(id++, 0, 'Act I');
    const chapter1 = MenuController.from(id++, 0, 'Chapter I');
    const chapter2 = MenuController.from(id++, 0, 'Chapter II');
    manuscript.add(act1);
    act1.add(chapter1);
    manuscript.add(chapter2);


    manuscript.dataModel.save();
    act1.dataModel.save();
    chapter1.dataModel.save();
    chapter2.dataModel.save();
    // console.log({manuscript, act1, chapter1});
    
    

    // document.querySelector('.column')?.appendChild(manuscript.menuView.htmlElement);

}