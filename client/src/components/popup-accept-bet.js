import React, { Component } from "react";
import MatchDescription from "./match-description.js";
import Popup from "./popup.js";

export class PopupAcceptBet extends Component {
  getQuota = () => {
    return this.props.bet.quota.toFixed(2);
  };

  getTypeOfBetResult = () => {
    if (!this.props.bet.match) {
      return "";
    }
    switch (this.props.bet.result) {
      case 0: //EMPATA
        return " no empatan";
      case 1:
        return ` no gana el ${this.props.bet.match.localName}`;
      case 2:
        return ` no gana el ${this.props.bet.match.visitorName}`;
      default:
        return "";
    }
  };

  acceptBet = () => {
    this.props.acceptBetFunction(this.props.bet);
  };

  canAffordBet = () => {};

  render() {
    return (
      <Popup
        title={"Aceptar apuesta"}
        closeFunction={this.props.closePopupAcceptBetFunction}
      >
        <MatchDescription match={this.props.bet.match}></MatchDescription>
        <div className="accept-description-container">
          <div className="accept-description">
            <div className="bet-logo">
              <img
                src="/img/logos/png/degradado/imago-tipo-color.png"
                alt="logo"
              ></img>
            </div>
            <div className="bet-quotas-container">
              <div className="bet-opposite">
                {this.props.bet.minimumCounterBet} &nbsp;
                {this.props.currentSymbol}&nbsp;
              </div>
              <div>{this.getTypeOfBetResult()} &nbsp;</div>
              <div> a cuota {this.getQuota()}</div>
            </div>
          </div>
        </div>
        <div className="btn-container">
          <button className="btn" onClick={this.acceptBet}>
            Aceptar
          </button>
        </div>
      </Popup>
    );
  }
}
