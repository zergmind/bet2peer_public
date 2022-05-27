import getWeb3 from "../getWeb3";

export class Web3Service {
  web3;

  getWeb3 = async () => {
    if (!this.web) {
      this.web3 = await getWeb3();
    }
  };

  getAccounts = async () => {
    // await this.getWeb3();
    return this.web3.eth.getAccounts();
  };

  getNetworkId = async () => {
    // await this.getWeb3();
    return this.web3.eth.net.getId();
  };

  //EXTRAÍDO DEL EJEMPLO ORIGINAL
  // const deployedNetwork = SimpleStorageContract.networks[networkId];
  // const instance = new web3.eth.Contract(
  //   SimpleStorageContract.abi,
  //   deployedNetwork && deployedNetwork.address
  // );
}
