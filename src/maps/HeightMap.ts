import { Serializable } from "../interfaces/Serializable";

export class HeightMap implements Map<number, number>, Serializable {
    private heightMap: { [key: number]: number } = {};

    public [Symbol.iterator](): IterableIterator<[number, number]> { return this.entries(); }
    public [Symbol.toStringTag]: string;

    public get size(): number {
        return Object.keys(this.heightMap).length;
    }
    
    public clear(): void {
        for (const key of Object.keys(this.heightMap) ) {
            this.delete(parseInt(key));
        }
    }
    public delete(key: number): boolean {
        return delete this.heightMap[key];
    }
    public forEach(callbackfn: (value: number, key: number, map: Map<number, number>) => void, thisArg?: any): void {
        for (const key of Object.keys(this.heightMap))
            Function.prototype.call(callbackfn, thisArg, this.heightMap[parseInt(key)], key, this);
    }
    public get(key: number): number | undefined {
        return this.heightMap[key];
    }
    public has(key: number): boolean {
        return this.heightMap.hasOwnProperty(key);
    }
    public set(key: number, value: number): this {
        this.heightMap[key] = value;
        return this;
    }
    public entries(): IterableIterator<[number, number]> {
        const map = this;
        const keys = Object.keys(this.heightMap);
        let index = 0;
        return {
            [Symbol.iterator]() { 
                return this;
            },
            next(): IteratorResult<[number, number], any> {
                const key = parseInt(keys[index++]);
                const value = map.get(key)!;
                return {
                    value: [key,  value],
                    done: index > map.size,
                }
            }
        }
    }
    public keys(): IterableIterator<number> {
        const map = this;
        const keys = Object.keys(this.heightMap);
        let index = 0;
        return {
            [Symbol.iterator]() { 
                return this;
            },
            next(): IteratorResult<number, any> {
                const key = parseInt(keys[index++]);
                return {
                    value: key,
                    done: index > map.size,
                }
            }
        }
    }
    public values(): IterableIterator<number> {
        const map = this;
        const keys = Object.keys(this.heightMap);
        let index = 0;
        return {
            [Symbol.iterator]() { 
                return this;
            },
            next(): IteratorResult<number, any> {
                const key = parseInt(keys[index++]);
                const value = map.get(key)!
                return {
                    value: value,
                    done: index > map.size,
                }
            }
        }
    }
    public serialize(): string {
        return JSON.stringify(this.heightMap);
    }
}