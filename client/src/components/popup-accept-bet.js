import React, { Component } from "react";
import MatchDescription from "./match-description.js";
import Popup from "./popup.js";

export class PopupAcceptBet extends Component {
  getQuota = () => {
    const ratio =
      this.props.bet.minimumOppositeBet / this.props.bet.originalBet;
    const ratioPlusOwnBet = ratio + 1;

    return ratioPlusOwnBet.toFixed(2);
  };

  getTypeOfBetResult = () => {
    switch (this.props.bet.result) {
      case 0: //EMPATA
        return " no empatan";
      case 1:
        return ` no gana el ${this.props.bet.match.localName}`;
      case 2:
        return ` no gana el ${this.props.bet.match.visitorName}`;
    }
  };

  acceptBet = () => {
    this.props.acceptBetFunction(this.state.bet);
  };

  render() {
    return (
      <Popup
        title={"Aceptar apuesta"}
        closeFunction={this.props.closePopupAcceptBetFunction}
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
                {this.props.bet.minimumOppositeBet} ETH
                <img
                  className="bet-logo"
                  src="/img/eth.png"
                  alt="logo ethereum"
                ></img>
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
