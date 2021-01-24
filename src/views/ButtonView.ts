import { View } from "./View";

export class ButtonView extends View<'button'> {
    public set text(text: string) {
        this.el.textContent = text;
    }
    public get text() {
        return this.el.textContent!;
    }
    constructor(text: string, id?: string, className?: string) {
        super('button', id, className);
        this.text = text;
    }
}