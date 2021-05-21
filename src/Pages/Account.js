import React, { useState, useContext } from "react";
import { Form, Col, Button, InputGroup } from "react-bootstrap";
import userDefaultImg from "../Images/user.png";
import { Redirect } from "react-router-dom";

// to compress image before uploading to the server
import { readAndCompressImage } from "browser-image-resizer";
import { imageConfig } from "../utils/config";

import firebase from "firebase/app";
import { toast } from "react-toastify";
import { UserContext } from "../Context/Context";
import { css } from "@emotion/core";
import CircleLoader from "react-spinners/CircleLoader";

const override = css`
  display: block;
  margin: 0 auto;
`;

const Account = () => {
  const userContext = useContext(UserContext);

  const [isUploading, setIsUploading] = useState(false);
  const [userProfilePicUrl, setUserProfilePicUrl] = useState(null);
  const [profileName, setProfileName] = useState(null);

  const userImagePicker = async (e) => {
    try {
      const file = e.target.files[0];

      var metadata = {
        contentType: file.type,
      };

      let resizedImage = await readAndCompressImage(file, imageConfig);

      // storage reference
      const storageRef = await firebase.storage().ref();

      var uploadTask = storageRef
        .child("userProfilePicture" + file.name)
        .put(resizedImage, metadata);

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          setIsUploading(true);

          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              setIsUploading(false);
              console.log("upload is paused");
              break;
            case firebase.storage.TaskState.RUNNING:
              console.log("upload is running");
              break;
          }
          if (progress === 100) {
            setIsUploading(false);
          }
        },
        (err) => {
          console.log(err);
          toast("Something went wrong!", { type: "error" });
        },
        () => {
          // upload complete
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then((downloadUrl) => {
              setUserProfilePicUrl(downloadUrl);
            })
            .catch((err) => console.error(err));
        }
      );
    } catch (error) {
      console.error(error);
      toast("Something went wrong", { type: "error" });
    }
  };

  const updateProfile = async () => {
    const intervalUpdate = setInterval(() => {
      const user = firebase.auth().currentUser;

      if (profileName && user) {
        user.updateProfile({
          displayName: profileName,
        });
      }
      if (userProfilePicUrl && user) {
        user.updateProfile({
          photoURL: userProfilePicUrl,
        });
      }
      if (user) user.reload();
      // console.log(user);

      userContext.setUser(null);
      userContext.setUser(user);
      localStorage.clear();
      localStorage.setItem("user", JSON.stringify(user));
      setTimeout(() => {
        clearInterval(intervalUpdate);
      }, 2000);
    }, 1000);
    toast("Profile Updated", { type: "dark" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile();
  };

  if (!userContext.user?.emailVerified && userContext.user?.uid) {
    return <Redirect to="/verifyemail" />;
  }

  // ! Put anypage behind login
  if (userContext.user === null) {
    console.log(userContext.user);
    return <Redirect to="/signin" />;
  }

  return (
    <div
      style={{
        width: "60vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        margin: "auto",
        marginTop: "10vh",
      }}
    >
      <img
        style={{
          height: "20vh",
          margin: "auto",
        }}
        className="rounded-circle"
        src={
          userProfilePicUrl
            ? userProfilePicUrl
            : userContext.user?.photoURL
            ? userContext.user?.photoURL
            : userDefaultImg
        }
        alt="user image"
      />
      <Form onSubmit={handleSubmit} className="text-light my-3">
        {isUploading ? (
          <CircleLoader color="#0b5ed7" css={override} size={40} />
        ) : (
          <InputGroup>
            <input
              type="file"
              className="form-control"
              id="customFile"
              accept="image/*"
              multiple={false}
              onChange={(e) => userImagePicker(e)}
            />
          </InputGroup>
        )}

        <Form.Group controlId="formPlaintext">
          <Form.Label column>Name</Form.Label>
          <Col>
            <Form.Control
              type="text"
              placeholder="Enter Name"
              defaultValue={userContext.user?.displayName}
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group className="my-3">
          <Col>
            <Button className="w-100" type="submit">
              Update
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
};

export default Account;
