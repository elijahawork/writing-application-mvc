import { posix } from "path";
import { CustomElement } from "../CustomElement";
import { Caret } from "./Caret";
import { TextLine } from "./TextLine";
import { Coordinate } from "../../types/Coordinate";

const NUM_LINES = 5;

const WAIT_TIME = 900;
//for now we only have one TextArea object
export class TextArea extends CustomElement<'div'> {
    //public spanList: Array<HTMLElementTagNameMap['span']>;
    public spanList: Array<TextLine>;
    //for now we append one <br> between each consecutive span
    public spanMaxID: number;

    x: number;
    y: number;
    caret: Caret;
    constructor(x: number) {
        super('div', 'textarea');
        this.spanList = new Array();
        for (let i=0; i<NUM_LINES; i++) {
        this.addLine('Lorem ipsum dolor sit amet');
        }
        this.removeLine(4);
        this.addLine("Testing");

        this.spanMaxID = -1;

        this.x = 0;
        this.y = 0;
        this.caret = new Caret();
        // const el = document.createElement('span');
        // el.innerHTML = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis lorem eleifend, ornare augue non, posuere leo. Mauris rutrum a diam eu dapibus. Aliquam tortor nisi, imperdiet quis libero sit amet, efficitur faucibus lorem. Fusce porta a erat sit amet ultrices. Proin ac luctus leo. Suspendisse massa odio, facilisis in lacinia vitae, varius vel est. Pellentesque interdum nulla nec placerat placerat. Quisque sodales leo eget dapibus dapibus. Phasellus hendrerit euismod gravida. Sed at accumsan justo, et imperdiet nisi. Sed venenatis rhoncus porta. Fusce tristique consequat nisl non dignissim. Ut semper eleifend nibh at egestas. Fusce eu tellus a dolor tempus tristique nec tincidunt eros. Nam egestas malesuada ipsum ut semper. Maecenas dictum non justo in aliquet.';
        // this.htmlElement.appendChild(el);
        this.htmlElement.appendChild(this.caret.htmlElement);
        //this.htmlElement.addEventListener("click", () => this.clickTest);
        
        //this.htmlElement.addEventListener("click", (ev) => this.click(ev));

        const debug = document.createElement('p');
        debug.innerHTML = 'x:'+this.x+' , y:'+this.y;
        debug.className = 'debug';
        //not necessary but later on we can decide to make debug hidden
        debug.style.visibility = 'visible';

        this.htmlElement.appendChild(debug);
    }

    public addLine(line: string) {
        const spanListLen = this.spanList.length;
        this.spanMaxID++;

        const curSpan = new TextLine(line);
        curSpan.htmlElement.addEventListener("click", (ev) => this.click(ev));
        curSpan.htmlElement.id = "line"+this.spanMaxID;
        //curSpan.id = 'span'+spanListLen;
        if (spanListLen > 0) {
            this.htmlElement.appendChild(document.createElement('br'));
        }
        
        this.htmlElement.appendChild(curSpan.htmlElement);
        this.spanList.push(curSpan);
    }

    public removeLine(ind:number =this.spanList.length-1) {
        //remove
        //NOTE: For now this function does not change the ids of the span line elements found after the indth span line element

        //childList will contain non-line elements such as the debug and cursor
        //but these non-line elements should be found exclusively at the end of childList
        const childList = this.htmlElement.children;
        for (let i=0; i<childList.length; i++) {
            console.log("childList["+i+"]="+childList[i].tagName);
        }
        childList[2*ind-1].remove();
        childList[2*ind-1].remove();
        this.spanList.splice(ind, 1);

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

       const ele = this.caret.htmlElement;
       //console.log("updateElements() being run now");
       //ele?.setAttribute('style', 'opacity: 0');
       var cursor:boolean = true;
       
       setInterval(function() {
           if (cursor) {
               ele?.setAttribute('style', 'opacity: 0');
               cursor = false;
           } else {
               ele?.setAttribute('style', 'opacity: 1');
               cursor = true;
           }
           //console.log("setInterval being run, cursor="+cursor);
       }, WAIT_TIME);
        
       
       //window.requestAnimationFrame(() => this.updateElements);
    }
    /*
    public click(ev: MouseEvent) {
        this.x = ev.clientX;
        this.y = ev.clientY;
    }
    */

    public updateCursor(target: HTMLElement, pos:any) {
        console.log("updateCursor"+pos);
        //create a temp div (if debug mode then visible else invisible)
        //and gradually add characters from the target span left to right
        //until temp div's .right x coord first exceeds or equals pos.x

        //very big brain
        
        //find which ind in spanList represents the target element
        
        //target.style.position = 'relative';
        
        const tempDiv = document.createElement('span');
        tempDiv.style.position = 'absolute';
        tempDiv.style.top = '0px';
        tempDiv.style.left = '0px';
        tempDiv.innerHTML = target.innerHTML.substring(0, 10);
        target.appendChild(tempDiv);
        //this.htmlElement.appendChild(tempDiv);
    }

    public click(ev: MouseEvent) {
        console.log("CLICK function called");
        console.log("this="+this+", ev.target="+ev.target);
        
        this.x = ev.clientX;
        this.y = ev.clientY;

        //this.updateElements();
        //update all elements that may change due to events
        const debug = document.querySelector(".debug");
        const posi = this.pos;
        //console.log("this.className="+this.className);
        //console.log("posi="+posi+"posi.x="+posi.x+"posi.y="+posi.y);
        const b = this.pos;
        if (posi != null && posi.y != undefined && posi.x != undefined) {
            console.log("this.pos="+posi.y+","+posi.x);
            const offset = {x: this.x-posi.x, y: this.y-posi.y};
            //console.log("within 1st if statement");
            if (debug != null) {

                debug.innerHTML = 'x:'+(Math.round(offset.x))+' , y:'+(Math.round(offset.y));
                debug?.setAttribute("style", "top:"+(offset.y)+"px; left:"+(offset.x)+"px");
            }

            //update the cursor
            if (ev.target instanceof HTMLElement) {
                console.log("ev.target is an HTMLElement. ev.target.tagName="+ev.target.tagName+" ev.target.className="+ev.target.className);
                if (ev.target.tagName === 'SPAN' && ev.target.className === 'text-line') {
                    this.updateCursor(ev.target, offset);
                }
            }
        }


    }
}