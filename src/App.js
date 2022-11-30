import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/pages/Home';
import Services from './components/pages/Services';
import Viajes from './components/pages/Viajes';
import Succesful from './components/pages/Succesful';
import Login from './components/pages/Login';
import TravelPreviewer from './components/pages/TravelPreviewer';
import LoggedIn from './components/pages/LoggedIn';
import Register from './components/pages/Register';
import ChangePass from './components/pages/ChangePass';
import FaqsPage from './components/pages/FaqsPage';
import Carpool from './components/pages/Carpool';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/services' component={Services} />
          <Route path='/viajes' component={Viajes} />
          <Route path='/success' component={Succesful} />
          <Route path='/login' component={Login} />
          <Route path='/loggedIn' component={LoggedIn} />
          <Route path='/register' component={Register} />
          <Route path='/changePass' component={ChangePass} />
          <Route path='/map' component={TravelPreviewer} />
          <Route path='/faqsPage' component={FaqsPage} />
          <Route path='/carpool' component={Carpool} />
        </Switch>
        <ToastContainer position="top-center"/>
      </Router>
    </>
  );
}
export default App;
