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
import { FatherContractService } from "./services/father-contract-service.js";

import "./App.css";
// import { PopupCreateBet } from "./components/popup-create-bet.js";
import { UserProfileAndChat } from "./components/user-profile-and-chat.js";
import { PopupCreateBet } from "./components/popup-create-bet";
import { PopupAcceptBet } from "./components/popup-accept-bet";

class App extends Component {
  state = {
    storageValue: 0,
    web3Service: null,
    fatherContractService: null,
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
    userBets: [],
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.

      await this.loadWeb3AndFatherContractService();
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

  loadWeb3AndFatherContractService = async () => {
    try {
      const web3Service = new Web3Service();
      await web3Service.getWeb3();
      const accounts = await web3Service.getAccounts();
      const account = accounts[0];
      const networkId = await web3Service.getNetworkId();
      const networkType = await web3Service.getNetworkType();

      const fatherContractService = new FatherContractService();
      await fatherContractService.configureService(web3Service);
      const userBets = await fatherContractService.getBetsByAccount(account);

      // await fatherContractService.getSonContractMatchId(
      //   userBets[0].contractAddress,
      //   account
      // );
      this.setState({
        accounts,
        account,
        networkId,
        networkType,
        fatherContractService,
        userBets,
      });
    } catch (error) {}
  };

  loadFatherContractService = () => {};

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

  createBet = async (bet) => {
    const { fatherContractService, account } = this.state;
    await fatherContractService.createBet(bet, account);
    const userBets = await fatherContractService.getBetsByAccount(account);
    this.setState({ showPopupCreateBet: false, userBets });
  };

  showPopupAcceptBet = (bet) => {
    const { matches } = this.state;
    bet.match = matches.find((match) => match.id === bet.matchId);
    this.setState({ selectedBet: bet, showPopupAcceptBet: true });
  };

  closePopupAcceptBet = () => {
    this.setState({ showPopupAcceptBet: false });
  };

  acceptBet = async (bet) => {
    const { fatherContractService, account } = this.state;
    await fatherContractService.createBet(bet, account);

    const userBets = await fatherContractService.getBetsByAccount(account);
    this.setState({ showPopupAcceptBet: false, userBets });
  };

  getBetsByMatches(matches) {
    const { fatherContractService } = this.state;
    matches.forEach((match) => {
      fatherContractService.getBetsForMatch(match.id).then((bets) => {
        bets.forEach((bet) => (bet.match = match));
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
            userBets={this.state.userBets}
            fatherContractService={this.state.fatherContractService}
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
