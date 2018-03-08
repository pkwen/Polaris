import React, { Component } from "react";
import Message from "./Message.js";

class MessageList extends Component {
  render() {
    // console.log("Rendering <MessageList />");

    let messages = this.props.allMessages;
    let messageItems = messages.map(message => {
      return <Message message={message} />;
    });

    return <main className="messages">{messageItems}</main>;
  }
}
export default MessageList;
