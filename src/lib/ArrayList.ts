export class ArrayList<T> {
    private arraylist: T[];

    public get(index: number): T {
        return this.arraylist[index];
    }

    public set(index: number, value: T): T {
        this.errorOnIndexOutOfRange(index);
        if (this.arraylist[index] === undefined)
            this.accessableLength++;
        this.arraylist[index] = value;
        return value;
    }
    /**
     * 
     * @param array an array to copy from
     */
    constructor(array: T[]);
    /**
     * 
     * @param size The amount of memory initially allocated
     */
    constructor(size: number);
    constructor(predicate?: number | T[]) {
        if (predicate === undefined) {
            this.arraylist = [];
        } else if (typeof predicate === 'number') {
            this.arraylist = new Array<T>(predicate);            
        } else {
            this.arraylist = predicate.slice(0);
            this.accessableLength = predicate.length;
        }
    }
    private accessableLength: number = 0;
    public get size() {
        return this.accessableLength;
    }

    public add(e: T, index: number): T;
    public add(e: T): T;
    public add(e: T, index: number = this.size): T {
        this.errorOnIndexOutOfRange(index);
        if (this.arraylist[index] === undefined)
            this.arraylist[index] = e;
        else
            this.arraylist.splice(index, 0, e);
        this.accessableLength++;
        return e;
    }

    public remove(index: number): T;
    public remove(e: T): T;
    public remove(predicate: T | number) {
        // base case
        if (typeof predicate === 'number') {
            this.errorOnIndexOutOfRange(predicate);
            this.accessableLength--;
            return this.arraylist.splice(predicate, 1)[0];
        // non base case
        } else {
            const index = this.indexOf(predicate);
            return this.remove(index);
        }
    }
    public indexOf(e: T) {
        return this.arraylist.indexOf(e);
    }

    public [Symbol.iterator]() {
        const length = this.size;
        const ar = this.arraylist;
        let i = 0;
        
        return {
            next() {
                return {
                    value: ar[i],
                    done: i++ === length,
                }
            }
        }
    }
    public forEach(callbackfn: (value: T, index: number, arraylist: ArrayList<T>) => void, thisArg?: any): void {
        for (let i = 0; i < this.size; i++)
            callbackfn.call(thisArg, this.get(i), i, this);
    }
    
    private errorOnIndexOutOfRange(index: number): never | void {
        if (this.indexOutOfRange(index))
            throw new RangeError(`Index ${index} is out of range`);
    }
    private indexOutOfRange(index: number): boolean {
        return !this.indexInRange(index);
    }
    private indexInRange(index: number): boolean {
        return 0 <= index && index <= this.size;
    }
    
}