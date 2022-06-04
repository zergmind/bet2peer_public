import PropTypes from "prop-types";
import Bet from "../models/bet";
import * as Bet2PeerJSON from "../contracts/Bet2Peer.json";

export class Bet2PeerService {
  contractABI = Bet2PeerJSON.abi;
  contractAddress = "";
  createBet(matchId, quantity) {}

  getCurrentMatches() {}
  //18165994, 18165993, 18166002, 18165998, 18166001, 18165997
  getBetsForMatch(matchId) {
    return fetch(
      `./fake-data/current-bets-for-match-${matchId}.json`,
      this.requestOptions
    ).then((response) => response.json());
  }
}
