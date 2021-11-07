import React, { useState, useEffect, useContext } from "react";
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
import SendIcon from "@mui/icons-material/Send";
import CheckIcon from '@mui/icons-material/Check';
import { useHistory } from "react-router-dom";
import { AppContext } from "../helper/AppProvider";
import Properties from "../Properties";

const PostViewer = ({ match }) => {
  const history = useHistory();
  const globalData = useContext(AppContext);
  const [post, setpost] = useState({
    id: 0,
    title: "",
    city: "",
    experience_level: 0,
    post_description: "",
    owner: 0,
    programming_languages: [],
    jobapplicants: [],
  });
  const experience_levels = ["Junior", "Mid", "Senior"];

  const handleApplyToPost = (e, is_applying = true) =>{
    e.preventDefault();
    let method = "DELETE";
    if (is_applying) method = "POST";
    fetch(Properties.api_root + "applicants/", {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization" : "token " + localStorage.getItem("authenticationToken")
      },
      body: JSON.stringify({
        id: post.id,
        applicant_id: globalData.user.id
      }),
    })
      .then((response) => response.json())
      .then((responsejson) => {
        setpost(responsejson);
      })
      .catch((error) => {
        console.log(error);
      });
  }


  useEffect(() => {
    fetch(Properties.api_root + "jobposts/?id=" + match.params.id , {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responsejson) => {
        setpost(responsejson);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [match.params.id]);

  document.title = "View Post | JobSearch";

  return (
    <Container fixed>
      <Card className="profile-card">
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "#125984" }} aria-label="recipe">
              {post.title.charAt(0)}
            </Avatar>
          }
          action={
            post.owner === globalData.user.id ? (
              <IconButton
                onClick={() => history.push("/posts/edit/" + post.id)}
              >
                <EditIcon />
              </IconButton>
            ) : (
              <></>
            )
          }
          title={<h2 style={{ margin: 0 }}>{post.title}</h2>}
          subheader={
            <>
              Post View: {post.page_view}, Number of Applicants:{" "}
              {post.jobapplicants.length}
            </>
          }
        />
        <CardContent>
          <div className="profile-section">
            {post.programming_languages.length !== 0 ? (
              <>
                <h4>Programming Languages:</h4>
                <p>
                  {post.programming_languages.map((lang, i) =>
                    i === 0 ? lang.language_name : ", " + lang.language_name
                  )}
                </p>
              </>
            ) : (
              <></>
            )}
            {post.city !== "" ? (
              <>
                <h4>City:</h4>
                <p>{post.city}</p>
              </>
            ) : (
              <></>
            )}
            <h4>Experience Level:</h4>
            <p>{experience_levels[post.experience_level]}</p>
            {post.post_description !== "" ? (
              <>
                <h4>Personal Biography:</h4>
                <p style={{whiteSpace : "pre-line"}}>{post.post_description}</p>
              </>
            ) : (
              <></>
            )}
          </div>
        </CardContent>
      </Card>
      {globalData.user.user_type === 0 ? (
        <Card className="profile-card">
          <CardHeader
            subheader="Interested in this Job Post, you can apply with a single click!"
            action={
               !(post.jobapplicants.includes(globalData.user.id)) ? (
                <Button
                  variant="outlined"
                  onClick={handleApplyToPost}
                  startIcon={<SendIcon />}
                >
                  Apply Now
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  onClick={(e) => handleApplyToPost(e, false)}
                  startIcon={<CheckIcon />}
                >
                  Applied
                </Button>
              )
            }
          />
        </Card>
      ) : (
        <></>
      )}
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

export default PostViewer;
