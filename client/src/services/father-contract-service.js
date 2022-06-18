// import PropTypes from "prop-types";
// import Bet from "../models/bet";
// import * as Bet2PeerJSON from "../contracts/Bet2Peer.json";
import * as FatherContractJSON from "../contracts/Father.json";
import Bet from "../models/bet";

export class FatherContractService {
  fatherContractABI = FatherContractJSON.abi;
  // fatherContractAddress = "0x744e7aAE80daF5978EC3d0c9eD516b9bF7fD928e";
  fatherContractAddress = "0x496287eFd724577124533F7df1069E431d234A9d"; //Contrato de Chus en Ganache
  web3;
  fatherContract;

  configureService = async (web3Service) => {
    this.web3 = await web3Service.getWeb3();
    this.fatherContract = await new this.web3.eth.Contract(
      this.fatherContractABI,
      this.fatherContractAddress
    );
  };

  createBet = async (bet, account) => {
    console.log(account);
    if (!this.fatherContract) return;

    const minimumCounterBet = bet.quantity * bet.quota;
    const amountToSend = this.web3.utils.toWei(bet.quantity, "ether");
    await this.fatherContract.methods
      .createBet(bet.match.id, bet.result, bet.quantity, minimumCounterBet)
      .estimateGas({ from: account })
      .then(async (gasAmount) => {
        await this.fatherContract.methods
          .createBet(bet.match.id, bet.result, bet.quantity, minimumCounterBet)
          .send({ from: account, value: amountToSend, gas: gasAmount });
      });

    // this.fatherContract.events
    //   .Status([])
    //   .on("connected", function (subscriptionId) {
    //     console.log("New subscription with ID: " + subscriptionId);
    //   })
    //   .on("data", function (event) {
    //     console.log("New event:");
    //     console.log(event);
    //     alert("New bet 🤑 💰 💸");
    //   });
  };

  getBetsByAccount = async (account) => {
    return await this.fatherContract.methods
      .getAllBetsByUser(account)
      .call({ from: account })
      .then(
        (contractsAddresses) => {
          return contractsAddresses.map((contractAddress) => {
            let bet = new Bet();
            bet.contractAddress = contractAddress;
            return bet;
          });
        },
        (error) => {
          console.log(error);
        }
      );
  };

  //18165994, 18165993, 18166002, 18165998, 18166001, 18165997
  getBetsForMatch(matchId) {
    return fetch(
      `./fake-data/current-bets-for-match-${matchId}.json`,
      this.requestOptions
    ).then((response) => response.json());
  }
}
