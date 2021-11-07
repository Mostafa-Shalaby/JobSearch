import React from "react";
import { BrowserRouter , Route, Switch } from "react-router-dom";
import ProtectedRoute from "./components/helper/ProtectedRoute";
import MainWrapper from "./components/MainWrapper";
import Login from "./components/authentication/Login";
import Signup from "./components/authentication/Signup";

const Connector = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <ProtectedRoute path="/" component={MainWrapper}/>
      </Switch>
    </BrowserRouter>
  );
};

export default Connector;
