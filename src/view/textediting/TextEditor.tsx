import { clipboard } from 'electron/common';
import React from 'react';

type TextEditorProps = {
  text: string;
};
type TextEditorState = {
  text: string;
  caretIndex: number;
} & TextEditorProps;

const TEXT_EDITOR_STYLE: React.CSSProperties = {
  width: '100%',
  height: '50%',
  border: '1px solid black',
  whiteSpace: 'pre',
  overflow: 'auto',
};

class TextEditor extends React.Component<TextEditorProps, TextEditorState> {
  constructor(props: TextEditorProps) {
    super(props);
    this.state = {
      text: props.text,
      caretIndex: 0,
    };
    this.handleKey = this.handleKey.bind(this);
    this.moveCaretBackward = this.moveCaretBackward.bind(this);
    this.moveCaretForward = this.moveCaretForward.bind(this);
  }
  private handleKey(event: React.KeyboardEvent<HTMLDivElement>) {
    const key = event.key;
    event.preventDefault();
    if (event.ctrlKey) {
      switch (key) {
        case 'v': {
          this.paste();
        }
      }
    } else {
      switch (key) {
        case 'ArrowRight':
          {
            this.moveCaretForward();
          }
          break;
        case 'ArrowLeft':
          {
            this.moveCaretBackward();
          }
          break;
        case 'Backspace':
          {
            this.deleteChar();
          }
          break;
        case 'Enter':
          {
            this.addText('\n');
          }
          break;
        default: {
          if (key.length === 1) {
            this.addText(key);
          }
        }
      }
    }
  }
  private deleteChar() {
    this.setState((state) => ({
      text:
        state.text.substring(0, state.caretIndex - 1) +
        state.text.substring(state.caretIndex),
    }));
    this.moveCaretBackward();
  }
  private addText(ch: string) {
    this.setState((state) => ({
      text:
        state.text.substring(0, state.caretIndex) +
        ch +
        state.text.substring(state.caretIndex),
    }));
    this.moveCaretForward();
  }
  private moveCaretForward(index = 1) {
    this.setState((state) => {
      const newCaretIndex = state.caretIndex + index;
      if (newCaretIndex > this.state.text.length) {
        return {
          caretIndex: state.text.length,
        };
      } else {
        return {
          caretIndex: newCaretIndex,
        };
      }
    });
  }
  private moveCaretBackward(index = 1) {
    this.setState((state) => {
      const newCaretIndex = state.caretIndex - index;
      if (newCaretIndex < -1) {
        return {
          caretIndex: -1,
        };
      } else {
        return {
          caretIndex: newCaretIndex,
        };
      }
    });
  }
  private paste() {
    const text = clipboard.readText('clipboard');
    this.addText(text);
    this.moveCaretForward(text.length);
  }
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
