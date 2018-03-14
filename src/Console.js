import React, { Component } from "react";

class Console extends Component {
  render() {
    return (
      <div className="console">
        <h5> Console </h5>
        <div className="console-divider" />
        <div className="evaluated-code">
          <p> > Evaluated Code Here </p>
        </div>
      </div>
    );
  }
}

export default Console;
