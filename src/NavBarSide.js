import React, { Component } from "react";
import TreeFolders from "./TreeFolders.js";

class NavBarSide extends Component {
  render() {
    const isLoggedIn = this.props.token;
    return (
      <div>
        {/* <h1> This is NavBarSide </h1> */}

        {isLoggedIn ? <p /> : <button>login to see repo</button>}

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
}

export default NavBarSide;
