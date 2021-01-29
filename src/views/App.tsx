import React from 'react';
import Explorer from './explorer/Explorer';
import InfoBar from './infobar/InfoBar';
import TextEditor from './texteditor/TextEditor';

export default class App extends React.Component {

    
    render() {
        return (
            <>
                <Explorer />
                <TextEditor />
                <InfoBar />
            </>
        );
    }
}