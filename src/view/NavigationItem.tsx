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

let currentlyDragging: NavigationItem[] = [];

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
    this.dragStartHandler = this.dragStartHandler.bind(this);
    this.dragEndHandler = this.dragEndHandler.bind(this);
    this.onDropReceiveHandler = this.onDropReceiveHandler.bind(this);
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

  public dragStartHandler(event: React.DragEvent<HTMLLIElement>) {
    event.stopPropagation();
    this.registerThisAsCurrentlyDragging();
    console.log(currentlyDragging);
  }

  public dragEndHandler(event: React.DragEvent<HTMLLIElement>) {
    event.stopPropagation();
    this.unregisterThisAsCurrentlyDragging();
    console.log(currentlyDragging);
  }

  public onDropReceiveHandler(event: React.DragEvent<HTMLLIElement>) {
    event.stopPropagation();

    // only going to handle one dragged element rn
    const registeredDraggingElement = currentlyDragging[0];
    
  }

  private registerThisAsCurrentlyDragging() {
    currentlyDragging.push(this);
  }
  private unregisterThisAsCurrentlyDragging() {
    currentlyDragging = currentlyDragging.filter((e) => e !== this);
  }

  render() {
    console.log(this.props.storyDivision.label, 'felt the need to rerender');

    return (
      <li
        draggable={true}
        onDragStart={this.dragStartHandler}
        onDragEnd={this.dragEndHandler}

      >
        <span className={'navigation-item-modification-wrapper'}>
          <button
            onClick={this.createNewChildDivision}
            className={'navigation-item-modification-button'}
          >
            +
          </button>
          <button>{this.props.storyDivision.label}</button>
          <button
            onClick={this.removeThis}
            className={'navigation-item-modification-button'}
          >
            -
          </button>
        </span>
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
