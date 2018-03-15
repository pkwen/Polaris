import React, { Component } from "react";
import { Base64 } from "js-base64";

import NavBarTop from "./NavBarTop.js";
import NavBarSide from "./NavBarSide.js";
import CodeEditor from "./CodeEditor.js";
import Console from "./Console.js";
import GitHub from "./github.js";

import "./styles/App.css"; //import App.css which is a compilation of all scss files

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      token: "",
      file: "https://api.github.com/repos/subclinical/boat/contents/weakend.md",
      res: "",
      value: "function() {}",
      sha: ""
    };
  }

  componentDidMount() {
    let clientCode = window.location.href.match(/\?code=(.*)/);
    let code = "";
    if(clientCode) {
      code = clientCode[1];
    }
    console.log(code + ' : ' + this.state.token);
    if (code && !this.state.token) {
      this.onAuth();
    }

  }

  render() {

    return (
      <div className="App">
        <NavBarTop />
        <NavBarSide token={this.state.token} />
        <CodeEditor
          onPull={this.onPull}
          onPush={this.onPush}
          onAuth={this.onAuth}
          growTree={this.growTree}
        />
        <Console />
      </div>
    );
  }

  //GET request returning a file from github
  onPull = () => {
    GitHub.pullContent("subclinical", "boat", "weakend.md")
      .then(res =>
        this.setState({ value: Base64.decode(res.content), sha: res.sha })
      )
      .catch(err => console.log(err));
  };

  //PUT request updating the current file being edited
  onPush = () => {
    GitHub.pushContent(
      this.state.file,
      "Straight outta Polaris",
      this.state.value,
      this.state.sha,
      this.state.token
    )
      .then(res => {
        this.setState({ res: Base64.decode(res.content) });
        console.log(res);
      })
      .catch(err => console.log(err));
  };

  //called after logging in with Github to retrieve a token used for further github auth
  onAuth = () => {
    const clientCode = window.location.href.match(/\?code=(.*)/)[1];
    GitHub.fetchToken(clientCode)
      .then(res => {
        this.setState({ token: res.access_token });
        console.log(res);
      })
      .catch(err => console.log(err));
  };

  growTree = () => {
    // GitHub.populateTree('facebook', 'create-react-app')
    GitHub.accessElement("boat", "")
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };
}

export default App;
