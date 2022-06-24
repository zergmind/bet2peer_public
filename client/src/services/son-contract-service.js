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

  acceptBet = async (bet, account, callback) => {
    console.log(account);
    const sonContract = await new this.web3.eth.Contract(
      this.sonContractABI,
      bet.contractAddress
    );

    const amountToSend = this.web3.utils.toWei(
      bet.minimumCounterBet.toString(),
      "ether"
    );
    const gasAmount = await sonContract.methods
      .acceptBet()
      .estimateGas({ from: account, value: amountToSend })
      .then((gasAmount) => gasAmount);

    return await sonContract.methods.acceptBet().send(
      {
        from: account,
        value: amountToSend,
        gas: gasAmount,
      },
      callback
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
          bet.counterGambler = data[1];
          bet.matchId = data[2];
          bet.result = parseInt(data[3]);
          bet.isTheUserTheOwner = this.userAccount === data.originalOwner;
          bet.minimumCounterBet = parseFloat(data[5]);
          bet.isTheUserTheCounterGambler =
            this.userAccount === bet.counterGambler;
          bet.quantity = parseFloat(data[4]);

          if (bet.isTheUserTheOwner) {
            bet.quota =
              parseFloat(bet.minimumCounterBet) / parseFloat(bet.quantity);
          } else {
            bet.minimumCounterBet = bet.minimumCounterBet - bet.quantity;
            bet.quota = bet.quantity / bet.minimumCounterBet;
            bet.quota++;
          }
          debugger;
          const match = matches.find(
            (match) => parseInt(match.id) === parseInt(bet.matchId)
          );
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
