import React, { Component } from "react";
import Axios from "axios";
import { isEmpty } from "../validation/is-empty";
import {
  getSummonerByName,
  getSummonerRanked,
  getChampionMasteries,
  getLastMatches,
  getMatch
} from "../api/Lolapi";
import RankedStats from "./layout/RankedStats";
import SummonerHeader from "./layout/SummonerHeader";
import Spinner from "./layout/Spinner";

import MatchCard from "./layout/MatchCard/MatchCard";
import timeSince from "../util/TimeSince";

export default class SummonerPage extends Component {
  state = {
    error: {},
    loaded: false
  };

  componentDidMount = () => {
    let { dispatch, summoner } = this.props.value;
    console.log(summoner);

    getSummonerByName(this.props.match.params.summonerName)
      .then(res => {
        if (!isEmpty(res.data)) {
          dispatch({
            type: "SET_SUMMONER",
            payload: res.data
          });
        }
      })
      .then(res => {
        summoner = this.props.value.summoner;

        Axios.all([
          getSummonerRanked(summoner.id),
          getChampionMasteries(summoner.id),
          getLastMatches(summoner.accountId, 10)
        ])
          .then(
            Axios.spread((rankedRes, masteriesRes, matchRes) => {
              dispatch({
                type: "SET_RANKED",
                payload: rankedRes.data
              });
              dispatch({
                type: "SET_CHAMPION_MASTERY",
                payload: masteriesRes.data
              });

              let matchRequests = matchRes.data.matches.map(r =>
                getMatch(r.gameId)
              );

              Axios.all(matchRequests).then(res => {
                let results = res.map(r => r.data);

                let newLastMatches = matchRes.data.matches.map((r, i) => {
                  r.details = results[i];
                  r.details.date = timeSince(new Date(r.timestamp)) + " ago";
                  return r;
                });

                //console.log(results);
                console.log("New last matches", newLastMatches);

                dispatch({
                  type: "SET_LAST_MATCHES",
                  payload: newLastMatches,
                  callback: this.setState({ loaded: true })
                });
              });
            })
          )
          .catch(err =>
            dispatch({
              type: "SET_ERROR",
              payload: err
            })
          );
      })
      .catch(err => {
        console.log(err);

        dispatch({
          type: "SET_ERROR",
          payload: err
        });

        this.setState({
          error: err
        });
      });
  };

  render() {
    const {
      summoner,
      ranked = [],
      championMastery,
      lastMatches
    } = this.props.value;
    const { loaded } = this.state;
    let header, rankedStats;
    const { name, profileIconId, summonerLevel } = summoner;

    if (isEmpty(summoner) || isEmpty(championMastery)) {
      header = (
        <div className="col-12">
          <Spinner />
        </div>
      );
    } else {
      header = (
        <SummonerHeader
          profileIconId={profileIconId}
          name={name}
          summonerLevel={summonerLevel}
          champion={[
            { ...championMastery[0] },
            { ...championMastery[1] },
            { ...championMastery[2] }
          ]}
        />
      );
    }

    rankedStats = (
      <React.Fragment>
        <div className="col-12 col-md-6">
          <h3>Ranked Solo</h3>
          <hr />
          <RankedStats {...ranked[0]} loaded={loaded} />
        </div>
        <div className="col-12 col-md-6">
          <h3>Ranked Flex</h3>
          <hr />
          <RankedStats {...ranked[1]} loaded={loaded} />
        </div>
      </React.Fragment>
    );

    //console.log("Render!");
    if (!isEmpty(this.state.error)) {
      return (
        <div className="container text-center mt-5">
          <i className="fas fa-unlink fa-5x mt-2 mb-5" />
          <h2 className="font-weight-bold">404</h2>
          <h3>Summoner not found</h3>
        </div>
      );
    } else {
      return (
        <div className="container">
          {/* Head Start */}
          <div className="row mt-4">{header}</div>
          {/* Head end */}
          <div className="row mt-5 text-center">{rankedStats}</div>
          <div className="row mt-5 text-center">
            <div className="col-12">
              <h3>Recent Matches</h3>
              <hr />
              {lastMatches.length > 0 ? (
                lastMatches.map(lastMatch => (
                  <MatchCard
                    key={lastMatch.gameId}
                    match={lastMatch}
                    accountId={summoner.accountId}
                  />
                ))
              ) : (
                <Spinner />
              )}
            </div>
          </div>
        </div>
      );
    }
  }
}
