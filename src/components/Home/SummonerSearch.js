import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Consumer } from "../../context";
import Validator from "validator";
import { getSummonerByName } from "../../api/Lolapi";
import Error from "../layout/Error";
import { isEmpty } from "../../validation/is-empty";

class SummonerSearch extends Component {
  state = {
    summonerName: "",
    notFound: false,
    redirect: false
  };

  onChange = event => {
    this.setState({
      summonerName: event.target.value
    });
  };

  searchSummoner = (dispatch, event) => {
    event.preventDefault();
    //Validate input
    let input = this.state.summonerName;

    if (
      !Validator.isLength(input, { min: 3, max: 25 }) ||
      Validator.isEmpty(input) ||
      !Validator.blacklist(input, `^[0-9\\p{L} _\\.]+$`)
    )
      return;

    getSummonerByName(input)
      .then(res => {
        console.log(res);
        dispatch({
          type: "SET_SUMMONER",
          payload: res.data
        });
        if (!isEmpty(res.data)) {
          this.setState({
            redirect: true
          });
        } else {
          dispatch({
            type: "SET_ERROR",
            payload: { response: { status: 404 } }
          });
        }
      })
      .catch(err => {
        //console.log(err);

        if (err.response.status === 404) {
          //Summoner not found
          this.setState({
            notFound: true,
            summonerName: ""
          });
        } else {
          dispatch({
            type: "SET_ERROR",
            payload: err
          });
        }
      });
  };

  render() {
    const { redirect, notFound } = this.state;

    if (!redirect) {
      return (
        <Consumer>
          {value => {
            const { dispatch, error } = value;
            if (!isEmpty(error)) return <Error />;

            let inputHelp = "";
            if (notFound) inputHelp = "Summoner not found, try again.";

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
                        <button
                          className="btn btn-outline-primary"
                          type="submit"
                        >
                          <i className="fas fa-search" />
                        </button>
                      </div>
                      <small
                        id="summonerNameHelp"
                        className="form-text text-muted"
                      >
                        {inputHelp}
                      </small>
                    </div>
                  </div>
                </form>
              </React.Fragment>
            );
          }}
        </Consumer>
      );
    } else {
      return <Redirect to={`/summoner/${this.state.summonerName}`} />;
    }
  }
}

export default SummonerSearch;
