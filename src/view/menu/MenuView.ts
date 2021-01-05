import { List } from "../../interfaces/List";
import { ArrayListElement } from "../ArrayListElement";
import { CustomElement } from "../CustomElement";

const menuViewInstances: MenuView[] = [];

export class MenuView extends CustomElement<'li'> implements List<MenuView> {
    public readonly labelElement: HTMLButtonElement = document.createElement('button');    
    private readonly arrayList: ArrayListElement<MenuView> = new ArrayListElement<MenuView>();
    public parent: MenuView | null = null;
    
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
        value.parent = this;
    }

    constructor(label?: string) {
        super('li');

        this.htmlElement.appendChild(this.labelElement);
        this.htmlElement.appendChild(this.arrayList.htmlElement);

        this.label = label ?? '';

        this.memoizeInstance();
    }

    public insertViewBefore(view: MenuView) {
        view.parent?.remove(view);
        if (this.parent)
            this.parent.arrayList.add(view, this.parent.arrayList.indexOf(this));
        else
            throw new Error('Cannot perform operation on orphan.')
    } 
    public insertViewAfter(view: MenuView) {
        view.parent?.remove(view);
        if (this.parent) {
            view.parent?.remove(view);
            this.parent.arrayList.add(view, this.parent.arrayList.indexOf(this) + 1)
        } else {
            throw new Error('Cannot perform operation on orphan.');
        }
    }

    public add(view: MenuView): void;
    public add(view: MenuView, index: number): void;
    public add(view: MenuView, index?: number): void {
        if (index === undefined)
            this.arrayList.add(view);
        else
            this.arrayList.add(view, index);
        view.parent = this;
    }

    public remove(view: MenuView): void;
    public remove(index: number): void;
    public remove(predicate: number | MenuView): void {
        if (typeof predicate === 'number') {
            const view = this.get(predicate);
            view.htmlElement.remove();
            this.arrayList.remove(view);
            view.parent = null;
        } else {
            predicate.htmlElement.remove();
            this.arrayList.remove(predicate);
            predicate.parent = null;
        }
    }

    private memoizeInstance() {
        menuViewInstances.push(this);
    }
}