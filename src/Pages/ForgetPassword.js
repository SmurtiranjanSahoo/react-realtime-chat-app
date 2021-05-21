import React, { useContext, useState } from "react";
import { Form, Col, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { UserContext } from "../Context/Context";
import firebase from "firebase/app";

const ForgetPassword = () => {
  const userContext = useContext(UserContext);

  const [email, setEmail] = useState("");

  const forgetPassword = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        toast("Password reset link sent to your email", { type: "dark" });
        firebase
          .auth()
          .signOut()
          .then(() => {
            userContext.setUser(null);
            localStorage.clear();
          });
      })
      .catch((err) => {
        toast(err.message, { type: "error" });
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    forgetPassword();
  };

  return (
    <div className="w-75 m-auto">
      <div className="form-text text-center m-5">
        <h3 className="signin-welcomeText">Reset Your Password</h3>
        <h6>
          <Link to="/signin">Sign In</Link>
        </h6>
      </div>

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label className="text-light" column>
            Email
          </Form.Label>
          <Col>
            <Form.Control
              type="email"
              placeholder="Enter Email"
              id="exampleInputEmail1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group className="my-3">
          <Col>
            <Button className="w-100" type="submit">
              Reset Password
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
};

export default ForgetPassword;
