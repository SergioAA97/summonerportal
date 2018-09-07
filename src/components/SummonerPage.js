import React, { Component } from "react";

import Axios from "axios";

import { isEmpty } from "../validation/is-empty";

export default class SummonerPage extends Component {
  state = {
    summoner: {},
    error: {}
  };

  componentDidMount = () => {
    Axios.get(
      `https://cors-anywhere.herokuapp.com/https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${
        this.props.match.params.summonerName
      }?api_key=${process.env.REACT_APP_RIOT_KEY}`
    )
      .then(res => {
        console.log(res);

        this.setState({
          summoner: res.data
        });
      })
      .catch(err => {
        console.log(err);

        this.setState({
          error: err
        });
      });
  };

  render() {
    if (isEmpty(this.state.summoner) && isEmpty(this.state.error)) {
      return <h3 className="display-3">Loading ...</h3>;
    } else if (!isEmpty(this.state.error)) {
      return <h3 className="display-3">404 Summoner not found</h3>;
    } else {
      const { name, profileIconId, summonerLevel } = this.state.summoner;
      return (
        <div className="container">
          <div className="row mt-4">
            <div className="col-12 col-sm-4 col-md-4 col-lg-2">
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/8.17.1/img/profileicon/${profileIconId}.png`}
                alt="summoner icon"
                className="align-self-center img-fluid"
              />
            </div>
            <div className="col-12 col-sm-8 col-md-6">
              <h3 className="mt-3 d-block">{name}</h3>
              <div className="ml-4">
                <p className="mb-1">MMR: {summonerLevel}</p>
                <p className="mt-0 mb-1">Summoner Level: {summonerLevel}</p>
                <p className="mt-0 mb-1">Region: {summonerLevel}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
