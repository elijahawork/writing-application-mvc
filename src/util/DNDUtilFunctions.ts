import { Nullable } from '../types/CustomUtilTypes';
import NavigationItem from '../view/NavigationItem';
import { HTMLMathUtil } from './HTMLMathUtil';
import Project from './Project';

export type PlacementLocation = 'before' | 'after' | 'in';

type NearestNavigationItemDistanceY = number;
type NearestNavigationItemDistanceX = number;

export namespace DNDUtilFunctions {
  export namespace Registry {
    // this should keep track of the navigation items
    const navigationItemPropsRegistry: Record<
      Project.StoryDivision.StoryDivisionID,
      NavigationItem
    > = {};

    export function getRegistry(): Record<Project.StoryDivision.StoryDivisionID, NavigationItem> {
      return navigationItemPropsRegistry;
    }

    export function register(navItem: NavigationItem) {
      const navItemID = navItem.props.storyDivision.id;
      console.assert(!navigationItemPropsRegistry[navItemID]);
      navigationItemPropsRegistry[navItem.props.storyDivision.id] = navItem;
    }
  }

  /**
   * @param dx is the displacement on the x axis
   * @param dy is the displacement on the y axis
   */
  function placementLocationFromDisplacement(
    dx: number,
    dy: number
  ): PlacementLocation {
    if (dy < 0) {
      if (dx > 0) return 'in';
      return 'after';
    }
    return 'before';
  }
  /**
   * @param y ist he cursor position at y
   * @param ignore is the navigation item to ignore when iterating so that one does not simply get their own nav item back, this may be useless but
   * @returns the nearest a tuple containing in the form ox [nearest navigation item, distY, distX]
   */
  function getNearestNavAndDisplacement(
    y: number,
    x: number,
    ignore?: NavigationItem
  ): [
    NavigationItem,
    NearestNavigationItemDistanceX,
    NearestNavigationItemDistanceY
  ] {
    let minimumYDisplacement = Number.NEGATIVE_INFINITY;
    let nearestNavItem: Nullable<NavigationItem> = null;
    let xDisplacement = 0;
    for (const navItem of Object.values(Registry.getRegistry())) {
      if (navItem === ignore) continue;
      console.assert(navItem.labelRef.current);

      // find the center of the label
      const [labelCenterX, labelCenterY] = HTMLMathUtil.getCenterOfElement(
        navItem.labelRef.current!
      );

      // we want to compare scalar quantities
      // so that we get the closest one
      // but it's not affected by whether or not
      // the cursor is above or below
      // it is, however, good to keep track of the
      // scalar as it might come in handy later
      // if this function is expanded upon

      // scalar quantity is unsigned
      // vector quantity is signed
      // assuming y and yr are both positive
      const prevDistScalar = Math.abs(minimumYDisplacement);
      // the order is important because if we want the negative value to indicate
      // that the cursor is "below" the label, then it must be acknowledged that
      // as the cursor goes further down the screen it gets bigger
      const queryDistVector = labelCenterY - y;
      const queryDistScalar = Math.abs(queryDistVector);
      const queryXDistScalar = x - labelCenterX;

      if (queryDistScalar < prevDistScalar) {
        minimumYDisplacement = queryDistVector;
        nearestNavItem = navItem;
        xDisplacement = queryXDistScalar;
      }
    }

    // there should always be an element nearby, but if there is not, then error out because then an item may not be placed
    // this is not the best way to handle this but right now it's the easiest
    if (!nearestNavItem) throw new Error(`There are no near elements`);
    return [nearestNavItem, xDisplacement, minimumYDisplacement];
  }
  type NavigationDoCallbacks = {
    before(this: NavigationItem, nearestNavigationItem?: NavigationItem): void;
    after(this: NavigationItem, nearestNavigationItem?: NavigationItem): void;
    in(this: NavigationItem, nearestNavigationItem?: NavigationItem): void;
  };
  /**
   * @param x is the cursor x position
   * @param y is the cursor y position
   * @param callbacks is an object of functions to perform given the result of where the item should be placed. Each function is bound to the context of its class
   * @param ignore is an optional NavItem to ignore
   */
  export function inRelationToNearestNavDo(
    x: number,
    y: number,
    callbacks: NavigationDoCallbacks,
    ignore?: NavigationItem
  ): NavigationItem {
    const [nearestNav, dx, dy] = getNearestNavAndDisplacement(x, y, ignore);

    const local = placementLocationFromDisplacement(dx, dy);    

    // call the function with the context of the NavItem
    callbacks[local].call(nearestNav, nearestNav);

    return nearestNav;
  }
}
