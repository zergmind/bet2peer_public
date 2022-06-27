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
import { PopupCancelBet } from "./components/popup-cancel-bet.js";
import { PopupResolveBet } from "./components/popup-resolve-bet";

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
    showPopupCancelBet: false,
    showPopupResolveBet: false,
    showPopupLoading: false,
    userBets: [],
    currentAccountBalance: 0,
    currentSymbol: "",
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      await this.loadServices();
      const websocketService = new WebsocketService();
      websocketService.setReceiveMessage(this.receiveMessage);

      const sportMonksService = new SportMonksService();

      this.setState({
        websocketService,
        sportMonksService,
      });

      await this.loadMatchBets();
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
      const currentAccountBalance = await web3Service.getBalance(account);
      const currentSymbol = await web3Service.getCurrentSymbol();

      //Evento cuando cambian las cuentas
      window.ethereum.on("accountsChanged", function (accounts) {
        window.location.reload();
      });

      const fatherContractService = new FatherContractService();
      await fatherContractService.configureService(web3Service, networkId);

      const sonContractService = new SonContractService();
      await sonContractService.configureService(web3Service, account);

      this.setState({
        accounts,
        account,
        networkId,
        networkType,
        fatherContractService,
        sonContractService,
        currentAccountBalance,
        currentSymbol,
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

  loadMatchBets = async () => {
    const { sportMonksService } = this.state;

    await sportMonksService.getCurrentMatches().then((matches) => {
      // this.getBetsByMatches(data);
      this.setState({ matches });
      this.loadMatchBetsWithData(matches);
    });
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
      const bets = await fatherContractService.getBetsByMatchId(
        account,
        match.id
      );
      for (let j = 0; j < bets.length; j++) {
        let newBet = await sonContractService.getAllData(
          bets[j].contractAddress,
          matches
        );

        if (!newBet.isTheUserTheOwner && !newBet.isTheUserTheCounterGambler) {
          match.bets.push(newBet);
        }
      }
    }

    this.setState({ matches: [...matches] });
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

  cancelBet = async (bet) => {
    const { fatherContractService, account } = this.state;

    this.setState({ showPopupCancelBet: false, showPopupLoading: true });
    await fatherContractService.cancelBet(bet, account, this.cancelBetFinished);
  };

  cancelBetFinished = async (arg) => {
    await this.loadUserBetsWithData();
    this.closePopupLoading();
  };

  showPopupCancelBetFunction = (bet) => {
    this.setState({ selectedBet: bet, showPopupCancelBet: true });
  };

  closePopupCancelBet = () => {
    this.setState({ showPopupCancelBet: false });
  };

  resolveBet = async (bet) => {
    const { fatherContractService, account } = this.state;

    this.setState({ showPopupResolveBet: false, showPopupLoading: true });
    await fatherContractService.resolveBet(
      bet,
      account,
      this.resolveBetFinished
    );
  };

  resolveBetFinished = async (arg) => {
    await this.loadUserBetsWithData();
    this.closePopupLoading();
  };

  showPopupResolveBetFunction = (bet) => {
    this.setState({ selectedBet: bet, showPopupResolveBet: true });
  };

  closePopupResolveBet = () => {
    this.setState({ showPopupResolveBet: false });
  };

  closePopupLoading = () => {
    this.setState({ showPopupLoading: false });
  };

  showPopupAcceptBet = (bet) => {
    this.setState({ selectedBet: bet, showPopupAcceptBet: true });
  };

  closePopupAcceptBet = () => {
    this.setState({ showPopupAcceptBet: false });
  };

  acceptBet = async (bet) => {
    const { sonContractService, account } = this.state;

    this.setState({ showPopupAcceptBet: false, showPopupLoading: true });
    await sonContractService.acceptBet(bet, account, this.acceptBetFinished);
  };

  acceptBetFinished = async (arg) => {
    const { matches } = this.state;
    await this.loadUserBetsWithData();
    await this.loadMatchBetsWithData(matches);
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
              currentSymbol={this.state.currentSymbol}
            ></MatchList>
          ) : null}
          {this.state.showUser ? (
            <UserProfile
              networkId={this.state.networkId}
              networkType={this.state.networkType}
              account={this.state.accounts ? this.state.accounts[0] : null}
              sonContractService={this.state.sonContractService}
              showPopupCancelBetFunction={this.showPopupCancelBetFunction}
              showPopupResolveBetFunction={this.showPopupResolveBetFunction}
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
            showPopupCancelBetFunction={this.showPopupCancelBetFunction}
            showPopupResolveBetFunction={this.showPopupResolveBetFunction}
          ></UserProfileAndChat>
        </div>
        {this.state.showPopupCreateBet ? (
          <PopupCreateBet
            match={this.state.selectedMatch}
            createBetFunction={this.createBet}
            closePopupCreateBetFunction={this.closePopupCreateBet}
            web3Service={this.state.web3Service}
            currentAccountBalance={this.state.currentAccountBalance}
            currentSymbol={this.state.currentSymbol}
          ></PopupCreateBet>
        ) : null}
        {this.state.showPopupAcceptBet ? (
          <PopupAcceptBet
            bet={this.state.selectedBet}
            acceptBetFunction={this.acceptBet}
            closePopupAcceptBetFunction={this.closePopupAcceptBet}
            web3Service={this.state.web3Service}
            currentAccountBalance={this.state.currentAccountBalance}
            currentSymbol={this.state.currentSymbol}
          ></PopupAcceptBet>
        ) : null}
        {this.state.showPopupCancelBet ? (
          <PopupCancelBet
            bet={this.state.selectedBet}
            cancelBetFunction={this.cancelBet}
            closePopupCancelBetFunction={this.closePopupCancelBet}
            currentSymbol={this.state.currentSymbol}
          ></PopupCancelBet>
        ) : null}
        {this.state.showPopupResolveBet ? (
          <PopupResolveBet
            bet={this.state.selectedBet}
            resolveBetFunction={this.resolveBet}
            closePopupResolveBetFunction={this.closePopupResolveBet}
            currentSymbol={this.state.currentSymbol}
          ></PopupResolveBet>
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
