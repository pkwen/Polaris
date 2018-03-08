import React, { Component } from "react";

class Message extends Component {
  render() {
    // console.log("Rendering <Message />");
    // console.log("this.props:", this.props);

    if (this.props.message.type === "incomingImage") {
      console.log("got incomingImage to Message render");
      console.log("props.image:", this.props.message.content);
      return (
        <div className="message">
          <span className="message-username">
            {this.props.message.currentUser}
          </span>
          <span className="message-image">
            <img src={this.props.message.content} />
          </span>
        </div>
      );
    } else if (this.props.message.type === "incomingNotification") {
      return (
        <div className="notification">
          <span>
            ** {this.props.message.prevUser} changed username to{" "}
            {this.props.message.currentUser} **
          </span>
        </div>
      );
    } else if (this.props.message.type === "incomingMessage") {
      return (
        <div className="message">
          <span className="message-username">
            {this.props.message.currentUser}
          </span>
          <span className="message-content">{this.props.message.content}</span>
        </div>
      );
    } else {
      return <div />;
    }
  }
}
export default Message;
