import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Container,
  IconButton,
  Tooltip,
  Avatar,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import GroupIcon from "@mui/icons-material/Group";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SendIcon from "@mui/icons-material/Send";
import { Link } from "react-router-dom";
import Properties from "../Properties";

const PostManager = ({ handleSnackBar, id }) => {
  const [jobApplicants, setjobApplicants] = useState([]);
  const [users, setusers] = useState([]);
  const application_status = ["Pending", "Accepted", "Rejected"];
  const experience_levels = ["Junior", "Mid", "Senior"];

  const handleEmployeeSearch = () => {
    fetch(Properties.api_root + "search/?post_id=" + id, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "token " + localStorage.getItem("authenticationToken"),
      },
    })
      .then((response) => response.json())
      .then((responsejson) => setusers(responsejson))
      .catch((error) => {
        console.log(error);
      });
  };

  const handleStatusChange = (index, status) => {
    let applicantEntry = jobApplicants[index];
    applicantEntry.status = status;
    fetch(Properties.api_root + "applicants/", {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "token " + localStorage.getItem("authenticationToken"),
      },
      body: JSON.stringify(applicantEntry),
    })
      .then((response) => {
        if (response.status === 202) {
          const newJobApplicants = [
            ...jobApplicants.slice(0, index),
            applicantEntry,
            ...jobApplicants.slice(index + 1),
          ];
          setjobApplicants(newJobApplicants);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetch(Properties.api_root + "applicants/?post_id=" + id, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "token " + localStorage.getItem("authenticationToken"),
      },
    })
      .then((response) => response.json())
      .then((responsejson) => setjobApplicants(responsejson))
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  document.title = "Post Applicant Manager | JobSearch";

  return (
    <Container className="page-container">
      <Card className="page-card">
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "#125984" }} aria-label="Icon">
              <GroupIcon />
            </Avatar>
          }
          title={<h2 style={{ margin: 0 }}>Job Post's Applicants</h2>}
        />
        <CardContent>
          {jobApplicants.length === 0 ? (
            <p className="empty-indicator-text">
              There are no applicants for this post.
            </p>
          ) : (
            <></>
          )}
          {jobApplicants.map((jobApplicant, index) => (
            <div key={jobApplicant.id} className="item-container">
              <div className="head">
                <Link
                  className="user-link"
                  to={"/users/" + jobApplicant.applicant.id}
                >
                  <h4>{jobApplicant.applicant.name}</h4>
                </Link>
                <p>
                  Applicant Status: {application_status[jobApplicant.status]}
                </p>
              </div>
              <div className="buttons">
                <Tooltip title="Set as Accepted">
                  <IconButton
                    color="success"
                    onClick={() => handleStatusChange(index, 1)}
                  >
                    <CheckIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Set as Rejected">
                  <IconButton
                    color="error"
                    onClick={() => handleStatusChange(index, 2)}
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Set as Pending">
                  <IconButton onClick={() => handleStatusChange(index, 0)}>
                    <MoreHorizIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      {users.length !== 0 ? (
        <Card className="page-card">
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: "#7bad56" }} aria-label="Icon">
                <GroupIcon />
              </Avatar>
            }
            title={<h2 style={{ margin: 0 }}>Possible Employee Candidates</h2>}
          />
          <CardContent>
            {users.map((user) => (
              <div key={user.id} className="item-container">
                <div className="head">
                  <Link className="user-link" to={"/users/" + user.id}>
                    <h4>{user.name}</h4>
                  </Link>
                </div>
                <div className>
                  <span class="bold">
                    {experience_levels[user.experience_level]} Developer
                  </span>{" "}
                  {user.city === "" ? (
                    <></>
                  ) : (
                    <>
                      living at <span class="bold">{user.city}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card className="page-card">
          <CardHeader
            subheader="Want to explore employees that with similar expertiese to your post, you can do so with a single click!"
            action={
              <Button
                variant="outlined"
                onClick={handleEmployeeSearch}
                startIcon={<SendIcon />}
              >
                Search
              </Button>
            }
          />
        </Card>
      )}
    </Container>
  );
};

export default PostManager;
