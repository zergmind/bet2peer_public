import getWeb3 from "../getWeb3";

export class Web3Service {
  web3;

  getWeb3 = async () => {
    if (!this.web3) {
      this.web3 = await getWeb3();
    }
    return this.web3;
  };

  getAccounts = async () => {
    return this.web3.eth.getAccounts();
  };

  getNetworkId = async () => {
    return this.web3.eth.net.getId();
  };

  getNetworkType = async () => {
    return this.web3.eth.net.getNetworkType();
  };

  //EXTRAÍDO DEL EJEMPLO ORIGINAL
  // const deployedNetwork = SimpleStorageContract.networks[networkId];
  // const instance = new web3.eth.Contract(
  //   SimpleStorageContract.abi,
  //   deployedNetwork && deployedNetwork.address
  // );
}
