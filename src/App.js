import React, { Component } from "react";
import { Base64 } from "js-base64";
import NavBarTop from "./NavBarTop.js";
import NavBarSide from "./NavBarSide.js";
import CodeEditor from "./CodeEditor.js";
import Console from "./Console.js";
import GitHub from "./github.js";
import Cookies from "universal-cookie";

import "./styles/App.css"; //import App.css which is a compilation of all scss files

const cookies = new Cookies();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomID: "polaris",
      user: "",
      token: "",
      content: "func",
      sha: ""
    };
  }

  componentDidMount() {
    //get github verification code from url
    let gitToken = cookies.get("user");
    if (gitToken) {
      this.setState({ token: gitToken });
    }
    console.log(gitToken);

    let clientCode = window.location.href.match(/\?code=(.*)/);
    let code = "";
    if (clientCode) {
      code = clientCode[1];
    }
    //if code is present in url, retrieve auth token from github
    if (code && !this.state.token) {
      this.onAuth();
    }
    //websocket
    this.socket = new WebSocket("ws:localhost:3001");
    this.socket.onopen = e => {
      console.log("opened");
      let roomed = window.location.href.match(/room\/(.*)/);
      let roomID = "";
      if (roomed) {
        roomID = roomed[1];
        this.setState({ roomID: roomID });
        this.socket.send(
          JSON.stringify({
            type: "system",
            roomID: roomID
          })
        );
      }
    };
    this.socket.onmessage = e => {
      const parsedData = JSON.parse(e.data);
      this.setState({ content: parsedData.content });
    };
  }

  render() {
    return (
      <div className="App container">
        <div className="row">
          <div className="col-lg-12">
            <NavBarTop />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3">
            <NavBarSide
              token={this.state.token}
              onPull={this.onPull}
              updateState={this.updateState}
            />
          </div>
          <div className="col-lg-9">
            <CodeEditor
              onPull={this.onPull}
              onPush={this.onPush}
              onAuth={this.onAuth}
              content={this.state.content}
              token={this.state.token}
              sha={this.state.sha}
              updateState={this.updateState}
              // growTree={this.growTree}
            />
            <Console />
          </div>
        </div>
      </div>
    );
  }

  //GET request returning a file from github
  onPull = url => {
    GitHub.pullContent(url)
      .then(res =>
        this.setState({ content: Base64.decode(res.content), sha: res.sha })
      )
      .then(() => {
        console.log(this.state.content);
        this.socket.send(
          JSON.stringify({
            content: this.state.content,
            roomID: this.state.roomID
          })
        );
      })
      .catch(err => console.log(err));
  };

  //PUT request updating the current file being edited
  onPush = (url, commit_msg) => {
    console.log("this.state at App: ", this.state);
    GitHub.pushContent(
      url,
      commit_msg,
      this.state.content,
      this.state.sha,
      this.state.token
    )
      .then(res => {
        // this.setState({ sha: Base64.decode(res.sha) });
        // console.log(res);
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
      .then(() => {
        let roomID = generateRandomString();
        window.history.replaceState(
          "",
          "",
          `http://localhost:3000/room/${roomID}`
        );
        this.socket.send(
          JSON.stringify({
            type: "system",
            roomID: roomID
          })
        );
      })
      .then(() => {
        cookies.set("user", this.state.token);
        console.log(cookies.get("user"));
        // fetch(`token/${this.state.token}`).then(res => { console.log(res) });
      })
      .catch(err => console.log(err));
  };

  //called when code in editor is updated to broadcast change to all connected users in real time
  updateState = (content = this.state.content) => {
    console.log(content);
    let roomed = window.location.href.match(/room\/(.*)/);
    let roomID = "polaris";
    if (roomed) {
      roomID = roomed[1];
    }
    this.setState({ content: content });
    this.socket.send(
      JSON.stringify({
        roomID: roomID,
        content: content
      })
    );
  };
}

export default App;

//generates 6 alphanumeric character strings using Math.random method
function generateRandomString() {
  var str = "";
  while (str.length < 6) {
    var candidate = Math.floor(Math.random() * 74 + 48);
    if (
      (candidate >= 48 && candidate <= 57) ||
      (candidate >= 65 && candidate <= 90) ||
      (candidate >= 97 && candidate <= 122)
    ) {
      str += String.fromCharCode(candidate);
    }
  }
  return str;
}
