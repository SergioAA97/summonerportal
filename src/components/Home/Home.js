import React, { Component } from "react";

import { SummonerSearch } from "..";
import { Consumer } from "../../context";
import { Error } from "..";
import { isEmpty } from "../../validation/is-empty";

export default class Home extends Component {
  render() {
    return (
      <Consumer>
        {value => {
          if (!isEmpty(value.error) && value.error.fatal) {
            return <Error />;
          }
          return (
            <div className="container">
              <SummonerSearch value={value}/>
            </div>
          );
        }}
      </Consumer>
    );
  }
}
