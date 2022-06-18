import * as SonContractJSON from "../contracts/Bet2Peer.json";
import Bet from "../models/bet";

export class SonContractService {
  sonContractABI = SonContractJSON.abi;
  web3;
  userAccount;

  configureService = async (web3Service, userAccount) => {
    this.userAccount = userAccount;
    this.web3 = await web3Service.getWeb3();
  };

  getMatchId = async (contractAddress) => {
    const sonContract = await new this.web3.eth.Contract(
      this.sonContractABI,
      contractAddress
    );
    await sonContract.methods
      .getMatchId()
      .call({ from: this.userAccount })
      .then(
        (matchId) => {
          console.log(matchId);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  getAllData = async (contractAddress, matches) => {
    const sonContract = await new this.web3.eth.Contract(
      this.sonContractABI,
      contractAddress
    );
    return await sonContract.methods
      .getContractInfo()
      .call({ from: this.userAccount })
      .then(
        (data) => {
          let bet = new Bet();
          bet.contractAddress = contractAddress;
          bet.originalOwner = data[0];
          bet.matchId = data[1];
          bet.result = parseInt(data[2]);
          bet.isTheUserTheOwner = this.userAccount == data.originalOwner;
          const minimumCounterBet = parseFloat(data[4]);

          if (bet.isTheUserTheOwner) {
            bet.quantity = parseFloat(data[3]);
            bet.quota =
              parseFloat(minimumCounterBet) / parseFloat(bet.quantity);
          } else {
            bet.quantity = data[3];
            bet.quota = bet.quantity / minimumCounterBet;
            bet.quota++; //Esto se pone porque hay que añadir 1 para incluir lo que estás apostando
          }
          const match = matches.find((match) => match.id == bet.matchId);
          bet.match = match;

          return bet;
        },
        (error) => {
          console.log(error);
          return null;
        }
      );
  };
}
