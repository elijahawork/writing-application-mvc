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
        <TextEditor text={'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam nobis eum rem laboriosam, expedita fugit sunt, hic exercitationem modi dicta, officia perferendis ducimus accusamus itaque obcaecati iste dolore fugiat molestias!'} />
      </div>
    );
  }
}
export default Pane2;
