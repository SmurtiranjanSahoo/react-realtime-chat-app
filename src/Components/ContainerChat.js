import React, { useEffect, useReducer } from "react";
import Message from "./Message";
import firebase from "firebase/app";
import reducer from "../Context/reducer";
import { SEND_MESSAGE, SET_LOADING } from "../Context/action.type";
import ScrollToBottom from "react-scroll-to-bottom";
import { css } from "@emotion/core";
import PulseLoader from "react-spinners/PulseLoader";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

// first state to provide in react reducer
const initialState = {
  messages: [],
  //message: {},
  isLoading: false,
};

const ContainerChat = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { messages, isLoading } = state;

  const getMessages = async () => {
    //start loading
    dispatch({
      type: SET_LOADING,
      payload: true,
    });

    const messagesRef = await firebase.database().ref("chats");
    messagesRef.on("value", (snapshot) => {
      dispatch({
        type: SEND_MESSAGE,
        payload: snapshot.val(),
      });
      //stop loading
      dispatch({
        type: SET_LOADING,
        payload: false,
      });
    });
  };

  useEffect(() => {
    getMessages();
  }, []);

  // return loading spinner
  if (isLoading) {
    return (
      <div className="m-5">
        <PulseLoader color="#0b5ed7" css={override} size={15} />
      </div>
    );
  }

  return (
    <ScrollToBottom className="container-chat w-100">
      {/*  Loop through FIREBASE objects  */}
      {messages.length === 0 ? (
        <div className="Center text-large text-warning">
          No Messages - Firebase
        </div>
      ) : (
        <div>
          {Object.entries(messages).map((message, key) => (
            <div key={key}>
              <Message message={message} />
            </div>
          ))}
        </div>
      )}
    </ScrollToBottom>
  );
};

export default ContainerChat;
