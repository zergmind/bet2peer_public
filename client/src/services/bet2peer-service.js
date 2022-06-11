// import PropTypes from "prop-types";
// import Bet from "../models/bet";
import * as Bet2PeerJSON from "../contracts/Bet2Peer.json";
import * as FatherJSON from "../contracts/Father.json";

export class Bet2PeerService {
  fatherContractABI = FatherJSON.abi;
  // fatherContractAddress = "0xaFAd47eaE4bc9F55Ca6B06Aef8e9105e183CBe7a";
  fatherContractAddress = "0x2589Ed6b23c390d3F2cEb215C64feFbaB4342591";
  web3;
  fatherContract;
  constructor() {}

  configureService = async (web3Service) => {
    this.web3 = await web3Service.getWeb3();
    this.fatherContract = new this.web3.eth.Contract(
      this.fatherContractABI,
      this.fatherContractAddress
    );
  };

  createBet = async (bet, account) => {
    console.log(account);
    if (!this.fatherContract) return;
    const minimumCounterBet = bet.quantity * bet.quota;
    const amountToSend = this.web3.utils.toWei(bet.quantity, "ether");
    this.fatherContract.methods
      .createBet(bet.match.id, bet.result, bet.quantity, minimumCounterBet)
      .send({ from: account, value: amountToSend });

    this.fatherContract.events
      .Status([])
      .on("connected", function (subscriptionId) {
        console.log("New subscription with ID: " + subscriptionId);
      })
      .on("data", function (event) {
        console.log("New event:");
        console.log(event);
        alert("New bet 🤑 💰 💸");
      });
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
