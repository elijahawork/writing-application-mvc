import React from 'react';
import TextEditor from '../textediting/TextEditor';

type Props = {};
type State = {};

class Pane2 extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    return (
      <div className={'pane'}>
        <TextEditor text={'hello, world'} />
      </div>
    );
  }
}
export default Pane2;
