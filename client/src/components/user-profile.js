import React, { Component } from "react";

export class UserProfile extends Component {
  nullAddress = "0x0000000000000000000000000000000000000000"; //TO-DO CREAR ARCHIVO DE CONSTANTES
  getTypeOfBetResult = (bet) => {
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

  isAllowedToCancelBet = (bet) => {
    //Sólo se puede cancelar la apuesta si el usuario es el creador de la apuesta
    //Y si todavía nadie se la ha aceptado
    return bet.isTheUserTheOwner && bet.counterGambler === this.nullAddress;
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
                      <div className="user-bet-and-cancel">
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
                        {this.isAllowedToCancelBet(bet) ? (
                          <button
                            onClick={() => {
                              this.props.showPopupCancelBetFunction(bet);
                            }}
                            className="btn small-btn"
                          >
                            Cancelar
                          </button>
                        ) : null}
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
