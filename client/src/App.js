import React, { Component } from "react";
// import SimpleStorageContract from "./contracts/SimpleStorage.son";
import { Sidebar } from "./components/sidebar.js";
import { Web3Service } from "./services/web3-service.js";
import { SportMonksService } from "./services/sportmonks-service.js";
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
    message: "",
  };
  receiveMessage = (message) => {
    let { messages } = this.state;
    messages.push(message);
    this.setState({ messages });
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      debugger;
      const web3Service = new Web3Service();
      await web3Service.getWeb3();
      const accounts = await web3Service.getAccounts();
      const networkId = await web3Service.getNetworkId();

      const websocketService = new WebsocketService();
      websocketService.setReceiveMessage(this.receiveMessage);

      const sportMonksService = new SportMonksService();
      sportMonksService.getCurrentMatches();

      // const p2pService = new P2PService(accounts[0]);
      // p2pService.start();

      // this.setState({ web3Service, accounts });
      this.setState({ accounts, websocketService, networkId });
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
    const { websocketService, message, messages } = this.state;
    messages.push(message);
    websocketService.sendMessage(message);
  };

  render() {
    return (
      <div className="App">
        <h1>Bienvenido a Bet2Peer!</h1>
        <p>Apuestas descentralizadas.</p>
        <h2>Este es tu Address de Wallet</h2>
        <div>
          Account:
          {this.state.accounts && this.state.accounts.length > 0
            ? this.state.accounts[0]
            : "Cargando..."}
        </div>
        <div>
          Esta es tu networkId:
          {this.state.networkId ? this.state.networkId : "Cargando..."}
        </div>
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
