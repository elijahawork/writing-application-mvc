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
