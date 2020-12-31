import { List } from "../../interfaces/List";
import { ArrayListElement } from "../ArrayListElement";
import { CustomElement } from "../CustomElement";

const menuViewInstances: MenuView[] = [];

export class MenuView extends CustomElement<'li'> implements List<MenuView> {
    public readonly labelElement: HTMLButtonElement = document.createElement('button');    
    private readonly arrayList: ArrayListElement<MenuView> = new ArrayListElement<MenuView>();
    
    public set label(label: string) {
        this.labelElement.textContent = label;
    }
    public get label() {
        return this.labelElement.textContent!;
    }

    public get(index: number): MenuView {
        return this.arrayList.get(index);
    }
    public set(index: number, value: MenuView): void {
        this.arrayList.set(index, value);
    }

    constructor(label?: string) {
        super('li');

        this.htmlElement.appendChild(this.labelElement);
        this.htmlElement.appendChild(this.arrayList.htmlElement);

        this.label = label ?? '';

        this.memoizeInstance();
    }

    public add(view: MenuView): void;
    public add(view: MenuView, index: number): void;
    public add(view: MenuView, index?: number): void {
        // don't fight with the type system. overloading is working weirdly
        this.arrayList.add(view, index!); 
    }

    public remove(view: MenuView): void;
    public remove(index: number): void;
    public remove(predicate: number | MenuView): void {
        // don't fight with the type system on this. overloading is working weirdly
        this.arrayList.remove(predicate as number);
    }

    private memoizeInstance() {
        menuViewInstances.push(this);
    }
}