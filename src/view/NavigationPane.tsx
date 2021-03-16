import React, { createRef } from 'react';
import { inspect } from 'util';
import { Nullable } from '../types/CustomUtilTypes';
import { StoryDivisionTree } from '../util/Project';
import NavigationItem from './NavigationItem';

type NavigationPaneProps = {
  initialStoryDivisionTree: StoryDivisionTree;
};

type NavigationPaneState = {
  storyDivisionTree: StoryDivisionTree;
};
class NavigationPane extends React.Component<
  NavigationPaneProps,
  NavigationPaneState
> {
  constructor(props: NavigationPaneProps) {
    super(props);

    this.setState = this.setState.bind(this);

    this.state = {
      // set the beginning state to the initially provided story division tree
      // this will be updated though
      // which will update the view
      storyDivisionTree: props.initialStoryDivisionTree,
    };
  }

  updateTree(tree: StoryDivisionTree) {
    this.setState({ storyDivisionTree: tree }, () => {
      'updated state';
      console.log(
        'Updating',
        inspect(this.state, false, null, false),
        'with new tree'
      );
    });
  }

  render() {
    console.log('Rendering Navigation Pane.');

    return (
      <nav>
        <NavigationItem
          childDivisions={this.state.storyDivisionTree.childDivisions}
          storyDivision={this.state.storyDivisionTree.storyDivision}
        />
      </nav>
    );
  }
}

export default NavigationPane;
