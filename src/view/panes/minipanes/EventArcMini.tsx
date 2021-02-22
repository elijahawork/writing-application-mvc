import React from 'react';
import EventArcModel from '../../../models/EventArcModel';

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
