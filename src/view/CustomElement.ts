export abstract class CustomElement<T extends keyof HTMLElementTagNameMap> {
    public readonly htmlElement: HTMLElementTagNameMap[T];
    
    constructor(tagName: T) {
        this.htmlElement = document.createElement(tagName);
    }
}