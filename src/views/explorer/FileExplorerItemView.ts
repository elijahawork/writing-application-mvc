import { ButtonView } from "../ButtonView";
import { View } from "../View";

export class FileExplorerView extends View<'li'> {
    public readonly label: ButtonView;
    
    constructor(label: string, id?: string) {
        super('li', id, 'file-explorer-view');
        this.label = this.addChild(
            new ButtonView(label)
        );
    }
}