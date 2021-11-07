import React, { useState } from "react";
import NavBar from "./custom/NavBar";
import ProfileEditor from "./profile/ProfileEditor";
import { Route } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import { Snackbar } from "@mui/material";
import ProfileViewer from "./profile/ProfileViewer";
import PostEditor from "./jobpost/PostEditor";
import PostViewer from "./jobpost/PostViewer";
import PostManager from "./jobpost/PostManager";
import PostList from "./jobpost/PostList";
import PasswordEditor from "./profile/PasswordEditor";
import ProfileList from "./profile/ProfileList";

const MainWrapper = () => {
  const [snackbarOpen, setsnackbarOpen] = React.useState(false);
  const [snakbarmessage, setsnackbarmessage] = useState("");
  const handleSnackBar = (msg) => {
    setsnackbarmessage(msg);
    setsnackbarOpen(true);
  };
  const handleClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setsnackbarOpen(false);
  };

  require("../assets/scss/main.scss");
  return (
    <div className="mainroot">
      <div className="mainbody">
        <NavBar />
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/users" component={ProfileList} />
        <Route exact path="/users/:id" component={ProfileViewer} />
        <Route exact path="/editprofile">
          <ProfileEditor handleSnackBar={handleSnackBar} />
        </Route>
        <Route exact path="/editpassword">
          <PasswordEditor handleSnackBar={handleSnackBar} />
        </Route>
        <Route exact path="/posts" component={PostList} />
        <Route exact path="/posts/:id" component={PostViewer} />
        <Route
          exact path="/posts/edit/:id"
          render={(props) => (
            <PostEditor
              handleSnackBar={handleSnackBar}
              id={props.match.params.id}
            />
          )}
        />
        <Route
          exact path="/posts/applicants/:id"
          render={(props) => (
            <PostManager
              handleSnackBar={handleSnackBar}
              id={props.match.params.id}
            />
          )}
        />
        <Route exact path="/addpost">
          <PostEditor handleSnackBar={handleSnackBar} />
        </Route>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleClose}
        message={snakbarmessage}
      />
    </div>
  );
};

export default MainWrapper;
