import React, { useContext, useState } from "react";
import firebase from "firebase/app";
import { toast } from "react-toastify";
import { GoogleButton } from "react-google-button";
import { UserContext } from "../Context/Context";
import { Link, Redirect } from "react-router-dom";

import { Form, FormGroup, Label, Input, Button } from "reactstrap";

import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: #0d6efd;
`;

const SignIn = () => {
  const userContext = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    await firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const user = result.user;

        userContext.setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        // console.log(user);
      })
      .catch((err) => {
        console.log(err);
        toast(err.message, { type: "error" });
      });
  };

  const signInWithEmail = async () => {
    setIsLoading(true);

    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        userContext.setUser(user);

        localStorage.setItem("user", JSON.stringify(user));
      })
      .catch((err) => {
        console.log(err);
        toast(err.message, { type: "error" });
      });
    setIsLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signInWithEmail();
  };
  if (userContext.user?.uid && !userContext.user?.emailVerified) {
    // console.log(userContext.user?.uid);
    return <Redirect to="/verifyemail" />;
  }
  if (userContext.user?.uid && userContext.user?.emailVerified) {
    // console.log(userContext.user);
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
    <div className="w-75 m-auto">
      <div className="form-text text-center m-5">
        <h3 className="signin-welcomeText">Welcome Back</h3>
        <h6 className="p-2 signin-DhaText ">
          Don't have an account? <Link to="/register">Register</Link>
        </h6>
      </div>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label className="text-light my-2" for="exampleInputEmail1">
            Email address
          </Label>
          <Input
            type="email"
            className="form-control mb-1"
            id="exampleInputEmail1"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup className="mb-4">
          <Label className="text-light my-2" for="exampleInputPassword1">
            Password
          </Label>
          <Input
            type="password"
            className="form-control mb-1"
            id="exampleInputPassword1"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <small id="emailHelp" className="form-text">
            <Link to="/forgetpassword" className="text-decoration-none">
              Forget Password?
            </Link>
          </small>
        </FormGroup>
        <div className="d-flex justify-content-center">
          <Button color="primary" className=" w-100">
            Sign In
          </Button>
        </div>
      </Form>
      <div className="d-flex justify-content-center mt-3 text-light">
        <h6>OR</h6>
      </div>
      <div
        style={{ outline: "none" }}
        className="d-flex justify-content-center mt-4"
      >
        <GoogleButton className="m-auto w-100" onClick={signInWithGoogle} />
      </div>
    </div>
  );
};

export default SignIn;
