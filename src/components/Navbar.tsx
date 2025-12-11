import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, IconButton, Avatar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Get actual name from localStorage
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const avatarLetter = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 no-underline ${
      isActive ? "bg-indigo-800 text-white shadow-sm" : "text-indigo-100 hover:bg-indigo-500 hover:text-white"
    }`;

  return (
    <AppBar position="static" className="bg-indigo-600 shadow-lg">
      <Toolbar className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <IconButton edge="start" color="inherit" aria-label="menu" className="md:hidden text-white">
            <MenuIcon />
          </IconButton>

          <NavLink to="/" className="text-xl font-bold text-white no-underline tracking-wide">
            Convertor Imagini
          </NavLink>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/plans" className={getLinkClass}>
            Planuri
          </NavLink>
          <NavLink to="/convert" className={getLinkClass}>
            Convert
          </NavLink>
        </div>

        <div className="flex items-center gap-3">
          <NavLink to="/profile" className="no-underline group flex items-center gap-2">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-white group-hover:text-indigo-100 transition">
                {user?.name || "Contul Meu"}
              </p>
            </div>

            <Avatar
              sx={{ width: 32, height: 32 }}
              className="bg-indigo-800 text-sm border-2 border-transparent group-hover:border-indigo-300 transition"
            >
              {avatarLetter}
            </Avatar>
          </NavLink>

          <div className="h-6 w-px bg-indigo-400 mx-1 hidden md:block"></div>

          <Button
            onClick={handleLogout}
            color="inherit"
            startIcon={<LogoutIcon />}
            className="text-white hover:bg-indigo-700 normal-case rounded-lg"
          >
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
