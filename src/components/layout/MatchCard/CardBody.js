import React from "react";
import { isEmpty } from "../../../validation/is-empty";

import { getChampionNameFromId } from "../../../api/Lolapi";

const gamemodes = require("../../../api/gamemodes.json");
const stringified = JSON.stringify(gamemodes);
const parsed = JSON.parse(stringified);

const getGameMode = match => {
  if (match["details"].hasOwnProperty("queueId") && !isEmpty(parsed)) {
    let result = parsed.filter(r => r["id"] === match["details"]["queueId"]);
    return result[0].description;
  }

  console.log("GAMEMODE NOT FOUND");
  return undefined;
};

const CardBody = ({ match }) => (
  <div className="col-6 col-md-6 d-flex pl-0 pt-2 pb-2">
    <div className="align-self-center text-left">
      <p className="mb-1 mt-2">
        {getGameMode(match).replace("games", "")} - {match.details.date}
      </p>
      <h4 className="mb-0 mt-1 ml-0">
        {getChampionNameFromId(match.champion)}
      </h4>
      <p className="mt-0" style={{ fontSize: "1rem" }}>
        {match.lane.charAt(0).toUpperCase() + match.lane.slice(1).toLowerCase()}
      </p>
    </div>
  </div>
);

export default CardBody;
