import React from "react";

export default ({ title, children, closeFunction }) => {
  return (
    // <div className="popup-container">
    //   <div className="empty-column"></div>
    //   <div className="popup-body-container">{children}</div>
    //   <div className="empty-column"></div>
    // </div>
    <div class="overlay">
      <div class="popup">
        <h2>{title}</h2>
        <a class="close" onClick={closeFunction}>
          &times;
        </a>
        <div class="content">{children}</div>
      </div>
    </div>
  );
};
