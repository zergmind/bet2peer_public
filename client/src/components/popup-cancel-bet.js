import React, { Component } from "react";
import MatchDescription from "./match-description.js";
import Popup from "./popup.js";

export class PopupCancelBet extends Component {
  getQuota = () => {
    return this.props.bet.quota.toFixed(2);
  };

  getTypeOfBetResult = (bet) => {
    if (!this.props.bet.match) {
      return "";
    }
    const modifier = bet.isTheUserTheCounterGambler ? " no" : "";
    switch (bet.result) {
      case 0: //EMPATA
        return `${modifier} empatan`;
      case 1:
        return `${modifier} gana el ${bet.match.localName}`;
      case 2:
        return `${modifier} gana el ${bet.match.visitorName}`;
      default:
        return "";
    }
  };

  cancelBet = () => {
    this.props.cancelBetFunction(this.props.bet);
  };

  render() {
    return (
      <Popup
        title={"Cancelar apuesta"}
        closeFunction={this.props.closePopupCancelBetFunction}
      >
        <MatchDescription match={this.props.bet.match}></MatchDescription>
        <div className="accept-description-container">
          <div className="empty-column"></div>
          <div className="accept-description">
            <div className="bet-logo">
              <img
                src="/img/logos/png/flat/imago-tipo-color.png"
                alt="logo"
              ></img>
            </div>
            <div className="bet-quotas-container">
              <div className="bet-opposite">
                {this.props.bet.quantity} ETH
                <img
                  className="bet-logo"
                  src="/img/eth.png"
                  alt="logo ethereum"
                ></img>
              </div>
              <div>{this.getTypeOfBetResult(this.props.bet)} &nbsp;</div>
              <div> a cuota {this.getQuota(this.props.bet)}</div>
            </div>
          </div>
        </div>
        <div className="btn-container">
          <button className="btn" onClick={this.cancelBet}>
            Cancelar apuesta
          </button>
        </div>
      </Popup>
    );
  }
}
