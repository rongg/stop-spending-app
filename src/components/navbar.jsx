import React from "react";

const NavBar = () => {
  return (
    <ul>
      <li>
        <a href="/">Home</a>
      </li>
      <li>
        <a href="/login">Login</a>
      </li>
      <li>
        <a href="/habits">Habits</a>
      </li>
      <li>
        <a href="/expenses">Expenses</a>
      </li>
    </ul>
  );
};

export default NavBar;
