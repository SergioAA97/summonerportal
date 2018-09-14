import React, { Component } from "react";

const Context = React.createContext();

const reducer = (state, action) => {


  switch (action.type) {
    case "SET_SUMMONER":
      return {
        ...state,
        summoner: action.payload
      };
    case "SET_RANKED":
      return {
        ...state,
        summoner: { ...state.summoner, ranked: action.payload }
      };
    case "SET_CHAMPION_MASTERY":
      return {
        ...state,
        summoner: { ...state.summoner, championMastery: action.payload }
      };

    case "SET_LAST_MATCHES":
      return {
        ...state,
        summoner: { ...state.summoner, lastMatches: action.payload }
      };
    case "SET_ERROR": {
      return {
        ...state,
        error: { ...action.payload, fatal: action.fatal }
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
    summoner: {
      ranked: [],
      championMastery: [],
      lastMatches: []
    },

    dispatch: action => this.setState(state => reducer(state, action)),
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
