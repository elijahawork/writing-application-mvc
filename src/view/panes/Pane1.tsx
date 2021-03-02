import React from 'react';

type Props = {};
type State = {};

class Pane1 extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    return <div className={'pane'}></div>;
  }
}
export default Pane1;
