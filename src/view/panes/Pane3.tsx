import React from 'react';
import EventArcModel from '../../models/EventArcModel';
import MindMapModel from '../../models/MindMapModel';
import EventArcMini from './minipanes/EventArcMini';
import MindMapMini from './minipanes/MindMapMini';

type Props = {
  mindmaps: MindMapModel[];
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
      <div>
        <h1 className={'side-panel-header'}>MINDMAP</h1>
        <MindMapMini mindmap={this.state.mindmaps[0]} />

        <h1 className={'side-panel-header'}>TIMELINES</h1>
        <ul>
          <li>
            <EventArcMini eventArc={this.state.eventArcs[0]} />
          </li>
          <li>
            <EventArcMini eventArc={this.state.eventArcs[1]} />
          </li>
        </ul>
      </div>
    );
  }
}
export default Pane3;
