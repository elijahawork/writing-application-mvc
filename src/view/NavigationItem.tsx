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
  }

  render() {
    console.log(this.props.storyDivision.label, 'felt the need to rerender');

    return (
      <li>
        <button
          onClick={() => {
            const newStoryDivision = {
              content: '',
              id: 5,
              label: 'New Item',
              parentId: this.props.storyDivision.id,
              position: 0,
            };
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
          }}
        >
          +
        </button>
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
