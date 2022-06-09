import React from "react";

export default ({ title, children, closeFunction }) => {
  return (
    <div className="overlay">
      <div className="popup">
        <div className="header">
          <h2>{title}</h2>
          <div className="close" onClick={closeFunction}>
            &times;
          </div>
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
};
