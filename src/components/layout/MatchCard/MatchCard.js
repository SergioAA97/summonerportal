import React from "react";
import { getChampionNameFromId } from "../../../api/Lolapi";
import ChampionImage from "../ChampionImage";
import CardBody from "./CardBody";
import { isEmpty } from "../../../validation/is-empty";

const laneImg = require.context("../../../img/lanes", true);

const getWin = (match, accountId) => {
  if (!isEmpty(match)) {
    if (match.details.hasOwnProperty("participants")) {
      let indexInParticipants;
      let summonerInMatch = match.details.participantIdentities.filter(
        (r, index) => {
          if (r["player"]["accountId"] === accountId) {
            indexInParticipants = index;
            return true;
          }
          return false;
        }
      );

      let result = match.details.participants[indexInParticipants];
      if (summonerInMatch) return result.stats.win;
      return false;
    }
  }
};

const MatchCard = ({
  match = { lane: "NONE", champion: 54, details: { gameMode: "ARAM" } },
  accountId
}) => {
  let win = getWin(match, accountId);

  return (
    <div className="row mt-1 mb-1">
      <div
        className="col-12 col-md-10 offset-md-1  offset-lg-1 col-lg-10"
        style={{
          boxShadow: "2px 5px 5px 0px rgba(0,0,0,0.15)",
          border: "1px solid rgba(0,0,0,.05)"
        }}
      >
        <div className="row">
          <div
            className="col-2 align-self-center"
            style={{ padding: "0", paddingLeft: "1rem" }}
          >
            <ChampionImage champion={getChampionNameFromId(match.champion)} />
          </div>
          <div className="col-1 align-self-center" style={{ padding: "0" }}>
            <img
              src={laneImg(`./${match.lane}.svg`)}
              alt=""
              className="p-2 img-fluid"
            />
          </div>
          {/* Body */}
          <CardBody match={match} />
          <div className="col-3 d-flex justify-content-end text-right">
            <div className="align-self-center">
              <span className="font-weight-bold">
                {win ? "Victory" : "Defeat"}
              </span>
              <i
                className={`fas fa-arrow-circle-${win ? "up" : "down"} ml-1`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
