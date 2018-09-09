import React, { Component } from "react";

const Context = React.createContext();

const reducer = (state, action) => {
  if (action.callback === "function") {
    action.callback();
  }

  switch (action.type) {
    case "SET_SUMMONER":
      return {
        ...state,
        summoner: action.payload
      };
    case "SET_RANKED":
      return {
        ...state,
        ranked: action.payload
      };
    case "SET_CHAMPION_MASTERY":
      return {
        ...state,
        championMastery: action.payload
      };
    case "SET_ERROR": {
      return {
        ...state,
        error: action.payload
      };
    }
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
    ranked: [],
    championMastery: [],
    dispatch: action => this.setState(state => reducer(state, action)),
    loading: false,
    error: {}
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
