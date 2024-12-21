"use client";
import React, { useState } from "react";
import Nav from "./Nav";

function ResponsiveNav() {
  const [showNav, setShowNav] = useState(false);

  return (
    <div>
      <Nav />
    </div>
  );
}
export default ResponsiveNav;
