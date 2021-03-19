import React, { createRef } from 'react';
import { Nullable } from '../types/CustomUtilTypes';
import { HTMLMathUtil } from '../util/HTMLMathUtil';
import Project, { StoryDivisionTree } from '../util/Project';

type StoryDivisionId = number;

// this should keep track of the navigation items
const navigationItemPropsRegistry: Record<StoryDivisionId, NavigationItem> = {};
let lastQuery: Nullable<NavigationItem> = null;

type NavigationItemProps = StoryDivisionTree & {
  parentSetState: Nullable<
    <K extends keyof NavigationItemState>(
      state:
        | ((
            prevState: Readonly<NavigationItemState>,
            props: Readonly<NavigationItemProps>
          ) => Pick<NavigationItemState, K> | NavigationItemState | null)
        | (Pick<NavigationItemState, K> | null),
      callback?: () => void
    ) => void
  >;
};
type NavigationItemState = {
  childDivisions: StoryDivisionTree[];
  disabled: boolean;
  aboutToReceiveAbove: boolean;
  aboutToContain: boolean;
  aboutToReceiveBelow: boolean;
  visible: boolean;
};

let currentlyDragging: NavigationItem[] = [];

class NavigationItem extends React.Component<
  NavigationItemProps,
  NavigationItemState
