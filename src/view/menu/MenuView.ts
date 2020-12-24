import { CustomElement } from "../CustomElement";

const menuViewInstances: MenuView[] = [];

export class MenuView extends CustomElement<'li'> {
    public readonly labelElement: HTMLButtonElement = document.createElement('button');
    private readonly listElement: HTMLUListElement = document.createElement('ul');

    private children: MenuView[] = [];

    constructor(label?: string) {
        super('li');

        this.htmlElement.appendChild(this.labelElement);

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
        this.children.push(menuView);
        this.reloadDOM();
    }
    
    public insert(menuView: MenuView, index: number) {
        this.children.splice(index, 0, menuView);
        this.reloadDOM();
    }
    public remove(menuView: MenuView) {
        this.removeMenuViewFromChildrenArray(menuView);
        this.reloadDOM();
    }
    private removeMenuViewFromChildrenArray(menuView: MenuView) {
        const index = this.children.indexOf(menuView);
        this.children.splice(index, 1);
    }

    public set(menuView: MenuView, index: number) {
        this.children[index] = menuView;
        this.reloadDOM();
    }
    public get(index: number): MenuView {
        return this.children[index];
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
        this.listElement.childNodes.forEach(child => child.remove());
    }
}