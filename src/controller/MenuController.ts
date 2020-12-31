import { DataModel } from "../model/DataModel";
import { MenuView } from "../view/menu/MenuView";

const allMenuControllers: MenuController[] = [];

type Coordinate = { x: number, y: number };

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

    constructor(menuView: MenuView, dataModel: DataModel) {
        allMenuControllers.push(this);
        this.menuView = menuView;
        this.dataModel = dataModel;

        this.menuView.labelElement.addEventListener('mousedown', (ev) => {
            ev.stopPropagation();
            this.menuView.htmlElement.draggable = true;
        });
        this.menuView.htmlElement.addEventListener('dragend', (ev) => {
            ev.stopPropagation();
            this.menuView.htmlElement.draggable = false;
            const { clientX: x, clientY: y } = ev;
            const nearestController = getNearestMenuController({ x, y }, this);
            nearestController.push(this);

        })
        this.menuView.htmlElement.addEventListener('drag', (ev) => {
            ev.stopPropagation();
        });
    }

    
    public static from(id: number, position: number, label: string) {
        return new MenuController(new MenuView(label), new DataModel(id, position, label));
    }
    public push(menuController: MenuController) {
        console.log('push');
        
        this.menuView.push(menuController.menuView);
        this.dataModel.push(menuController.dataModel);
    }
    public insert(menuController: MenuController, index: number) {
        this.menuView.insert(menuController.menuView, index);
        this.dataModel.insert(menuController.dataModel, index);
    }
    public remove(menuController: MenuController) {
        this.menuView.remove(menuController.menuView);
        this.dataModel.remove(menuController.dataModel);
    }
}