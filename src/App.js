import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Navbar from './components/Navbar';
import Carpool from './components/pages/Carpool';
import ChangePass from './components/pages/ChangePass';
import FaqsPage from './components/pages/FaqsPage';
import Home from './components/pages/Home';
import LoggedIn from './components/pages/LoggedIn';
import Login from './components/pages/Login';
import NotFound from './components/pages/NotFound';
import Register from './components/pages/Register';
import Services from './components/pages/Services';
import TravelPreviewer from './components/pages/TravelPreviewer';
import Viajes from './components/pages/Viajes';

function App() {

  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/services' component={Services} />
          <Route path='/viajes' component={Viajes} />
          <Route path='/login' component={Login} />
          <Route path='/loggedIn' component={LoggedIn} />
          <Route path='/register' component={Register} />
          <Route path='/changePass' component={ChangePass} />
          <Route path='/map' component={TravelPreviewer} />
          <Route path='/faqsPage' component={FaqsPage} />
          <Route path='/carpool' component={Carpool} />
          <Route path='*' component={NotFound}/>
        </Switch>
        <ToastContainer position="top-center"/>
      </Router>
    </>
  );
}
export default App;
