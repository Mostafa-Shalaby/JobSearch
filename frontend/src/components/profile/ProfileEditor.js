import {
  Autocomplete,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Container,
  FormControl,
  Select,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AppContext } from "../helper/AppProvider";
import Properties from "../Properties";

const ProfileEditor = ({ handleSnackBar }) => {
  const history = useHistory();
  const globalData = React.useContext(AppContext);
  const [user, setuser] = useState({
    id: 1,
    programming_languages: [],
    name: "",
    email: "",
    user_type: 0,
    national_id: "",
    city: "",
    experience_level: 0,
    bio_description: "",
    profile_view: 0,
  });

  const handleChange = (e) => {
    setuser((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUserDataUpdate = (e) => {
    e.preventDefault();
    let userData = { ...user };
    userData.programming_languages = userData.programming_languages.map(
      (lang) => lang.id
    );
    fetch(Properties.api_root + "auth/register/", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization" : "token " + localStorage.getItem("authenticationToken")
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if ((response.status === 202)) {
          handleSnackBar("User Data Updated!");
        }
        else{
          handleSnackBar("An Error has Occured, User Data Update Failed!");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getuserData = () => {
    fetch(Properties.api_root + "auth/login/", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization" : "token " + localStorage.getItem("authenticationToken")
      },
    })
      .then((response) => response.json())
      .then((responsejson) => {
        setuser(responsejson);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getuserData();
  }, []);

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
              <h4>Name:</h4>
              <FormControl className="formInput" fullWidth>
                <TextField
                  id="name"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                />
              </FormControl>
              <h4>Current Position:</h4>
              <Select
                labelId="user_type-label"
                id="user_type"
                name="user_type"
                value={user.user_type}
                onChange={handleChange}
              >
                <MenuItem value={0}>Employee</MenuItem>
                <MenuItem value={1}>Employer</MenuItem>
              </Select>
              <h4>Email:</h4>
              <FormControl className="formInput" fullWidth>
                <TextField
                  id="email"
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                />
              </FormControl>
              <h4>National ID:</h4>
              <FormControl className="formInput" fullWidth>
                <TextField
                  id="national_id"
                  type="number"
                  name="national_id"
                  value={user.national_id}
                  onChange={handleChange}
                />
              </FormControl>
              <h4>Programming Languages:</h4>
              <FormControl className="formInput" fullWidth>
                <Autocomplete
                  multiple
                  id="programming_languages-multi"
                  options={globalData.programming_languages}
                  name="programming_languages"
                  isOptionEqualToValue={(option, value) =>
                    option.language_name === value.language_name
                  }
                  getOptionLabel={(option) => option.language_name}
                  value={user.programming_languages}
                  onChange={(e, value) =>
                    setuser((prevState) => ({
                      ...prevState,
                      programming_languages: value,
                    }))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={handleChange}
                      id="programming_languages"
                    />
                  )}
                />
              </FormControl>
              <h4>City:</h4>
              <FormControl className="formInput" fullWidth>
                <TextField
                  id="city"
                  name="city"
                  value={user.city}
                  onChange={handleChange}
                />
              </FormControl>
              <h4>Experience Level:</h4>
              <FormControl className="formInput" fullWidth>
                <Select
                  labelId="experience_level-label"
                  id="experience_level"
                  name="experience_level"
                  value={user.experience_level}
                  onChange={handleChange}
                >
                  <MenuItem value={0}>Junior</MenuItem>
                  <MenuItem value={1}>Mid</MenuItem>
                  <MenuItem value={2}>Senior</MenuItem>
                </Select>
              </FormControl>
              <h4>Personal Biography:</h4>
              <FormControl className="formInput" fullWidth>
                <TextField
                  id="bio_description"
                  name="bio_description"
                  value={user.bio_description}
                  onChange={handleChange}
                  multiline
                  rows={8}
                />
              </FormControl>
              <div></div>
              <FormControl className="formInput" fullWidth>
                <Button
                  style={{ marginBottom: "8px" }}
                  className="formButton"
                  variant="contained"
                  type="submit"
                  onClick={handleUserDataUpdate}
                >
                  Save Changes
                </Button>
                <Button
                  style={{ marginBottom: "8px" }}
                  className="formButton"
                  variant="outlined"
                  onClick={getuserData}
                >
                  Revert Fields
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

export default ProfileEditor;
