import { CustomElement } from "../CustomElement";
import { FolderMenuView } from "./FolderMenuView";

export abstract class MenuView extends CustomElement<'li'> {
    public readonly labelElement: HTMLButtonElement = document.createElement('button');
    public parent: FolderMenuView | null = null;
    constructor(label?: string) {
        super('li');

        this.htmlElement.appendChild(this.labelElement);

        this.label = label ?? '';
    }
    
    public set label(label: string) {
        this.labelElement.textContent = label;
    }
    public get label() {
        return this.labelElement.textContent!;
    }
}