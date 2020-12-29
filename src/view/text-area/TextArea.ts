import { CustomElement } from "../CustomElement";

//for now we only have one TextArea object
export class TextArea extends CustomElement<'div'> {
    x: number;
    y: number;

    constructor(x: number) {
        super('div', 'textarea');
        this.x = x;
        this.y = 0;
        const el = document.createElement('span');
        el.innerHTML = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis lorem eleifend, ornare augue non, posuere leo. Mauris rutrum a diam eu dapibus. Aliquam tortor nisi, imperdiet quis libero sit amet, efficitur faucibus lorem. Fusce porta a erat sit amet ultrices. Proin ac luctus leo. Suspendisse massa odio, facilisis in lacinia vitae, varius vel est. Pellentesque interdum nulla nec placerat placerat. Quisque sodales leo eget dapibus dapibus. Phasellus hendrerit euismod gravida. Sed at accumsan justo, et imperdiet nisi. Sed venenatis rhoncus porta. Fusce tristique consequat nisl non dignissim. Ut semper eleifend nibh at egestas. Fusce eu tellus a dolor tempus tristique nec tincidunt eros. Nam egestas malesuada ipsum ut semper. Maecenas dictum non justo in aliquet.';
        this.htmlElement.appendChild(el);
        this.htmlElement.addEventListener("click", this.clickTest);
        const debug = document.createElement('p');
        debug.innerHTML = 'x:'+this.x+' , y:'+this.y;
        debug.className = 'debug';
        //not necessary but later on we can decide to make debug hidden
        debug.style.visibility = 'visible';

        this.htmlElement.appendChild(debug);
    }

    public getX() {
        return this.x;
    }

    public getY() {
        return this.y;
    }

    public updateElements() {
        //update all elements that may change due to events
        const debug = document.querySelector(".debug");
        if (debug != null)
        debug.innerHTML = 'x:'+this.x+' , y:'+this.y;
        
    }
    /*
    public click(ev: MouseEvent) {
        this.x = ev.clientX;
        this.y = ev.clientY;
    }
    */

    public clickTest(ev: MouseEvent) {
        console.log("CLICKED");
        this.x = ev.clientX;
        this.y = ev.clientY;

        //this.updateElements();
        //update all elements that may change due to events
        const debug = document.querySelector(".debug");
        const pos = super.getPos();
        
        if (pos != null && pos[0] != undefined && pos[1] != undefined) {
            console.log("this.pos="+pos[0]+","+pos[1]);
            const offset: number[] = [this.y-pos[0], this.x-pos[1]];
            if (debug != null) {
                debug.innerHTML = 'x:'+(Math.round(offset[1]))+' , y:'+(Math.round(offset[0]));
                debug?.setAttribute("style", "top:"+(offset[0])+"px; left:"+(offset[1])+"px");
            }
        }

    }
}

console.log("TESTING. PRINTED FROM INSIDE TEXTAREA.TS");
var text: TextArea = new TextArea(9);
console.log("x=" + text.getX());
