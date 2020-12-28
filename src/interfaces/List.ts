export interface List<T> {
    get(index: number): T;
    set(index: number, value: T): void;

    add(element: T): void;
    add(element: T, index: number): void;

    remove(element: T): void;
    remove(index: number): void;
}