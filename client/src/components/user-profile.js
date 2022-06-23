import React, { Component } from "react";

export class UserProfile extends Component {
  getTypeOfBetResult = (bet) => {
    switch (bet.result) {
      case 0: //EMPATA
        return " empatan";
      case 1:
        return ` gana el ${bet.match.localName}`;
      case 2:
        return ` gana el ${bet.match.visitorName}`;
      default:
        return "";
    }
  };

  render() {
    return (
      <div className="user-profile">
        <div>Mi perfil</div>
        {this.props.account ? (
          <div>
            <div className="avatar-and-network">
              <div>
                <img src="/img/avatar.webp" alt="perfil de usuario"></img>
              </div>
              <div>
                Red {this.props.networkType}({this.props.networkId})
              </div>
            </div>
            <div className="user-account">
              <div>{this.props.account}</div>
            </div>
            <div>Mis apuestas</div>
            <div className="user-bets">
              {this.props.userBets ? (
                this.props.userBets.map((bet) => (
                  <div key={bet.contractAddress}>
                    {bet.match ? (
                      <div className="user-bet">
                        <div className="bet-teams">
                          <div>
                            <img
                              src={bet.match.localImageUrl}
                              alt="equipo_local"
                            />
                          </div>
                          <div>
                            <img
                              className="vs-image"
                              src="/img/vs.png"
                              alt="vs"
                            />
                          </div>
                          <div>
                            <img
                              src={bet.match.visitorImageUrl}
                              alt="equipo_visitante"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="bet-quantity">
                            {bet.quantity}
                            <img
                              className="bet-logo"
                              src="/img/eth.png"
                              alt="logo ethereum"
                            ></img>
                            a cuota {bet.quota}
                          </div>
                          <div>{this.getTypeOfBetResult(bet)}</div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))
              ) : (
                <div>No tienes apuestas todavía</div>
              )}
            </div>
          </div>
        ) : (
          <div>Para ver tus apuestas conéctate a tu wallet</div>
        )}
      </div>
    );
  }
}
