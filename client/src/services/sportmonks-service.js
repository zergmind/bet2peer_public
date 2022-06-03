import PropTypes from "prop-types";
import Bet from "../models/bet";
import * as Bet2PeerJSON from "../contracts/Bet2Peer.json";

export class SportMonksService {
  requestOptions = {
    method: "GET",
    headers: { Accept: "application/json" },
  };
  apiUrl = "https://soccer.sportmonks.com/api/v2.0/";
  apiToken =
    "?api_token=3DbpOpiCRABIYsM6oJK9bAuT3MQdDwyO3AXgd08A1jqEuS69aVg5imxGKWY2";

  getCurrentMatches() {
    fetch(
      `${this.apiUrl}fixtures/between/2020-08-02/2020-08-10${this.apiToken}`,
      this.requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        debugger;
      });
  }
}
