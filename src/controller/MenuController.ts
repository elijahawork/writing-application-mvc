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

export class MenuController {
    public readonly menuView: MenuView;
    public readonly dataModel: DataModel;

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
        })
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