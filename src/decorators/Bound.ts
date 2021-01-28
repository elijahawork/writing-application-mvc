/**
 * Binds a function's "this" context to its containing class
 */
export default function Bound(constr: any, key: string, info: PropertyDescriptor) {
    info.value = (info.value as Function).bind(constr);
}