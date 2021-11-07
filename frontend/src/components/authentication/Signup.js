import React, { useState } from "react";
import WhiteLogo from "../../assets/img/Logo-White.png";
import {
  Grid,
  FormControl,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  Snackbar,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import Properties from "../Properties";

const Signup = () => {
  const history = useHistory();
  const [fieldname, setname] = useState("");
  const [fieldemail, setemail] = useState("");
  const [fieldpassword, setpassword] = useState("");
  const [fieldconfirmPassword, setconfirmPassword] = useState("");
  const [fielduserType, setuserType] = useState(0);

  // SnackBar Controls
  const [open, setopen] = React.useState(false);
  const [message, setmessage] = useState("");
  const handleClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setopen(false);
  };

  document.title = "Signup | JobSearch";

  const handleSignup = (e) => {
    e.preventDefault();

    if (fieldpassword !== fieldconfirmPassword) {
      setmessage("Password does not match Confirm Password.");
      setopen(true);
    }

    fetch(Properties.api_root + "auth/register/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: fieldname,
        email: fieldemail,
        password: fieldpassword,
        user_type: fielduserType,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          response.json().then((responsejson) => {
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("authenticationToken", responsejson.key);
            window.location.pathname = "/";
          });
        } else if (response.status === 409) {
          setmessage("This email address already has an account!");
          setopen(true);
        } else if (response.status === 400) {
          setmessage("There are Some Missing or Invalid Input Fields");
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
        <form action="" method="post">
          <p>Please Fill in the Following Fields to Signup!</p>
          <FormControl className="formInput" fullWidth>
            <TextField
              id="name"
              label="Full Name"
              type="name"
              value={fieldname}
              onChange={(e) => setname(e.target.value)}
            />
          </FormControl>
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
            <TextField
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={fieldconfirmPassword}
              onChange={(e) => setconfirmPassword(e.target.value)}
            />
          </FormControl>
          <FormControl className="formInput" fullWidth>
            <InputLabel id="UserType-label">I am currently an</InputLabel>
            <Select
              labelId="UserType-label"
              id="UserType"
              value={fielduserType}
              label="I am currently an"
              onChange={(e) => setuserType(e.target.value)}
            >
              <MenuItem value={0}>Empolyee</MenuItem>
              <MenuItem value={1}>Empolyer</MenuItem>
            </Select>
          </FormControl>
          <FormControl className="formInput" fullWidth>
            <Button
              className="formButton"
              variant="contained"
              type="submit"
              onClick={handleSignup}
            >
              Signup
            </Button>
            <Button
              className="formButton"
              variant="outlined"
              onClick={() => history.push("/login")}
            >
              Back to Login Page
            </Button>
          </FormControl>
        </form>
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        message={message}
      />
    </Grid>
  );
};

export default Signup;
