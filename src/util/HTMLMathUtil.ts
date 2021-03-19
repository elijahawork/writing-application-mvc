export namespace HTMLMathUtil {
  /**
   *
   * @param e is the HTML element
   * @returns a tuple in the form of [x, y]
   */
  export function getCenterOfElement<T extends keyof HTMLElementTagNameMap>(
    e: HTMLElementTagNameMap[T]
  ): [number, number] {
    const rect = e.getBoundingClientRect();
    return [rect.x + rect.width / 2, rect.y + rect.height / 2];
  }
}
