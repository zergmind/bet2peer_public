import PropTypes from "prop-types";
import Bet from "../models/bet";
import * as Bet2PeerJSON from "../contracts/Bet2Peer.json";

export class Bet2PeerService {
  contractABI = Bet2PeerJSON.abi;
  contractAddress = "";
  createBet(matchId, quantity) {}

  getCurrentMatches() {}
}
