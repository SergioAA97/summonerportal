import React, { Component } from "react";
import Axios from "axios";

const Context = React.createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_SUMMONER":
      return {
        ...state,
        summoner: action.payload,
        heading: "Search Results"
      };
    case "DISPLAY_LOADING":
      return {
        ...state,
        loading: action.payload
      };

    default:
      return state;
  }
};

export class Provider extends Component {
  state = {
    summoner: {},
    heading: "Search Summoner",
    dispatch: action => this.setState(state => reducer(state, action)),
    loading: false
  };

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export const Consumer = Context.Consumer;
