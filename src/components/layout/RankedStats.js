import React from "react";
import PropTypes from "prop-types";

import { RankedImage, Spinner } from "../";
import { isEmpty } from "../../validation/is-empty";

const RankedStat = ({ label, value }) => {
  return (
    <div className="d-flex mt-1 mb-1">
      <div className="flex-fill text-left">{label}</div>
      <div className="flex-fill text-right">{value}</div>
    </div>
  );
};

const RankedStats = props => {
  const {
    wins = "..",
    losses = "..",
    leagueName = "..",
    tier = "..",
    rank = "..",
    leaguePoints = 0
  } = props.ranked;
  const loaded = props.loaded;

  if (!loaded) {
    return <Spinner />;
  } else if (
    (!props.ranked.hasOwnProperty("leagueName") && loaded) ||
    (loaded && isEmpty(props.ranked))
  ) {
    return <h5 className="mb-2">No recent data</h5>;
  } else {
    return (
      <React.Fragment>
        <RankedImage tier={tier} rank={rank} />
        <div className="text-center mb-5">
          <h3 className="font-weight-bold mb-0">{`${tier} ${rank}`}</h3>
          <h5 className="font-weight-normal text-muted">{leagueName}</h5>
        </div>
        <div
          className="mb-4"
          style={{ paddingLeft: "5rem", paddingRight: "5rem" }}
        >
          <RankedStat label="Wins:" value={wins} />
          <RankedStat label="Losses:" value={losses} />
          <RankedStat label="League Points:" value={leaguePoints} />
        </div>
      </React.Fragment>
    );
  }
};

RankedStats.propTypes = {
  ranked: PropTypes.shape({
    freshBlood: PropTypes.bool,
    hotStreak: PropTypes.bool,
    inactive: PropTypes.bool,
    leagueId: PropTypes.string,
    leagueName: PropTypes.string,
    leaguePoints: PropTypes.number,
    losses: PropTypes.number,
    playerOrTeamId: PropTypes.string,
    playerOrTeamName: PropTypes.string,
    queueType: PropTypes.string,
    rank: PropTypes.string,
    tier: PropTypes.string,
    veteran: PropTypes.bool,
    wins: PropTypes.number
  }),
  loaded: PropTypes.bool
};

export default RankedStats;
