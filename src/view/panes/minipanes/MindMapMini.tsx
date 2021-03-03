import React from 'react';
import MindMapModel from '../../../models/MindMapModel';

type Props = {
  mindMap: MindMapModel;
};
type State = Props;

class MindMapMini extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { ...props };
  }
  render() {
    return <div></div>;
  }
}
export default MindMapMini;
