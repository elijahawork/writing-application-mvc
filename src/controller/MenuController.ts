import { DataModel } from "../model/DataModel";
import { MenuView } from "../view/menu/MenuView";

export class MenuController {
    menuView: MenuView;
    dataModel: DataModel;

    constructor(menuView: MenuView, dataModel: DataModel) {
        this.menuView = menuView;
        this.dataModel = dataModel;
    }
}