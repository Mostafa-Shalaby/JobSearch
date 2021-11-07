import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  FormControl,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useHistory, Link } from "react-router-dom";
import { AppContext } from "../helper/AppProvider";
import Properties from "../Properties";
import BuildIcon from "@mui/icons-material/Build";
import PreviewIcon from "@mui/icons-material/Preview";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import BookIcon from "@mui/icons-material/Book";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import GroupIcon from "@mui/icons-material/Group";
import SendIcon from "@mui/icons-material/Send";

const Dashboard = () => {
  const history = useHistory();
  const globalData = React.useContext(AppContext);
  const [posts, setposts] = useState([]);
  const [myJobPosts, setmyJobPosts] = useState([]);
  const [jobApplications, setjobApplicants] = useState([]);
  const experience_levels = ["Junior", "Mid", "Senior"];
  const application_status = [
    "Pending, Your application is still in consideration",
    "Accepted, You will be contacted shortly by the employer.",
    "Rejected, Better luck on your next job offer.",
  ];

  const handleJobSearch = () => {
    fetch(Properties.api_root + "search/?user_id=" + globalData.user.id, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "token " + localStorage.getItem("authenticationToken"),
      },
    })
      .then((response) => response.json())
      .then((responsejson) => setmyJobPosts(responsejson))
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetch(Properties.api_root + "jobposts/?owner=" + globalData.user.id, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responsejson) => {
        setposts(responsejson);
      })
      .catch((error) => {
        console.log(error);
      });
    fetch(
      Properties.api_root + "applicants/?applicant_id=" + globalData.user.id,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "token " + localStorage.getItem("authenticationToken"),
        },
      }
    )
      .then((response) => response.json())
      .then((responsejson) => setjobApplicants(responsejson))
      .catch((error) => {
        console.log(error);
      });
  }, [globalData.user.id]);

  document.title = "Dashboard | JobSearch";

  return (
    <Container fixed className="page-container">
      <Grid container>
        <Grid item={true} md={4} xs={12}>
          <Card className="page-card">
            <CardHeader
              avatar={<BuildIcon />}
              title={<h2 style={{ margin: 0 }}>User Tools</h2>}
            />
            <CardContent>
              <FormControl className="formInput" fullWidth>
                <Button
                  style={{ marginBottom: "8px" }}
                  className="formButton"
                  variant="outlined"
                  startIcon={<PreviewIcon />}
                  onClick={() => history.push("/users/" + globalData.user.id)}
                >
                  View Public Profile
                </Button>
                <Button
                  style={{ marginBottom: "8px" }}
                  className="formButton"
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => history.push("/editprofile")}
                >
                  Edit Personal Details
                </Button>
                <Button
                  style={{ marginBottom: "8px" }}
                  className="formButton"
                  variant="outlined"
                  startIcon={<VpnKeyIcon />}
                  onClick={() => history.push("/editpassword")}
                >
                  Change Password
                </Button>
                {globalData.user.user_type === 1 ? (
                  <Button
                    style={{ marginBottom: "8px" }}
                    className="formButton"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => history.push("/addpost")}
                  >
                    Add a Job Post
                  </Button>
                ) : (
                  <></>
                )}
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
        <Grid item={true} md={8} xs={12}>
          {globalData.user.user_type === 1 ? (
            <Card className="dashboard-card">
              <CardHeader
                avatar={<BookIcon />}
                title={<h2 style={{ margin: 0 }}>My Job Posts</h2>}
              />
              <CardContent>
                {posts.map((post) => (
                  <div key={post.id} className="item-container">
                    <div className="post-head">
                      <h4 className="post-title">{post.title}</h4>
                      <p className="post-subtitle">
                        Post View: {post.page_view}, Number of Applicants:{" "}
                        {post.jobapplicants.length}
                      </p>
                    </div>
                    <div className="post-buttons">
                      <Tooltip title="View">
                        <IconButton
                          color="primary"
                          onClick={() => history.push("/posts/" + post.id)}
                        >
                          <PreviewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          color="warning"
                          onClick={() => history.push("/posts/edit/" + post.id)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Applicants">
                        <IconButton
                          onClick={() =>
                            history.push("/posts/applicants/" + post.id)
                          }
                        >
                          <GroupIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="page-card">
                <CardHeader
                  avatar={<GroupIcon />}
                  title={<h2 style={{ margin: 0 }}>My Job Applications</h2>}
                />
                <CardContent>
                  {jobApplications.length === 0 ? (
                    <p className="empty-indicator-text">
                      There are no active job applications.
                    </p>
                  ) : (
                    <></>
                  )}
                  {jobApplications.map((jobApplication) => (
                    <div key={jobApplication.id} className="item-container">
                      <div className="head">
                        <Link
                          className="user-link"
                          to={"/posts/" + jobApplication.jobpost.id}
                        >
                          <h4>{jobApplication.jobpost.title}</h4>
                        </Link>
                        <p>
                          Status: {application_status[jobApplication.status]}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              {myJobPosts.length !== 0 ? (
                <Card className="page-card">
                  <CardHeader
                    avatar={<BookIcon />}
                    title={<h2 style={{ margin: 0 }}>Job Posts For You</h2>}
                  />
                  <CardContent>
                    {myJobPosts.map((post) => (
                      <div key={post.id} className="item-container">
                        <div className="head">
                          <Link className="user-link" to={"/posts/" + post.id}>
                            <h4>{post.title}</h4>
                          </Link>
                        </div>
                        <div className>
                          Requires:{" "}
                          <span class="bold">
                            {experience_levels[post.experience_level]} Developer
                          </span>{" "}
                          at <span class="bold">{post.city}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <Card className="page-card">
                  <CardHeader
                    subheader="Want to browse compatible job post, you can do so with a single click!"
                    action={
                      <Button
                        variant="outlined"
                        onClick={handleJobSearch}
                        startIcon={<SendIcon />}
                      >
                        Search
                      </Button>
                    }
                  />
                </Card>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
