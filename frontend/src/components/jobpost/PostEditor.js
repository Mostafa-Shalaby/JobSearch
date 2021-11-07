import {
  Autocomplete,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Select,
  TextField,
  MenuItem,
  Button,
  IconButton,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AppContext } from "../helper/AppProvider";
import Properties from "../Properties";
import PostAddIcon from "@mui/icons-material/PostAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const PostEditor = ({ handleSnackBar, id = 0 }) => {
  const history = useHistory();
  const globalData = React.useContext(AppContext);
  const [post, setpost] = useState({
    id: 0,
    title: "",
    city: "",
    experience_level: 0,
    post_description: "",
    owner: 0,
    programming_languages: [],
  });
  const [uneditedPost, setuneditedPost] = useState([]);

  const [openDialog, setopenDialog] = useState(false);
  const handleOpenDialog = () => {
    setopenDialog(true);
  };
  const handleCloseDialog = () => {
    setopenDialog(false);
  };

  const handleChange = (e) => {
    setpost((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDataDeletion = (e) => {
    fetch(Properties.api_root + "jobposts/", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "token " + localStorage.getItem("authenticationToken"),
      },
      body: JSON.stringify({
        id: post.id,
      }),
    })
      .then((response) => {
        console.log(response);
        if (response.status === 204) {
          handleSnackBar("Post Deleted Successfully!");
          history.push("/");
        } else {
          handleSnackBar("An Error has Occured, Post Deletion Failed!");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setopenDialog(false);
  };

  const handleDataUpdate = (e) => {
    e.preventDefault();
    let postData = { ...post };
    postData.programming_languages = postData.programming_languages.map(
      (lang) => lang.id
    );
    postData.owner = globalData.user.id;

    let apiMethod = "PATCH";
    if (postData.id === 0) apiMethod = "POST";

    fetch(Properties.api_root + "jobposts/", {
      method: apiMethod,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "token " + localStorage.getItem("authenticationToken"),
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        console.log(response);
        if (response.status === 201 || response.status === 202) {
          handleSnackBar("Post Data Updated!");
          history.push("/");
        } else {
          handleSnackBar("An Error has Occured, Post Data Submission Failed!");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const revertpostData = () => {
    setpost(uneditedPost);
  };

  useEffect(() => {
    if (id !== 0) {
      fetch(Properties.api_root + "jobposts/?is_editor=true&id=" + id, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((responsejson) => {
          setpost(responsejson);
          setuneditedPost(responsejson);
        })
        .catch((error) => {
          console.log(error);
        });
      document.title = "Edit Post | JobSearch";
    } else {
      document.title = "Add new Post | JobSearch";
    }
  }, [id]);

  return (
    <Container fixed>
      <Card className="profile-card">
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "#125984" }} aria-label="Icon">
              {post.id === 0 ? <PostAddIcon /> : <EditIcon />}
            </Avatar>
          }
          title={
            <h2 style={{ margin: 0 }}>
              {post.id === 0 ? "Add My Post" : "Edit My Post"}
            </h2>
          }
          action={
            post.owner === globalData.user.id ? (
              <IconButton
                variant="outlined"
                color="error"
                onClick={handleOpenDialog}
              >
                <DeleteIcon />
              </IconButton>
            ) : (
              <></>
            )
          }
        />
        <CardContent>
          <form>
            <div className="profile-section">
              <h4>Title:</h4>
              <FormControl className="formInput" fullWidth>
                <TextField
                  id="title"
                  name="title"
                  value={post.title}
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
                  value={post.programming_languages}
                  onChange={(e, value) =>
                    setpost((prevState) => ({
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
                  value={post.city}
                  onChange={handleChange}
                />
              </FormControl>
              <h4>Experience Level:</h4>
              <FormControl className="formInput" fullWidth>
                <Select
                  labelId="experience_level-label"
                  id="experience_level"
                  name="experience_level"
                  value={post.experience_level}
                  onChange={handleChange}
                >
                  <MenuItem value={0}>Junior</MenuItem>
                  <MenuItem value={1}>Mid</MenuItem>
                  <MenuItem value={2}>Senior</MenuItem>
                </Select>
              </FormControl>
              <h4>Post Description:</h4>
              <FormControl className="formInput" fullWidth>
                <TextField
                  id="post_description"
                  name="post_description"
                  value={post.post_description}
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
                  onClick={handleDataUpdate}
                >
                  {post.id !== 0 ? "Save Changes" : "Create new post"}
                </Button>
                {post.id !== 0 ? (
                  <Button
                    style={{ marginBottom: "8px" }}
                    className="formButton"
                    variant="outlined"
                    onClick={revertpostData}
                  >
                    Revert Fields
                  </Button>
                ) : (
                  <></>
                )}
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
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          {"Are you sure you want to delete this post?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Keep in mind that this action is irreveralable.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Disagree</Button>
          <Button onClick={handleDataDeletion}>Agree</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PostEditor;
