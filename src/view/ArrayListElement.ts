import { List } from "../interfaces/List";
import { ArrayList } from "./ArrayList";
import { CustomElement } from "./CustomElement";

export class ArrayListElement<T extends CustomElement<'li'>> extends CustomElement<'ul'> implements List<T> {
    private internalArray: ArrayList<T> = new ArrayList<T>();

    public get length() {
        return this.internalArray.length;
    }

    constructor() {
        super('ul');
    }

    public get(index: number): T {
        return this.internalArray.get(index);
    }
    public set(index: number, value: T): void {
        return this.internalArray.set(index, value);
    }

    public add(element: T, index: number): void;
    public add(element: T): void;
    public add(element: T, index?: number): void {
        this.errorOnAlreadyRenderedElement(element);
        // ignore overload complaints
        this.internalArray.add(element, index!);
        this.reloadDOM();
    }
    private errorOnAlreadyRenderedElement(element: T) {
        if (element.htmlElement.parentElement) 
            throw new Error('Rendered element may not be duplicated in an ArrayListElement');
    }
    public remove(index: number): void;
    public remove(element: T): void;
    public remove(predicate: number | T): void {
        // ignore complaints, overloading signature is fine it's just being stupid
        this.internalArray.remove(predicate as number);
        this.reloadDOM();
    }

    private reloadDOM() {
        this.removeAllHTMLChildElements();
        this.addAllInteralArrayHTMLElementChildren();
    }
    private removeAllHTMLChildElements() {
        Array.from(this.htmlElement.children).forEach(child => child.remove());
    }
    private addAllInteralArrayHTMLElementChildren() {
        this.internalArray.toArray().forEach(customElement => this.htmlElement.appendChild(customElement.htmlElement));
    }
}