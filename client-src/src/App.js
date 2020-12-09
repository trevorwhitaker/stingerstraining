import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
} from 'react-router-dom';

import { Sidenav, Nav, Navbar } from 'rsuite';

import util from './util/utils';

import { navdata } from './data/navdata';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';

import './App.scss';

const App = () => {
  const [isLoggedin, setIsLoggedin] = useState(null);

  // Login check on mount
  useEffect(() => {
    const check = async () => {
      const isLoggedin = await util.checkLogin();
      setIsLoggedin(isLoggedin);
    };
    check();
  }, []);

  const Content = (props) => {
    return (
      <>
        <div>
          This is the content component place holder, matching route:{' '}
          {props.match.path}
        </div>
      </>
    );
  };

  // Logged out prompt
  const Logout = () => {
    localStorage.removeItem('token');
    return <div className='logged-out'>You are now logged out.</div>;
  };

  const mainContent = () => {
    if (isLoggedin === true) {
      return (
        <div className='main-section'>
          <div className='side-nav'>
            <Sidenav appearance='subtle'>
              {navdata.map((navitem, index) => {
                return (
                  <Nav.Item key={index} active={true} componentClass={Link} to={navitem.href}>
                    {navitem.label}
                  </Nav.Item>
                );
              })}
            </Sidenav>
          </div>
          {navdata.map((navitem, index) => {
            return <Route  exact path={navitem.href} component={Content} key={index}/>;
          })}
        </div>
      );
    } else if (isLoggedin === false) {
      return (<div className='no-login'>Please login or register first.</div>)
    } else {
      return null;
    }

  };

  return (
    <div className='App'>
      <Router>
        <div className='header'>
          <Navbar appearance='inverse'>
            <Navbar.Header>
              <Link to='/' className='navbar-brand logo'>
                Stingers Training
              </Link>
            </Navbar.Header>
            <Navbar.Body>
              <Nav pullRight>
                {isLoggedin === true && (
                  <Nav.Item href='/Logout'>Logout</Nav.Item>
                )}
                {isLoggedin === false && (
                  <>
                    <Nav.Item componentClass={Link} to={'/register'}>
                      Register
                    </Nav.Item>
                    <Nav.Item componentClass={Link} to={'/login'}>
                      Login
                    </Nav.Item>
                  </>
                )}
              </Nav>
            </Navbar.Body>
          </Navbar>
        </div>
        <Switch>
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/logout' component={Logout} />
          <Route component={mainContent} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
