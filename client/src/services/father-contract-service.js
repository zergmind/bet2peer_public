// import PropTypes from "prop-types";
// import Bet from "../models/bet";
// import * as Bet2PeerJSON from "../contracts/Bet2Peer.json";
import * as FatherContractJSON from "../contracts/Father.json";
import Bet from "../models/bet";

export class FatherContractService {
  nullAddress = "0x0000000000000000000000000000000000000000"; //TO-DO CREAR ARCHIVO DE CONSTANTES
  networkId;
  fatherContractABI = FatherContractJSON.abi;
  web3;
  fatherContract;

  configureService = async (web3Service, networkId) => {
    this.web3 = await web3Service.getWeb3();
    switch (networkId) {
      case 137:
        this.fatherContractAddress =
          "0x2347af8ec100522efe521411fbe0a31620218e86"; //Polygon Producción

        break;
      case 80001:
        this.fatherContractAddress =
          "0x00b954a2e6e4b76436b5bb6093b4db4ff9b8364f"; //Mumbai
        //ÚLTIMA VERSIÓN EN MUMBAI
        //0x9b6a0f7cf5d081adce3c846eea612ca0bfee252e
        break;
      case 5777:
        this.fatherContractAddress =
          "0x49c750515C01831ae54463aA1BEF0306fcb4F04C"; //Ganache Chus proxy
        break;
    }

    this.fatherContract = await new this.web3.eth.Contract(
      this.fatherContractABI,
      this.fatherContractAddress
    );
  };

  createBet = async (bet, account, callback) => {
    console.log(account);
    if (!this.fatherContract) return;
    const minimumCounterBet = bet.quantity * bet.quota - bet.quantity;
    const minimumCounterBetInWei = this.web3.utils.toWei(
      minimumCounterBet.toString()
    );
    const amountToSend = this.web3.utils.toWei(bet.quantity, "ether");
    const gasAmount = await this.fatherContract.methods
      .createBet(bet.match.id, bet.result, amountToSend, minimumCounterBetInWei)
      .estimateGas({ from: account })
      .then((gasAmount) => gasAmount);

    return this.fatherContract.methods
      .createBet(bet.match.id, bet.result, amountToSend, minimumCounterBetInWei)
      .send(
        { from: account, value: amountToSend, gas: gasAmount * 2 }, //TO-DO AVERIGUAR BIEN EL COSTE DEL GAS
        callback
      );
  };

  cancelBet = async (bet, account, callback) => {
    console.log(account);
    if (!this.fatherContract) return;

    const gasAmount = await this.fatherContract.methods
      .removeBet(bet.contractAddress)
      .estimateGas({ from: account })
      .then((gasAmount) => gasAmount);

    return this.fatherContract.methods
      .removeBet(bet.contractAddress)
      .send({ from: account, gas: gasAmount }, callback);
  };

  resolveBet = async (bet, account, callback) => {
    console.log(account);
    if (!this.fatherContract) return;

    const gasAmount = await this.fatherContract.methods
      .resolveBet(bet.contractAddress)
      .estimateGas({ from: account })
      .then((gasAmount) => gasAmount);

    return this.fatherContract.methods
      .resolveBet(bet.contractAddress)
      .send({ from: account, gas: gasAmount }, callback);
  };

  getBetsByAccount = async (account) => {
    return await this.fatherContract.methods
      .getAllBetsByUser(account)
      .call({ from: account })
      .then(
        (contractsAddresses) => {
          return contractsAddresses
            .filter((contractAddress) => contractAddress !== this.nullAddress)
            .map((contractAddress) => {
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
          return contractsAddresses
            .filter((contractAddress) => contractAddress !== this.nullAddress)
            .map((contractAddress) => {
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
