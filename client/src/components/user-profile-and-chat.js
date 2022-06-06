import React, { Component } from "react";
import { Chat } from "./chat";
import { UserProfile } from "./user-profile";

export class UserProfileAndChat extends Component {
  render() {
    return (
      <div className="user-profile-and-chat">
        <UserProfile
          networkId={this.props.networkId}
          account={this.props.account}
          networkType={this.props.networkType}
        ></UserProfile>
        <Chat
          sendMessageFunction={this.props.sendMessageFunction}
          messages={this.props.messages}
        ></Chat>
      </div>
    );
  }
}
