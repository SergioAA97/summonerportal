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

import MatchCard from "./layout/MatchCard";

export default class SummonerPage extends Component {
  state = {
    error: {}
  };

  componentDidMount = () => {
    let { dispatch, summoner } = this.props.value;
    console.log(summoner);

    getSummonerByName(this.props.match.params.summonerName)
      .then(res => {
        //We have summoner
        //console.log(`Summoner By Name:`, res.data);

        if (!isEmpty(res.data)) {
          dispatch({
            type: "SET_SUMMONER",
            payload: res.data
          });
        } else {
          //console.log("Summoner data is empty!");
        }
      })
      .then(res => {
        summoner = this.props.value.summoner;

        Axios.all([
          getSummonerRanked(summoner.id),
          getChampionMasteries(summoner.id),
          getLastMatches(summoner.accountId, 3)
        ])
          .then(
            Axios.spread((rankedRes, masteriesRes, matchRes) => {
              //console.log("Summoner:", summoner);
              //console.log(`Summoner Ranked:`, rankedRes.data);
              //console.log(`Summoner Champion Masteries:`, masteriesRes.data);
              //console.log(`Summoner Last Matches:`, matchRes.data);
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
                  r.details.date = new Date(r.timestamp).toLocaleDateString();
                  return r;
                });

                //console.log(results);
                console.log("New last matches", newLastMatches);

                dispatch({
                  type: "SET_LAST_MATCHES",
                  payload: newLastMatches
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
    const { summoner, ranked, championMastery, lastMatches } = this.props.value;
    let header, rankedStats, matches;
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
          <RankedStats {...ranked[0]} />
        </div>
        <div className="col-12 col-md-6">
          <h3>Ranked Flex</h3>
          <hr />
          <RankedStats {...ranked[1]} />
        </div>
      </React.Fragment>
    );

    //console.log("Render!");
    if (!isEmpty(this.state.error)) {
      return <h3 className="display-3">404 Summoner not found</h3>;
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
              <MatchCard
                match={lastMatches[0]}
                accountId={summoner.accountId}
              />
              <MatchCard
                match={lastMatches[1]}
                accountId={summoner.accountId}
              />
              <MatchCard
                match={lastMatches[2]}
                accountId={summoner.accountId}
              />
            </div>
          </div>
        </div>
      );
    }
  }
}
