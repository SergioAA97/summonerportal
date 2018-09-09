import React, { Component } from "react";

import { SummonerSearch } from "./";
import { Consumer } from "../context";
import { Error } from "./";
import { isEmpty } from "../validation/is-empty";

export default class Home extends Component {
  render() {
    return (
      <Consumer>
        {value => {
          if (!isEmpty(value.error)) {
            return <Error error={value.error} value={value} />;
          }
          return (
            <div className="container">
              <SummonerSearch />
            </div>
          );
        }}
      </Consumer>
    );
  }
}
