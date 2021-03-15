import React, { createRef } from 'react';
import IStoryDivisionSchema from '../schema/IStoryDivisionSchema';
import { Nullable } from '../types/CustomUtilTypes';
import Project from '../util/Project';
import { GlobalAppState, GlobalSetAppState } from './App';

const navigationList: Record<number, NavigationItem> = {};

type NavigationItemProps = {
  setState: GlobalSetAppState;
  appState: GlobalAppState;
  storyDivision: IStoryDivisionSchema;
};
type NavigationItemState = {
  storyDivision: IStoryDivisionSchema;
};

class NavigationItem extends React.Component<
  NavigationItemProps,
  NavigationItemState
> {
  constructor(props: NavigationItemProps) {
    super(props);
    this.state = { storyDivision: props.storyDivision };
    this.dragOverHandler = this.dragOverHandler.bind(this);
    this.dragHandler = this.dragHandler.bind(this);
    navigationList[this.props.storyDivision.id] = this;
    console.log(navigationList);
  }

  html = createRef<HTMLLIElement>();

  dragOverHandler(event: React.DragEvent) {
    console.log(event.target, this.html.current!);

    const nearestNavigationItem = this.getNearestNavigationItem(
      event.clientX,
      event.clientY
    )!;

    console.assert(nearestNavigationItem);

    nearestNavigationItem.setState((state) => {
      Project.moveStoryDivisionToStoryDivision(
        this.props.storyDivision,
        state.storyDivision
      );

      return {
        storyDivision: state.storyDivision,
      };
    });

    console.log({ nearestNavigationItem });
  }

  dragHandler(event: React.DragEvent) {
    // stop this form effecting every item above it too otherwise everything will
    // be trying to get dragged into everything
    event.stopPropagation();
  }

  private getNearestNavigationItem(x: number, y: number) {
    // make this an impossible small amount so that everything is greater than it
    let minY = Number.NEGATIVE_INFINITY;
    let minYItem: Nullable<NavigationItem> = null;

    for (const navigationItem of Object.values(navigationList)) {
      if (navigationItem === this) continue;
      console.assert(navigationItem.html.current);
      console.assert(this.html.current);

      const rect = navigationItem.html.current!.getBoundingClientRect();

      const rectCenter = rect.bottom - rect.height / 2;
      const cursor = y;

      const dist = rectCenter - cursor;

      if (Math.abs(dist) < Math.abs(minY)) {
        minY = dist;
        minYItem = navigationItem;
      }
    }

    return minYItem;
  }

  render() {
    return (
      <li className={'navigation-item'} ref={this.html}>
        <ul
          draggable={true}
          onDragOver={this.dragOverHandler}
          onDrag={this.dragHandler}
        >
          <button>{this.state.storyDivision.label}</button>
          {Project.getAllImmediateChildren(this.state.storyDivision).map(
            (childDivision, key) => (
              <NavigationItem
                key={key}
                storyDivision={childDivision}
                setState={this.props.setState}
                appState={this.props.appState}
              />
            )
          )}
        </ul>
      </li>
    );
  }
}

export default NavigationItem;
