import React from 'react';

type TextEditorProps = {
  text: string;
};
type TextEditorState = {
  text: string;
  // caret index represents the point before the char at the number
  // i.e. charIndex = 7, would represent the character before 7
  // this is so that the caret may be behind the cursor and to add functionality
  // for the beginning of text where charIndex = 0
  caretIndex: number;
} & TextEditorProps;

const TEXT_EDITOR_STYLE: React.CSSProperties = {
  width: '100%',
  height: '50%',
  border: '1px solid black',
  whiteSpace: 'pre',
};

class TextEditor extends React.Component<TextEditorProps, TextEditorState> {
  constructor(props: TextEditorProps) {
    super(props);
    this.state = {
      text: props.text,
      caretIndex: 0,
    };
    this.handleKey = this.handleKey.bind(this);
  }
  handleKey(event: KeyboardEvent<HTMLDivElement>) {}
  render() {
    const prefix = this.state.text.substring(0, this.state.caretIndex);
    const char = this.state.text[this.state.caretIndex];
    const suffix = this.state.text.substring(this.state.caretIndex + 1);
    return (
      <div
        id={'text-editor'}
        tabIndex={1}
        style={TEXT_EDITOR_STYLE}
        onKeyDown={this.handleKey}
      >
        {prefix}
        <span style={{ background: 'black', color: 'white' }}>{char}</span>
        {suffix}
      </div>
    );
  }
}

export default TextEditor;
