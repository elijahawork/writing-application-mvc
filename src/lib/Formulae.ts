import { Coordinate } from "../types/Coordinate";

export namespace Formulae {
    /**
     * @param coordinate1 The first coordinate
     * @param coordinate2 The second coordinate
     * @description Returns the distance between two points using Pythagorean Theorem
     */
    export function distance2D(coordinate1: Coordinate, coordinate2: Coordinate) {
        return Math.sqrt((coordinate1.x - coordinate2.x) ** 2 + (coordinate1.y - coordinate2.y) ** 2);
    }
}