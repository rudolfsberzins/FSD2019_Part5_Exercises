import React from "react";

const Notification = ({ message, isError }) => {
  if (message === null) {
    return null;
  }
  let style = isError ? "message-error" : "message-addition";
  return <div className={style}> {message} </div>;
};

export default Notification;
