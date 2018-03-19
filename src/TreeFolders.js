import React from "react";
import { Treebeard } from "react-treebeard";
import { Base64 } from "js-base64";
import GitHub from "./github.js";

// let data = {
//   name: "root",
//   toggled: true,
//   children: [
//     {
//       name: "parent",
//       children: [{ name: "child1" }, { name: "child2" }]
//     },
//     {
//       name: "loading parent",
//       children: []
//     },
//     {
//       name: "parent",
//       children: [
//         {
//           name: "nested parent",
//           children: [{ name: "nested child 1" }, { name: "nested child 2" }]
//         }
//       ]
//     }
//   ]
// };

class TreeFolders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: "",
      loaded: false,
      data: {},
      spinner: false,
      cursor: {
        active: true
      }
    };
    this.onToggle = this.onToggle.bind(this);
  }

  componentWillMount() {
    let clientCode = window.location.href.match(/\?code=(.*)/);
    if (!this.state.spinner && clientCode) this.setState({ spinner: true });
  }

  render() {
    if (!this.state.loaded && this.props.token) {
      this.syncUserRepos();
    }
    return (
      <div className="tree-folders">
        <div className="container">
          <div
            className="spinner"
            style={{ display: this.state.spinner ? "block" : "none" }}
          />
        </div>
        <Treebeard
          data={this.state.data}
          onToggle={this.onToggle}
          className="tree-folders"
        />
      </div>
    );
  }

  //find parent node and add newly created child
  attachChild(data, name, child) {
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
            i.children.splice(i.children.length - 1, 0, child);
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
    if (this.state.cursor) {
      this.state.cursor.active = false;
    }
    console.log(node);
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
      node.loading = true;
    }
    if (
      node.type &&
      node.type !== "file" &&
      node.type !== "new" &&
      node.toggled
    ) {
      let children = await GitHub.accessElement(node.fullName, node.path);
      if (this.attachChildren(this.state.data, node.name, children)) {
        console.log("Loading children...");
        node.loading = false;
      } else {
        console.log("Unable to attach children to parent.");
        node.loading = false;
      }
    } else if (node.type === "file") {
      let url = `https://api.github.com/repos/${node.fullName}/contents/${
        node.path
      }`;
      this.props.onPull(url);
    } else if (node.type === "new") {
      let file = {
        name: "Danny",
        type: "file",
        fullName: node.fullName
      };
      let parentPath = `https://api.github.com/repos/${
        node.fullName
      }/contents/${node.path}`;
      let url = parentPath.match(/\/$/)
        ? `${parentPath}${file.name}`
        : `${parentPath}/${file.name}`;
      file.path = `${node.path}/${file.name}`;
      await this.props.newFile(url, "test msg");
      this.attachChild(this.state.data, node.parent, file);
      // let children = await GitHub.accessElement(node.fullName, node.path);
      // if (await this.attachChildren(this.state.data, node.parent, children)) {
      //   console.log('Loading children...');
      //   node.loading = false;
      // }
      setTimeout(this.props.getSha(url), 30000);
    }
    this.setState({ cursor: node });
  }

  //list all repos upon successful login
  async syncUserRepos() {
    this.setState({
      data: await GitHub.listRepos(this.props.user, this.props.token),
      loaded: true,
      spinner: false
    });
  }
}

export default TreeFolders;
