import React, { Component } from "react";
import { Button } from "reactstrap";
import Cookies from "universal-cookie";

const cookies = new Cookies();

class NavBarTop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged: false
    };
  }
  componentWillMount() {
    let clientCode = window.location.href.match(/\?code=(.*)/);
    if (clientCode || cookies.get("token")) {
      this.setState({ logged: true });
    }
  }
  render() {
    // const clientID = "2437e80c83661e9e530f";
    return (
      <div className="navbar-top">
        <nav>
          <a href="/" className="navbar-logo">
            <img
              className="polaris-logo"
              style={{ height: "58px" }}
              src="https://i.imgur.com/EAQGmqc.png"
              alt="Logo Here"
            />
          </a>
          <Button
            outline
            color="secondary"
            className="github-button"
            onClick={this.githubRedirect}
            style={{ display: this.state.logged ? "none" : "block" }}
          >
            <i className="top-nav-gh fab fa-github" /> Sign In
          </Button>

          <Button
            className="navbar-signout"
            outline
            color="secondary"
            onClick={this.props.signOut}
            style={{ display: this.state.logged ? "block" : "none" }}
          >
            <i className="top-nav-signout fas fa-sign-out-alt" /> Sign Out
          </Button>
        </nav>
      </div>
    );
  }

  githubRedirect = () => {
    const clientID = "2437e80c83661e9e530f";
    window.location =
      "https://github.com/login/oauth/authorize?scope=repo&client_id=" +
      clientID;
  };
}

export default NavBarTop;
