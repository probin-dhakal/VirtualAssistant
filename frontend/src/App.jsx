import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import CustomizePage from "./pages/CustomizePage";
import { userDataContext } from "./context/UserContext";
import Home from "./pages/Home";
import CustomizeName from "./pages/CustomizeName";

const App = () => {
  const { userData } = useContext(userDataContext);

  return (
    <Routes>
      <Route
        path="/"
        element={
          userData && userData.assistantImage && userData.assistantName
            ? <Home />
            : <Navigate to="/customize" />
        }
      />
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/" />}
      />
      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to="/" />}
      />
      <Route
        path="/customize"
        element={userData ? <CustomizePage /> : <Navigate to="/signin" />}
      />
      <Route
        path="/customizeName"
        element={userData ? <CustomizeName /> : <Navigate to="/signin" />}
      />
    </Routes>
  );
};

export default App;
