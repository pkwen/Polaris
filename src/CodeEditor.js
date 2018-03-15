import React, { Component } from "react";
import brace from "brace";
import AceEditor from "react-ace";
import "brace/mode/java";
import "brace/theme/github";
import "brace/theme/monokai";
import { Base64 } from "js-base64";
import Form from "./Form.js";
import GitHub from "./github.js";

// require("monaco-editor/min/vs/editor/editor.main.css");
// require("dotenv").config();
// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET;

class CodeEditor extends Component {
  // constructor(props) {
  //   super(props);
  // }

  onChange = e => {
    const editor = this.refs.aceEditor.editor;
    var code = editor.getValue();
    var session = editor.getSession();
    var sessionDocument = editor.getSession().getDocument();
    this.props.updateState(code);
  };

  // componentDidMount() {
  //   //   let url = "wss://afternoon-waters-66838.herokuapp.com/"
  // }

  render() {
    return (
      <div className="code-editor">
        <a
          className="gh-login"
          href="https://github.com/login/oauth/authorize?client_id=2437e80c83661e9e530f"
        >
          Log In with GitHub
        </a>
        <button className="push-hub" onClick={this.props.onPush}>
          Update Data
        </button>
        <AceEditor
          ref="aceEditor"
          mode="javascript"
          theme="monokai"
          onChange={this.onChange}
          value={this.props.content}
          enableBasicAutocompletion="true"
          editorProps={{ $blockScrolling: true }}
        />
        <Form />
      </div>
    );
  }
}

export default CodeEditor;