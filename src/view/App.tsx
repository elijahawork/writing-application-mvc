import React from 'react';
import IProjectSchema from '../schema/IProjectSchema';
import { StoryDivisionTree } from '../util/Project';
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
  rootStoryDivisionTree: StoryDivisionTree;
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
  }
  render() {
    return (
      <div>
        {
          <NavigationPane
            initialStoryDivisionTree={this.props.rootStoryDivisionTree}
          />
        }
      </div>
    );
  }
}

export default App;
