import React, { createRef } from 'react';
import { inspect } from 'util';
import IStoryDivisionSchema from '../schema/IStoryDivisionSchema';
import { Nullable } from '../types/CustomUtilTypes';
import Project from '../util/Project';
import { GlobalAppState, GlobalSetAppState } from './App';
import {
  globalNavigationPaneState as GlobalNavigationPaneState,
  GlobalSetNavigationPaneState,
} from './NavigationPane';

const navigationList: Record<number, NavigationItem> = {};

let currentlyMoving: Nullable<NavigationItem> = null;

export type StoryDivisionWChildren = {
  // this is a reference to the schema so that when the schema is updated, so is the
  // information in this object
  storyDivisionPointer: IStoryDivisionSchema;
  children: StoryDivisionWChildren[];
};

type NavigationItemProps = {
  setState: GlobalSetNavigationPaneState;
  appState: GlobalNavigationPaneState;
  storyDivisionStructure: StoryDivisionWChildren;
};
type NavigationItemState = {
  storyDivisionWChildren: StoryDivisionWChildren;
};

class NavigationItem extends React.Component<
  NavigationItemProps,
  NavigationItemState
> {
  buttonRef = createRef<HTMLButtonElement>();
  html = createRef<HTMLLIElement>();

  constructor(props: NavigationItemProps) {
    super(props);

    this.state = {
      storyDivisionWChildren: props.storyDivisionStructure,
    };

    // register?
    this.register();

    this.dragOverHandler = this.dragOverHandler.bind(this);
    this.dropHandler = this.dropHandler.bind(this);
    this.dragHandler = this.dragHandler.bind(this);
  }

  private register() {
    const thisId = this.state.storyDivisionWChildren.storyDivisionPointer.id;

    // ensure the registered item does not already exist
    console.assert(!navigationList[thisId]);

    navigationList[thisId] = this;
  }

  // this allows the drop event to take place
  dragOverHandler(event: React.DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  dropHandler(event: React.DragEvent) {
    event.stopPropagation();

    console.assert(currentlyMoving);

    Project.moveStoryDivisionToStoryDivision(
      currentlyMoving!.props.storyDivisionStructure.storyDivisionPointer,
      this.state.storyDivisionWChildren.storyDivisionPointer
    );

    const newOrganizedStoryDivisionStructure = Project.makeStoryDivisionWChildrenFromStoryDivision(
      Project.getRootStoryDivision()
    );

    console.log('Here');
    console.log(
      inspect(newOrganizedStoryDivisionStructure, false, null, false)
    );

    // reload tree display
    this.props.setState({
      rootStoryDivisionStructure: newOrganizedStoryDivisionStructure,
    });
  }

  dragHandler(event: React.DragEvent) {
    // stop this from  effecting every item above it too otherwise everything will
    // be trying to get dragged into everything
    event.stopPropagation();
  }

  public getCenter() {}

  private getNearestNavigationItem(x: number, y: number) {
    // make this an impossible small amount so that everything is greater than it
    let minY = Number.NEGATIVE_INFINITY;
    let minYItem: Nullable<NavigationItem> = null;

    const navigationListValues = Object.values(navigationList);

    for (const navigationItem of navigationListValues) {
      if (this.isThisNavigationItemTheSame(navigationItem)) continue;
      console.assert(navigationItem.buttonRef.current);

      const rect = navigationItem.buttonRef.current!.getBoundingClientRect();
      const rectCenter = rect.bottom - rect.height / 2;
      const dist = rectCenter - y;

      if (Math.abs(dist) < Math.abs(minY)) {
        minY = dist;
        minYItem = navigationItem;
      }
    }

    return minYItem;
  }

  private isThisNavigationItemTheSame(navigationItem: NavigationItem) {
    // checks if the id's are identical
    return (
      this.state.storyDivisionWChildren.storyDivisionPointer.id ===
      navigationItem.props.storyDivisionStructure.storyDivisionPointer.id
    );
  }

  render() {
    console.log(
      'Rerendering',
      inspect(
        this.state.storyDivisionWChildren.storyDivisionPointer,
        false,
        null,
        false
      )
    );

    return (
      <li className={'navigation-item'} ref={this.html}>
        <ul
          draggable={true}
          onDragOver={(ev) => this.dragOverHandler(ev)}
          onDrop={(ev) => this.dropHandler(ev)}
          onDrag={(ev) => this.dragHandler(ev)}
          onDragStart={(event) => {
            event.stopPropagation();
            currentlyMoving = this;
          }}
        >
          <button ref={this.buttonRef}>
            {this.state.storyDivisionWChildren.storyDivisionPointer.label}
          </button>

          {this.state.storyDivisionWChildren.children.map((child, key) => (
            <NavigationItem
              key={key}
              appState={this.props.appState}
              setState={this.props.setState}
              storyDivisionStructure={child}
            />
          ))}
        </ul>
      </li>
    );
  }
}

export default NavigationItem;
