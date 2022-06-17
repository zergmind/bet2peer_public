import * as SonContractJSON from "../contracts/Bet2Peer.json";
import Bet from "../models/bet";

export class SonContractService {
  sonContractABI = SonContractJSON.abi;
  web3;
  sonContract;
  userAccount;

  configureService = async (web3Service, contractAddress, userAccount) => {
    this.userAccount = userAccount;
    this.web3 = await web3Service.getWeb3();
    this.sonContract = await new this.web3.eth.Contract(
      this.sonContractABI,
      contractAddress
    );
  };

  getMatchId = async () => {
    await this.sonContract.methods
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
}
