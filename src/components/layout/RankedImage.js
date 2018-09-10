import React from "react";

const images = require.context("../../img/ranked_icon", true);

const RankedImage = ({ tier = "bronze", rank = "i" }) => {
  const src = `./${tier.toLowerCase()}_${rank.toLowerCase()}.png`;
  return <img src={images(src)} alt="Rank Logo" className="image-flex" />;
};

export default RankedImage;
