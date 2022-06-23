// import PropTypes from "prop-types";
// import Bet from "../models/bet";
// import * as Bet2PeerJSON from "../contracts/Bet2Peer.json";
import * as FatherContractJSON from "../contracts/Father.json";
import Bet from "../models/bet";

export class FatherContractService {
  fatherContractABI = FatherContractJSON.abi;
  // fatherContractAddress = "0x744e7aAE80daF5978EC3d0c9eD516b9bF7fD928e";
  // fatherContractAddress = "0x8fff9e4CaA54a25498BC89850CEFD66F722c8ddC"; //Contrato de Chus en Ganache
  //Transacción del deploy
  //https://mumbai.polygonscan.com/tx/0xda3090bd0b52202e2d9ad5cb5f6fb09b826b165a3292d7847617467ea929c47a
  fatherContractAddress = "0x7e34ac1a95d82e7ff3a1e129560923050bbe81b6"; //Dirección de Mumbai
  web3;
  fatherContract;

  configureService = async (web3Service) => {
    this.web3 = await web3Service.getWeb3();
    this.fatherContract = await new this.web3.eth.Contract(
      this.fatherContractABI,
      this.fatherContractAddress
    );
  };

  createBet = async (bet, account, callback) => {
    console.log(account);
    if (!this.fatherContract) return;

    const minimumCounterBet = bet.quantity * bet.quota;
    const amountToSend = this.web3.utils.toWei(bet.quantity, "ether");
    const gasAmount = await this.fatherContract.methods
      .createBet(bet.match.id, bet.result, bet.quantity, minimumCounterBet)
      .estimateGas({ from: account })
      .then((gasAmount) => gasAmount);

    return this.fatherContract.methods
      .createBet(bet.match.id, bet.result, bet.quantity, minimumCounterBet)
      .send({ from: account, value: amountToSend, gas: gasAmount }, callback);
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

  getBetsByMatchId = async (account, matchId) => {
    return this.fatherContract.methods
      .getAllBetsByMatchId(matchId)
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
