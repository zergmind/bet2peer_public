import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import { Sidebar } from "./components/sidebar.js";
import getWeb3 from "./getWeb3";
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

      // Use web3 to get the user's accounts.
      // // Set web3, accounts, and contract to the state, and then proceed with an
      // // example of interacting with the contract's methods.
      // this.setState({ web3, accounts, contract: instance }, this.runExample);
      this.setState({ web3Service, accounts });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.accounts) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
        <div>Account: {this.state.accounts[0]}</div>
        <Sidebar></Sidebar>
      </div>
    );
  }
}

export default App;
