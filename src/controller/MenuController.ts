import { ipcRenderer } from "electron";
import { List } from "../interfaces/List";
import { IPCChannel } from "../ipc/channels";
import { ArrayList } from "../lib/ArrayList";
import { Formulae } from "../lib/Formulae";
import { HTMLProcessing } from "../lib/HTMLProcessing";
import { DataModel } from "../model/DataModel";
import { Coordinate } from "../types/Coordinate";
import { MenuView } from "../view/menu/MenuView";

const menuControllerInstances: ArrayList<MenuController> = new ArrayList<MenuController>();

function getCoordinatesOfMenuControllerLabelCenter(menuController: MenuController): Coordinate {
    return HTMLProcessing
        .getCoordinatesOfElementCenter(menuController.menuView.labelElement);
}

function addNewFileToSelected() {
    const controller = MenuController.selectedControllers
        .get(MenuController.selectedControllers.length - 1);
    const controllerFrom = MenuController
        .from(DataModel.generateID(), -1, 'Untitled');
    controller.add(controllerFrom);
}
function deleteSelectedFile() {
    MenuController.selectedControllers
        .forEach(controller => controller.delete());
}
function renameSelectedFile() {
    const controller = MenuController.selectedControllers
        .get(MenuController.selectedControllers.length - 1);
}

ipcRenderer.on(IPCChannel.ADD_NEW_FILE, addNewFileToSelected);
ipcRenderer.on(IPCChannel.DELETE_SELECTED_FILE,  deleteSelectedFile);
ipcRenderer.on(IPCChannel.RENAME_SELECTED_FILE, renameSelectedFile);

export class MenuController implements List<MenuController> {
    public static selectedControllers: ArrayList<MenuController> =
        new ArrayList<MenuController>();
    public readonly menuView: MenuView;
    public readonly dataModel: DataModel;
    public parent: MenuController | null = null;
    private controllers: ArrayList<MenuController> =
        new ArrayList<MenuController>();

    public static from(id: number, position: number, label: string) {
        return new MenuController(new MenuView(label),
            new DataModel(id, position, label));
    }
    public delete() {
        this.dataModel.delete();
        this.menuView.delete();
        menuControllerInstances.remove(this);
    }

    constructor(menuView: MenuView, dataModel: DataModel) {
        this.menuView = menuView;
        this.dataModel = dataModel;

        this.addMouseDownDraggingEvent();
        this.addDragEndEvent();
        this.addDragEvent();

        this.menuView.labelElement.addEventListener('contextmenu', () => {
            ipcRenderer.send(IPCChannel.CONTEXT_MENU_NAV_OPEN);
        });

        this.menuView.labelElement.addEventListener('focus', () => {
            MenuController.selectedControllers.add(this);
        });
        this.menuView.labelElement.addEventListener('blur', () => {
            MenuController.selectedControllers.remove(this);
        });

        this.memoize();
    }

    public set(index: number, value: MenuController) {
        throw new Error(`Cannot replace a menu view controller location`);
    }
    public get(index: number): MenuController {
        return this.controllers.get(index);
    }

    public add(menuController: MenuController): void;
    public add(menuController: MenuController, index: number): void;
    public add(menuController: MenuController, index?: number): void {
        if (index === undefined) {
            this.push(menuController);
        } else {
            this.insert(menuController, index);
        }
        menuController.parent = this;
    }
    private insert(menuController: MenuController, index: number) {
        this.menuView.add(menuController.menuView, index);
        this.dataModel.add(menuController.dataModel, index);
        this.controllers.add(menuController, index);
    } 
    private push(menuController: MenuController) {
        this.menuView.add(menuController.menuView);
        this.dataModel.add(menuController.dataModel);
        this.controllers.add(menuController);
    }

    public remove(menuController: MenuController): void;
    public remove(index: number): void;
    public remove(predicate: MenuController | number): void {
        if (typeof predicate === 'number') {
            this.removeControllerByIndex(predicate);
        } else {
            this.removeController(predicate);
        }
    }
    private removeController(controller: MenuController) {
        this.menuView.remove(controller.menuView);
        this.dataModel.remove(controller.dataModel);
        this.controllers.remove(controller);
        controller.parent = null;    
    }
    private removeControllerByIndex(index: number) {
        this.removeController(this.get(index));
    }
    public indexOf(controller: MenuController) {
        return this.controllers.indexOf(controller);
    }   
    private addMouseDownDraggingEvent() {
        this.menuView.labelElement.addEventListener('mousedown', (ev) => {
            ev.stopPropagation();
            this.menuView.htmlElement.draggable = true;
        });
    }
    private addDragEndEvent() {
        this.menuView.htmlElement.addEventListener('dragend', (ev) => {
            ev.stopPropagation();
            this.menuView.htmlElement.draggable = false;
            const { clientX: x, clientY: y } = ev;
            const nearestController = this.getNearestMenuController({ x, y });
            const placement = this.getPlacement({ x, y }, nearestController)
            
            switch (placement) {
                case 'in': {
                    nearestController.add(this);
                }
                    break;
                case 'before': {
                    nearestController.insertAdjacentBefore(this);
                }
                    break;
                case 'after': {
                    nearestController.insertAdjacentAfter(this);
                }
                    break;
            }

        })
    }

    public insertAdjacentAfter(controller: MenuController) {
        controller.parent?.remove(controller);
        this.menuView.insertViewAfter(controller.menuView);
        this.dataModel.insertModelAfter(controller.dataModel);
    }
    public insertAdjacentBefore(controller: MenuController) {
        controller.parent?.remove(controller);
        this.menuView.insertViewBefore(controller.menuView);
        this.dataModel.insertModelBefore(controller.dataModel);
    }

    private addDragEvent() {
        this.menuView.htmlElement.addEventListener('drag', (ev) => {
            ev.stopPropagation();
        });
    }

    private memoize() {
        menuControllerInstances.add(this);
    }
    private getPlacement({ x, y }: Coordinate,
        nearestController: MenuController): 'before' | 'after' | 'in' {
        const centerOfController =
            getCoordinatesOfMenuControllerLabelCenter(nearestController);

        if (x < centerOfController.x) {
            if (y < centerOfController.y) {
                return 'before';
            } else {
                return 'after';
            }
        } else {
            return 'in';
        }
    }
    private getNearestMenuController({ x, y }: Coordinate): MenuController {
        let minController: MenuController | null = null;
        let minDist = Number.POSITIVE_INFINITY;
    
        menuControllerInstances.forEach((comparableController) => {
            if (comparableController == this)
                return;

            const { x: x1, y: y1 } =
                getCoordinatesOfMenuControllerLabelCenter(comparableController);
            const distance = Formulae.distance2D({ x, y }, { x: x1, y: y1 });
    
            if (distance < minDist) {
                minController = comparableController;
                minDist = distance;
            }
        })
    
        if (minController)
            return minController;
        throw new Error('Null controller');
    }
}