import getWeb3 from "../getWeb3";

export class Web3Service {
    web3;
    constructor() {
        this.web3 = await getWeb3();
    }

    async getAccounts(){
        return web3.eth.getAccounts();
    }

    async getNetworkId(){
        return web3.eth.net.getId();
    }
}
