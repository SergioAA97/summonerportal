import React from "react";
import { getChampionNameFromId } from "../../api/Lolapi";

const images = require.context("../../img/champion_icon", true);
const masteryFlairs = require.context("../../img/mastery_flair", true);
const ChampionImage = ({ champion = "Aatrox" }) => {
  let src = `./Aatrox.png`;

  let masteryFlair = `./`;
  let masteryImage;

  console.log("Champion passed to image:", champion);
  if (
    typeof champion !== "string" &&
    typeof champion !== undefined &&
    champion.hasOwnProperty("championId")
  ) {
    src = `./${getChampionNameFromId(champion.championId)}.png`;
  }

  let level = parseInt(champion.championLevel, 10);
  if (!champion.hasOwnProperty("championLevel") || !level) {
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
      <img src={images(src)} alt="Rank Logo" className="img-fluid" />
      {masteryImage}
    </React.Fragment>
  );
};

export default ChampionImage;
