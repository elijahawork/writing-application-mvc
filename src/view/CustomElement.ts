import { Coordinate } from "../types/Coordinate";

export abstract class CustomElement<T extends keyof HTMLElementTagNameMap> {
    public readonly htmlElement: HTMLElementTagNameMap[T];

    public readonly tagName: string;
    //public clientRect: ClientRect;
    constructor(tagName: T, className?: string) {
        this.tagName = tagName;
        this.htmlElement = document.createElement(tagName);

        if (className)
            this.htmlElement.classList.add(className);
    }

    public get pos() {
        console.log("get pos()");
        const obj = {x: 3, y: 2};
        return obj;
        /*
        const boundingClientRect = this.htmlElement.getBoundingClientRect();
        if (boundingClientRect)
            return { x: boundingClientRect.x, y: boundingClientRect.y };
        
        throw new Error('DOM element not appended. Cannot retrieve BOUNDING_CLIENT_RECT of orphan.');
        */
    }

    get className() {
        console.log("get className()");
        return this.htmlElement.className;
    }
}