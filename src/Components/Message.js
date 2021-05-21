import React, { useContext } from "react";
import { UserContext } from "../Context/Context";

const Message = ({ message }) => {
  const userContext = useContext(UserContext);

  return userContext.user?.uid === message[1].userUid ? (
    <div
      style={{
        width: "50%",
        marginTop: "1rem",
        marginBottom: "1rem",
        marginLeft: "auto",
      }}
      className="d-flex align-items-center wrapper-msg"
    >
      <div
        style={{ width: "100%", marginLeft: "auto" }}
        className="message-container bg-dark"
      >
        <div className="msg-username">{message[1].userName}</div>
        <div className="msg">{message[1].message}</div>
        <div className="msgTime">{message[1].messageTime}</div>
      </div>
    </div>
  ) : (
    <div className="wrapper-msg">
      <img
        className="rounded-circle msg-userImg"
        alt="user image"
        src={message[1].userPhoto}
      />
      <div className="message-container bg-primary">
        <div className="msg-username">{message[1].userName}</div>
        <div className="msg">{message[1].message}</div>
        <div className="msgTime">{message[1].messageTime}</div>
      </div>
    </div>
  );
};

export default Message;
