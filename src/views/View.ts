const idMap = new Map<string, View<any>>();

export abstract class View<T extends keyof HTMLElementTagNameMap> {
    protected readonly el: HTMLElementTagNameMap[T];
    public readonly id: string;

    private readonly _children: View<any>[] = [];
    private _parent: View<any> | null = null;

    public get parent(): View<any> | null{
        return this._parent;
    } 
    public get children(): View<any>[] {
        return Object.seal(this._children.slice(0));
    }

    public addChild<E extends keyof HTMLElementTagNameMap, R extends View<E>>(child: R): R {
        this._children.push(child);
        child._parent = this;
        this.el.appendChild(child.el);
        return child;
    }
    public removeChild<E extends keyof HTMLElementTagNameMap, R extends View<E>>(child: R): R {
        const index = this._children.indexOf(child);
        this.verifyValidIndex(index);
        this.removeIndex(index);
        child._parent = null;
        child.el.remove();
        return child;
    }
    public insertChildAtIndex<E extends keyof HTMLElementTagNameMap, R extends View<E>>(child: R, index: number): R {
        this._children[index].el.insertAdjacentElement('beforebegin', child.el)
        this._children.splice(index, 0, child);
        child._parent = this;
        return child;
    }
    public attachToHTMLElement(element: Element) {
        element.appendChild(this.el);
    }

    public addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLObjectElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    public addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
        this.el.addEventListener(type, listener, options);
    }

    public removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLObjectElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    public removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void {
        this.el.removeEventListener(type, listener, options);
    }

    constructor(tagName: T, id?: string, className?: string) {
        this.el = document.createElement(tagName);
        this.id = id ?? '';

        this.verifyUniqueID(this.id);

        while (this.IDInvalidOrInUse())
            this.id = generateRandomString();

        if (className)
            this.el.className = className;

        idMap.set(this.el.id, this);
    }

    private removeIndex(index: number) {
        this._children.splice(index, 1);
    }

    private verifyValidIndex(index: number) {
        if (index === -1)
            throw new RangeError(`Element does not exist.`);
    }

    private IDInvalidOrInUse() {
        return !this.id || idMap.has(this.id);
    }

    private verifyUniqueID(id: string | undefined) {
        if (this.id && idMap.has(this.id))
            throw new Error(`Id "${id}" is already in use.`);
    }
}

function generateRandomString(length = 16): string {
    const validSymbols = 'abcdefghijklmnopqrstuvwxyz-123456789'
    let outputString = '';

    for (let i = 0; i < length; i++)
        outputString += randomChar(validSymbols);
    
    return outputString;
}
function randomChar(strFrom: string) {
    return strFrom[Math.floor(Math.random() * strFrom.length)];
}