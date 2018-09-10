import React, { Component } from "react";
import PropTypes from "prop-types";

import Axios from "axios";
import { isEmpty } from "../../validation/is-empty";
import {
  getSummonerByName,
  getSummonerRanked,
  getChampionMasteries,
  getLastMatches,
  getMatch
} from "../../api/Lolapi";
import RankedStats from "../layout/RankedStats";
import SummonerHeader from "./SummonerHeader";
import Spinner from "../layout/Spinner";
import Error from "../layout/Error";

import MatchCard from "../layout/MatchCard/MatchCard";
import timeSince from "../../util/TimeSince";

const Ranked = ({ ranked, loaded }) => (
  <React.Fragment>
    <div className="col-12 col-md-6">
      <h3>Ranked Solo</h3>
      <hr />
      {loaded ? (
        <RankedStats ranked={{ ...ranked[0] }} loaded={loaded} />
      ) : (
        <Spinner />
      )}
    </div>
    <div className="col-12 col-md-6">
      <h3>Ranked Flex</h3>
      <hr />
      {loaded ? (
        <RankedStats ranked={{ ...ranked[1] }} loaded={loaded} />
      ) : (
        <Spinner />
      )}
    </div>
  </React.Fragment>
);

class SummonerPage extends Component {
  state = {
    error: {},
    loaded: false
  };

  componentDidMount = () => {
    let { dispatch, summoner } = this.props.value;

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

              Axios.all(matchRequests)
                .then(res => {
                  let results = res.map(r => r.data);

                  let newLastMatches = matchRes.data.matches.map((r, i) => {
                    r.details = results[i];
                    r.details.date =
                      timeSince(
                        new Date(r.timestamp + results[i].gameDuration)
                      ) + " ago";
                    return r;
                  });

                  dispatch({
                    type: "SET_LAST_MATCHES",
                    payload: newLastMatches,
                    callback: this.setState({ loaded: true })
                  });
                })
                .catch(err => {
                  console.log(err);
                  dispatch({
                    type: "SET_ERROR",
                    payload: err,
                    fatal: false,
                    callback: this.setState({
                      loaded: true,
                      lastMatches: false
                    })
                  });
                });
            })
          )
          .catch(err =>
            dispatch({
              type: "SET_ERROR",
              payload: err,
              fatal: false,
              callback: this.setState({ loaded: true })
            })
          );
      })
      .catch(err => {
        console.log(err);

        dispatch({
          type: "SET_ERROR",
          payload: err,
          fatal: true
        });

        this.setState({
          error: err,
          loaded: true
        });
      });
  };

  render() {
    const {
      summoner,
      ranked = [],
      championMastery,
      lastMatches,
      error
    } = this.props.value;
    const { loaded } = this.state;
    const { name, profileIconId, summonerLevel } = summoner;

    if (!isEmpty(error) && error.fatal) {
      return (
        <div className="container text-center mt-5">
          <Error />
        </div>
      );
    } else {
      return (
        <div className="container">
          {/* Head Start */}

          {!isEmpty(summoner) && loaded ? (
            <div className="row mt-4">
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
            </div>
          ) : (
            <Spinner />
          )}

          {/* Head end */}

          <div className="row mt-5 text-center">
            <Ranked ranked={ranked} error={error} loaded={loaded} />
          </div>

          <div className="row mt-5 text-center">
            <div className="col-12">
              <h3>Recent Matches</h3>
              <hr />
              {loaded &&
                !isEmpty(lastMatches) &&
                lastMatches.map(lastMatch => (
                  <MatchCard
                    key={lastMatch.gameId}
                    match={lastMatch}
                    accountId={summoner.accountId}
                  />
                ))}

              {!loaded && <Spinner />}
              {loaded &&
                isEmpty(lastMatches) && (
                  <h5 className="mb-4">No recent data</h5>
                )}
            </div>
          </div>
        </div>
      );
    }
  }
}

SummonerPage.propTypes = {
  value: PropTypes.shape({
    championMastery: PropTypes.array,
    dispatch: PropTypes.func,
    error: PropTypes.object,
    lastMatches: PropTypes.array,
    loading: PropTypes.bool,
    ranked: PropTypes.array,
    summoner: PropTypes.object
  })
};
export default SummonerPage;
