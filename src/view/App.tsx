import React from 'react';
import MindMapModel from '../models/MindMapModel';
import MindMapMini from './panes/minipanes/MindMapMini';
import Pane1 from './panes/Pane1';
import Pane2 from './panes/Pane2';
import Pane3 from './panes/Pane3';

class App extends React.Component {
  render() {
    return (
      <>
        <Pane1 />
        <Pane2 />
        <Pane3 eventArcs={[]} mindmaps={[]} />
      </>
    );
  }
}
export default App;
