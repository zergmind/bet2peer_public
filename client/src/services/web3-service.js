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

  switchNetwork = async (desiredChainId) => {
    //TO-DO HACER BIEN CUANDO SE PUEDA
    const currentChainId = await this.getNetworkId();

    if (currentChainId !== desiredChainId) {
      try {
        await this.web3.currentProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: this.web3.utils.toHex(desiredChainId) }],
        });

        return true;
      } catch (switchError) {
        // // This error code indicates that the chain has not been added to MetaMask.
        // if (switchError.code === 4902) {
        //   alert('add this chain id')
        // }
        return false;
      }
    }

    return true;
  };
}
