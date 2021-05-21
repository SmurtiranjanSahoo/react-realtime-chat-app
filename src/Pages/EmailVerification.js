import React, { useContext, useState } from "react";
import firebase from "firebase/app";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import { Link, Redirect, useHistory } from "react-router-dom";
import { UserContext } from "../Context/Context";

import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: #0d6efd;
`;

const EmailVerification = () => {
  const userContext = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const completedVerification = () => {
    setIsLoading(true);

    const interval = setInterval(() => {
      const user = firebase.auth().currentUser;
      var firebaseEmailVerified = false;
      // console.log(user);
      if (user) {
        user.reload();
        console.log("user");
        console.log(user);
        userContext.setUser(user);
        firebaseEmailVerified = user.emailVerified;

        console.log(userContext.user);
      }

      if (userContext.user?.emailVerified || firebaseEmailVerified) {
        userContext.setUser(null);
        localStorage.clear();
        history.push("/signin");
        clearInterval(interval);
        console.log(userContext.user);

        // console.log("redirect");
        setIsLoading(false);
      }
    }, 1000);
  };

  const resendVerificationEmail = (e) => {
    e.preventDefault();

    const user = firebase.auth().currentUser;
    if (user) {
      user.sendEmailVerification();
    }

    setTimeout(() => {
      toast("Email sent sucessfully, Please verify", {
        type: "dark",
        position: "bottom-right",
      });
    }, 10000);
  };

  if (!userContext.user) {
    return <Redirect to="/" />;
  }

  if (isLoading) {
    return (
      <div className="m-5">
        <ClipLoader color="#0b5ed7" css={override} size={50} />
      </div>
    );
  }

  return (
    <div
      className="d-flex  flex-column justify-content-center 
    align-items-center m-5"
    >
      <h2 className="text-center text-light mb-4">
        Verify Email To Activate Your Account
      </h2>
      <p className="text-center text-light">
        Please verify your email{" "}
        <Link className="text-warning text-decoration-none">
          {userContext.user?.email}
        </Link>{" "}
        by clicking on the verification link sent to your registered email.
      </p>
      <p className="text-center text-light">
        Can't find email that we have sent you? <br /> Please check your spam
        folder.
      </p>
      <Button
        style={{ fontFamily: "monospace", fontWeight: "bold" }}
        className="m-3 text-uppercase"
        onClick={completedVerification}
        color="primary"
      >
        Completed Email Verification
      </Button>
      <Button
        style={{ fontFamily: "monospace", fontWeight: "bold" }}
        className="bg-transparent border-0 text-primary text-uppercase shadow-none"
        onClick={resendVerificationEmail}
      >
        Resend Email
      </Button>
    </div>
  );
};

export default EmailVerification;
