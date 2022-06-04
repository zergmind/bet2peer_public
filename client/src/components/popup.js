import React, { Component } from "react";

export default ({ children }) => {
  return (
    <div className="popup-container">
      <div className="empty-column"></div>
      <div className="popup-body-container">{children}</div>
      <div className="empty-column"></div>
    </div>
  );
};
