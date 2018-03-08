import React, { Component } from "react";

class NavBar extends Component {
  render() {
    // console.log("Rendering <NavBar />");
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">
            Slackr
          </a>
          <span id="userCount">
            # of User(s) Online: {this.props.userCount}
          </span>
        </nav>
      </div>
    );
  }
}

export default NavBar;
