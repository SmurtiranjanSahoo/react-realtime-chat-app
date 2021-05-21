import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { Container } from "reactstrap";
import ContainerChat from "../Components/ContainerChat";
import SendForm from "../Components/SendForm";
import { UserContext } from "../Context/Context";

const Home = () => {
  const userContext = useContext(UserContext);

  if (!userContext.user?.emailVerified && userContext.user?.uid) {
    return <Redirect to="/verifyemail" />;
  }

  // ! Put anypage behind login
  if (userContext.user === null) {
    return <Redirect to="/signin" />;
  }

  return (
    <Container fluid className="App ">
      <ContainerChat />
      <SendForm />
    </Container>
  );
};

export default Home;
