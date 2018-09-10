import React from "react";

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
    leagueName,
    tier,
    rank,
    leaguePoints = "..",
    loaded
  } = props;

  if (!loaded) {
    return <Spinner />;
  } else if (!props.hasOwnProperty("leagueName") && loaded) {
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

export default RankedStats;
