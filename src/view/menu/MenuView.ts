import { List } from "../../interfaces/List";
import { ArrayList } from "../../lib/ArrayList";
import { ArrayListElement } from "../ArrayListElement";
import { CustomElement } from "../CustomElement";

const menuViewInstances: ArrayList<MenuView> = new ArrayList<>();

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

        this.memoize();
    }

    public insertViewBefore(view: MenuView) {
        // temporary
        view.parent?.remove(view);
        
        if (view.parent) {  
            throw new Error('View not removed from DOM before being placed back down');
        } else {
            this.parent?.add(view, this.parent.indexOf(this));
        }
    }
    public insertViewAfter(view: MenuView) {
        view.parent?.remove(view);
        
        if (view.parent) {
            throw new Error('View not removed from DOM before being placed back down');
        } else {
            this.parent?.add(view, this.parent.indexOf(this) + 1);
        }
    }
    public indexOf(view: MenuView) {
        return this.arrayList.indexOf(view);
    }

    public add(view: MenuView): void;
    public add(view: MenuView, index: number): void;
    public add(view: MenuView, index?: number): void {
        view.parent?.remove(view);
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
            this.removeViewByIndex(predicate);
        } else {
            this.removeView(predicate);
        }
    }
    private removeView(view: MenuView) {
        view.htmlElement.remove();
        this.disown(view);
    }
    private disown(view: MenuView) {
        view.parent = null;
        this.arrayList.remove(view);
    }
    private removeViewByIndex(index: number) {
        this.removeView(this.get(index));
    }

    private memoize() {
        menuViewInstances.add(this);
    }
    public delete() {
        this.htmlElement.remove();
        menuViewInstances.remove(this);
    }
}