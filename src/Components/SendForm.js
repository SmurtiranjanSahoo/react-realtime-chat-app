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
    // const date = new Date().toISOString().split("T")[0];
    const date = new Date()
      .toLocaleDateString()
      .replaceAll(`/`, `-`)
      .split("-")
      .reverse()
      .join("-");
    // let y = date[2];
    // date.pop();
    // date.unshift(y);
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
    <Container className="fixed-bottom mb-4">
      <MessageContext.Provider value={{ messageTime, userName, userPhoto }}>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <InputGroup>
              <Input
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
              <Button color="primary" className="px-4">
                Send
              </Button>
            </InputGroup>
          </FormGroup>
        </Form>
      </MessageContext.Provider>
    </Container>
  );
};

export default SendForm;
