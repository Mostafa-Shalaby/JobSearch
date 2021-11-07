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

const ProfileList = ({ PageTitle = "All Employees Profiles" }) => {
  const [users, setusers] = useState([]);
  const experience_levels = ["Junior", "Mid", "Senior"];

  useEffect(() => {
    fetch(Properties.api_root + "users/?type=0", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responsejson) => {
        setusers(responsejson);
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
          {users.length === 0 ? (
            <p className="empty-indicator-text">
              There are no active employees on the platform :/.
            </p>
          ) : (
            <></>
          )}
          {users.map((user) => (
            <div key={user.id} className="item-container">
              <div className="head">
                <Link className="user-link" to={"/users/" + user.id}>
                  <h4>{user.name}</h4>
                </Link>
              </div>
              <div className>
                <span class="bold">{experience_levels[user.experience_level]} Developer</span> {user.city === "" ? <></> : <>living at <span class="bold">{user.city}</span></>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProfileList;
