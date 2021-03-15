import React from 'react';
import IProjectSchema from '../schema/IProjectSchema';
import Project from '../util/Project';
import { StoryDivisionWChildren } from './NavigationItem';
import NavigationPane from './NavigationPane';

export type GlobalSetAppState = <K extends keyof AppState>(
  state:
    | ((
        prevState: Readonly<AppState>,
        props: Readonly<AppProps>
      ) => Pick<AppState, K> | AppState | null)
    | (Pick<AppState, K> | null),
  callback?: () => void
) => void;

export type GlobalAppState = AppState;

type AppProps = {
  projectSettings: IProjectSchema;
};
type AppState = {
  projectSettings: IProjectSchema;
  rootStoryDivisionStructure: StoryDivisionWChildren;
};

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    const rootStoryDivision = Project.getRootStoryDivision();
    const rootStoryDivisionWChildren = Project.makeStoryDivisionWChildrenFromStoryDivision(
      rootStoryDivision
    );

    this.setState = this.setState.bind(this);

    this.state = {
      projectSettings: props.projectSettings,
      rootStoryDivisionStructure: rootStoryDivisionWChildren,
    };
  }
  render() {
    return (
      <div>
        {
          <NavigationPane
            rootStoryDivisionStructure={this.state.rootStoryDivisionStructure}
            appState={this.state}
            setAppState={this.setState}
          />
        }
      </div>
    );
  }
}

export default App;
