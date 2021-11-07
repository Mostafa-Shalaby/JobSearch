import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Menu, MenuItem } from "@mui/material";
import WhiteLogo from "../../assets/img/Logo-White.png";
import { useHistory } from "react-router-dom";
import Properties from "../Properties";

const NavBar = () => {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = (e) => {
    e.preventDefault();
    fetch(Properties.api_root + "auth/login/", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization" : "token " + localStorage.getItem("authenticationToken")
      },
    })
      .catch((error) => {
        console.log(error);
      });
    localStorage.setItem("isAuthenticated", "false");
    localStorage.setItem("authenticationEmail", "");
    window.location.pathname = "/";
  }

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={()=> history.push("/editpassword")}>Change Password</MenuItem>
      <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box margin="0" component="div" sx={{ flexGrow: 1 }}>
            <Button onClick={() => history.push("/")}>
              <img height="30" src={WhiteLogo} alt="Website Logo" />
            </Button>
          </Box>
          <Button onClick={() => history.push("/")} color="inherit">Dashboard</Button>
          <Button onClick={() => history.push("/posts")} color="inherit">Jobs</Button>
          <Button onClick={() => history.push("/users")} color="inherit">Employees</Button>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
};

export default NavBar;
