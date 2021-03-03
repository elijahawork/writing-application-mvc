import React from 'react';
import { ModelInfo } from '../..';
import StoryDivision from './StoryDivision';

type Props = {};
type State = {};

class Pane1 extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    const manuscript = ModelInfo.storageDivisionRegistry.get(-1);
    if (!manuscript) throw new TypeError(`Manuscript does not exist.`);
    return (
      <div className={'pane'}>
        <StoryDivision model={manuscript} />
      </div>
    );
  }
}
export default Pane1;
