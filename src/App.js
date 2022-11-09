import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import Home from './components/pages/Home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Services from './components/pages/Services';
import Products from './components/pages/Products';
import Register from './components/pages/Register';
import Login from './components/pages/Login';
import LoggedIn from './components/pages/LoggedIn';
import ChangePass from './components/pages/ChangePass';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/services' component={Services} />
          <Route path='/products' component={Products} />
          <Route path='/register' component={Register} />
          <Route path='/login' component={Login} />
          <Route path='/loggedIn' component={LoggedIn} />
          <Route path='/changePass' component={ChangePass} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
