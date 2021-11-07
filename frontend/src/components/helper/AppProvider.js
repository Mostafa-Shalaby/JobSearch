import React, { useState, useEffect } from "react";
import Properties from "../Properties";

export const AppContext = React.createContext();

export function LoadData() {
  // useState React hook
  const [data, setData] = useState({
    programming_languages: [
      {
        id: 1,
        language_name: "Python",
      },
    ],
    user: {
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
    }
  });

  const getlangData = () => {
    fetch(Properties.api_root + "languages/", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responsejson) => {
        setData((prevState) => ({
          ...prevState,
          programming_languages: responsejson,
        }));
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
        setData((prevState) => ({
          ...prevState,
          user: responsejson,
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getlangData();
    if (localStorage.getItem("authenticationToken") !== "") getuserData();
  }, []);

  return data;
}

export const AppProvider = (props) => (
  <AppContext.Provider value={{ ...LoadData() }}>
    {props.children}
  </AppContext.Provider>
);
