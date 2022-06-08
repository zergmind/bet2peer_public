import React, { Component } from "react";
import Popup from "./popup.js";

export class PopupAcceptBet extends Component {
  render() {
    return (
      <Popup
        title={"Aceptar apuesta"}
        closeFunction={this.props.closePopupAcceptBetFunction}
      >
        <p>Bet Id: {this.props.betId}</p>
      </Popup>
    );
  }
}
