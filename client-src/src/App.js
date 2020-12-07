import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import { Sidenav, Nav, Navbar } from 'rsuite';

import { navdata } from './data/navdata'
import Login from './components/Login/Login';
import './App.scss';

const App = () => {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(false);

  const fetchTest = () => {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    };
    console.log(options);
    fetch('/test', options)
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((jsonObj) => {
              setResults(jsonObj);
            })
            .catch(() => {
              setError(true);
            });
        }
        setError(true);
      })
      .catch(() => {
        setError(true);
      });
  };

  const Content = (props) => {
    return (
      <>
        <div>This is the content component place holder, matching route: {props.match.path}</div>
      </>
    );
  };

  const mainContent = () => {
    return (
      <div className='main-section'>
        <div className='side-nav'>
          <Sidenav appearance='su'>
            {navdata.map((navitem) => {
              return (
                <Nav.Item active={true} componentClass={Link} to={navitem.href}>
                  {navitem.label}
                </Nav.Item>
              );
            })}
          </Sidenav>
        </div>
        {navdata.map((navitem) => {
          return <Route exact path={navitem.href} component={Content} />;
        })}
      </div>
    );
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
                <Nav.Item componentClass={Link} to={'/login'}>
                  Login
                </Nav.Item>
              </Nav>
            </Navbar.Body>
          </Navbar>
        </div>
        <Switch>
          <Route
            exact
            path='/login'
            component ={Login}
          />
          <Route component={mainContent} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
