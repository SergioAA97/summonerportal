import React from "react";

const Spinner = props => {
  return (
    <div className="row d-flex">
      <div className="text-center mt-5 col-12 col-md-4 offset-md-4 mb-5 align-self-center">
        <i className={`fas fa-circle-notch fa-3x fa-spin`} />
      </div>
    </div>
  );
};

export default Spinner;
