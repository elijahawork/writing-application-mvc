import React, { createRef } from 'react';
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
  disabled: boolean;
  aboutToReceiveAbove: boolean;
  aboutToContain: boolean;
  aboutToReceiveBelow: boolean;
};

let currentlyDragging: NavigationItem[] = [];

class NavigationItem extends React.Component<
  NavigationItemProps,
  NavigationItemState
> {
  private labelRef = createRef<HTMLInputElement>();
  constructor(props: NavigationItemProps) {
    super(props);
    this.state = {
      childDivisions: props.childDivisions,
      disabled: true,
      aboutToContain: false,
      aboutToReceiveAbove: false,
      aboutToReceiveBelow: false,
    };

    this.createNewChildDivision = this.createNewChildDivision.bind(this);
    this.removeFromParent = this.removeFromParent.bind(this);
    this.setState = this.setState.bind(this);
    this.dragStartHandler = this.dragStartHandler.bind(this);
    this.dragEndHandler = this.dragEndHandler.bind(this);
    this.onDropReceiveHandler = this.onDropReceiveHandler.bind(this);
    this.updateNamingChange = this.updateNamingChange.bind(this);
    this.dragLeaveHandler = this.dragLeaveHandler.bind(this);
    // because the dnd api sucks, these need to exist to cancel for the drop to take effect @.@
    this.dragEnterHandler = this.dragEnterHandler.bind(this);
    this.dragOverHandler = this.dragOverHandler.bind(this);

    this.makeLabelEditable = this.makeLabelEditable.bind(this);
    this.makeLabelUneditable = this.makeLabelUneditable.bind(this);
  }
  updateNamingChange() {
    console.assert(this.labelRef.current);

    Project.relabelStoryDivision(
      this.props.storyDivision,
      this.labelRef.current!.value
    );
  }
  removeFromParent() {
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
  }

  public dragEndHandler(event: React.DragEvent<HTMLLIElement>) {
    event.stopPropagation();
    // this is fired after the drop event, so un-registering should still work without
    // impacting the drop's awareness of currently dragging elements
    this.unregisterThisAsCurrentlyDragging();
  }

  public dragEnterHandler(event: React.DragEvent<HTMLLIElement>) {
    // this is required for the drop event to take effect
    event.preventDefault();
    // this prevents every element above from also performing the acts of a dropping element
    event.stopPropagation();

    // note: this event is from the POV of the element being entered

    this.setState({ aboutToContain: true });
  }
  public dragLeaveHandler(event: React.DragEvent<HTMLLIElement>) {
    event.stopPropagation();
    this.setState({
      aboutToContain: false,
      aboutToReceiveBelow: false,
      aboutToReceiveAbove: false,
    });
  }
  public dragOverHandler(event: React.DragEvent<HTMLLIElement>) {
    // this is also required for the drop event to take effect
    event.preventDefault();
  }

  public onDropReceiveHandler(event: React.DragEvent<HTMLLIElement>) {
    event.stopPropagation();

    console.clear();

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

  makeLabelEditable() {
    console.assert(this.labelRef.current);

    this.setState({ disabled: false });
    this.labelRef.current!.focus();
  }
  makeLabelUneditable() {
    this.setState({ disabled: true });
  }

  render() {
    return (
      <li
        className={
          'navigation-item ' +
          (this.state.aboutToContain
            ? 'about-to-contain'
            : this.state.aboutToReceiveAbove
            ? 'about-to-receive-above'
            : this.state.aboutToReceiveBelow
            ? 'about-to-receive-below'
            : '')
        }
        draggable={true}
        onDragStart={this.dragStartHandler}
        onDragEnd={this.dragEndHandler}
        onDragOver={this.dragOverHandler}
        onDragEnter={this.dragEnterHandler}
        onDrop={this.onDropReceiveHandler}
        onDragLeave={this.dragLeaveHandler}
      >
        <div
          className={'navigation-item-modification-wrapper'}
          onDoubleClick={this.makeLabelEditable}
        >
          <button
            onClick={this.createNewChildDivision}
            className={'navigation-item-modification-button'}
          >
            +
          </button>
          <button className={'navigation-item-label-button'}>
            <input
              ref={this.labelRef}
              onBlur={this.makeLabelUneditable}
              onChange={this.updateNamingChange}
              defaultValue={this.props.storyDivision.label}
              disabled={this.state.disabled}
            />
          </button>
          <button
            onClick={this.removeFromParent}
            className={'navigation-item-modification-button'}
          >
            -
          </button>
        </div>
        <ul>
          {this.state.childDivisions
            .sort(compareStoryDivisionTrees)
            .map((child, key) => (
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

function compareStoryDivisionTrees(
  storyDivisionA: StoryDivisionTree,
  storyDivisionB: StoryDivisionTree
) {
  return (
    storyDivisionA.storyDivision.position -
    storyDivisionB.storyDivision.position
  );
}
