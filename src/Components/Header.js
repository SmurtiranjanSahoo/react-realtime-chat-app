import React, { useContext } from "react";
import { UserContext } from "../Context/Context";
import { Navbar, NavbarBrand, NavbarText } from "reactstrap";
import Dropdown from "react-bootstrap/Dropdown";
import firebase from "firebase/app";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import userDefaultImg from "../Images/user.png";

const Header = () => {
  const userContext = useContext(UserContext);

  // sign from google
  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        userContext.setUser(null);
        localStorage.clear();
      })
      .catch((err) => {
        console.log(err.message);
        toast(err.message, { type: "error" });
      });
  };

  return (
    <div>
      <Navbar className="" color="primary" light>
        <NavbarBrand tag={Link} to="/" className="text-white mx-3">
          Chitter-Chatter
        </NavbarBrand>
        <NavbarText className="text-white float-right">
          {userContext.user !== null && userContext.user?.emailVerified ? (
            <h6
              // style={style}
              className="visible header-welcomeText"
            >{`Welcome Back, ${userContext.user?.displayName}`}</h6>
          ) : (
            <></>
          )}
        </NavbarText>

        {userContext.user ? (
          <Dropdown className="mx-2">
            <Dropdown.Toggle id="dropdown-basic">
              <img
                className="rounded-circle"
                style={{ height: "2em", marginRight: "2vw" }}
                src={
                  userContext.user?.photoURL
                    ? userContext.user?.photoURL
                    : userDefaultImg
                }
                alt="user Image"
              />
            </Dropdown.Toggle>

            <Dropdown.Menu className="my-2">
              <Dropdown.Item>
                <Link className="text-decoration-none text-dark" to="/account">
                  Account
                </Link>
              </Dropdown.Item>
              {/* <Dropdown.Item>Another action</Dropdown.Item> */}
              <Dropdown.Divider />
              <Dropdown.Item
                style={{ fontWeight: "bold" }}
                onClick={signOut}
                className="text-primary"
              >
                Sign Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <></>
        )}
      </Navbar>
    </div>
  );
};

export default Header;
