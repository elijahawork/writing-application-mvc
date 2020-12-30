import { CustomElement } from "../CustomElement";
import { Caret } from "./Caret";

//for now we only have one TextArea object
export class TextArea extends CustomElement<'div'> {
    public spanList: Array<HTMLElementTagNameMap['span']>;
    
    x: number;
    y: number;
    caret: Caret;
    constructor(x: number) {
        super('div', 'textarea');
        this.spanList = new Array();
        this.addLine('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis lorem eleifend, ornare augue non, posuere leo. Mauris rutrum a diam eu dapibus. Aliquam tortor nisi, imperdiet quis libero sit amet, efficitur faucibus lorem. Fusce porta a erat sit amet ultrices. Proin ac luctus leo. Suspendisse massa odio, facilisis in lacinia vitae, varius vel est. Pellentesque interdum nulla nec placerat placerat. Quisque sodales leo eget dapibus dapibus. Phasellus hendrerit euismod gravida. Sed at accumsan justo, et imperdiet nisi. Sed venenatis rhoncus porta. Fusce tristique consequat nisl non dignissim. Ut semper eleifend nibh at egestas. Fusce eu tellus a dolor tempus tristique nec tincidunt eros. Nam egestas malesuada ipsum et');
        this.x = 0;
        this.y = 0;
        this.caret = new Caret();
        // const el = document.createElement('span');
        // el.innerHTML = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis lorem eleifend, ornare augue non, posuere leo. Mauris rutrum a diam eu dapibus. Aliquam tortor nisi, imperdiet quis libero sit amet, efficitur faucibus lorem. Fusce porta a erat sit amet ultrices. Proin ac luctus leo. Suspendisse massa odio, facilisis in lacinia vitae, varius vel est. Pellentesque interdum nulla nec placerat placerat. Quisque sodales leo eget dapibus dapibus. Phasellus hendrerit euismod gravida. Sed at accumsan justo, et imperdiet nisi. Sed venenatis rhoncus porta. Fusce tristique consequat nisl non dignissim. Ut semper eleifend nibh at egestas. Fusce eu tellus a dolor tempus tristique nec tincidunt eros. Nam egestas malesuada ipsum ut semper. Maecenas dictum non justo in aliquet.';
        // this.htmlElement.appendChild(el);
        this.htmlElement.appendChild(this.caret.htmlElement);
        this.htmlElement.addEventListener("click", this.clickTest);
        const debug = document.createElement('p');
        debug.innerHTML = 'x:'+this.x+' , y:'+this.y;
        debug.className = 'debug';
        //not necessary but later on we can decide to make debug hidden
        debug.style.visibility = 'visible';

        this.htmlElement.appendChild(debug);
    }

    public addLine(line: string) {
        const curSpan = document.createElement('span');
        curSpan.innerHTML = line;
        const spanListLen = this.spanList.length;
        curSpan.id = 'span'+spanListLen;
        this.htmlElement.appendChild(curSpan);
        this.spanList.push(curSpan);
    }

    public run() {
        console.log("running");
        this.run();
    }
    public getX() {
        return this.x;
    }

    public getY() {
        return this.y;
    }

    public updateElements() {
        //update all elements that may change due to events
        
        /*
        const debug = document.querySelector(".debug");
        if (debug != null)
        debug.innerHTML = 'x:'+this.x+' , y:'+this.y;
        */

       const ele = document.querySelector("span.caret");
       var cursor:boolean = true;
       setInterval(function() {
           if (cursor) {
               ele?.setAttribute('style', 'opacity: 0');
               cursor = false;
           } else {
               ele?.setAttribute('style', 'opacity: 1');
               cursor = true;
           }
       }, 1000);

       window.requestAnimationFrame(this.updateElements);
    }
    /*
    public click(ev: MouseEvent) {
        this.x = ev.clientX;
        this.y = ev.clientY;
    }
    */

    public updateCursor(pos: [number, number]) {
        
    }
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
            const offset: [number, number] = [this.y-pos[0], this.x-pos[1]];
            if (debug != null) {
                debug.innerHTML = 'x:'+(Math.round(offset[1]))+' , y:'+(Math.round(offset[0]));
                debug?.setAttribute("style", "top:"+(offset[0])+"px; left:"+(offset[1])+"px");
            }
            //update the cursor
            this.updateCursor(offset);

        }


    }
}