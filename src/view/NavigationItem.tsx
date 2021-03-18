import React, { createRef } from 'react';
import { Nullable } from '../types/CustomUtilTypes';
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
    };

    this.createNewChildDivision = this.createNewChildDivision.bind(this);
    this.removeFromParent = this.removeFromParent.bind(this);
    this.setState = this.setState.bind(this);

    this.makeLabelEditable = this.makeLabelEditable.bind(this);
    this.makeLabelUneditable = this.makeLabelUneditable.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDrag = this.handleDrag.bind(this);

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
    const [navItem, pos] = nearestNavItem(ev.clientY, this);

    this.removeFromParent();

    Project.moveStoryDivisionTo(
      this.props.storyDivision,
      navItem.props.storyDivision
    );

    navItem.setState((state) => ({
      childDivisions: [...state.childDivisions, this.toStoryDivisionTree()],
    }));
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
    const [navItem, pos] = nearestNavItem(ev.clientY, this);

    console.clear();
    console.log({ pos });

    // this is very buggy
    navItem.setState({
      // the y value of the label is always positive
      // a cursor is below an element
      // if its y value is greater than the element
      // because the greater the y value, the further down
      // on the page the element is
      aboutToReceiveBelow: pos < 10,
      aboutToContain: -10 < pos && pos < 10,
      aboutToReceiveAbove: pos < -10,
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

  render() {
    return (
      <li
        className={'navigation-item '}
        draggable={true}
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
            this.state.aboutToReceiveBelow ? 'receive-vis' : 'receive-invis'
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
 * @returns the nearest nav item as its object instance
 */
type NearestNavigationItemDistance = number;
function nearestNavItem(
  y: number,
  ignore?: NavigationItem
): [NavigationItem, NearestNavigationItemDistance] {
  let minY = Number.NEGATIVE_INFINITY;
  let minE: Nullable<NavigationItem> = null;
  for (const navItem of Object.values(navigationItemPropsRegistry)) {
    if (navItem === ignore) continue;
    console.assert(navItem.labelRef.current);

    const yr = navItem.labelRef.current!.getBoundingClientRect().y;

    // we want to compare scalar quantities
    // so that we get the closest one
    // but it's not affected by whether or not
    // the cursor is above or below
    // it is, however, good to keep track of the
    // scalar as it might come in handy later
    // if this function is expanded upon

    // assuming y and yr are both positive
    const prevDistScalar = Math.abs(minY);
    const queryDistVector = y - yr;
    const queryDistScalar = Math.abs(queryDistVector);

    if (queryDistScalar < prevDistScalar) {
      minY = y - yr;
      minE = navItem;
    }
  }

  // there should always be an element nearby, but if there is not, then error out because then an item may not be placed
  // this is not the best way to handle this but right now it's the easiest
  if (!minE) throw new Error(`There are no near elements`);
  return [minE, minY];
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
