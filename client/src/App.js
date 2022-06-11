import React, { Component } from "react";
// import SimpleStorageContract from "./contracts/SimpleStorage.son";
import { MatchList } from "./components/match-list.js";
import { Header } from "./components/header.js";
import { Chat } from "./components/chat";
import { ChatForm } from "./components/chat-form";
import { UserProfile } from "./components/user-profile";
import { Web3Service } from "./services/web3-service.js";
import { SportMonksService } from "./services/sportmonks-service.js";
import { WebsocketService } from "./services/websocket-service.js";
import { Bet2PeerService } from "./services/bet2peer-service.js";

import "./App.css";
// import { PopupCreateBet } from "./components/popup-create-bet.js";
import { UserProfileAndChat } from "./components/user-profile-and-chat.js";
import { PopupCreateBet } from "./components/popup-create-bet";
import { PopupAcceptBet } from "./components/popup-accept-bet";

class App extends Component {
  state = {
    storageValue: 0,
    web3Service: null,
    bet2peerService: null,
    accounts: null,
    contract: null,
    websocketService: null,
    matches: null,
    messages: [],
    showChat: false,
    showUser: false,
    showBets: true,
    selectedMatchId: null,
    showPopupCreateBet: false,
    showPopupAcceptBet: false,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.

      await this.loadWeb3AndBet2PeerService();
      const websocketService = new WebsocketService();
      websocketService.setReceiveMessage(this.receiveMessage);

      const sportMonksService = new SportMonksService();
      sportMonksService.getCurrentMatches().then((data) => {
        this.getBetsByMatches(data);
        this.setState({ matches: data });
      });

      this.setState({
        websocketService,
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
    }
  };

  loadWeb3AndBet2PeerService = async () => {
    try {
      const web3Service = new Web3Service();
      await web3Service.getWeb3();
      const accounts = await web3Service.getAccounts();
      const account = accounts[0];
      const networkId = await web3Service.getNetworkId();
      const networkType = await web3Service.getNetworkType();
  
      const bet2peerService = new Bet2PeerService();
      bet2peerService.configureService(web3Service);

      this.setState({
        accounts,
        account,
        networkId,
        networkType,
        bet2peerService,
      });
    } catch (error) {}
  };

  loadBet2PeerService = () => {};

  sendMessage = async (nickname, currentMessage) => {
    const { websocketService, messages } = this.state;
    const message = {
      id: messages.length,
      nickname: nickname,
      content: currentMessage,
    };
    messages.push(message);
    websocketService.sendMessage(message);

    this.setState({ messages });
  };

  receiveMessage = (message) => {
    let { messages } = this.state;
    let messageToAdd = { id: messages.length, ...message };
    messages.push(messageToAdd);
    this.setState({ messages });
  };

  showPopupCreateBet = (match) => {
    this.setState({ selectedMatch: match, showPopupCreateBet: true });
  };

  closePopupCreateBet = () => {
    this.setState({ showPopupCreateBet: false });
  };

  createBet = (bet) => {
    const { bet2peerService } = this.state;
    bet2peerService.createBet(bet);
    this.setState({ showPopupCreateBet: false });
  };

  showPopupAcceptBet = (bet) => {
    const { matches } = this.state;
    bet.match = matches.find((match) => match.id === bet.matchId);
    this.setState({ selectedBet: bet, showPopupAcceptBet: true });
  };

  closePopupAcceptBet = () => {
    this.setState({ showPopupAcceptBet: false });
  };

  acceptBet = (bet) => {
    const { bet2peerService } = this.state;
    this.setState({ showPopupAcceptBet: false });
  };

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
          {/* PARA EL RESPONSIVE */}
          {this.state.showBets ? (
            <MatchList
              matches={this.state.matches}
              showPopupCreateBetFunction={this.showPopupCreateBet}
              showPopupAcceptBetFunction={this.showPopupAcceptBet}
            ></MatchList>
          ) : null}
          {this.props.showUser ? (
            <UserProfile
              networkId={this.props.networkId}
              account={this.props.account}
              networkType={this.props.networkType}
            ></UserProfile>
          ) : null}
          {this.props.showChat ? (
            <Chat messages={this.state.messages}></Chat>
          ) : null}
          {this.props.showChat ? (
            <ChatForm sendMessageFunction={this.sendMessage}></ChatForm>
          ) : null}
        </div>
        {/* EN DESKTOP */}
        <div className="second-container">
          <UserProfileAndChat
            networkId={this.state.networkId}
            networkType={this.state.networkType}
            account={this.state.accounts ? this.state.accounts[0] : null}
            messages={this.state.messages}
            sendMessageFunction={this.sendMessage}
          ></UserProfileAndChat>
        </div>
        {this.state.showPopupCreateBet ? (
          <PopupCreateBet
            match={this.state.selectedMatch}
            createBetFunction={this.createBet}
            closePopupCreateBetFunction={this.closePopupCreateBet}
          ></PopupCreateBet>
        ) : null}
        {this.state.showPopupAcceptBet ? (
          <PopupAcceptBet
            bet={this.state.selectedBet}
            acceptBetFunction={this.acceptBet}
            closePopupAcceptBetFunction={this.closePopupAcceptBet}
          ></PopupAcceptBet>
        ) : null}
      </div>
    );
  }
}

export default App;
