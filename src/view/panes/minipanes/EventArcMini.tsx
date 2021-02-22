import React, { useState } from 'react';
import EventArcModel from '../../../models/EventArcModel';
import MindMapModel from '../../../models/MindMapModel';

type Props = {
  eventArc: EventArcModel;
};
type State = Props;

class EventArcMini extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { ...props };
  }
  render() {
    return <div></div>;
  }
}
export default EventArcMini;
