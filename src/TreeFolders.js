import React from "react";
import { Treebeard, decorators } from "react-treebeard";
// import { Base64 } from "js-base64";
import GitHub from "./github.js";
import Cookies from "universal-cookie";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label
} from "reactstrap";

import {
  AvForm,
  AvGroup,
  AvInput,
  AvFeedback
} from "availity-reactstrap-validation";


// Example: Customising The Header Decorator To Include Icons
decorators.Header = ({style, node}) => {
  var iconType = ""
    switch (node.type) {
      case "root": iconType = "far fa-user";
        break;
      case "branch": iconType = "fas fa-code-branch";
        break;
      case "dir": iconType = "far fa-folder";
        break;
      case "file": iconType = "far fa-file-alt";
        break;
      case "new": iconType = "fas fa-plus";
        break;
      default: break;
    }
    const iconClass = `${iconType}`;
    const iconStyle = {marginRight: '5px'};

    return (
        <div style={style.base}>
            <div style={style.title}>
                <i className={iconClass} style={iconStyle}/>

                {node.name}
            </div>
        </div>
    );
};

const cookies = new Cookies();

class TreeFolders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: "",
      loaded: false,
      spinner: false,
      data: {},
      cursor: {
        active: true
      },
      show_modal: false,
      file_name: "",
      node: {}
    };
    this.onToggle = this.onToggle.bind(this);
  }

  componentWillMount() {
    let clientCode = window.location.href.match(/\?code=(.*)/);
    if (!this.state.spinner && (clientCode || cookies.get("token"))) {
      this.setState({ spinner: true });
      this.props.changeLogInStatus();
    }
    console.log(this.state.data);
  }

  render() {
    if (!this.state.loaded && this.props.token) {
      this.syncUserRepos();
    }
    return (
      <div>
        <div className="container text-center spin-div">
          <div
            className="spinner"
            style={{ display: this.state.spinner ? "block" : "none" }}
          />
        </div>
        <div className="tree-folders">
          <Treebeard data={this.state.data} onToggle={this.onToggle} />
          <Modal
            isOpen={this.state.show_modal}
            toggle={this.toggle}
            className="test_modal"
          >
            <ModalHeader toggle={this.toggle}>Create new file</ModalHeader>
            <ModalBody>
              <b>Branch</b>
              <br />
              <i>{this.state.node.branch}</i>
              <br />
              <AvForm onValidSubmit={this.createFile}>
                <AvGroup>
                  <Label for="path">
                    <br />
                    <b>File Name</b>
                  </Label>
                  <AvInput
                    name="path"
                    id="path"
                    onChange={this.handleFileChange}
                    placeholder="Enter a file name"
                    required
                  />{" "}
                  <AvFeedback>Please enter a file name</AvFeedback>
                </AvGroup>
                <FormGroup>
                  <Button color="success">Create</Button>{" "}
                  <Button color="secondary" onClick={this.toggle}>
                    Cancel
                  </Button>
                </FormGroup>
              </AvForm>
            </ModalBody>
          </Modal>
        </div>
      </div>
    );
  }

  toggle = () => {
    this.setState({ show_modal: !this.state.show_modal });
  };

  handleFileChange = e => {
    this.setState({ file_name: e.target.value });
  };

  createFile = async () => {
    this.toggle();
    console.log("node:", this.state.node);

    this.props.setBranch(this.state.node.branch);
    let file = {
      name: this.state.file_name,
      type: "file",
      fullName: this.state.node.fullName,
      branch: this.state.node.branch
    };
    let parentPath = `https://api.github.com/repos/${
      this.state.node.fullName
    }/contents/${this.state.node.path}`;
    let url = parentPath.match(/contents\//)
      ? `${parentPath}${file.name}`
      : `${parentPath}/${file.name}`;
    // url += `?ref=${node.branch}`
    file.path =
      this.state.node.path.match(/\/$/) || this.state.node.path === ""
        ? `${this.state.node.path}${file.name}`
        : `${this.state.node.path}/${file.name}`;
    await this.props.newFile(url, "initial commit", this.state.node.branch);
    await this.attachChild(this.state.data, this.state.node.parent, file);
    this.setState({ data: this.state.data });
    // setTimeout(this.props.getSha(url), 30000);
  };

  //find parent node and add newly created child
  attachChild(data, name, child) {
    child.type = "file";
    if (data.children) {
      loop: for (const i of data.children) {
        if (i.name === name) {
          console.log(i.children);
          if (i.children.length) {
            //if file already in directory, abort
            for (const j of i.children) {
              if (j.name === child.name) {
                break loop;
              }
            }
            i.children.splice(i.children.length, 0, child);
          } else {
            i.children = [child];
          }
          console.log(data + "found");
          return data;
        } else if (i.children) {
          console.log(data + "data has children");
          this.attachChild(i, name, child);
        }
      }
    } else {
      if (data.name === name) {
        console.log("data without children found" + data);
        data.children.push(child);
        return data;
      }
    }
    return false;
  }

  //find parent node and add children
  attachChildren(data, name, children) {
    if (data.children) {
      for (const i of data.children) {
        if (i.name === name) {
          i.children = children;
          console.log(data + "found");
          return data;
        } else if (i.children) {
          console.log(data + "data has children");
          this.attachChildren(i, name, children);
        }
      }
    } else {
      if (data.name === name) {
        console.log("data without children found" + data);
        data.children = children;
        return data;
      }
    }
    return false;
  }

  //when navigator tree is clicked, make api calls to github and render children of target
  async onToggle(node, toggled) {
    console.log(node);
    if(node.type === "root") {
      return;
    }
    if (this.state.cursor) {
      this.state.cursor.active = false;
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
      node.loading = true;
    }
    if (node.type === "repo" && node.toggled) {
      let children = await GitHub.listBranches(node.fullName, this.props.token);
      if (this.attachChildren(this.state.data, node.name, children)) {
        console.log("Loading children...");
        node.loading = false;
      } else {
        console.log("Unable to attach children to parent.");
        node.loading = false;
      }
    } else if (node.type === "branch" && node.toggled) {
      this.props.setBranch(node.branch);
      let children = await GitHub.accessElement(
        node.fullName,
        node.path,
        node.branch,
        this.props.token
      );
      if (this.attachChildren(this.state.data, node.name, children)) {
        console.log("Loading children...");
        node.loading = false;
      } else {
        console.log("Unable to attach children to parent.");
        node.loading = false;
      }
    } else if (node.type === "dir" && node.toggled) {
      this.props.setBranch(node.branch);
      let children = await GitHub.accessElement(
        node.fullName,
        node.path,
        node.branch,
        this.props.token
      );
      if (this.attachChildren(this.state.data, node.name, children)) {
        console.log("Loading children...");
        node.loading = false;
      } else {
        console.log("Unable to attach children to parent.");
        node.loading = false;
      }
    } else if (node.type === "file") {
      this.props.setBranch(node.branch);
      console.log(node.path);
      let url = `https://api.github.com/repos/${node.fullName}/contents/${
        node.path
      }?ref=${node.branch}`;
      this.props.onPull(url, this.props.token);
    } else if (node.type === "new") {
      //show modal
      this.toggle();
      this.setState({ node: node });
    }
    this.setState({ cursor: node });
  }

  //list all repos upon successful login
  async syncUserRepos() {
    this.setState(
      {
        loaded: true,
        data: await GitHub.listRepos(this.props.user, this.props.token),
        spinner: false
      }
      // this.props.toggleSpinner()
    );
  }
}

export default TreeFolders;
