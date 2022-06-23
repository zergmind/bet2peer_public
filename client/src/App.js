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
import { SonContractService } from "./services/son-contract-service.js";

import "./App.css";
// import { PopupCreateBet } from "./components/popup-create-bet.js";
import { UserProfileAndChat } from "./components/user-profile-and-chat.js";
import { PopupCreateBet } from "./components/popup-create-bet";
import { PopupAcceptBet } from "./components/popup-accept-bet";
import { PopupLoading } from "./components/popup-loading";

class App extends Component {
  state = {
    storageValue: 0,
    web3Service: null,
    fatherContractService: null,
    sonContractService: null,
    accounts: null,
    contract: null,
    websocketService: null,
    sportMonksService: null,
    matches: null,
    messages: [],
    showChat: false,
    showUser: false,
    showBets: true,
    selectedMatchId: null,
    showPopupCreateBet: false,
    showPopupAcceptBet: false,
    showPopupLoading: false,
    userBets: [],
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.

      await this.loadServices();
      const websocketService = new WebsocketService();
      websocketService.setReceiveMessage(this.receiveMessage);

      const sportMonksService = new SportMonksService();
      await sportMonksService.getCurrentMatches().then((data) => {
        // this.getBetsByMatches(data);
        this.setState({ matches: data });
        this.loadMatchBetsWithData(data);
      });

      this.setState({
        websocketService,
        sportMonksService,
      });

      await this.loadUserBetsWithData();
    } catch (error) {
      // Catch any errors for any of the above operations.
    }
  };

  loadServices = async () => {
    try {
      const web3Service = new Web3Service();
      await web3Service.getWeb3();
      const accounts = await web3Service.getAccounts();
      const account = accounts[0];
      const networkId = await web3Service.getNetworkId();
      const networkType = await web3Service.getNetworkType();
      //Evento cuando cambian las cuentas
      window.ethereum.on("accountsChanged", function (accounts) {
        window.location.reload();
      });

      const fatherContractService = new FatherContractService();
      await fatherContractService.configureService(web3Service);

      const sonContractService = new SonContractService();
      await sonContractService.configureService(web3Service, account);

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
        sonContractService,
      });
    } catch (error) {}
  };

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

  loadUserBetsWithData = async () => {
    const { matches } = this.state;
    const { fatherContractService, account, sonContractService } = this.state;
    const userBets = await fatherContractService.getBetsByAccount(account);

    let userBetsWithAllData = [];
    for (let i = 0; i < userBets.length; i++) {
      let newBet = await sonContractService.getAllData(
        userBets[i].contractAddress,
        matches
      );
      userBetsWithAllData.push(newBet);
    }

    this.setState({ userBets: userBetsWithAllData });
  };

  loadMatchBetsWithData = async (matches) => {
    const { fatherContractService, account, sonContractService } = this.state;

    for (let i = 0; i < matches.length; i++) {
      var match = matches[i];
      match.bets = [];
      await fatherContractService
        .getBetsByMatchId(account, match.id)
        .then(async (bets) => {
          for (let j = 0; j < bets.length; j++) {
            let newBet = await sonContractService.getAllData(
              bets[j].contractAddress,
              matches
            );
            newBet.match = match;

            if (
              !newBet.isTheUserTheOwner &&
              !newBet.isTheUserTheCounterGambler
            ) {
              match.bets.push(newBet);
            }
          }
        });
    }

    this.setState({ matches });
  };

  showPopupCreateBet = (match) => {
    this.setState({ selectedMatch: match, showPopupCreateBet: true });
  };

  closePopupCreateBet = () => {
    this.setState({ showPopupCreateBet: false });
  };

  createBet = async (bet) => {
    const { fatherContractService, account } = this.state;

    this.setState({ showPopupCreateBet: false, showPopupLoading: true });
    await fatherContractService.createBet(bet, account, this.createBetFinished);
  };

  createBetFinished = async (arg) => {
    await this.loadUserBetsWithData();
    this.closePopupLoading();
  };

  showPopupAcceptBet = (bet) => {
    this.setState({ selectedBet: bet, showPopupAcceptBet: true });
  };

  closePopupAcceptBet = () => {
    this.setState({ showPopupAcceptBet: false });
  };

  closePopupLoading = () => {
    this.setState({ showPopupLoading: false });
  };

  acceptBet = async (bet) => {
    const { sonContractService, account } = this.state;
    await sonContractService.acceptBet(bet, account, this.acceptBetFinished);

    this.setState({ showPopupAcceptBet: false, showPopupLoading: true });
  };

  acceptBetFinished = async (arg) => {
    await this.loadUserBetsWithData();
    this.closePopupLoading();
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
    let showChat = false;
    let showUser = false;
    let showBets = false;
    switch (changeTo) {
      case "chat":
        showChat = true;
        break;
      case "user":
        showUser = true;
        break;
      case "bets":
        showBets = true;
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
          {this.state.showUser ? (
            <UserProfile
              networkId={this.props.networkId}
              account={this.props.account}
              networkType={this.props.networkType}
              sonContractService={this.state.sonContractService}
            ></UserProfile>
          ) : null}
          {this.state.showChat ? (
            <Chat messages={this.state.messages}></Chat>
          ) : null}
          {!this.props.showChat ? (
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
            sendMessageFunction={this.sendMessage}
            sonContractService={this.state.sonContractService}
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
        {this.state.showPopupLoading ? (
          <PopupLoading
            closePopupLoadingFunction={this.closePopupLoading}
          ></PopupLoading>
        ) : null}
      </div>
    );
  }
}

export default App;
