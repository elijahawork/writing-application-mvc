import React from 'react';
import Project, { StoryDivisionTree } from '../util/Project';

type NavigationItemProps = StoryDivisionTree & {};
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
    this.createNewChildDivision = this.createNewChildDivision.bind(this);
  }

  createNewChildDivision() {
    // create a new story division with this story division as its parent
    const newStoryDivision = Project.generateUntitledStoryDivision(this.props.storyDivision.id);
    
    Project.addStoryDivision(newStoryDivision);
    
    this.setState((state) => ({
      childDivisions: [
        ...state.childDivisions,
        {
          childDivisions: [],
          storyDivision: newStoryDivision,
        },
      ],
    }));
  }

  render() {
    console.log(this.props.storyDivision.label, 'felt the need to rerender');

    return (
      <li>
        <button onClick={this.createNewChildDivision}>+</button>
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
