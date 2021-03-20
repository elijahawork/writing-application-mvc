import React, { createRef } from 'react';
import IStoryDivisionSchema from '../schema/IStoryDivisionSchema';
import { Nullable } from '../types/CustomUtilTypes';
import { DNDUtilFunctions } from '../util/DNDUtilFunctions';
import Project, { StoryDivisionTree } from '../util/Project';

let lastQuery: Nullable<NavigationItem> = null;

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
  visible: boolean;
};

let currentlyDragging: NavigationItem[] = [];

class NavigationItem extends React.Component<
  NavigationItemProps,
  NavigationItemState
> {
  public readonly labelRef = createRef<HTMLInputElement>();

  constructor(props: NavigationItemProps) {
    super(props);
    this.state = {
      childDivisions: props.childDivisions,
      disabled: true,
      aboutToContain: false,
      aboutToReceiveAbove: false,
      aboutToReceiveBelow: false,
      visible: true,
    };

    this.createNewChildDivision = this.createNewChildDivision.bind(this);
    this.removeFromParent = this.removeFromParent.bind(this);
    this.setState = this.setState.bind(this);

    this.makeLabelEditable = this.makeLabelEditable.bind(this);
    this.makeLabelUneditable = this.makeLabelUneditable.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    DNDUtilFunctions.Registry.register(this);
  }
  updateNamingChange() {
    console.assert(this.labelRef.current);

    Project.StoryDivision.API.relabel(
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
    const newStoryDivision: IStoryDivisionSchema = {
      content: '',
      id: Project.StoryDivision.Registry.getUniqueID(),
      label: 'Untitled',
      parentId: this.props.storyDivision.id,
      position: this.props.childDivisions.length,
    };

    Project.StoryDivision.API.add(newStoryDivision);

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
  handleDragEnd(ev: React.DragEvent<HTMLLIElement>) {
    ev.stopPropagation(); // f bubbling in this api
    const navItem = DNDUtilFunctions.inRelationToNearestNavDo(
      ev.clientY,
      ev.clientX,
      {
        before() {},
        in() {
          this.removeFromParent();

          Project.StoryDivision.API.move(
            this.props.storyDivision,
            navItem.props.storyDivision
          );

          navItem.setState((state) => ({
            childDivisions: [
              ...state.childDivisions,
              this.toStoryDivisionTree(),
            ],
          }));
        },
        after() {},
      },
      this
    );

    this.setState({ visible: true });
  }
  private toStoryDivisionTree() {
    return {
      childDivisions: this.props.childDivisions,
      storyDivision: this.props.storyDivision,
    };
  }
  handleDrag(ev: React.DragEvent<HTMLLIElement>) {
    ev.stopPropagation(); // f bubbling in this api
    lastQuery?.setState({
      aboutToContain: false,
      aboutToReceiveAbove: false,
      aboutToReceiveBelow: false,
    });
    const navItem = DNDUtilFunctions.inRelationToNearestNavDo(
      ev.clientY,
      ev.clientX,
      {
        before() {
          navItem.setState({ aboutToReceiveBelow: true });
        },
        in() {
          navItem.setState({ aboutToReceiveBelow: true });
          lastQuery = navItem;
        },
        after() {
          navItem.setState({ aboutToReceiveBelow: true });
        },
      },
      this
    );
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
  handleDragStart(ev: React.DragEvent<HTMLLIElement>) {
    ev.stopPropagation();

    console.clear();
    console.log("Oh my lordy, I can't done believe this is happening");

    // this is so that the drag event doesn't stop and the
    // drag visual doesn't disappear
    setTimeout(() => this.setState({ visible: false }), 0);
  }
  render() {
    return (
      <li
        className={`navigation-item ${this.state.visible ? '' : 'nav-vis'}`}
        draggable={true}
        onDragStart={this.handleDragStart}
        onDrag={this.handleDrag}
        onDragEnd={this.handleDragEnd}
      >
        <div
          className={
            this.state.aboutToReceiveAbove ? 'receive-vis' : 'receive-invis'
          }
        ></div>
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
              className={
                this.state.aboutToContain ||
                this.state.aboutToReceiveAbove ||
                this.state.aboutToReceiveBelow
                  ? 'selected'
                  : ''
              }
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

        <div
          className={
            this.state.aboutToReceiveBelow
              ? 'receive-vis'
              : this.state.aboutToContain
              ? 'contain-vis'
              : 'receive-invis'
          }
        ></div>
        <ul>
          {this.state.childDivisions
            .sort((a, b) =>
              Project.StoryDivision.Util.compare(
                a.storyDivision,
                b.storyDivision
              )
            )
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
