import React, { Component } from "react";
import TreeFolders from "./TreeFolders.js";
import { Button } from "reactstrap";

class NavBarSide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      isLoggedIn: false
    };
  }

  componentWillMount() {
    let clientCode = window.location.href.match(/\?code=(.*)/);
    if (clientCode || this.props.token || this.props.user) {
      this.setState({ isLoggedIn: true });
    }
  }

  // componentWillUnmount() {
  //   if (this.props.token || this.props.user) {
  //     this.setState({ isLoggedIn: true });
  //   }
  // }

  render() {
    // let clientCode = window.location.href.match(/\?code=(.*)/);
    // if (clientCode && this.props.user) {
    //   this.setState({ isLoggedIn: true });
    // }
    // if (isLoggedIn && !this.state.spinner) this.setState({ spinner: true });

    // let clientCode = window.location.href.match(/\?code=(.*)/);
    // const isLoggedIn = this.props.user;
    // let showLogin;

    // if (!isLoggedIn) {
    //   showLogin = (
    //     <div className="side-login text-center">
    //       <i className="fab fa-github" />
    //       <br />
    //       <Button
    //         outline
    //         color="secondary"
    //         className="github-button"
    //         onClick={this.githubRedirect}
    //       >
    //         Log in using GitHub
    //       </Button>
    //     </div>
    //   );
    // }

    return (
      <div>
        <div
          className="side-login text-center"
          style={{
            display:
              // this.state.isLoggedIn || this.state.spinner ? "none" : "block"
              this.state.isLoggedIn ? "none" : "block"
          }}
        >
          <i className="fab fa-github" />
          <br />
          <Button
            outline
            color="secondary"
            className="github-button"
            onClick={this.githubRedirect}
          >
            Log in using GitHub
          </Button>
        </div>
        <div className="container">
          <div
            className="spinner"
            style={{ display: this.state.spinner ? "block" : "none" }}
          />
        </div>
        {/* {clientCode || isLoggedIn ? (
          <p />
        ) : (
          <div className="side-login text-center">
            <i className="fab fa-github" />
            <br />
            <Button
              outline
              color="secondary"
              className="github-button"
              onClick={this.githubRedirect}
            >
              Log in using GitHub
            </Button>
          </div>
        )} */}
        {/* {showLogin} */}
        <div className="tree-folders">
          <TreeFolders
            token={this.props.token}
            onPull={this.props.onPull}
            getSha={this.props.getSha}
            setBranch={this.props.setBranch}
            newFile={this.props.newFile}
            updateState={this.props.updateState}
            user={this.props.user}
            toggleSpinner={this.toggleSpinner}
          />
        </div>
      </div>
    );
  }

  toggleSpinner = () => {
    this.setState({ spinner: !this.state.spinner });
  };

  githubRedirect = () => {
    const clientID = "2437e80c83661e9e530f";
    window.location =
      "https://github.com/login/oauth/authorize?scope=repo&client_id=" +
      clientID;
    this.setState({ isLoggedIn: true });
  };
}

export default NavBarSide;
