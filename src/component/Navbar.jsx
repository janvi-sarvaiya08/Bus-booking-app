import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

export default function Navbar() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    } else {
      document.documentElement.classList.add("light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
  };

  const isActiveDesktop ="bg-white text-green rounded-md px-3 py-2 font-bold";
  const isActiveMobile = "bg-white text-green rounded-full py-2.5 px-1.5";

  return (
    <>
      <nav className="sticky top-0 z-30 flex justify-between items-center w-full md:px-20 gap-20 p-4 bg-green text-white shadow-md">
        <h3 className="text-lg lg:text-2xl font-medium">
          Book MyBus
        </h3> 

        {/* for desktop */} 
        <ul className="hidden md:flex items-center gap-10">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? isActiveDesktop : "")}
            >
              Bus
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/mybookings"
              className={({ isActive }) => (isActive ? isActiveDesktop : "")}
            >
              My Booking
            </NavLink>
          </li>
          <li className="hover:scale-110">
            <button
              value={theme}
              onClick={toggleTheme}
              className="cursor-pointer"
            >
              {theme === "light" ? (
                <LightModeOutlinedIcon sx={{ fontSize: "30px" }} />
              ) : (
                <DarkModeOutlinedIcon sx={{ fontSize: "30px" }} />
              )}
            </button>
          </li>
        </ul>

        {/* for mobile */}
        <ul className="md:hidden flex gap-3">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? isActiveMobile : "")}
            >
              <DirectionsBusIcon sx={{ fontSize: "30px" }} />
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/mybookings"
              className={({ isActive }) => (isActive ? isActiveMobile : "")}
            >
              <AccountCircleIcon sx={{ fontSize: "30px" }} />
            </NavLink>
          </li>
          <li className="hover:scale-110">
            <button
              value={theme}
              onClick={toggleTheme}
              className="cursor-pointer"
            >
              {theme === "light" ? (
                <LightModeOutlinedIcon sx={{ fontSize: "30px" }} />
              ) : (
                <DarkModeOutlinedIcon sx={{ fontSize: "30px" }} />
              )}
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
