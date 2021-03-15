import React, { createRef } from 'react';
import { inspect } from 'util';
import { GlobalAppState, GlobalSetAppState } from './App';
import NavigationItem, { StoryDivisionWChildren } from './NavigationItem';

type NavigationPaneProps = {
  setAppState: GlobalSetAppState;
  appState: GlobalAppState;
  rootStoryDivisionStructure: StoryDivisionWChildren;
};

export type GlobalSetNavigationPaneState = <
  K extends keyof NavigationPaneState
>(
  state:
    | ((
        prevState: Readonly<NavigationPaneState>,
        props: Readonly<NavigationPaneProps>
      ) => Pick<NavigationPaneState, K> | NavigationPaneState | null)
    | (Pick<NavigationPaneState, K> | null),
  callback?: () => void
) => void;

export type globalNavigationPaneState = NavigationPaneState;

type NavigationPaneState = {
  rootStoryDivisionStructure: StoryDivisionWChildren;
};

export let globalNavigationPane: NavigationPane;

export const rootRef = createRef<NavigationItem>();

class NavigationPane extends React.Component<
  NavigationPaneProps,
  NavigationPaneState
> {
  constructor(props: NavigationPaneProps) {
    super(props);
    this.state = {
      rootStoryDivisionStructure: props.rootStoryDivisionStructure,
    };
    // maybe unnecessary
    globalNavigationPane = this;
    this.setState = this.setState.bind(this);
  }

  render() {
    console.log('Rendering');
    console.log('rendering story structure', inspect(this.state.rootStoryDivisionStructure, false, null, false));
    
    return (
      <nav>
        <NavigationItem
          ref={rootRef}
          setState={this.setState}
          appState={this.state}
          storyDivisionStructure={this.state.rootStoryDivisionStructure}
        />
      </nav>
    );
  }
}

export default NavigationPane;
