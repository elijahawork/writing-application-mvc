import React from 'react';
import EventArcModel from '../../models/EventArcModel';
import MindMapModel from '../../models/MindMapModel';
import EventArcMini from './minipanes/EventArcMini';
import MindMapMini from './minipanes/MindMapMini';

type Props = {
  mindMaps: MindMapModel[];
  eventArcs: EventArcModel[];
};
type State = Props;

class Pane3 extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { ...props };
  }

  render() {
    return (
      <div className={'pane'}>
        <h1 className={'side-panel-header'}>MINDMAP</h1>
        <MindMapMini mindMap={this.state.mindMaps[0]} />

        <h1 className={'side-panel-header'}>TIMELINES</h1>
        <ul>
          {this.state.eventArcs[0] ? (
            <li>
              <EventArcMini eventArc={this.state.eventArcs[0]} />
            </li>
          ) : (
            <></>
          )}
          {this.state.eventArcs[1] ? (
            <li>
              <EventArcMini eventArc={this.state.eventArcs[1]} />
            </li>
          ) : (
            <></>
          )}
        </ul>
      </div>
    );
  }
}
export default Pane3;
