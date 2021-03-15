import React, { createRef } from 'react';
import StoryDivision from './StoryDivision';

type StoryDivisionLabelProps = {
  division: StoryDivision;
};
type StoryDivisionLabelState = {};

class StoryDivisionLabel extends React.Component<
  StoryDivisionLabelProps,
  StoryDivisionLabelState
> {
  private labelElementReference = createRef<HTMLInputElement>();

  constructor(props: StoryDivisionLabelProps) {
    super(props);
    this.makeReadOnly = this.makeReadOnly.bind(this);
    this.makeWritable = this.makeWritable.bind(this);
    this.serializeNewLabelName = this.serializeNewLabelName.bind(this);
  }

  private makeReadOnly() {
    this.labelElementReference.current!.readOnly = true;
  }
  private makeWritable() {
    this.labelElementReference.current!.readOnly = false;
  }

  render() {
    return (
      <div className={this.props.division.state.labelClassName}>
        <button onClick={this.props.division.addNewStoryDivision}> + </button>

        <input
          className={'story-division-label'}
          ref={this.labelElementReference}
          onDoubleClick={this.makeWritable}
          onBlur={this.makeWritable}
          onKeyDown={this.serializeNewLabelName}
          defaultValue={this.props.division.props.model.label}
          readOnly
        />

        <button> - </button>
      </div>
    );
  }

  private serializeNewLabelName(): void {
    this.props.division.props.model.label = this.labelElementReference.current!.value;
  }
}
export default StoryDivisionLabel;
