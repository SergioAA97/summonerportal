import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Consumer } from "../../context";

const messageFromStatus = status => {
  switch (status) {
    case 404:
      return "Not Found";
    case 503:
      return "Server Error, try again later";
    default:
      return "Uh oh, something didn't work";
  }
};

export class Error extends Component {
  resetError = () => {
    this.props.value.dispatch({
      type: "SET_ERROR",
      payload: {}
    });
  };

  render() {
    return (
      <Consumer>
        {value => {
          const { error } = value;
          const { status } = error.response;
          let statusMessage = messageFromStatus(status);
          return (
            <div className="row">
              <div
                className="col-12 offset-md-4 col-md-4 offset-lg-4 col-lg-4 text-center w-100"
                style={{ marginTop: "5rem" }}
              >
                <i className="fas fa-exclamation-triangle fa-5x" />
                <h2 className="mt-4 mb-4">{status}</h2>
                <div className="text-center font-italic">{statusMessage}</div>
                <Link to="/" onClick={this.resetError}>
                  Go Back
                </Link>
              </div>
            </div>
          );
        }}
      </Consumer>
    );
  }
}

export default Error;
