import React from "react";
import "./App.css";
import { Route, Redirect } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function PrivateRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/', state: {from: props.location}}} />}
    />
  )
}