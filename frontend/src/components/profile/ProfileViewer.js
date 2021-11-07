import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  FormControl,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Properties from "../Properties";

const ProfileViewer = ({ match }) => {
  const history = useHistory();
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
  const experience_levels = ["Junior", "Mid", "Senior"];
  const user_types = ["Employee", "Employer"];

  useEffect(() => {
    fetch(Properties.api_root + "users/?id=" + match.params.id , {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responsejson) => {
        setuser(responsejson);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [match.params.id]);

  document.title = "User Profile | JobSearch";

  return (
    <Container fixed>
      <Card className="profile-card">
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "#125984" }} aria-label="recipe">
              {user.name.charAt(0)}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <EditIcon />
            </IconButton>
          }
          title={<h2 style={{ margin: 0 }}>{user.name}</h2>}
          subheader={"Page Views: " + user.profile_view}
        />
        <CardContent>
          <div className="profile-section">
            <h4>Current Position:</h4>
            <p>{user_types[user.user_type]}</p>
            <h4>Email:</h4>
            <p>{user.email}</p>
            {user.national_id !== "" ? (
              <>
                <h4>National ID:</h4>
                <p>{user.national_id}</p>{" "}
              </>
            ) : (
              <></>
            )}
            {user.programming_languages.length !== 0 ? (
              <>
                <h4>Programming Languages:</h4>
                <p>
                  {user.programming_languages.map((lang, i) =>
                    i === 0 ? lang.language_name : ", " + lang.language_name
                  )}
                </p>
              </>
            ) : (
              <></>
            )}
            {user.city !== "" ? (
              <>
                <h4>City:</h4>
                <p>{user.city}</p>
              </>
            ) : (
              <></>
            )}
            <h4>Experience Level:</h4>
            <p>{experience_levels[user.experience_level]}</p>
            {user.bio_description !== "" ? (
              <>
                <h4>Personal Biography:</h4>
                <p style={{whiteSpace : "pre-line"}} >{user.bio_description}</p>
              </>
            ) : (
              <></>
            )}
          </div>
        </CardContent>
      </Card>
      <FormControl fullWidth>
        <Button
          className="formButton"
          variant="outlined"
          onClick={() => history.goBack()}
        >
          Back to Last Page
        </Button>
      </FormControl>
    </Container>
  );
};

export default ProfileViewer;
