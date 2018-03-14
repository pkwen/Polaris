import React, { Component } from "react";
import TreeFolders from "./TreeFolders.js";

class NavBarSide extends Component {
  render() {
    return (
      <div className="navbar-side">
        {/* <h1> This is NavBarSide </h1> */}
        <TreeFolders token={this.props.token} />
      </div>
    );
  }
}

export default NavBarSide;
