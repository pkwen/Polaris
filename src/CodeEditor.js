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
  FormText,
  FormFeedback
} from "reactstrap";
import {
  AvForm,
  AvField,
  AvGroup,
  AvInput,
  AvFeedback
} from "availity-reactstrap-validation";
import brace from "brace";
import AceEditor from "react-ace";
import "brace/mode/java";
import "brace/theme/github";
import "brace/theme/monokai";
// import { Base64 } from "js-base64";
// import FormModal from "./FormModal.js";
// import GitHub from "./github.js";

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
      path: this.props.path
    };
  }

  onChange = e => {
    const editor = this.refs.aceEditor.editor;
    var code = editor.getValue();
    // var session = editor.getSession();
    // var sessionDocument = editor.getSession().getDocument();
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
    console.log("this.props.path: ", this.props.path);
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
    if (this.state.commit_msg) {
      this.toggle();
      this.props.onPush(this.state.path, this.state.commit_msg);
    } else {
      //show invalid message
    }
  };

  handleValidSubmit(event, values) {
    this.setState({ values });
  }

  render() {
    return (
      <div>
        <AceEditor
          ref="aceEditor"
          mode="javascript"
          theme="monokai"
          font-family="Roboto Mono"
          width="1080px"
          height="550px"
          onChange={this.onChange}
          value={this.props.content}
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            // fontFamily: "Roboto",
            fontSize: 14,
            showPrintMargin: false,
            focus: true,
            minLines: 25,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true
          }}
        />
        <Button color="danger" className="commit-push" onClick={this.toggle}>
          Commit + Push
        </Button>
        <Modal
          isOpen={this.state.show_modal}
          toggle={this.toggle}
          className="test_modal"
        >
          <ModalHeader toggle={this.toggle}>Commit - Details</ModalHeader>
          <ModalBody>
            <AvForm onValidSubmit={this.onPushToggle}>
              <AvGroup>
                <Label for="path">Repository Path</Label>
                <AvInput
                  name="path"
                  id="path"
                  onChange={this.handlePathChange}
                  value={this.props.path}
                  required
                />
                <AvFeedback>Please enter a valid repository path</AvFeedback>
              </AvGroup>
              <AvGroup>
                <Label for="commit_msg">Commit Message</Label>
                <AvInput
                  name="commit_msg"
                  id="commit_msg"
                  onChange={this.handleCommitChange}
                  required
                />
                <AvFeedback>Please enter a commit message</AvFeedback>
              </AvGroup>
              <FormGroup>
                <Button color="primary">Submit</Button>{" "}
                <Button color="secondary" onClick={this.toggle}>
                  Cancel
                </Button>
              </FormGroup>
            </AvForm>
          </ModalBody>
          <ModalFooter />
        </Modal>
      </div>
    );
  }
}

export default CodeEditor;
