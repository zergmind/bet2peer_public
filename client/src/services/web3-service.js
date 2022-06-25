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

  getChainId = async () => {
    return this.web3.eth.getChainId();
  };

  getBalance = async (account) => {
    return this.web3.eth.getBalance(account);
  };

  getCurrentSymbol = async () => {
    const chainId = await this.web3.eth.getChainId();
    //AQUÍ SE PUEDEN EXTRAER TODAS LAS REDES CON SUS SÍMBOLOS
    //https://chainid.network/chains.json
    switch (chainId) {
      case 137: //Polygon production
      case 80001: //Polygon Mumbai
        return "MATIC";
      default:
        return "ETH";
    }
  };

  //EXTRAÍDO DEL EJEMPLO ORIGINAL
  // const deployedNetwork = SimpleStorageContract.networks[networkId];
  // const instance = new web3.eth.Contract(
  //   SimpleStorageContract.abi,
  //   deployedNetwork && deployedNetwork.address
  // );
}
