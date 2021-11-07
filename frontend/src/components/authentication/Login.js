import React, { useState } from "react";
import WhiteLogo from "../../assets/img/Logo-White.png";
import { Grid, FormControl, TextField, Button, Snackbar } from "@mui/material";
import { useHistory } from "react-router-dom";
import Properties from "../Properties";

const Login = () => {
  const history = useHistory();
  const [fieldemail, setemail] = useState("");
  const [fieldpassword, setpassword] = useState("");

  // SnackBar Controls
  const [open, setopen] = React.useState(false);
  const [message, setmessage] = useState("");
  const handleClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setopen(false);
  };

  document.title = "Login | JobSearch";

  const handleLogin = (e) => {
    e.preventDefault();

    fetch(Properties.api_root + "auth/login/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: fieldemail,
        password: fieldpassword,
      }),
    })
      .then((response) => {
        if (response.status === 202) {
          response.json().then((responsejson) => {
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("authenticationToken", responsejson.key);
            window.location.pathname = "/";
          });
        } else if (response.status === 400) {
          setmessage("Invalid Credentials!");
          setopen(true);
        }
      })
      .catch((error) => {
        console.log(error);
        setmessage("API server unreachable!");
        setopen(true);
      });
  };

  require("../../assets/scss/login.scss");
  return (
    <Grid container className="login-container">
      <Grid item={true} md={6} xs={12} className="logo-container">
        <img src={WhiteLogo} alt="Website Logo" />
        <p>When Linkedin isn't Enough!</p>
      </Grid>
      <Grid item={true} md={6} xs={12} className="form-container">
        <form>
          <p>Please Login to Get Started!</p>
          <FormControl className="formInput" fullWidth>
            <TextField
              id="email"
              label="Email"
              type="email"
              value={fieldemail}
              onChange={(e) => setemail(e.target.value)}
            />
          </FormControl>
          <FormControl className="formInput" fullWidth>
            <TextField
              id="password"
              label="Password"
              type="password"
              value={fieldpassword}
              onChange={(e) => setpassword(e.target.value)}
            />
          </FormControl>
          <FormControl className="formInput" fullWidth>
            <Button
              className="formButton"
              variant="contained"
              type="submit"
              onClick={handleLogin}
            >
              Login In
            </Button>
            <Button
              className="formButton"
              variant="outlined"
              onClick={() => history.push("/signup")}
            >
              Create an Account
            </Button>
          </FormControl>
        </form>
        <Snackbar
          open={open}
          autoHideDuration={2000}
          onClose={handleClose}
          message={message}
        />
      </Grid>
    </Grid>
  );
};

export default Login;
