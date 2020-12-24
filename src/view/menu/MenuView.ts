import { CustomElement } from "../CustomElement";

const menuViewInstances: MenuView[] = [];

export class MenuView extends CustomElement<'li'> {
    public readonly labelElement: HTMLButtonElement = document.createElement('button');
    private readonly listElement: HTMLUListElement = document.createElement('ul');

    public parent: MenuView | null = null;
    private children: MenuView[] = [];

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

    public push(menuView: MenuView) {
        this.listElement.appendChild(menuView.htmlElement);
    }
    
    public insert(menuView: MenuView, index: number) {
        this.listElement.children[index].insertAdjacentElement('beforebegin', menuView.htmlElement);
    }

    public get(index: number): MenuView {
        return this.listElement;
    }
    public set(index: number, menuView: MenuView) {
        this.remove(this.get(index));
        this.insert(menuView, index - 1);
    }


    
    public remove(menuView: MenuView) {
        menuView.htmlElement.remove();
    }
}