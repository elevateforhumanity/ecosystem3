import React from "react";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      {/* Add your navigation/header here if needed */}
      <Outlet />
      {/* Add your footer here if needed */}
    </div>
  );
}