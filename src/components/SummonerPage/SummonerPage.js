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

const CancelToken = Axios.CancelToken;
const source = CancelToken.source();

const Ranked = ({ ranked, loaded }) => (
  <React.Fragment>
    <div className="col-12 col-md-6 mb-3">
      <h3>Ranked Solo</h3>
      <hr />
      {loaded ? (
        <RankedStats ranked={{ ...ranked[0] }} loaded={loaded} />
      ) : (
        <Spinner />
      )}
    </div>
    <div className="col-12 col-md-6 mb-3">
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
    loaded: false,
  };

  componentDidMount = () => {
    this.getSummonerData();
  };

  componentDidUpdate(prevProps) {
    if (prevProps.value.summoner.name !== this.props.value.summoner.name) {
      this.getSummonerData();
    }
  }

  componentWillUnmount(){
    source.cancel("Requests canceled before unmounting")
  }

  getSummonerData = () => {
    let { dispatch, summoner } = this.props.value;
    this.setState({ loaded: false });
    getSummonerByName(this.props.match.params.summonerName, source)
      
      .then(res => {
        

        dispatch({
          type: "SET_SUMMONER",
          payload: res.data
        });

        summoner = res.data;

        Axios.all([
          getSummonerRanked(summoner.id, source),
          getChampionMasteries(summoner.id, source),
          getLastMatches(summoner.accountId, 10, source)
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
                  });
                  this.setState({ loaded: true });
                })
                .catch(err => {
                  console.log(err);
                  dispatch({
                    type: "SET_ERROR",
                    payload: err,
                    fatal: false,
                  });
                });
            })
          )
      })
      .catch(err => {
        console.log(err);
        if(Axios.isCancel(err)) return;
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

      error
    } = this.props.value;
    const { loaded } = this.state;
    const {
      name,
      profileIconId,
      summonerLevel,
      ranked = [],
      championMastery = [],
      lastMatches
    } = summoner;

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
