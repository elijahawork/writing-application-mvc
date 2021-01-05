import { Coordinate } from "../types/Coordinate";

export namespace HTMLProcessing {
    export function getCoordinatesOfElementCenter(el: HTMLElement): Coordinate {
        const box = el.getBoundingClientRect();
        return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
    }
}