import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Axios from "axios";
import { Consumer } from "../context";
import Validator from "validator";

class SummonerSearch extends Component {
  state = {
    summonerName: "",
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
      Validator.isEmpty(input)
    )
      return;

    Validator.blacklist(input, `^[0-9\\p{L} _\\.]+$`);

    dispatch({
      type: "DISPLAY_LOADING",
      payload: true
    });

    Axios.get(
      `https://cors-anywhere.herokuapp.com/https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${input}?api_key=${
        process.env.REACT_APP_RIOT_KEY
      }`
    )
      .then(res => {
        console.log(res);
        dispatch({
          type: "SEARCH_SUMMONER",
          payload: res.data
        });

        dispatch({
          type: "DISPLAY_LOADING",
          payload: false
        });

        this.setState({
          redirect: true
        });
      })
      .catch(err => console.log(err));
  };

  render() {
    const { redirect } = this.state;
    if (!redirect) {
      return (
        <Consumer>
          {value => {
            const { dispatch } = value;

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
