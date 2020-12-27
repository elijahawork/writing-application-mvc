import { CustomElement } from "../CustomElement";

const menuViewInstances: MenuView[] = [];

export class MenuView extends CustomElement<'li'> {
    public readonly labelElement: HTMLButtonElement = document.createElement('button');
    private readonly listElement: HTMLUListElement = document.createElement('ul');

    private parent: MenuView | null = null;
    private children: MenuView[] = [];

    constructor(label?: string) {
        super('li');

        this.htmlElement.appendChild(this.labelElement);
        this.htmlElement.appendChild(this.listElement);

        this.label = label ?? '';

        menuViewInstances.push(this);
    }
    
    public set label(label: string) {
        this.labelElement.textContent = label;
    }
    public get label() {
        return this.labelElement.textContent!;
    }

    public push(menuView: MenuView) {
        this.adopt(menuView);
        this.children.push(menuView);
        this.reloadDOM();
    
    }
    public insert(menuView: MenuView, index: number) {
        this.adopt(menuView);
        this.children.splice(index, 0, menuView);
        this.reloadDOM();
    }
    public remove(menuView: MenuView) {
        this.orphanize(menuView);
        this.reloadDOM();
    }
    public placeAfter(menuView: MenuView) {
        const placementWithinParent = this.getIndexWithinParent();

        this.parent!.insert( menuView, placementWithinParent + 1);

        this.reloadDOM();
    }
    public placeBefore(menuView: MenuView) {
        const placementWithinParent = this.getIndexWithinParent();

        this.parent!.insert( menuView, placementWithinParent);

        this.reloadDOM();
    }
    public set(menuView: MenuView, index: number) {
        this.children[index] = menuView;
        this.reloadDOM();
    }
    public get(index: number): MenuView {
        return this.children[index];
    }

    private adopt(menuView: MenuView) {
        this.orphanize(menuView);
        menuView.parent = this;
    }
    private orphanize(menuView: MenuView) {
        if (menuView.parent) {
            menuView.parent.removeMenuViewFromChildrenArray(menuView);
            menuView.parent = null;
        }
    }
    private getIndexWithinParent() {
        if (!this.parent)
            throw new Error('Cannot be a sibling of an independent node');

        const placementWithinParent = this.parent.children.indexOf(this);
        return placementWithinParent;
    }
    private removeMenuViewFromChildrenArray(menuView: MenuView) {
        const index = this.children.indexOf(menuView);
        this.children.splice(index, 1);
    }
    private reloadDOM() {
        this.removeAllHTMLChildren();
        this.addAllMenuViewChildren();
    }   
    private addAllMenuViewChildren() {
        this.children.forEach(child => {
            this.listElement.appendChild(child.htmlElement);
        });
    }
    private removeAllHTMLChildren() {
        this.listElement.childNodes.forEach(child => {
            child.remove();
        });
    }
}