import React from 'react';
import { Nullable } from '../types/CustomUtilTypes';
import Project, { StoryDivisionTree } from '../util/Project';

type NavigationItemProps = StoryDivisionTree & {
  parentSetState: Nullable<
    <K extends keyof NavigationItemState>(
      state:
        | ((
            prevState: Readonly<NavigationItemState>,
            props: Readonly<NavigationItemProps>
          ) => Pick<NavigationItemState, K> | NavigationItemState | null)
        | (Pick<NavigationItemState, K> | null),
      callback?: () => void
    ) => void
  >;
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
    this.createNewChildDivision = this.createNewChildDivision.bind(this);
    this.removeThis = this.removeThis.bind(this);
    this.setState = this.setState.bind(this);
  }

  removeThis() {
    Project.removeStoryDivision(this.props.storyDivision);
    console.assert(this.props.parentSetState);
    this.props.parentSetState!((state) => ({
      childDivisions: state.childDivisions.filter(
        (e) => e.storyDivision !== this.props.storyDivision
      ),
    }));
  }

  createNewChildDivision() {
    // create a new story division with this story division as its parent
    const newStoryDivision = Project.generateUntitledStoryDivision(
      this.props.storyDivision.id
    );

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
        <button onClick={this.removeThis}>-</button>
        <ul>
          {this.state.childDivisions.map((child, key) => (
            <NavigationItem
              childDivisions={child.childDivisions}
              storyDivision={child.storyDivision}
              key={key}
              parentSetState={this.setState}
            />
          ))}
        </ul>
      </li>
    );
  }
}

export default NavigationItem;
