import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Consumer } from "../../context";
import Validator from "validator";
import { getSummonerByName } from "../../api/Lolapi";
import Error from "../layout/Error";
import { isEmpty } from "../../validation/is-empty";
import { searchSummoner as summonerSearch } from "../../api/Lolapi";
import { escape } from "../../util/escape";

class SummonerSearch extends Component {
  state = {
    summonerName: ""
  };

  onChange = event => {
    let input = escape(event.target.value, true, true);
    this.setState({
      summonerName: input
    });
  };

  searchSummoner = (dispatch, event) => {
    event.preventDefault();
    //Validate input
    let input = this.state.summonerName;

    if (
      !Validator.isLength(input, { min: 3, max: 25 }) ||
      Validator.isEmpty(input)
    ) {
      return;
    }

    input = escape(input, true, true);
    summonerSearch(input, dispatch);
  };

  render() {
    return (
      <Consumer>
        {value => {
          const { dispatch, error, summoner } = value;

          if (!isEmpty(error) && error.response.status !== 404)
            return <Error />;

          let inputHelp = "";
          if (!isEmpty(error) && error.response.status === 404)
            inputHelp = "Summoner not found, try again.";

          if (!isEmpty(summoner))
            return <Redirect to={`/summoner/${summoner.name}`} />;

          return (
            <React.Fragment>
              <h1 className="display-4 mt-5">Summoner Search</h1>
              <p className="lead">
                Enter the name of the summoner's profile you want to search.
              </p>
              <hr className="my-4" />
              <form onSubmit={this.searchSummoner.bind(this, dispatch)}>
                <div className="form-group">
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      placeholder="Summoner's Name..."
                      className="form-control"
                      onChange={this.onChange}
                    />
                    <div className="input-group-append">
                      <button className="btn btn-outline-primary" type="submit">
                        <i className="fas fa-search" />
                      </button>
                    </div>
                  </div>
                  <small id="summonerNameHelp" className="form-text text-muted">
                    {inputHelp}
                  </small>
                </div>
              </form>
            </React.Fragment>
          );
        }}
      </Consumer>
    );
  }
}

export default SummonerSearch;
