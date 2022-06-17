import React, { Component } from "react";

export class UserProfile extends Component {
  componentDidUpdate() {
    const { fatherContractService } = this.props;
    if(this.props.userBets){
      debugger
      this.props.userBets.forEach((userBet) => {
        //Si no se han traído datos de la apuesta
        if (!userBet.result) {
        }
      });
    }
  }

  render() {
    return (
      <div className="user-profile">
        <div>Mi perfil</div>
        {/* {this.props.account ? ( */}
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

          <div></div>
        </div>
<<<<<<< HEAD
        ) : (<div>Para ver tus apuestas conéctate a tu wallet</div>
        )
=======
        ) : (<div>Para ver tus apuestas conéctate a tu wallet</div>)
>>>>>>> 6cb77ee8051df51d15cd895390e0609a8ae0f072
      </div>
    );
  }
}
