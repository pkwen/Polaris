import React, { Component } from "react";

class Console extends Component {
  constructor(props) {
    super(props);
    this.state = {
      evaluated_code: ""
    };
  }
  render() {
    return (
      <div className="console">
        <h5> Console </h5>
        <div className="console-divider" />
        <div className="console-tab"> </div>

        {/* add buttons for "run" and "clear" console */}
        <button className="run-button" onclick={this.evaluate}>
          Run
        </button>
        <button className="clear-button" onclick={this.clear}>
          Clear
        </button>
        <div className="evaluated-code" value={this.state.evaluated_code}>
          <p> > output </p>
        </div>
      </div>
    );
  }

  evaluate() {
    let evaluated_code = eval(this.props.value);
    this.setState = { evaluated_code: evaluated_code };
  }
  clear() {
    this.setState = { evaluated_code: "" };
  }
}

export default Console;
