import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  // ModalFooter,
  // Form,
  FormGroup,
  Tooltip,
  Label
  // Input,
  // FormText,
  // FormFeedback
} from "reactstrap";

import {
  AvForm,
  // AvField,
  AvGroup,
  AvInput,
  AvFeedback
} from "availity-reactstrap-validation";

import AceEditor from "react-ace";
// import brace from "brace";
import "brace/ext/language_tools";
import "brace/mode/javascript";
import "brace/theme/monokai";

// require("dotenv").config();
// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET;

class CodeEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_modal: false,
      show_success: false,
      commit_msg: "",
      tooltipOpen: false,
      repo: "",
      directory: "",
      branch: ["master", "deploy", "QA"]
    };
  }

  onChange = e => {
    const editor = this.refs.aceEditor.editor;
    var code = editor.getValue();
    // var session = editor.getSession();
    // var sessionDocument = editor.getSession().getDocument();
    this.props.updateState(code);
  };

  toggle = () => {
    console.log("this.props.path: ", this.props.path);
    this.setState({ show_modal: !this.state.show_modal });
  };

  toggleTooltip = () => {
    // console.log("this.props.path: ", this.props.path);
    this.setState({ tooltipOpen: !this.state.tooltipOpen });
  };

  toggleSuccess = () => {
    // console.log("this.props.path: ", this.props.path);
    this.setState({ show_success: !this.state.show_success });
  };

  handleCommitChange = e => {
    this.setState({ commit_msg: e.target.value });
  };

  handleRepoChange = e => {
    this.setState({ repo: e.target.value });
  };

  handleDirectoryChange = e => {
    this.setState({ directory: e.target.value });
  };

  onPushToggle = () => {
    console.log("state in CodeEditor: ", this.state);
    this.toggle();
    this.props.onPush(this.props.path, this.state.commit_msg);
    this.toggleSuccess();
  };

  render() {
    // let splitLength = this.props.path.split("/").length;
    let repoName = this.props.path.split("/")[5];
    // let fileName = "";
    // for (let i = 7; i <= splitLength; i++) {
    //   fileName += "/" + this.props.path.split("/")[i];
    // }
    return (
      <div>
        <AceEditor
          ref="aceEditor"
          mode="javascript"
          theme="monokai"
          font-family="Roboto Mono"
          width="1080px"
          height="542px"
          focus={true}
          wrapEnabled={true}
          onChange={this.onChange}
          value={this.props.content}
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            // fontFamily: "Roboto",
            fontSize: 16,
            showPrintMargin: false,
            minLines: 25,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true
          }}
        />

        <Button color="success" className="commit-push" onClick={this.toggle}>
          Commit + Push
        </Button>
        <Modal
          isOpen={this.state.show_modal}
          toggle={this.toggle}
          className="commit"
        >
          <ModalHeader toggle={this.toggle}>Commit/Push - Details</ModalHeader>
          <ModalBody>
            <b>Repo</b>
            <br />
            <i>{repoName}</i>
            <br />
            <br />
            <b>Branch</b>
            <br />
            <i>{this.props.branch}</i>
            <AvForm onValidSubmit={this.onPushToggle}>
              <AvGroup>
                <Label for="commit_msg">
                  <br />
                  <b>Commit Message</b>{" "}
                  <a href="#" id="commit-tooltip">
                    <i class="fas fa-info-circle" />
                  </a>
                  <Tooltip
                    placement="right"
                    isOpen={this.state.tooltipOpen}
                    target="commit-tooltip"
                    toggle={this.toggleTooltip}
                  >
                    A commit message is mandatory
                  </Tooltip>
                </Label>
                <AvInput
                  name="commit_msg"
                  id="commit_msg"
                  onChange={this.handleCommitChange}
                  required
                />
                <AvFeedback>Please enter a commit message</AvFeedback>
              </AvGroup>
              <FormGroup>
                <br />
                <Button color="primary">Submit</Button>{" "}
                <Button color="secondary" onClick={this.toggle}>
                  Cancel
                </Button>
              </FormGroup>
            </AvForm>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={this.state.show_success}
          toggle={this.toggleSuccess}
          className="success_modal"
        >
          <ModalHeader toggle={this.toggleSuccess}> Success </ModalHeader>
          <ModalBody>
            Committed and pushed to GitHub!
            <FormGroup>
              <br />
              <Button color="secondary" onClick={this.toggleSuccess}>
                Close
              </Button>
            </FormGroup>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default CodeEditor;
