import React from "react";
import { getChampionNameFromId } from "../../api/Lolapi";
import ChampionImage from "./ChampionImage";
import { isEmpty } from "../../validation/is-empty";

const laneImg = require.context("../../img/lanes", true);
const gamemodes = require("../../api/gamemodes.json");
const stringified = JSON.stringify(gamemodes);
const parsed = JSON.parse(stringified);

const getGameMode = match => {
  console.log(parsed, parsed[0].id, match["details"]["queueId"], match);
  if (match["details"].hasOwnProperty("queueId") && !isEmpty(parsed)) {
    let result = parsed.filter(r => r["id"] === match["details"]["queueId"]);
    console.log("RESULT:", result);
    return result[0].description;
  }

  console.log("NOT FOUND");
  return undefined;
};

const getWin = (match, accountId) => {
  if (!isEmpty(match)) {
    if (match.details.hasOwnProperty("participants")) {
      let indexInParticipants;
      let winnerTeam = match.details.teams.filter(team => team.win === "Win");
      console.log("winnerTeam ", winnerTeam, match, accountId);

      let summonerInMatch = match.details.participantIdentities.filter(
        (r, index) => {
          console.log(
            r.player.accountId,
            r.player.accountId === accountId,
            accountId
          );
          if (r["player"]["accountId"] === accountId) {
            indexInParticipants = index;
            return true;
          }
          return false;
        }
      );
      console.log("Summoner In Match ", summonerInMatch);
      let result = match.details.participants[indexInParticipants];

      console.log("Result is an empty object", result.stats.win);
      return result.stats.win;
    }
  }
};

const MatchCard = ({
  match = { lane: "NONE", champion: 54, details: { gameMode: "ARAM" } },
  accountId
}) => {
  let win = getWin(match, accountId);
  console.log(win);
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
          <div className="col-6 col-md-6 d-flex pl-0 pt-2 pb-2">
            <div className="align-self-center text-left pl-2">
              <p className="mb-1 mt-2">
                {getGameMode(match)} - {match.details.date}
              </p>
              <h4 className="mb-0 mt-1 ml-0">
                {getChampionNameFromId(match.champion)}
              </h4>
              <p className="mt-0" style={{ fontSize: "1rem" }}>
                {match.lane.charAt(0).toUpperCase() +
                  match.lane.slice(1).toLowerCase()}
              </p>
            </div>
          </div>
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
