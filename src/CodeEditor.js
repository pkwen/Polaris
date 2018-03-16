import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  FormText
} from "reactstrap";
// import MonacoEditor from "react-monaco-editor";
import brace from "brace";
import AceEditor from "react-ace";
import "brace/mode/java";
import "brace/theme/github";
import "brace/theme/monokai";
import { Base64 } from "js-base64";
// import FormModal from "./FormModal.js";
import GitHub from "./github.js";

// require("monaco-editor/min/vs/editor/editor.main.css");
// require("dotenv").config();
// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET;

class CodeEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_modal: false,
      commit_msg: "",
      path: ""
    };
  }

  onChange = e => {
    const editor = this.refs.aceEditor.editor;
    var code = editor.getValue();
    var session = editor.getSession();
    var sessionDocument = editor.getSession().getDocument();
    this.props.updateState(code);
  };

  componentDidMount() {
    //   let url = "wss://afternoon-waters-66838.herokuapp.com/";
    this.socket = new WebSocket("ws://localhost:3001");
    this.socket.onopen = e => {
      console.log("opened");
    };
    this.socket.onmessage = e => {
      const parsedData = JSON.parse(e.data);
      //     // console.log(Date.now() + " state change observed");
      this.setState({ value: parsedData });
      //     // setInterval(this.setState({ value: parsedData }), 500);
    };
  }

  toggle = () => {
    this.setState({ show_modal: !this.state.show_modal });
  };

  handleCommitChange = e => {
    this.setState({ commit_msg: e.target.value });
  };

  handlePathChange = e => {
    this.setState({ path: e.target.value });
  };

  onPushToggle = () => {
    console.log("state in CodeEditor: ", this.state);
    this.toggle();
    this.props.onPush(this.state.path, this.state.commit_msg);
  };

  render() {
    return (
      <div className="code-editor">
        <a
          className="gh-login"
          href="https://github.com/login/oauth/authorize?client_id=2437e80c83661e9e530f&scope=repo"
        >
          Log In with GitHub
        </a>
        <button className="push-hub" onClick={this.props.signOut}>
          Log out
        </button>
        <AceEditor
          ref="aceEditor"
          mode="javascript"
          theme="monokai"
          onChange={this.onChange}
          value={this.props.content}
          enableBasicAutocompletion="true"
          editorProps={{ $blockScrolling: true }}
          enableBasicAutocompletion="true"
          enableLiveAutocompletion="true"
        />
        <Button color="danger" onClick={this.toggle}>
          Commit + Push 3
        </Button>
        <Modal
          isOpen={this.state.show_modal}
          toggle={this.toggle}
          className="test_modal"
        >
          <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="path">Path</Label>
                <Input
                  type="textarea"
                  name="path"
                  id="path"
                  placeholder="path"
                  onChange={this.handlePathChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="path">Commit Message</Label>
                <Input
                  type="textarea"
                  name="commit_msg"
                  id="commit_msg"
                  placeholder="Enter commit message"
                  onChange={this.handleCommitChange}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.onPushToggle}>
              Done
            </Button>{" "}
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default CodeEditor;