> {
  public readonly labelRef = createRef<HTMLInputElement>();

  constructor(props: NavigationItemProps) {
    super(props);
    this.state = {
      childDivisions: props.childDivisions,
      disabled: true,
      aboutToContain: false,
      aboutToReceiveAbove: false,
      aboutToReceiveBelow: false,
      visible: true,
    };

    this.createNewChildDivision = this.createNewChildDivision.bind(this);
    this.removeFromParent = this.removeFromParent.bind(this);
    this.setState = this.setState.bind(this);

    this.makeLabelEditable = this.makeLabelEditable.bind(this);
    this.makeLabelUneditable = this.makeLabelUneditable.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    navigationItemPropsRegistry[this.props.storyDivision.id] = this;
  }
  updateNamingChange() {
    console.assert(this.labelRef.current);

    Project.relabelStoryDivision(
      this.props.storyDivision,
      this.labelRef.current!.value
    );
  }
  removeFromParent() {
    console.assert(this.props.parentSetState);
    this.props.parentSetState!((state) => ({
      childDivisions: state.childDivisions.filter(
        (e) => e.storyDivision !== this.props.storyDivision
      ),
    }));
  }

  createNewChildDivision() {
    // create a new story division with this story division as its parent
    const newStoryDivision = Project.generateUntitledStoryDivision(
      this.props.storyDivision.id
    );

    Project.addStoryDivision(newStoryDivision);

    this.setState((state) => ({
      childDivisions: [
        ...state.childDivisions,
        {
          childDivisions: [],
          storyDivision: newStoryDivision,
        },
      ],
    }));
  }
  handleDragEnd(ev: React.DragEvent<HTMLLIElement>) {
    ev.stopPropagation(); // f bubbling in this api
    const [navItem, dy, dx] = getNearestNavAndDisplacement(
      ev.clientY,
      ev.clientX,
      this
    );

    this.removeFromParent();

    Project.moveStoryDivisionTo(
      this.props.storyDivision,
      navItem.props.storyDivision
    );

    navItem.setState((state) => ({
      childDivisions: [...state.childDivisions, this.toStoryDivisionTree()],
    }));

    this.setState({ visible: true });
  }
  private toStoryDivisionTree() {
    return {
      childDivisions: this.props.childDivisions,
      storyDivision: this.props.storyDivision,
    };
  }
  handleDrag(ev: React.DragEvent<HTMLLIElement>) {
    ev.stopPropagation(); // f bubbling in this api
    lastQuery?.setState({
      aboutToContain: false,
      aboutToReceiveAbove: false,
      aboutToReceiveBelow: false,
    });
    const [navItem, dy, dx] = getNearestNavAndDisplacement(
      ev.clientY,
      ev.clientX,
      this
    );

    const loc = placementLocationFromDisplacement(dx, dy);

    navItem.setState({
      aboutToReceiveBelow: loc === 'below',
      aboutToReceiveAbove: loc === 'above',
      aboutToContain: loc === 'in',
    });

    lastQuery = navItem;
  }
  private registerThisAsCurrentlyDragging() {
    currentlyDragging.push(this);
  }
  private unregisterThisAsCurrentlyDragging() {
    currentlyDragging = currentlyDragging.filter((e) => e !== this);
  }

  makeLabelEditable() {
    console.assert(this.labelRef.current);

    this.setState({ disabled: false });
    this.labelRef.current!.focus();
  }
  makeLabelUneditable() {
    this.setState({ disabled: true });
  }
  handleDragStart(ev: React.DragEvent<HTMLLIElement>) {
    ev.stopPropagation();

    console.clear();
    console.log("Oh my lordy, I can't done believe this is happening");

    // this is so that the drag event doesn't stop and the
    // drag visual doesn't disappear
    setTimeout(() => this.setState({ visible: false }), 0);
  }
  render() {
    return (
      <li
        className={`navigation-item ${this.state.visible ? '' : 'nav-vis'}`}
        draggable={true}
        onDragStart={this.handleDragStart}
        onDrag={this.handleDrag}
        onDragEnd={this.handleDragEnd}
      >
        <div
          className={
            this.state.aboutToReceiveAbove ? 'receive-vis' : 'receive-invis'
          }
        ></div>
        <div
          className={'navigation-item-modification-wrapper'}
          onDoubleClick={this.makeLabelEditable}
        >
          <button
            onClick={this.createNewChildDivision}
            className={'navigation-item-modification-button'}
          >
            +
          </button>
          <button className={'navigation-item-label-button'}>
            <input
              className={
                this.state.aboutToContain ||
                this.state.aboutToReceiveAbove ||
                this.state.aboutToReceiveBelow
                  ? 'selected'
                  : ''
              }
              ref={this.labelRef}
              onBlur={this.makeLabelUneditable}
              onChange={this.updateNamingChange}
              defaultValue={this.props.storyDivision.label}
              disabled={this.state.disabled}
            />
          </button>
          <button
            onClick={this.removeFromParent}
            className={'navigation-item-modification-button'}
          >
            -
          </button>
        </div>

        <div
          className={
            this.state.aboutToReceiveBelow
              ? 'receive-vis'
              : this.state.aboutToContain
              ? 'contain-vis'
              : 'receive-invis'
          }
        ></div>
        <ul>
          {this.state.childDivisions
            .sort(compareStoryDivisionTrees)
            .map((child, key) => (
              <NavigationItem
                childDivisions={child.childDivisions}
                storyDivision={child.storyDivision}
                key={key}
                parentSetState={this.setState}
              />
            ))}
        </ul>
      </li>
    );
  }
}

export default NavigationItem;
/**
 *
 * @param y ist he cursor position at y
 * @param ignore is the navigation item to ignore when iterating so that one does not simply get their own nav item back, this may be useless but
 * @returns the nearest a tuple containing in the form ox [nearest navigation item, distY, distX]
 */
type NearestNavigationItemDistanceY = number;
type NearestNavigationItemDistanceX = number;
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
  for (const navItem of Object.values(navigationItemPropsRegistry)) {
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

function compareStoryDivisionTrees(
  storyDivisionA: StoryDivisionTree,
  storyDivisionB: StoryDivisionTree
) {
  return (
    storyDivisionA.storyDivision.position -
    storyDivisionB.storyDivision.position
  );
}

type PlacementLocation = 'above' | 'below' | 'in';
/**
 *
 * @param dx is the displacement on the x axis
 * @param dy is the displacement on the y axis
 */
function placementLocationFromDisplacement(
  dx: number,
  dy: number
): PlacementLocation {
  if (dy < 0) {
    if (dx > 0) return 'in';
    return 'below';
  }
  return 'above';
}
