import React, { Component } from "react";
// import SimpleStorageContract from "./contracts/SimpleStorage.son";
import { Sidebar } from "./components/sidebar.js";
import { Web3Service } from "./services/web3-service.js";
// import { P2PService } from "./services/p2p-service.js";
import { WebsocketService } from "./services/websocket-service.js";

import "./App.css";

class App extends Component {
  state = {
    storageValue: 0,
    web3Service: null,
    accounts: null,
    contract: null,
    websocketService: null,
    messages: [],
    message: null,
  };
  receiveMessage = (message) => {
    let { messages } = this.state;
    messages.push(message);
    this.setState({ messages });
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      // const web3Service = new Web3Service();
      // var accounts = await web3Service.getAccounts();
      debugger;
      const websocketService = new WebsocketService();
      websocketService.setReceiveMessage(this.receiveMessage);

      // const p2pService = new P2PService(accounts[0]);
      // p2pService.start();

      // this.setState({ web3Service, accounts });
      const accounts = "cuentafalsa";
      this.setState({ accounts, websocketService });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  updateInputValue(event) {
    const val = event.target.value;
    // ...
    this.setState({
      message: val,
    });
  }

  sendMessage = async () => {
    const { websocketService, message } = this.state;
    websocketService.sendMessage(message);
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
        {/* <div>Account: {this.state.accounts[0]}</div> */}
        <input
          value={this.state.message}
          onChange={(evt) => this.updateInputValue(evt)}
        />
        <button onClick={this.sendMessage}>Enviar mensaje</button>
        <h3>Mensajes actuales</h3>
        <ul>
          {this.state.messages.map((message) => (
            <li>{message}</li>
          ))}
        </ul>
        <Sidebar></Sidebar>
      </div>
    );
  }
}

export default App;
