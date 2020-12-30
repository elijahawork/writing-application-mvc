import { CustomElement } from "../CustomElement";

export class TextLine extends CustomElement<'span'> {
    public static readonly TEXT_LINE_CLASS_NAME = 'text-line';

    constructor(textContent?: string) {
        super('span');

        const el = this.htmlElement;
        el.classList.add(TextLine.TEXT_LINE_CLASS_NAME);
    
        this.textContent = textContent ?? '';
    }
    
    set textContent(value: string) {
        this.htmlElement.textContent = value;
    }
    get textContent(): string {
        // always will be assigned
        return this.htmlElement.textContent!;
    }
}