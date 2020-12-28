export interface List<T> {
    add(element: T): void;
    add(element: T, index: number): void;

    remove(element: T): void;
    remove(index: number): void;
}