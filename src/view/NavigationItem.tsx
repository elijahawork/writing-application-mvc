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
    this.removeFromParent = this.removeFromParent.bind(this);
    this.setState = this.setState.bind(this);
    this.dragStartHandler = this.dragStartHandler.bind(this);
    this.dragEndHandler = this.dragEndHandler.bind(this);
    this.onDropReceiveHandler = this.onDropReceiveHandler.bind(this);
    // because the dnd api sucks, these need to exist to cancel for the drop to take effect @.@
    this.dragEnterHandler = this.dragEnterHandler.bind(this);
    this.dragOverHandler = this.dragOverHandler.bind(this);
  }

  removeFromParent() {
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
    // this is fired after the drop event, so un-registering should still work without
    // impacting the drop's awareness of currently dragging elements
    this.unregisterThisAsCurrentlyDragging();
    console.log(currentlyDragging);
  }

  public dragEnterHandler(event: React.DragEvent<HTMLLIElement>) {
    // this is required for the drop event to take effect
    event.preventDefault();
  }
  public dragOverHandler(event: React.DragEvent<HTMLLIElement>) {
    // this is also required for the drop event to take effect
    event.preventDefault();
  }

  public onDropReceiveHandler(event: React.DragEvent<HTMLLIElement>) {
    event.stopPropagation();

    console.clear();
    console.log('Experiencing a drop');

    // only going to handle one dragged element rn
    const registeredDraggingElement: NavigationItem = currentlyDragging[0];

    console.assert(registeredDraggingElement.props.parentSetState);

    registeredDraggingElement.removeFromParent();

    // change the data state
    Project.moveStoryDivisionTo(
      registeredDraggingElement.props.storyDivision,
      this.props.storyDivision
    );

    // change the view state
    this.setState((state) => ({
      childDivisions: [
        ...state.childDivisions,
        {
          childDivisions: registeredDraggingElement.props.childDivisions,
          storyDivision: registeredDraggingElement.props.storyDivision,
        },
      ],
    }));
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
        onDragOver={this.dragOverHandler}
        onDragEnter={this.dragEnterHandler}
        onDrop={this.onDropReceiveHandler}
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
            onClick={this.removeFromParent}
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
