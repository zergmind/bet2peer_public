// import PropTypes from "prop-types";
// import Bet from "../models/bet";
import * as Bet2PeerJSON from "../contracts/Bet2Peer.json";

export class Bet2PeerService {
  contractABI = Bet2PeerJSON.abi;
  contractAddress = "0xaFAd47eaE4bc9F55Ca6B06Aef8e9105e183CBe7a";
  web3;
  fatherContract;
  constructor() {
    
  }
  
  configureService = async (web3Service) => {
    await web3Service.getWeb3();
    this.fatherContract = web3Service.eth.Contract(this.contractABI, this.contractAddress);
  }

  createBet = async (bet) => {
    const minimumCounterBet = bet.quantity*bet.quota;
    this.fatherContract.methods.createBet(bet.match.id, bet.result, bet.quantity, minimumCounterBet)
  }

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
