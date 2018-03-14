import React, { Component } from "react";
import MonacoEditor from "react-monaco-editor";
import { Base64 } from "js-base64";
import GitHub from "./github.js";

require("monaco-editor/min/vs/editor/editor.main.css");
require("dotenv").config();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

class CodeEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      file: "https://api.github.com/repos/subclinical/boat/contents/weakend.md",
      res: "",
      value: "function() {}",
      sha: ""
    };
  }

  componentDidMount() {
    let url = "wss://afternoon-waters-66838.herokuapp.com/";
    this.socket = new WebSocket("ws://localhost:3001");
    this.socket.onopen = e => {
      console.log("opened");
    };
    this.socket.onmessage = e => {
      const parsedData = JSON.parse(e.data);
      // console.log(Date.now() + " state change observed");
      this.setState({ value: parsedData });
      // setInterval(this.setState({ value: parsedData }), 500);
    };
  }

  editorDidMount(editor, monaco) {
    console.log("editorDidMount", editor);
    editor.focus();
  }

  //updates state and rerenders editor
  onChange = e => {
    const model = this.refs.monaco.editor.getModel();
    // console.log(model)
    // model.validatePosition({ lineNumber: 1, column: 2 });
    const value = model.getValue();
    this.setState({
      value: value
    });
    this.socket.send(JSON.stringify(value));
    // console.log(this.state.value);
  };

  render() {
    const requireConfig = {
      url:
        "https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.1/require.min.js",
      paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.6.1/min/vs"
      }
    };
    return (
      <div className="code-editor">
        <button className="grow-tree" onClick={this.props.growTree}>
          Populate Tree
        </button>
        <a
          className="gh-login"
          href="https://github.com/login/oauth/authorize?client_id=2437e80c83661e9e530f"
        >
          Log In with GitHub
        </a>
        <button className="get-token" onClick={this.props.onAuth}>
          Get Token
        </button>
        <button className="get-hub" onClick={this.props.onPull}>
          Fetch Data
        </button>
        <button className="push-hub" onClick={this.props.onPush}>
          Update Data
        </button>

        <MonacoEditor
          ref="monaco"
          width="1120"
          height="550"
          language="javascript" //   theme="vs-dark"
          value={this.state.value}
          onChange={this.onChange}
          editorDidMount={this.editorDidMount}
          requireConfig={requireConfig}
        />
      </div>
    );
  }
}

export default CodeEditor;

// class App extends Component {
// pullContent = async () => {
//   const response = await fetch("https://api.github.com/repos/subclinical/day-one/contents/weakend.md");
//   const body = await response.json();
//   console.log(body);

//   if (response.status !== 200) throw Error(body.message);

//   return body;
// };

// pushContent = async () => {
//   const response = await fetch(
//     "https://api.github.com/repos/subclinical/day-one/contents/weakend.md",
//     {
//       method: "PUT",
//       headers: {
//         "Authorization": "token " //Insert Token here to authenticate pushing
//       },
//       body: JSON.stringify({
//         "content": Base64.encode(this.state.value),
//         "message": "Straight outta Polaris",
//         "sha": this.state.sha
//       })
//     }
//   );
//   const body = await response.json();

//   if (response.status !== 200) throw Error(body.message);
//   return body;
// }

// fetchToken = async () => {
//   this.clientCode = window.location.href.replace("http://localhost:3000/auth/login?code=", "");
//   this.urlurl = `https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${this.clientCode}`;
//   const response = await fetch(
//     `https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token?client_id=2437e80c83661e9e530f&client_secret=b0ae333d9094c5597743cb2fd658cf8b5188aabb&code=${this.clientCode}`,
//     {
//       method: "POST",
//       headers: {
//         'Accept': 'application/json'
//       }
//     }
//   )
//   const body = await response.json();
//   console.log(this.clientCode.replace('http://localhost:3000/auth/login?code=', ''));
//   return body;
// }

//   componentDidMount() {
//     let url = "wss://afternoon-waters-66838.herokuapp.com/";
//     this.socket = new WebSocket("ws://localhost:3001");
//     this.socket.onopen = e => {
//       console.log("opened");
//     };
//     this.socket.onmessage = e => {
//       const parsedData = JSON.parse(e.data);
//       // console.log(Date.now() + " state change observed");
//       this.setState({ value: parsedData });
//       // setInterval(this.setState({ value: parsedData }), 500);
//     };
//   }

//   //updates state and rerenders editor
//   onChange = e => {
//     const model = this.refs.monaco.editor.getModel();
//     // console.log(model)
//     // model.validatePosition({ lineNumber: 1, column: 2 });
//     const value = model.getValue();
//     this.setState({
//       value: value
//     });
//     this.socket.send(JSON.stringify(value));
//     // console.log(this.state.value);
//   };

//   render() {
//     const requireConfig = {
//       url:
//         "https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.1/require.min.js",
//       paths: {
//         vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.6.1/min/vs"
//       }
//     };
//     return (
//       <div className="App">
//         {/* <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <h1 className="App-title">Welcome to React</h1>
//         </header> */}
//         <p className="App-intro">
//           To get started, edit <code>src/App.js</code> and save to reload. App
//           State: {this.state.res}
//         </p>
//         {/* <p className="App-intro">{this.state.response}</p> */}
//         <button className="grow-tree" onClick={this.growTree}>
//           Populate Tree
//         </button>
//         <a
//           className="gh-login"
//           href="https://github.com/login/oauth/authorize?client_id=2437e80c83661e9e530f"
//         >
//           Log In with GitHub
//         </a>
//         <button className="get-token" onClick={this.onAuth}>
//           Get Token
//         </button>
//         <button className="get-hub" onClick={this.onPull}>
//           Fetch Data
//         </button>
//         <button className="push-hub" onClick={this.onPush}>
//           Update Data
//         </button>
//         <MonacoEditor
//           ref="monaco"
//           width="800"
//           height="600"
//           language="javascript"
//           value={this.state.value}
//           onChange={this.onChange}
//           requireConfig={requireConfig}
//         />
//       </div>
//     );
//   }
// }
