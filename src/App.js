import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home";
import Services from "./components/pages/Services";
import Viajes from "./components/pages/Viajes";
import Succesful from "./components/pages/Succesful";
import Login from "./components/pages/Login";
import TravelPreviewer from "./components/pages/TravelPreviewer";
import Register from "./components/pages/RegistrarUsuario";
import ChangePass from "./components/pages/ChangePass";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/services" component={Services} />
          <Route path="/viajes" component={Viajes} />
          <Route path="/success" component={Succesful} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/changePass" component={ChangePass} />
          <Route path="/map" component={TravelPreviewer} />
        </Switch>
      </Router>
    </>
  );
}
export default App;
