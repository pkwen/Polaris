import React, { Component } from "react";
import {
  Modal,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  Button,
  Popover,
  Tooltip,
  OverlayTrigger
} from "react-bootstrap";

class FormModal extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      commit_msg: "test commit msg here",
      path: ""
    };

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleCommitChange = this.handleCommitChange.bind(this);
    this.handlePathChange = this.handlePathChange.bind(this);

    this.state = {
      show: false
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleCommitChange(e) {
    this.setState({ commit_msg: e.target.value });
  }

  handlePathChange(e) {
    this.setState({ path: e.target.value });
  }

  // getValidationState() {
  //   const length = this.state.commit_msg.length;
  //   if (length > 0) return "success";
  //   else if (length <= 0) return "error";
  //   return null;
  // }

  onPush() {
    this.props.onPush(
      this.state.path,
      this.state.commit_msg,
      this.props.value,
      this.props.sha,
      this.props.token
    );
  }

  render() {
    // const popover = (
    //   <Popover id="modal-popover" title="popover">
    //     very popover. such engagement
    //   </Popover>
    // );
    // const tooltip = <Tooltip id="modal-tooltip">wow.</Tooltip>;

    return (
      // <!-- Button trigger modal -->

      // <!-- Modal -->
      <div
        className="modal"
        // class="modal fade"
        id="exampleModalCenter"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
                Modal title
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">...</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      // <div>
      //   <Button bsStyle="primary" bsSize="large" onClick={this.handleShow}>
      //     Commit + Push
      //   </Button>

      //   <Modal show={this.state.show} onHide={this.handleClose}>
      //     <Modal.Header closeButton>
      //       <Modal.Title>Modal heading</Modal.Title>
      //     </Modal.Header>
      //     <Modal.Body>
      //       <form>
      //         <FormGroup controlId="formBasicText">
      //           {/* validationState={this.getValidationState()} */}
      //           <ControlLabel>Test</ControlLabel>
      //           <FormControl
      //             type="text"
      //             value={this.state.commit_msg}
      //             placeholder="Enter text"
      //             onChange={this.handleCommitChange}
      //           />
      //           <FormControl
      //             type="text"
      //             value={this.state.path}
      //             placeholder="Enter text"
      //             onChange={this.handleCommitChange}
      //           />
      //           <FormControl.Feedback />
      //           <HelpBlock>Validation is based on string length.</HelpBlock>
      //         </FormGroup>
      //         <Button type="submit" onClick={this.onPush}>
      //           Submit
      //         </Button>
      //       </form>

      //       <h4>Popover in a modal</h4>
      //       <p>
      //         there is a{" "}
      //         <OverlayTrigger overlay={popover}>
      //           <a href="#popover">popover</a>
      //         </OverlayTrigger>{" "}
      //         here
      //       </p>

      //       <h4>Tooltips in a modal</h4>
      //       <p>
      //         there is a{" "}
      //         <OverlayTrigger overlay={tooltip}>
      //           <a href="#tooltip">tooltip</a>
      //         </OverlayTrigger>{" "}
      //         here
      //       </p>

      //       <hr />

      //
      //       <p>
      //         Praesent commodo cursus magna, vel scelerisque nisl consectetur
      //         et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor
      //         auctor.
      //       </p>
      //     </Modal.Body>
      //     <Modal.Footer>
      //       <Button onClick={this.handleClose}>Close</Button>
      //     </Modal.Footer>
      //   </Modal>
      // </div>
    );
  }
}

export default FormModal;
