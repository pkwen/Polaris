import React, { Component } from "react";
import { Button } from "reactstrap";

class NavBarTop extends Component {
  render() {
    const clientID = "2437e80c83661e9e530f";
    return (
      <div className="navbar-top">
        <nav>
          <a href="/" className="navbar-logo">
            Logo Here
          </a>
          <a
            href={
              "https://github.com/login/oauth/authorize?scope=repo&client_id=" +
              clientID
            }
            className="navbar-login"
            style={{ display: this.props.user ? "none" : "block" }}
          />
          <Button
            className="navbar-signout"
            outline
            color="secondary"
            onClick={this.props.signOut}
            style={{ display: this.props.user ? "block" : "none" }}
          >
            {" "}
            Sign Out
          </Button>
        </nav>
      </div>
    );
  }
}

export default NavBarTop;
