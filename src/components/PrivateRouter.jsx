import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";
import CircleLoader from "react-spinners/CircleLoader";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const PrivateRouter = () => {
  const { loggedIn, checkStatus } = useAuthStatus();
  if (checkStatus) {
    return (
      <>
        <CircleLoader
          cssOverride={override}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <p>Loading</p>
      </>
    );
  }

  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRouter;
