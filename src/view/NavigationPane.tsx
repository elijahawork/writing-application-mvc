import React from 'react';
import Project from '../util/Project';
import { GlobalAppState, GlobalSetAppState } from './App';
import NavigationItem from './NavigationItem';

type NavigationPaneProps = {
  setAppState: GlobalSetAppState;
  appState: GlobalAppState;
};
type NavigationPaneState = {};

class NavigationPane extends React.Component<
  NavigationPaneProps,
  NavigationPaneState
> {
  
  constructor(props: NavigationPaneProps) {
    super(props);
    this.state = {};
  }
  
  render() {
    return (
      <nav>
        <NavigationItem
          setState={this.props.setAppState}
          appState={this.props.appState}
          storyDivision={Project.getRootStoryDivision()}
        />
      </nav>
    );
  }
}

export default NavigationPane;
