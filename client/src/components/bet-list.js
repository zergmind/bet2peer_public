import React, { Component } from "react";

export class BetList extends Component {
  getQuota(bet) {
    const ratio = bet.minimumOppositeBet / bet.originalBet;
    const ratioPlusOwnBet = ratio + 1;

    return ratioPlusOwnBet.toFixed(2);
  }

  render() {
    return (
      <ul className="bets-container">
        {this.props.bets ? (
          this.props.bets.map((bet) => (
            <li className="bet-container" key={bet.contractAddress}>
              <div className="empty-column"></div>
              <div className="bet-logo">
                <img src="/img/bet2peer_logo.png" alt="logo"></img>
              </div>
              <div className="bet-quotas-container">
                <div className="bet-opposite">
                  Apuesta &nbsp;
                  {bet.minimumOppositeBet} ETH
                  <img
                    className="bet-logo"
                    src="/img/eth.png"
                    alt="logo ethereum"
                  ></img>
                </div>
                <div> a una cuota de {this.getQuota(bet)}</div>
                <div className="accept-bet-container">
                  <button className="btn accept-bet">Aceptar</button>
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
