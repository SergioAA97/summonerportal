import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Consumer } from "../../context";

export class Error extends Component {
  resetError = () => {
    console.log("Reset Error");

    this.props.value.dispatch({
      type: "SET_ERROR",
      payload: {}
    });

    console.log(this.props.value.error);
  };

  render() {
    return (
      <div className="row">
        <div
          className="col-12 offset-md-4 col-md-4 offset-lg-4 col-lg-4 text-center w-100"
          style={{ marginTop: "5rem" }}
        >
          <i className="fas fa-exclamation-triangle fa-5x" />
          <h2 className="mt-4 mb-4">
            {this.props.error.status}
            503
          </h2>
          <div className="text-center font-italic">
            Uh oh, something didn't work out.
          </div>
          <Link to="/" onClick={this.resetError}>
            Go Back
          </Link>
        </div>
      </div>
    );
  }
}

export default Error;
