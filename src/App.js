import React, { Component } from "react";
import { Base64 } from "js-base64";
import NavBarTop from "./NavBarTop.js";
import NavBarSide from "./NavBarSide.js";
import CodeEditor from "./CodeEditor.js";
import Console from "./Console.js";
import GitHub from "./github.js";
import Cookies from "universal-cookie";

//import App.css which is a compilation of all scss files
import "./styles/App.css";

const cookies = new Cookies();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomID: "polaris",
      user: "",
      token: "",
      content: "",
      path: "",
      sha: ""
    };
  }

  componentDidMount() {
    //get github verification code from url
    let gitToken = cookies.get("token");
    let username = cookies.get("user");
    // console.log(gitToken);
    if (gitToken) {
      this.setState({ token: gitToken, user: username });
      console.log(this.state);
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
    this.socket = new WebSocket("wss://polaris-editor.herokuapp.com");
    // this.socket = new WebSocket("ws://localhost:3001");
    this.socket.onopen = e => {
      console.log("opened");
      let roomed = window.location.href.match(/room\/(.*)/);
      let roomID = roomed ? roomed[1] : generateRandomString();
      this.setState({ roomID: roomID });
      window.history.replaceState("", "", `https://polaris-editor.herokuapp.com/room/${roomID}`);
      // window.history.replaceState("", "", `http://localhost:3000/room/${roomID}`);
      this.socket.send(
        JSON.stringify({
          type: "system",
          roomID: roomID
        })
      );
    };
    this.socket.onmessage = e => {
      console.log("e.data:", e.data);
      console.log("e.data(parsed):", JSON.parse(e.data));
      const parsedData = JSON.parse(e.data);
      if (parsedData.content) {
        this.setState({ content: parsedData.content });
      }
      if (parsedData.sha) {
        this.setState({ sha: parsedData.sha });
      }
      if (parsedData.branch) {
        this.setState({ branch: parsedData.branch });
      }
    };
  }

  render() {
    return (
      <div className="App">
        <div className="row">
          <div className="col-xl-12">
            <NavBarTop signOut={this.signOut} user={this.state.user} />
          </div>
        </div>
        <div className="row">
          <div className="col-xl-3 navbar-side">
            <NavBarSide
              token={this.state.token}
              onPull={this.onPull}
              getSha={this.getSha}
              newFile={this.newFile}
              setBranch={this.setBranch}
              updateState={this.updateState}
              user={this.state.user}
            />
          </div>
          <div className="col-xl-9 code-editor">
            <CodeEditor
              onPull={this.onPull}
              onPush={this.onPush}
              onAuth={this.onAuth}
              content={this.state.content}
              path={this.state.path}
              user={this.state.user}
              token={this.state.token}
              sha={this.state.sha}
              updateState={this.updateState}
              branch={this.state.branch}
            />
            <Console content={this.state.content} />
          </div>
        </div>
      </div>
    );
  }

  //GET request returning a file from github
  onPull = url => {
    console.log("url: ", url);
    this.setState({ path: url });

    GitHub.pullContent(url, this.state.token)
      .then(res =>
        this.setState({ content: Base64.decode(res.content), sha: res.sha })
      )
      .then(() => {
        this.socket.send(
          JSON.stringify({
            content: this.state.content,
            roomID: this.state.roomID,
            sha: this.state.sha,
            branch: this.state.branch
          })
        );
        console.log("this.state (after setting path to url): ", this.state);
      })
      .catch(err => console.log(err));
  };

  //GET request updating the sha of current file
  getSha = url => {
    GitHub.pullContent(url, this.state.token)
      .then(res => this.setState({ sha: res.sha }))
      .then(() => {
        console.log(this.state.sha);
        this.socket.send(
          JSON.stringify({
            sha: this.state.sha
          })
        );
      })
      .catch(err => console.log(err));
  };

  //PUT request updating the current file being edited
  onPush = (url, commit_msg) => {
    GitHub.pushContent(
      url,
      commit_msg,
      this.state.content,
      this.state.sha,
      this.state.token,
      this.state.branch
    )
      .then(res => {
        console.log(res.content.sha);
        this.setState({ sha: res.content.sha });
        console.log("successfully committed");
      })
      .catch(err => console.log(err));
  };

  //set branch to whatever branch file was pulled from
  setBranch = branch => {
    this.setState({ branch: branch });
  };

  //create new file
  newFile = (url, commit_msg, branch = "") => {
    GitHub.pushContent(url, commit_msg, "", "", this.state.token, branch)
      .then(res => {
        console.log("$$$$$$$$", res);
      })
      .catch(err => console.log(err));
  };

  //called after logging in with Github to retrieve a token used for further github auth
  onAuth = () => {
    const clientCode = window.location.href.match(/\?code=(.*)/)[1];
    GitHub.fetchToken(clientCode)
      .then(res => {
        this.setState({ token: res.access_token, user: res.username });
        cookies.set("user", res.username);
        cookies.set("token", res.access_token);
      })
      // .then(() => {
      //   let roomID = generateRandomString();
      //   window.history.replaceState(
      //     "",
      //     "",
      //     `http://localhost:3000/room/${roomID}`
      //   );
      //   this.socket.send(
      //     JSON.stringify({
      //       type: "system",
      //       roomID: roomID
      //     })
      //   );
      // })
      // .then(() => {
      //   // cookies.set("user", this.state.token);
      //   // console.log(cookies.get("user"));
      //   // fetch(`token/${this.state.token}`).then(res => { console.log(res) });
      // })
      .catch(err => console.log(err));
  };

  //log out function
  signOut = () => {
    this.setState({ token: "", user: "" });
    cookies.remove("user");
    cookies.remove("token");
    setTimeout(// window.location.assign("https://warm-plateau-87726.herokuapp.com/"),
      window.location.assign("https://polaris-editor.herokuapp.com"), 1000);
  };

  //called when code in editor is updated to broadcast change to all connected users in real time
  updateState = (content = this.state.content) => {
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
