// src/SideDrawer.js
import React from "react";
import "./SideDrawer.css";

const SideDrawer = ({ show, closeDrawer }) => {
  let drawerClasses = "side-drawer";
  if (show) {
    drawerClasses = "side-drawer open";
  }

  return (
    <div className={drawerClasses}>
      <button className="close-btn" onClick={closeDrawer}>
        ×
      </button>
      <div className="drawer-content">
        <h2>Side Drawer</h2>
        <p>This is a side drawer with a slide-in effect.</p>
      </div>
    </div>
  );
};

export default SideDrawer;
