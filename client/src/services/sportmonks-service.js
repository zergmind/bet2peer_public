// import PropTypes from "prop-types";
// import Bet from "../models/bet";
// import * as Bet2PeerJSON from "../contracts/Bet2Peer.json";
import Match from "../models/match.js";

export class SportMonksService {
  requestOptions = {
    method: "GET",
    headers: { Accept: "application/json" },
  };
  apiUrl = "https://soccer.sportmonks.com/api/v2.0/";
  apiToken =
    "?api_token=3DbpOpiCRABIYsM6oJK9bAuT3MQdDwyO3AXgd08A1jqEuS69aVg5imxGKWY2";
  laLigaId = 564;

  getCurrentMatches() {
    return fetch(`./fake-data/current-matches.json`, this.requestOptions)
      .then((response) => response.json())
      .then((parsedResponse) => {
        return parsedResponse.data
          .filter((d) => d.league_id == this.laLigaId)
          .map((d) => {
            const localTeam = d.localTeam.data;
            const visitorTeam = d.visitorTeam.data;
            const scores = d.scores;

            let match = new Match();
            match.id = d.id;
            match.localName = localTeam.name;
            match.localImageUrl = localTeam.logo_path;
            match.visitorName = visitorTeam.name;
            match.visitorImageUrl = visitorTeam.logo_path;
            match.localScore = scores.localteam_score;
            match.visitorScore = scores.visitorteam_score;

            return match;
          });
      });
    // return fetch(
    //   `${this.apiUrl}fixtures/between/2022-03-18/2022-03-20${this.apiToken}&include=visitorTeam,localTeam`,
    //   this.requestOptions
    // ).then((response) => response.json());
  }
}
