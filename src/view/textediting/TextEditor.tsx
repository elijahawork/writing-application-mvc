import React from "react";

type TextEditorProps = {

}
type TextEditorState = {
  
} & TextEditorProps;

const TEXT_EDITOR_STYLE: React.CSSProperties = {
  width: '100px',
  height: '100px',
  border: '1px solid black',
}

class TextEditor extends React.Component<TextEditorProps, TextEditorState> {
  constructor(props: TextEditorProps) {
    super(props);
    this.state = { ... props };
  }
  render() {
    return <div style = {TEXT_EDITOR_STYLE}></div>;
  }
}

export default TextEditor;