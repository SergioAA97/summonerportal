import Axios from "axios";
import Validator from "validator";
import { isString } from "../validation/is-string";

export const getSummonerByName = summonerName => {
  if (
    !isString(summonerName) ||
    !Validator.blacklist(summonerName, `^[0-9\\p{L} _\\.]+$`)
  )
    return;

  return Axios.get(
    `https://cors-anywhere.herokuapp.com/https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}?api_key=${
      process.env.REACT_APP_RIOT_KEY
    }`
  );
};

export const getSummonerRanked = id => {
  return Axios.get(
    `https://cors-anywhere.herokuapp.com/https://euw1.api.riotgames.com/lol/league/v3/positions/by-summoner/${id}?api_key=${
      process.env.REACT_APP_RIOT_KEY
    }`
  );
};

export const getChampionMasteries = id => {
  return Axios.get(
    `https://cors-anywhere.herokuapp.com/https://euw1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/${id}?api_key=${
      process.env.REACT_APP_RIOT_KEY
    }`
  );
};

export const getLastMatches = (id, amount) => {
  if (typeof amount !== "number") amount = 5;
  return Axios.get(
    `https://cors-anywhere.herokuapp.com/https://euw1.api.riotgames.com/lol/match/v3/matchlists/by-account/${id}?endIndex=${amount}&api_key=${
      process.env.REACT_APP_RIOT_KEY
    }`
  );
};

export const getMatch = id => {
  return Axios.get(
    `https://cors-anywhere.herokuapp.com/https://euw1.api.riotgames.com/lol/match/v3/matches/${id}?api_key=${
      process.env.REACT_APP_RIOT_KEY
    }`
  );
};

export const getChampionNameFromId = id => {
  const championsJSON = require("./champions.json");

  for (var key in championsJSON.data) {
    if (championsJSON.data.hasOwnProperty(key)) {
      if (parseInt(championsJSON.data[key].key, 10) === id) {
        let result = championsJSON.data[key].name.trim();
        result = result.replace(/\s/g, "");
        if (result === "Nunu&Willump") return "Nunu";
        return result;
      }
    }
  }

  return "Jax";
};
