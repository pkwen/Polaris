import React, { Component } from "react";
import MonacoEditor from 'react-monaco-editor'
// import MessageList from "./MessageList.js";
// import ChatBar from "./ChatBar.js";
// import NavBar from "./NavBar.js";
require('monaco-editor/min/vs/editor/editor.main.css')

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
  }
  componentWillMount() {
    const url = "wss://secret-meadow-50707.herokuapp.com/";
    this.socket = new WebSocket(url);
    this.socket.wsURL = "wss://secret-meadow-50707.herokuapp.com/";
    this.socket.onopen = e => {
      console.log("opened");
    };
    this.socket.onmessage = e => {
      const parsedData = JSON.parse(e.data);
      this.setState({ value: parsedData });
    };
  }
  onChange = e => {
    const model = this.refs.monaco.editor.getModel();
    const value = model.getValue();
    this.setState({
      value: value
    });
    console.log(this.state.value);
    this.socket.send(JSON.stringify(value));
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
      <div className="App">
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header> */}
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
          {this.socket.wsURL}
        </p>
        <MonacoEditor
          ref="monaco"
          width="800"
          height="600"
          language="javascript"
          value={this.state.value}
          onChange={this.onChange}
          requireConfig={requireConfig}
        />
      </div>
    );
  }
}
//   constructor(props) {
//     super(props);
//     this.state = {
//       currentUser: "Michael", // optional. if currentUser is not defined, it means the user is Anonymous
//       prevUser: "",
//       messages: [],
//       userCount: 0
//     };
//   }
//   wss.clients.forEach(function each(client) {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(JSON.stringify(userCountObj));
//     }
//   });

//   ws.on("message", function incoming(message) {
//     // console.log("received a messge");
//     let parsedMessage = JSON.parse(message);

//     parsedMessage.id = uuidv1();

//     //add message "type" depending on the message receied from the client
//     if (parsedMessage.type === "postMessage") {
//       parsedMessage.type = "incomingMessage";
//     } else if (parsedMessage.type === "postImage") {
//       parsedMessage.type = "incomingImage";
//       console.log("received image");
//     } else if (parsedMessage.type === "postNotification") {
//       parsedMessage.type = "incomingNotification";
//     }

//     //send message to client (message)
//     wss.clients.forEach(function each(client) {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(JSON.stringify(parsedMessage));
//       }
//     });
//   });

//   // Set up a callback for when a client closes the socket. This usually means they closed their browser.
//   ws.on("close", () => {
//     console.log("Client disconnected");
//     userCount--;
//     console.log("userCount:", userCount);
//   });
// });
//   componentDidMount() {
//     // console.log("componentDidMount <App />");
//     this.ws = new WebSocket("wss://enigmatic-temple-17196.herokuapp.com/");

//     //when server broadcasts a message, take this message and update the App state and render the incoming message
//     this.ws.onmessage = event => {
//       const parsedData = JSON.parse(event.data);
//       // console.log("parsedData:", parsedData);

//       switch (parsedData.type) {
//         case "userCount":
//           this.setState({ userCount: parsedData.userCount });
//           // console.log("this.state after userCount Message:", this.state);
//           break;
//         case "incomingMessage":
//         case "incomingNotification":
//         case "incomingImage":
//           const updatedMessages = this.state.messages.concat(parsedData);
//           this.setState({ messages: updatedMessages });
//           // console.log("this.state after updatedMessages:", this.state);
//           break;
//       }
//     };
//   }

//   render() {
//     // console.log("Rendering <App />");
//     return (
//       <div>
//         <NavBar userCount={this.state.userCount} />
//         <MessageList allMessages={this.state.messages} />
//         <ChatBar
//           currentUser={this.state.currentUser}
//           onSubmit={this.onSubmit}
//           onNotification={this.onNotification}
//         />
//       </div>
//     );
//   }

//   //when user hits "Enter", send message object (with item.type = postMessage) to server, server will then broadcast message to the right client (or all client)
//   onSubmit = item => {
//     const imageExtension = /(\.jpg|\.gif|\.jpeg|\.png)/;
//     if (item.content.match(imageExtension)) {
//       item.type = "postImage";
//       console.log("found image");
//       this.ws.send(JSON.stringify(item));
//     } else {
//       item.type = "postMessage";
//       this.ws.send(JSON.stringify(item));
//     }
//   };

//   //when user hits "Enter", send message object (with item.type = postNotification) to server, server will then broadcast message to the right client (or all client)
//   onNotification = item => {
//     item.type = "postNotification";
//     this.setState({ currentUser: item.currentUser }); //set state of currentUser in App component so when it's passed back down to ChatBar, the updated user will be included
//     this.ws.send(JSON.stringify(item));
//   };
// }

export default App;
