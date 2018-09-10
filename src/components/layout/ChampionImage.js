import React from "react";
import { getChampionNameFromId } from "../../api/Lolapi";
import { isEmpty } from "../../validation/is-empty";

const images = require.context("../../img/champion_icon", true);
const masteryFlairs = require.context("../../img/mastery_flair", true);

const ChampionImage = ({ champion = "Aatrox" }) => {
  let src = `./${champion}.png`;

  let masteryFlair = `./`;
  let masteryImage;

  console.log(champion);

  if (
    typeof champion !== "string" &&
    typeof champion !== undefined &&
    champion.hasOwnProperty("championId")
  ) {
    let championName = getChampionNameFromId(champion.championId);
    championName = championName.replace(/[^\w\s]/gi, "");
    src = `./${championName}.png`;
  } else if (typeof champion === "string") {
    champion = champion.replace(/[^\w\s]/gi, "");
    src = `./${champion}.png`;
  }

  let level = parseInt(champion.championLevel, 10);

  if (
    !champion.hasOwnProperty("championLevel") ||
    !level ||
    level < 1 ||
    level > 7 ||
    isEmpty(champion)
  ) {
    masteryImage = <React.Fragment />;
  } else {
    masteryFlair = `./Level${level}.png`;
    masteryImage = (
      <img
        src={masteryFlairs(masteryFlair)}
        alt="mastery flair"
        className="img-fluid"
      />
    );
  }

  return (
    <React.Fragment>
      {!isEmpty(champion) && (
        <img src={images(src)} alt="Champion Logo" className="img-fluid" />
      )}
      {masteryImage}
    </React.Fragment>
  );
};

export default ChampionImage;
