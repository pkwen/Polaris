import React, { Component } from "react";
import TreeFolders from "./TreeFolders.js";

class NavBarSide extends Component {
  render() {
    const isLoggedIn = this.props.token;
    return (
      <div className="navbar-side">
        {/* <h1> This is NavBarSide </h1> */}

        {isLoggedIn ? <p /> : <button>login to see repo</button>}

        <TreeFolders 
          token={this.props.token} 
          onPull={this.props.onPull}
        />
      </div>
    );
  }
}

export default NavBarSide;
