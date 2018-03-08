import React, { Component } from "react";

class ChatBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: props.currentUser,
      prevUser: "",
      content: ""
    };
  }

  render() {
    // console.log("Rendering <ChatBar />");
    return (
      <footer className="chatbar">
        <input
          className="chatbar-username"
          placeholder="Your Name (Optional)"
          value={this.state.currentUser}
          onChange={this.handleUserChange}
          onKeyPress={event => {
            if (event.key === "Enter") {
              this.submitNotification();
            }
          }}
        />
        <input
          className="chatbar-message"
          placeholder="Type a message and hit ENTER"
          value={this.state.content}
          onChange={this.handleMessageChange}
          onKeyPress={event => {
            if (event.key === "Enter") {
              this.submitMessage();
            }
          }}
        />
      </footer>
    );
  }

  handleUserChange = event => {
    this.setState({ currentUser: event.target.value });
  };

  handleMessageChange = event => {
    this.setState({ content: event.target.value });
  };

  submitMessage = () => {
    if (!this.state.content) {
      return;
    } else {
      this.props.onSubmit(this.state);
      this.setState({ content: "" });
    }
  };

  submitNotification = () => {
    //if the value of the username is empty/false, set the state to Anonymous, so the conditional below can be evaluated properly
    //specifically for (object.prevUser === object.currentUser), so it's never checking if (Anonymous === "")
    if (!this.state.currentUser) {
      this.setState(
        {
          currentUser: "~Anonymous~"
        },
        //callback function once the state is set/updated to Anonymous
        () => {
          //create an object to capture the prevUser and the currentUser
          //prevUser comes from props (App state)
          //currentUser is set when handleUserChange or set here if it's empty
          let object = {
            prevUser: this.props.currentUser,
            currentUser: this.state.currentUser
          };
          //check if the user was already Anonymous, if so, do nothing
          if (object.prevUser === object.currentUser) {
            return;
            //else send a notification that a user has changed to Anonymous
          } else {
            this.props.onNotification(object);
          }
        }
      );
    } else {
      let object = {
        prevUser: this.props.currentUser,
        currentUser: this.state.currentUser
      };
      if (object.prevUser === object.currentUser) {
        return;
      } else {
        this.props.onNotification(object);
      }
    }
  };
}
export default ChatBar;
