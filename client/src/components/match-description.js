import React from "react";

export default ({ match }) => {
  return (
    <div className="match-container match-description">
      <div className="team-local">
        <div className="team-name">{match.localName}</div>
        <img src={match.localImageUrl} alt="equipo_local" />
      </div>
      <div className="vs">vs</div>
      <div className="team-visitor">
        <img src={match.visitorImageUrl} alt="equipo_visitante" />
        <div className="team-name">{match.visitorName}</div>
      </div>
    </div>
  );
};
