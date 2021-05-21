import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";

// toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// react-Router
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
import { firebaseConfig } from "./utils/config";

//components - pages
import Home from "./Pages/Home";
import SignIn from "./Pages/SignIn";
import PageNotFound from "./Pages/PageNotFound";
import Header from "./Components/Header";
import Register from "./Pages/Register";
import EmailVerification from "./Pages/EmailVerification";
import Account from "./Pages/Account";
import ForgetPassword from "./Pages/ForgetPassword";

//Context and stuff
import { UserContext } from "./Context/Context";
import { Container } from "reactstrap";

// Initialize firebase
firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    //console.log(user);
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  // firebase.auth.onAuthStateChanged( user)

  return (
    <Router>
      <UserContext.Provider value={{ user, setUser }}>
        <ToastContainer />
        <Header />
        <Container>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/signin" component={SignIn} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/verifyemail" component={EmailVerification} />
            <Route exact path="/account" component={Account} />
            <Route exact path="/forgetpassword" component={ForgetPassword} />
            <Route exact path="*" component={PageNotFound} />
          </Switch>
        </Container>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
