// import PropTypes from "prop-types";
// import Bet from "../models/bet";
import * as Bet2PeerJSON from "../contracts/Bet2Peer.json";
import * as FatherJSON from "../contracts/Father.json";

export class Bet2PeerService {
  contractABI = FatherJSON.abi;
  // contractAddress = "0xaFAd47eaE4bc9F55Ca6B06Aef8e9105e183CBe7a";
  contractAddress = "0x9fF9b82387aC8e69a3B591169ce627b161eE4e96";
  web3;
  fatherContract;
  constructor() {}

  configureService = async (web3Service) => {
    this.web3 = await web3Service.getWeb3();
    this.fatherContract = new this.web3.eth.Contract(
      this.contractABI,
      this.contractAddress
    );
  };

  createBet = async (bet) => {
    const minimumCounterBet = bet.quantity * bet.quota;
    this.fatherContract.methods.createBet(
      bet.match.id,
      bet.result,
      bet.quantity,
      minimumCounterBet
    );
  };

  getCurrentMatches() {}
  //18165994, 18165993, 18166002, 18165998, 18166001, 18165997
  getBetsForMatch(matchId) {
    return fetch(
      `./fake-data/current-bets-for-match-${matchId}.json`,
      this.requestOptions
    ).then((response) => response.json());
  }

  createBetInContract = () => {};

  acceptBetInContract = () => {};
}
