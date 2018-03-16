import React, { Component } from "react";

class NavBarTop extends Component {
  render() {
    const clientID = "57863a3c5df5ea6c3a77";
    return (
      <div className="navbar-top">
        {/* <h1>This is NavBarTop h1</h1>
        <h2>This is NavBarTop h2</h2> */}
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
          >
            {/* <img src="/assets/github_signin_logo.jpg" /> */}
          </a>
        </nav>
      </div>
    );
  }
}

export default NavBarTop;
