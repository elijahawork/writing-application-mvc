import React from 'react';
import StoryDivisionModel from '../../models/StoryDivisionModel';

type StoryDivisionProps = {
  model: StoryDivisionModel;
};

type StoryDivisionState = {
  sdivs: StoryDivisionModel[];
};

class StoryDivision extends React.Component<
  StoryDivisionProps,
  StoryDivisionState
> {
  constructor(props: StoryDivisionProps) {
    super(props);
    this.state = { sdivs: this.props.model.children };
  }
  render() {
    return (
      <li>
        <div style={{ display: 'grid', gridTemplateColumns: '20% 60% 20%' }}>
          <button
            onClick={() => {
              this.setState((state) => ({
                sdivs: [
                  ...state.sdivs,
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
            }}
          >
            +
          </button>
          <button>{this.props.model.label}</button>
          <button> - </button>
        </div>
        <ul>
          {this.state.sdivs.map((childModel, key) => {
            return <StoryDivision model={childModel} key={key} />;
          })}
        </ul>
      </li>
    );
  }
}
export default StoryDivision;
