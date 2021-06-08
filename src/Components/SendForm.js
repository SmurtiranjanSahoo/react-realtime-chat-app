import React, { useState, useContext } from "react";
import {
  Button,
  Input,
  InputGroup,
  Form,
  FormGroup,
  Container,
} from "reactstrap";
import firebase from "firebase/app";
import { UserContext } from "../Context/Context";
import { toast } from "react-toastify";
import { MessageContext } from "../Context/Context";

const SendForm = () => {
  const userContext = useContext(UserContext);

  const [message, setMessage] = useState("");
  const [messageTime, setMessageTime] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const [userUid, setUserUid] = useState("");

  const myUuid = () => {
    var time = new Date().toTimeString().split(" ")[0];
    const date = new Date().toISOString().split("T")[0];
    // const date = new Date().toLocaleDateString().replaceAll(`/`, ``);

    // // .reverse()
    // // .join("-");
    // let y = date[2];
    // date.pop();
    // date.unshift(y);
    // let m = date.pop();
    // if (m.charAt(0) === "0") {
    //   var mnew = m.charAt(1);
    // }
    // date.push(mnew);
    // let d = date.join("-");

    return `${date} ${time}`;
  };

  // console.log(myUuid());

  const sendMessage = async () => {
    try {
      firebase.database().ref("chats/").child(myUuid()).set({
        message,
        messageTime,
        userName,
        userPhoto,
        userUid,
      });
    } catch (err) {
      console.log(err);
      toast(err.message, { type: "error" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // empty msg handled
    if (message !== "") {
      sendMessage();
      setMessage("");
    }
  };

  return (
    <Container className="send-from">
      <MessageContext.Provider value={{ messageTime, userName, userPhoto }}>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <InputGroup className="shadow-none">
              <Input
                className="shadow-none"
                type="text"
                name="message"
                placeholder="Type a message"
                value={message}
                onChange={(e) => {
                  var msgTime = new Date().toTimeString().split(" ")[0];
                  // console.log(msgTime);
                  setMessageTime(msgTime);
                  setUserPhoto(userContext.user?.photoURL);
                  setUserName(userContext.user?.displayName);
                  setUserUid(userContext.user?.uid);
                  setMessage(e.target.value);
                  //console.log(messages);
                }}
              />
              <button
                style={{
                  outline: "none",
                  border: "none",
                  borderRadius: "0px 5px 5px 0",
                  background: "#0d6efd",
                  color: "#ffffff",
                }}
                className="px-4"
              >
                Send
              </button>
            </InputGroup>
          </FormGroup>
        </Form>
      </MessageContext.Provider>
    </Container>
  );
};

export default SendForm;
