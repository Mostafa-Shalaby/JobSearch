import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Container,
  FormControl,
  TextField,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Properties from "../Properties";

const PasswordEditor = ({ handleSnackBar }) => {
  const history = useHistory();
  const [password, setpassword] = useState({
    oldpassword: "",
    newpassword: "",
    confirmnewpassword: "",
  });

  const handleChange = (e) => {
    setpassword((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordDataUpdate = (e) => {
    e.preventDefault();
    if (password.oldpassword === "") {
      handleSnackBar("Please Enter your Original Password Set!");
      return;
    }
    if (password.newpassword === "") {
      handleSnackBar("No New Password Set!");
      return;
    }
    if (password.newpassword !== password.confirmnewpassword) {
      handleSnackBar("Confirm Password does not match Password!");
      return;
    }

    fetch(Properties.api_root + "auth/register/", {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "token " + localStorage.getItem("authenticationToken"),
      },
      body: JSON.stringify({
        password: password.oldpassword,
        new_password: password.newpassword,
      }),
    })
      .then((response) => {
        if (response.status === 202) {
          handleSnackBar("User Data Updated!");
          history.push("/");
        } else if (response.status === 401) {
          handleSnackBar("Invalid Old Password!");
        } else {
          handleSnackBar("An Error has Occured, User Data Update Failed!");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  document.title = "Edit Profile | JobSearch";

  return (
    <Container fixed>
      <Card className="profile-card">
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "#125984" }} aria-label="recipe"></Avatar>
          }
          title={<h2 style={{ margin: 0 }}>View/Edit My Profile</h2>}
        />
        <CardContent>
          <form>
            <div className="profile-section">
              <h4>Old Password:</h4>
              <FormControl className="formInput" fullWidth>
                <TextField
                  id="oldpassword"
                  type="password"
                  name="oldpassword"
                  value={password.oldpassword}
                  onChange={handleChange}
                />
              </FormControl>
              <h4>New Password:</h4>
              <FormControl className="formInput" fullWidth>
                <TextField
                  id="newpassword"
                  type="password"
                  name="newpassword"
                  value={password.newpassword}
                  onChange={handleChange}
                />
              </FormControl>
              <h4>Confirm New Password:</h4>
              <FormControl className="formInput" fullWidth>
                <TextField
                  id="confirmnewpassword"
                  type="password"
                  name="confirmnewpassword"
                  value={password.confirmnewpassword}
                  onChange={handleChange}
                />
              </FormControl>

              <div></div>
              <FormControl className="formInput" fullWidth>
                <Button
                  style={{ marginBottom: "8px" }}
                  className="formButton"
                  variant="contained"
                  type="submit"
                  onClick={handlePasswordDataUpdate}
                >
                  Save Changes
                </Button>
                <Button
                  className="formButton"
                  color="error"
                  variant="outlined"
                  onClick={() => history.push("/")}
                >
                  Back to Dashboard
                </Button>
              </FormControl>
            </div>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PasswordEditor;
