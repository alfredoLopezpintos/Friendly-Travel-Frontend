import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/pages/Home';
import Services from './components/pages/Services';
import Products from './components/pages/Products';
import SignUp from './components/pages/SignUp';
import RegistrarViaje from './components/pages/RegistrarViaje';
import RegistrarUsuario from './components/pages/RegistrarUsuario';
import Succesful from './components/pages/Succesful';
import Login from './components/pages/Login';
import TravelPreviewer from './components/pages/TravelPreviewer'; 

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/services' component={Services} />
          <Route path='/products' component={Products} />
          <Route path='/sign-up' component={SignUp} />
          <Route path='/addTrip' component={RegistrarViaje} />
          <Route path='/success' component={Succesful} />
          <Route path='/regUser' component={RegistrarUsuario} />
          <Route path='/login' component={Login} />
          <Route path='/map' component={TravelPreviewer} />

        </Switch>
      </Router>
    </>
  );
}
export default App;
