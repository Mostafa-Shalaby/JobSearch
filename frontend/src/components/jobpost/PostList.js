import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Container,
} from "@mui/material";
import { Link } from "react-router-dom";
import Properties from "../Properties";
import BookIcon from "@mui/icons-material/Book";

const PostList = ({ PageTitle = "All Job Posts" }) => {
  const [posts, setposts] = useState([]);
  const experience_levels = ["Junior", "Mid", "Senior"];

  useEffect(() => {
    fetch(Properties.api_root + "jobposts/", {
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
    
  }, []);

  return (
    <Container className="page-container">
      <Card className="page-card">
        <CardHeader
          avatar={<BookIcon />}
          title={<h2 style={{ margin: 0 }}>{PageTitle}</h2>}
        />
        <CardContent>
          {posts.length === 0 ? (
            <p className="empty-indicator-text">
              There are no active job posts.
            </p>
          ) : (
            <></>
          )}
          {posts.map((post) => (
            <div key={post.id} className="item-container">
              <div className="head">
                <Link className="user-link" to={"/posts/" + post.id}>
                  <h4>{post.title}</h4>
                </Link>
              </div>
              <div className>
                Requires: <span class="bold">{experience_levels[post.experience_level]} Developer</span> at <span class="bold">{post.city}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </Container>
  );
};

export default PostList;
