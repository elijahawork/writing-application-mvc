import React from 'react';
import IStoryDivisionSchema from '../schema/IStoryDivisionSchema';
import { StoryDivisionTree } from '../util/Project';

type NavigationItemProps = {
  storyDivision: IStoryDivisionSchema;
  childDivisions: StoryDivisionTree[];
};
type NavigationItemState = {
  childDivisions: StoryDivisionTree[];
};

class NavigationItem extends React.Component<
  NavigationItemProps,
  NavigationItemState
> {
  constructor(props: NavigationItemProps) {
    super(props);
    this.state = {
      childDivisions: props.childDivisions,
    };
  }

  render() {
    console.log(this.props.storyDivision.label, 'felt the need to rerender');

    return (
      <li>
        <button>{this.props.storyDivision.label}</button>
        <ul>
          {this.state.childDivisions.map((child, key) => (
            <NavigationItem
              childDivisions={child.childDivisions}
              storyDivision={child.storyDivision}
              key={key}
            />
          ))}
        </ul>
      </li>
    );
  }
}

export default NavigationItem;
