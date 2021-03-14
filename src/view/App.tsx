import React from 'react';
import IProjectSchema from '../schema/IProjectSchema';
import Project from '../util/Project';
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
};

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      projectSettings: props.projectSettings,
    };

    // set the current project in use to the project of the app
    // this should never be a problem as no two projects should be capable
    // of running in the same window at the same time at any meaningful
    // point in this project
    Project.useProject(props.projectSettings);
  }
  render() {
    return (
      <div>
        {<NavigationPane appState={this.state} setAppState={this.setState} />}
      </div>
    );
  }
}

export default App;
