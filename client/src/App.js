import React, { Component } from "react";
// import SimpleStorageContract from "./contracts/SimpleStorage.son";
import { MatchList } from "./components/match-list.js";
import { Header } from "./components/header.js";
import { Web3Service } from "./services/web3-service.js";
import { SportMonksService } from "./services/sportmonks-service.js";
import { WebsocketService } from "./services/websocket-service.js";
import { Bet2PeerService } from "./services/bet2peer-service.js";

import "./App.css";
// import { PopupCreateBet } from "./components/popup-create-bet.js";
import { UserProfileAndChat } from "./components/user-profile-and-chat.js";

class App extends Component {
  state = {
    storageValue: 0,
    web3Service: null,
    accounts: null,
    contract: null,
    websocketService: null,
    matches: null,
    messages: [],
    message: "",
    showChat: true,
    showUser: true,
    showBets: false,
  };
  receiveMessage = (message) => {
    let { messages } = this.state;
    messages.push(message);
    this.setState({ messages });
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3Service = new Web3Service();
      await web3Service.getWeb3();
      const accounts = await web3Service.getAccounts();
      const networkId = await web3Service.getNetworkId();
      const networkType = await web3Service.getNetworkType();

      const websocketService = new WebsocketService();
      websocketService.setReceiveMessage(this.receiveMessage);

      const sportMonksService = new SportMonksService();
      sportMonksService.getCurrentMatches().then((data) => {
        this.getBetsByMatches(data);
        this.setState({ matches: data });
      });

      const bet2peerService = new Bet2PeerService();
      // const p2pService = new P2PService(accounts[0]);
      // p2pService.start();

      // this.setState({ web3Service, accounts });
      debugger;
      this.setState({
        accounts,
        websocketService,
        networkId,
        bet2peerService,
        networkType,
      });
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

  createBet(matchId) {
    alert(matchId);
  }

  getBetsByMatches(matches) {
    const { bet2peerService } = this.state;
    matches.forEach((match) => {
      bet2peerService.getBetsForMatch(match.id).then((bets) => {
        match.bets = bets;
        this.setState({ matches });
      });
    });
  }

  burgerMenuChange = (changeTo) => {
    let showChat = true;
    let showUser = true;
    let showBets = true;
    switch (changeTo) {
      case "chat":
        showChat = false;
        break;
      case "user":
        showUser = false;
        break;
      case "bets":
        showBets = false;
        break;
      default:
        break;
    }

    this.setState({ showChat, showUser, showBets });
  };

  render() {
    return (
      <div className="App">
        <div className="first-container">
          <Header
            burgerMenuChange={this.burgerMenuChange}
            showChat={this.state.showChat}
            showUser={this.state.showUser}
            showBets={this.state.showBets}
          ></Header>

          <MatchList
            matches={this.state.matches}
            createBetFunction={this.createBet}
          ></MatchList>
        </div>
        <div className="second-container">
          <UserProfileAndChat
            networkId={this.state.networkId}
            networkType={this.state.networkType}
            account={this.state.accounts ? this.state.accounts[0] : null}
          ></UserProfileAndChat>
        </div>
        {/* <PopupCreateBet></PopupCreateBet> */}
      </div>
    );
  }
}

export default App;
