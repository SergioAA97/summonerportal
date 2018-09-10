import React from "react";
import PropTypes from "prop-types";
import { ChampionImage } from "..";

const SummonerHeader = ({
  profileIconId,
  name,
  summonerLevel,
  champion = []
}) => {
  return (
    <React.Fragment>
      <div className="col-12 col-sm-4 col-md-3 col-lg-2">
        <img
          src={`https://ddragon.leagueoflegends.com/cdn/8.17.1/img/profileicon/${profileIconId}.png`}
          alt="summoner icon"
          className="rounded mx-auto d-block img-fluid"
        />
      </div>
      <div className="col-12 col-sm-8 col-md-5 col-lg-6 pt-2">
        <h3 className="d-block">{name}</h3>
        <p className="mt-0 mb-1">Summoner Level: {summonerLevel}</p>
      </div>
      <div className="col-12 col-sm-12 col-md-4 col-lg-4">
        <React.Fragment>
          <div className="col-12  text-center mt-2">
            <h3>Top 3 Champions</h3>
          </div>
          <div className="row justify-content-center">
            <div className="col-3">
              {champion[0] && <ChampionImage champion={champion[0]} />}
            </div>
            <div className="col-3">
              {champion[1] && <ChampionImage champion={champion[1]} />}
            </div>
            <div className="col-3">
              {champion[2] && <ChampionImage champion={champion[2]} />}
            </div>
          </div>
        </React.Fragment>
      </div>
    </React.Fragment>
  );
};

SummonerHeader.propTypes = {
  champion: PropTypes.array,
  name: PropTypes.string,
  profileIconId: PropTypes.number,
  summonerLevel: PropTypes.number
};

export default SummonerHeader;
