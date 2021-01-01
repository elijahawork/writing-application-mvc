import { List } from '../interfaces/List';
export class ArrayList<T> implements List<T> {
    private internalArray: T[] = [];

    get length() {
        return this.internalArray.length;
    }

    // duplicate, nonmodifiable array
    public toArray(): T[] {
        return Array.from(this.internalArray);
    }
    
    public get(index: number): T {
        this.errorOnOutOfBoundsIndex(index);
        return this.internalArray[index];
    }
    public set(index: number, value: T): void {
        this.errorOnOutOfBoundsIndex(index);
        this.internalArray[index] = value;
    }
    
    public add(element: T, index: number): void;
    public add(element: T): void;
    public add(element: T, index?: number): void {
        if (index === undefined || index === this.length) {
            this.internalArray.push(element);
        } else {
            this.insertElementAtIndex(element, index);
        }
    }
  
    public remove(index: number): void;
    public remove(element: T): void;
    public remove(predicate: number | T): void {
        if (typeof predicate === 'number') {
            this.removeIndex(predicate);
        } else {
            this.removeElement(predicate);
        }
    }

    private insertElementAtIndex(element: T, index: number) {
        this.errorOnOutOfBoundsIndex(index);
        this.internalArray.splice(index, 0, element);
    }
    private removeElement(element: T) {
        const index = this.indexOf(element);
        this.errorOnOutOfBoundsIndex(index);
        this.removeIndex(index);
    }
    private indexOf(element: T) {
        return this.internalArray.indexOf(element);
    }
    private removeIndex(index: number) {
        this.errorOnOutOfBoundsIndex(index);
        this.internalArray.splice(index, 1);
    }
    private errorOnOutOfBoundsIndex(index: number) {
        if (this.indexOutOfBounds(index))
            throw new Error(`Error, ArrayListElement index "${index}" is out of bounds`);        
    }
    private indexOutOfBounds(index: number) {
        return !this.indexInBounds(index);
    }
    private indexInBounds(index: number) {
        return 0 <= index && index < this.length;
    }
}