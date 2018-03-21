import React, { Component } from "react";
import TreeFolders from "./TreeFolders.js";
// import "../node_modules/font-awesome/css/font-awesome.min.css";

class NavBarSide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged: false
    }
  }
  componentWillMount() {
  }
  render() {
    const clientID = "2437e80c83661e9e530f";
    const isLoggedIn = this.state.logged;
    return (
      <div>
        {isLoggedIn ? (
          <p />
        ) : (
          <a
            className="side-login"
            href={
              "https://github.com/login/oauth/authorize?scope=repo&client_id=" +
              clientID
            }
          >
            {" "}
            <i className="fab fa-github" />
            <p> Log in through GitHub </p>
          </a>
        )}

        <TreeFolders
          token={this.props.token}
          onPull={this.props.onPull}
          getSha={this.props.getSha}
          setBranch={this.props.setBranch}
          newFile={this.props.newFile}
          updateState={this.props.updateState}
          user={this.props.user}
          changeLogInStatus={this.changeLogInStatus}
        />
      </div>
    );
  }
  changeLogInStatus = () => {
    this.setState({ logged: true })
  }
}

export default NavBarSide;
