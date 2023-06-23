import React from "react";
import { Redirect, Route } from "react-router-dom";

const ProtectedRoute = ({
  component: Component,
  expectedResponse,
  redirect,
  ...rest
}) => {
  const endpointResponse = rest.location?.state?.endpointResponse?.message;

  return (
    <Route
      {...rest}
      render={(props) =>
        endpointResponse === expectedResponse ? (
          <Component {...props} />
        ) : (
          <Redirect to={redirect} />
        )
      }
    />
  );
};

export default ProtectedRoute;
