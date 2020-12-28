import { List } from "../interfaces/List";
import { CustomElement } from "./CustomElement";

export class ArrayListElement<T extends CustomElement<'li'>> extends CustomElement<'ul'> implements List<T> {
    private internalArray: T[] = [];

    public get length() {
        return this.internalArray.length;
    }

    constructor() {
        super('ul');
    }

    public add(element: T, index: number): void;
    public add(element: T): void;
    public add(element: T, index?: number): void {
        this.errorOnAlreadyRenderedElement(element);
        if (index === undefined || index === this.length) {
            this.internalArray.push(element);
        } else {
            this.insertElementAtIndex(element, index);
        }
        this.reloadDOM();
    }
    private errorOnAlreadyRenderedElement(element: T) {
        if (element.htmlElement.parentElement) 
            throw new Error('Rendered element may not be duplicated in an ArrayListElement');
    }
    private insertElementAtIndex(element: T, index: number) {
        this.errorOnOutOfBoundsIndex(index);
        this.internalArray.splice(index, 0, element);
        this.reloadDOM();    
    }

    public remove(index: number): void;
    public remove(element: T): void;
    public remove(predicate: number | T): void {
        if (typeof predicate === 'number') {
            this.removeIndex(predicate);
        } else {
            this.removeElement(predicate);
        }
        this.reloadDOM();
    }

    private removeElement(element: T) {
        const index = this.indexOf(element);
        this.errorOnOutOfBoundsIndex(index);
        this.removeIndex(index);
    }
    private indexOf(element: T) {
        return this.internalArray.indexOf(element);
    }
    private removeIndex(index: number) {
        this.errorOnOutOfBoundsIndex(index);
        this.internalArray.splice(index, 1);
    }
    private errorOnOutOfBoundsIndex(index: number) {
        if (this.indexOutOfBounds(index))
            throw new Error(`Error, ArrayListElement index "${index}" is out of bounds`);        
    }
    private indexOutOfBounds(index: number) {
        return !this.indexInBounds(index);
    }
    private indexInBounds(index: number) {
        return 0 <= index && index < this.length;
    }

    private reloadDOM() {
        this.removeAllHTMLChildElements();
        this.addAllInteralArrayHTMLElementChildren();
    }
    private removeAllHTMLChildElements() {
        Array.from(this.htmlElement.children).forEach(child => child.remove());
    }
    private addAllInteralArrayHTMLElementChildren() {
        this.internalArray.forEach(customElement => this.htmlElement.appendChild(customElement.htmlElement));
    }
}