import { List } from "../interfaces/List";
import { ArrayList } from "../lib/ArrayList";
import { DataModel } from "../model/DataModel";
import { Coordinate } from "../types/Coordinate";
import { MenuView } from "../view/menu/MenuView";

const allMenuControllers: MenuController[] = [];

function getNearestMenuController({ x, y }: Coordinate, ignore?: MenuController): MenuController {
    let minController: MenuController | null = null;
    let minDist = Number.POSITIVE_INFINITY;

    for (const comparableController of allMenuControllers) {
        if (comparableController == ignore)
            continue;
        const { x: x1, y: y1 } = getCoordinatesOfMenuControllerViewLabelCenter(comparableController);
        const distance = distanceBetweenTwoCoordinates({ x, y }, { x: x1, y: y1 });

        if (distance < minDist) {
            minController = comparableController;
            minDist = distance;
        }
    }

    if (minController)
        return minController;
    throw new Error('Null controller');
}

function distanceBetweenTwoCoordinates(coordinate1: Coordinate, coordinate2: Coordinate) {
    return Math.sqrt((coordinate1.x - coordinate2.x) ** 2 + (coordinate1.y - coordinate2.y) ** 2);
}
function getCoordinatesOfMenuControllerViewLabelCenter(menuController: MenuController): Coordinate {
    return getCoordinatesOfElementCenter(menuController.menuView.labelElement);
}
function getCoordinatesOfElementCenter(el: HTMLElement): Coordinate {
    const box = el.getBoundingClientRect();
    return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
}

export class MenuController implements List<MenuController> {
    public readonly menuView: MenuView;
    public readonly dataModel: DataModel;
    private parent: MenuController | null = null;
    private controllers: ArrayList<MenuController> = new ArrayList<MenuController>();

    public static from(id: number, position: number, label: string) {
        return new MenuController(new MenuView(label), new DataModel(id, position, label));
    }

    constructor(menuView: MenuView, dataModel: DataModel) {
        this.menuView = menuView;
        this.dataModel = dataModel;

        this.addMouseDownDraggingEvent();
        this.addDragEndEvent();
        this.addDragEvent();

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
            this.menuView.add(menuController.menuView);
            this.dataModel.add(menuController.dataModel);
            this.controllers.add(menuController);
        } else {
            this.menuView.add(menuController.menuView, index);
            this.dataModel.add(menuController.dataModel, index);
            this.controllers.add(menuController, index);
        }
        menuController.parent = this;
    }

    public remove(menuController: MenuController): void;
    public remove(index: number): void;
    public remove(predicate: MenuController | number): void {
        if (typeof predicate === 'number') {
            this.menuView.remove(predicate);
            this.dataModel.remove(predicate);
        } else {
            this.menuView.remove(predicate.menuView);
            this.dataModel.remove(predicate.dataModel);
        }
        
        if (typeof predicate === 'number') {
            const controller = this.get(predicate);
            controller.parent = null;
        } else {
            predicate.parent = null;
        }
        
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
            const nearestController = getNearestMenuController({ x, y }, this);
            const centerOfController = getCoordinatesOfElementCenter(nearestController.menuView.htmlElement);

            console.log(x, centerOfController);
            
            if (x < centerOfController.x) {
                if (y < centerOfController.y) {
                    nearestController.insertControllerBefore(this);
                } else {
                    nearestController.insertControllerAfter(this);
                }
            } else {
                nearestController.add(this);
            }

        })
    }

    public insertControllerAfter(controller: MenuController) {
        this.menuView.insertViewAfter(controller.menuView);
        this.dataModel.insertModelAfter(controller.dataModel);
    }
    public insertControllerBefore(controller: MenuController) {
        this.menuView.insertViewBefore(controller.menuView);
        this.dataModel.insertModelBefore(controller.dataModel);
    }

    private addDragEvent() {
        this.menuView.htmlElement.addEventListener('drag', (ev) => {
            ev.stopPropagation();
        });
    }

    private memoize() {
        allMenuControllers.push(this);
    }
}