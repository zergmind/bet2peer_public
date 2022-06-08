import React, { Component } from "react";
import Popup from "./popup.js";

export class PopupCreateBet extends Component {
  render() {
    return (
      <Popup
        title={"Crear apuesta"}
        closeFunction={this.props.closePopupCreateBetFunction}
      >
        <p>Match Id: {this.props.matchId}</p>
      </Popup>
    );
  }
}
