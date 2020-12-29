export abstract class CustomElement<T extends keyof HTMLElementTagNameMap> {
    public readonly htmlElement: HTMLElementTagNameMap[T];
    public htmlElementa: HTMLElementTagNameMap[T];

    public tagName: string;
    public className: string | undefined;
    public pos: [number | undefined, number | undefined];
    //public clientRect: ClientRect;
    constructor(tagName: T, className?: string) {
        this.tagName = tagName;
        this.className = className;

        this.htmlElement = document.createElement(tagName);
        if (className != null)
            this.htmlElement.className = className;
        this.htmlElementa = document.createElement(tagName);
        if (className != null)
            this.htmlElementa.className = className;
            
        this.pos = [undefined, undefined];
    
    }

    public getPos() {
        var strQuery = this.tagName;
        if (this.className) {
            strQuery += "."+this.className;
        }
        const ele = document.querySelector(strQuery);
        if (ele == null) return null;
        console.log("ele="+ele.tagName);
        const clientRect = ele.getBoundingClientRect();
        this.pos = [clientRect.top, clientRect.left];
        return this.pos;
    }
}