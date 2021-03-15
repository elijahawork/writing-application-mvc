import React, { createRef } from 'react';
import { log } from '../..';
import StoryDivisionModel from '../../models/StoryDivisionModel';
import StoryDivisionLabel from './StoryDivisionLabel';

const storyDivisionViewRegistry = new Map<number, StoryDivision>();

export type StoryDivisionProps = {
  model: StoryDivisionModel;
};

export type StoryDivisionState = {
  readonly el: React.RefObject<HTMLLIElement>;
  storyDivisionChildren: StoryDivisionModel[];
  labelClassName: string;
};

class StoryDivision extends React.Component<
  StoryDivisionProps,
  StoryDivisionState
> {
  constructor(props: StoryDivisionProps) {
    super(props);

    this.state = {
      storyDivisionChildren: this.props.model.children,
      el: createRef<HTMLLIElement>(),
      labelClassName: 'story-division',
    };

    
    this.dragOverHandler = this.dragOverHandler.bind(this);
    this.addNewStoryDivision = this.addNewStoryDivision.bind(this);
    this.dragHandler = this.dragHandler.bind(this);
    
    this.register();
  }
  private register() {
    storyDivisionViewRegistry.set(this.props.model.id, this);
  }

  private getRect(): DOMRect {
    return this.state.el.current!.getBoundingClientRect();
  }
  private remove(storyDivisionModel: StoryDivisionModel) {
    // remove an element by filtering it out
    this.setState((state) => ({
      storyDivisionChildren: state.storyDivisionChildren.filter(
        (comparisonModel) => comparisonModel !== storyDivisionModel
      ),
    }));
  }
  private add(storyDivisionModel: StoryDivisionModel) {
    this.setState((state) => ({
      storyDivisionChildren: [
        ...state.storyDivisionChildren,
        storyDivisionModel,
      ],
    }));
  }
  private tryToGetNearestStoryDivisionViewInformation(): {
    view: StoryDivision;
    distanceX: number;
  } | null {
    const { x: thisRectX } = this.getRect();

    let minDistX: number = Number.POSITIVE_INFINITY;
    let view: StoryDivision | undefined;

    for (const storyDivisionView of storyDivisionViewRegistry.values()) {
      if (storyDivisionView === this) continue;

      const rect = storyDivisionView.getRect();
      const xDist = Math.abs(rect.x - thisRectX);

      if (xDist < minDistX) {
        view = storyDivisionView;
        minDistX = xDist;
      }
    }
    return view ? { view, distanceX: minDistX } : null;
  }
  private dragOverHandler(event: React.DragEvent<HTMLLIElement>): void {
    event.stopPropagation();

    const nearestStoryDivisionViewInformation = this.tryToGetNearestStoryDivisionViewInformation();

    if (nearestStoryDivisionViewInformation) {
      const { view, distanceX } = nearestStoryDivisionViewInformation;
      this.moveToDifferentStoryDivision(view);
    } else {
      // if a view nearby has not been found
      return log.error(
        'There are no nearby divisions. Cannot move current division.'
      );
    }
  }
  private moveToDifferentStoryDivision(view: StoryDivision) {
    this.makeOrphan();
    const newParentModel = view.props.model;
    this.props.model.parentId = newParentModel.id;
    storyDivisionViewRegistry.get(newParentModel.id)!;
  }
  private dragHandler(event: React.DragEvent<HTMLLIElement>) {
    event.stopPropagation();
    const nearestStoryDivisionViewInformation = this.tryToGetNearestStoryDivisionViewInformation();

    // if a view nearby has not been found
    if (!nearestStoryDivisionViewInformation) {
      return log.error(
        'There are no nearby divisions. Cannot display movement to current division.'
      );
    } else {
      nearestStoryDivisionViewInformation.view.setState({
        labelClassName: `story-division-label ${
          nearestStoryDivisionViewInformation.distanceX <= 0 ? 'above' : 'below'
        }`,
      });
    }
  }

  public addNewStoryDivision() {
    this.setState((state) => ({
      storyDivisionChildren: [
        ...state.storyDivisionChildren,
        new StoryDivisionModel({
          content: '',
          id: StoryDivisionModel.generateUniqueID(),
          label: 'Untitled',
          parentId: this.props.model.id,
          position: 1,
        }),
      ]
        .map((model, index) => ((model.position = index), model))
        .sort((model1, model2) => model1.position - model2.position),
    }));
  }

  private makeOrphan() {
    const currentParentView = storyDivisionViewRegistry.get(
      this.props.model.id
    )!;
    currentParentView.remove(this.props.model);
  }

  public render() {
    return (
      <li
        ref={this.state.el}
        draggable={true}
        onDragOver={this.dragOverHandler}
        onDrag={this.dragHandler}
      >
        <StoryDivisionLabel division={this} />
        <ul>
          {this.state.storyDivisionChildren.map((childModel, key) => (
            <StoryDivision model={childModel} key={key} />
          ))}
        </ul>
      </li>
    );
  }
}
export default StoryDivision;
