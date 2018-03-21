import React, { Component } from "react";
import { Button } from "reactstrap";

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
        <div className="console-divider">
          <Button
            outline
            color="secondary"
            className="run-button"
            onClick={this.evaluate}
          >
            Run
          </Button>
          <Button
            outline
            color="secondary"
            className="clear-button"
            onClick={this.clear}
          >
            Clear
          </Button>
          {/* <button className="run-button" onClick={this.evaluate}>
            Run
          </button>
          <button className="clear-button" onClick={this.clear}>
            Clear
          </button> */}
        </div>
        {/* <div className="console-tab"> </div> */}

        <div className="evaluated-code">
          &gt; &nbsp; {this.state.evaluated_code}
        </div>
      </div>
    );
  }

  evaluate = () => {
    try {
      // eslint-disable-next-line
      let output = eval(this.props.content);
      this.setState({ evaluated_code: output });
    } catch (error) {
      let error_msg = `${error.name}: ${error.message}`;
      this.setState({ evaluated_code: error_msg });
    }
  };
  clear = () => {
    this.setState({ evaluated_code: "" });
  };
}

export default Console;
