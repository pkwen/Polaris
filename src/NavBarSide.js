import React, { Component } from "react";
import TreeFolders from "./TreeFolders.js";
import { Button } from "reactstrap";

class NavBarSide extends Component {
  render() {
    const isLoggedIn = this.props.token;
    return (
      <div>
        {isLoggedIn ? (
          <p />
        ) : (
          <div>
            <i className="fab fa-github" />
            <Button
              outline
              color="secondary"
              className="github-button"
              onClick={this.githubRedirect}
            >
              Log in using GitHub
            </Button>
          </div>
        )}

        <TreeFolders
          token={this.props.token}
          onPull={this.props.onPull}
          getSha={this.props.getSha}
          setBranch={this.props.setBranch}
          newFile={this.props.newFile}
          updateState={this.props.updateState}
          user={this.props.user}
        />
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

export default NavBarSide;
