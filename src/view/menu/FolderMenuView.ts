import { MenuView } from "./MenuView";

export class FolderMenuView extends MenuView {
    private containerViews: MenuView[] = [];
    private readonly listElement: HTMLUListElement;

    constructor(label?: string) {
        super(label);
        this.listElement = document.createElement('ul');
        this.htmlElement.appendChild(this.listElement);
    }

    public set(index: number, value: MenuView): void {
        this.containerViews[index] = value;
    }
    public get(index: number): MenuView {
        return this.containerViews[index];
    }
    public insert(index: number, value: MenuView): void {
        this.insertElementAtIndexIntoElement(index, value);
        this.insertValueAtIndexIntoArray(index, value);
    }

    private insertValueAtIndexIntoArray(index: number, value: MenuView) {
        this.containerViews.splice(index, 0, value);
    }

    private insertElementAtIndexIntoElement(index: number, value: MenuView) {
        this.listElement.children[index].insertAdjacentElement('afterend', value.htmlElement);
    }

    public push(value: MenuView): void {
        value.parent = this;
        this.containerViews.push(value);
        this.listElement.appendChild(value.htmlElement);
    }

    public remove(value: MenuView): void {
        const index = this.indexOf(value);
        this.removeIndex(index);
        this.removeMenuViewElement(value);
    }

    private removeMenuViewElement(value: MenuView) {
        this.listElement.removeChild(value.htmlElement);
    }

    public indexOf(value: MenuView) {
        return this.containerViews.indexOf(value);
    }

    private removeIndex(index: number) {
        this.containerViews.splice(index, 1);
    }
}