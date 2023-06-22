import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home";
import About from "./components/pages/About";
import Viajes from "./components/pages/Viajes";
import Login from "./components/pages/Login";
import TravelPreviewer from "./components/pages/TravelPreviewer";
import Register from "./components/pages/RegistrarUsuario";
import ChangePass from "./components/pages/ChangePass";
import Policy from "./components/pages/Policy";
import Vehicle from "./components/pages/RegistrarVehiculo";
import FaqsPage from "./components/pages/FaqsPage";
import Carpool from "./components/pages/Carpool";
import NotFound from "./components/pages/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthenticatedRoute from "./AuthenticatedRoute";
import { getToken } from "./components/service/AuthService";
import { Statistics } from "./components/pages/Statistics";
import { ChangeData } from "./components/pages/ChangeData";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <ProtectedRoute
            path="/changePass"
            component={ChangePass}
            expectedResponse="NEW_PASSWORD_REQUIRED"
            redirect="/login"
          />
          <Route path="/" exact component={Home} />
          <Route path="/about" component={About} />
          <Route path="/statistics" component={Statistics} />
          <Route path="/changeData" component={ChangeData} />
          <Route path="/viajes" component={Viajes} />
          <AuthenticatedRoute
            authed={getToken() == null}
            path="/login"
            component={Login}
          />
          <Route path="/policy" component={Policy} />
          <AuthenticatedRoute
            authed={getToken() !== null}
            path="/vehicle"
            component={Vehicle}
          />
          <Route path="/faqsPage" component={FaqsPage} />
          <Route path="/carpool" component={Carpool} />
          <Route path="/register" component={Register} />
          <AuthenticatedRoute
            authed={getToken() !== null}
            path="/map"
            component={TravelPreviewer}
          />
          <Route path="*" component={NotFound} />
        </Switch>
        <ToastContainer position="top-center" />
      </Router>
    </>
  );
}
export default App;
