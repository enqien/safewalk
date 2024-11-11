import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ component: Component, ...rest }) {
  //   const isAuthenticated = /* logic to check authentication status */;

  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
}
export default PrivateRoute;
