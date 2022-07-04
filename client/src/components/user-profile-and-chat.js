import React, { Component } from "react";
import { Chat } from "./chat";
import { ChatForm } from "./chat-form";
import { UserProfile } from "./user-profile";

export class UserProfileAndChat extends Component {
  render() {
    return (
      <div className="user-profile-and-chat">
        <UserProfile
          networkId={this.props.networkId}
          account={this.props.account}
          networkType={this.props.networkType}
          userBets={this.props.userBets}
          sonContractService={this.props.sonContractService}
          showPopupCancelBetFunction={this.props.showPopupCancelBetFunction}
          showPopupResolveBetFunction={this.props.showPopupResolveBetFunction}
          web3NetworkAvailable={this.props.web3NetworkAvailable}
          currentSymbol={this.props.currentSymbol}
        ></UserProfile>
        <Chat messages={this.props.messages}></Chat>
        <ChatForm
          sendMessageFunction={this.props.sendMessageFunction}
        ></ChatForm>
      </div>
    );
  }
}
