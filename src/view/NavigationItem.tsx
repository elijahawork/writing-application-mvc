import React from 'react';
import IStoryDivisionSchema from '../schema/IStoryDivisionSchema';
import Project from '../util/Project';
import { GlobalAppState, GlobalSetAppState } from './App';

type NavigationItemProps = {
  setState: GlobalSetAppState;
  appState: GlobalAppState;
  storyDivision: IStoryDivisionSchema;
};
type NavigationItemState = {};

class NavigationItem extends React.Component<
  NavigationItemProps,
  NavigationItemState
> {
  constructor(props: NavigationItemProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <li className={'navigation-item'}>
        <ul draggable={true}>
          <button>
            {this.props.storyDivision.label}
          </button>
          {Project.getAllImmediateChildren(this.props.storyDivision).map(
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
