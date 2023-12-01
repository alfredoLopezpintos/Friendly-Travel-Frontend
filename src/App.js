import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, useLocation } from "react-router-dom";
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
import { getExpire, resetUserSession } from "./components/service/AuthService";
import moment from 'moment'
import LeaveWarning from "./LeaveWarning";
import HistorialViajes from "./components/pages/HistorialViajes";
import MisViajes from "./components/pages/MisViajes";
import RegistrarVehiculo from "./components/pages/RegistrarVehiculo";
import ReviewTravel from "./ReviewTravel";

function App() {

  const refreshToken = () => {
    if(getExpire() !== null) {
      if(moment().isSameOrAfter(moment(getExpire()))) {
        resetUserSession();
        window.location.reload(false);
      }

      setTimeout(() => {
        refreshToken();
        // toast.info("Se cerró la sesión automáticamente debido a que transcurrió el tiempo máximo por sesión")
      }, (3600 * 1000))
    }
  };

  useEffect(() => {
    refreshToken()
  }, []);

  return (
    <>

      <Router>
        <Navbar />
        <Switch>
          <AuthenticatedRoute
              authed={(getToken() !== null)}
              path="/misViajes" 
              component={MisViajes}
            />
          <AuthenticatedRoute
              authed={(getToken() !== null)}
              path="/travelHistory" 
              component={HistorialViajes}
            />
          <AuthenticatedRoute
              authed={(getToken() !== null)}
              path="/registerVehicle" 
              component={RegistrarVehiculo}
            />
          <AuthenticatedRoute
              authed={(getToken() !== null)}
              path="/reviewTravel" 
              component={ReviewTravel}
            />
          <AuthenticatedRoute
              authed={(getToken() !== null)}
              path="/redirecting" 
              component={LeaveWarning}
            />
          <Route
            path="/changePass"
            component={ChangePass}
          />
          {/* <AuthenticatedRoute
            authed={(getToken() !== null) || ()}
            path="/changePass" 
            component={ChangePass}
          /> */}
          <Route path="/" exact component={Home} />
          <Route path="/about" component={About} />
          <Route path="/statistics" component={Statistics} />
          <AuthenticatedRoute
            authed={getToken() !== null}
            path="/changeData" 
            component={ChangeData}
          />
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
