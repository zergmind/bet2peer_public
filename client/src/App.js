import React, { Component } from "react";
// import SimpleStorageContract from "./contracts/SimpleStorage.son";
import { Sidebar } from "./components/sidebar.js";
import { Web3Service } from "./services/web3-service.js";
// import { P2PService } from "./services/p2p-service.js";

import "./App.css";

class App extends Component {
  state = {
    storageValue: 0,
    web3Service: null,
    accounts: null,
    contract: null,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3Service = new Web3Service();
      var accounts = await web3Service.getAccounts();

      // const p2pService = new P2PService(accounts[0]);

      this.setState({ web3Service, accounts });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.accounts) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Bienvenido a Bet2Peer!</h1>
        <p>Apuestas descentralizadas.</p>
        <h2>Este es tu Address de Wallet</h2>
        <div>Account: {this.state.accounts[0]}</div>
        <Sidebar></Sidebar>
      </div>
    );
  }
}

export default App;
