import React, { Component } from "react";

export class BetList extends Component {
  getQuota = (bet) => {
    // const ratio = bet.minimumOppositeBet / bet.originalBet;
    // const ratioPlusOwnBet = ratio + 1;

    return bet.quota.toFixed(2);
  };

  getTypeOfBetResult = (bet) => {
    switch (bet.result) {
      case 0: //EMPATA
        return " no empatan ";
      case 1:
        return ` no gana el ${bet.match.localName} `;
      case 2:
        return ` no gana el ${bet.match.visitorName} `;
      default:
        return "";
    }
  };

  render() {
    return (
      <ul className="bets-container">
        {this.props.bets ? (
          this.props.bets.map((bet) => (
            <li className="bet-container" key={bet.contractAddress}>
              <div className="empty-column"></div>
              <div className="bet-logo">
                <img
                  src="/img/logos/png/flat/imago-tipo-color.png"
                  alt="logo"
                ></img>
              </div>
              <div className="bet-quotas-container">
                <div className="bet-opposite">
                  {bet.minimumCounterBet} ETH
                  <img
                    className="bet-logo"
                    src="/img/eth.png"
                    alt="logo ethereum"
                  ></img>
                </div>
                <div>{this.getTypeOfBetResult(bet)} &nbsp;</div>
                <div> a cuota {this.getQuota(bet)}</div>
                <div className="accept-bet-container">
                  <button
                    className="btn accept-bet"
                    onClick={() => {
                      this.props.showPopupAcceptBetFunction(bet);
                    }}
                  >
                    Aceptar
                  </button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li>Cargando las apuestas...</li>
        )}
      </ul>
    );
  }
}
