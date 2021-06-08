import React, { useState, useContext } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import firebase from "firebase/app";
import { toast } from "react-toastify";
import { UserContext } from "../Context/Context";
import userDefaultImg from "../Images/user.png";

import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: #0d6efd;
`;

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const userContext = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const registerwithEmail = async () => {
    setIsLoading(true);
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredentrial) => {
        const user = userCredentrial.user;

        userContext.setUser(user);

        localStorage.setItem("user", JSON.stringify(user));
        // update profile
        user.updateProfile({
          displayName: name,
          photoURL: userDefaultImg,
          appName: "Chitter Chatter",
        });
        user.sendEmailVerification();
      })
      .catch((err) => {
        console.log(err);
        toast(err.message, { type: "error" });
      });
    setIsLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerwithEmail();
  };

  if (userContext.user?.emailVerified === false) {
    return <Redirect to="/verifyemail" />;
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
        <h3 className="register-crText">Create your account</h3>
        <h6 className="p-2 register-ahaa">
          Already have an account? <br />
          <Link to="/signin">Sign In</Link>
        </h6>
      </div>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label className="text-light my-2" for="exampleInputEmail1">
            Name
          </Label>
          <Input
            type="text"
            className="form-control mb-1"
            placeholder="Enter name"
            value={name}
            required={true}
            onChange={(e) => setName(e.target.value)}
          />
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
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
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
        </FormGroup>
        <div className="d-flex justify-content-center">
          <Button color="primary" className=" w-100">
            Register
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Register;
