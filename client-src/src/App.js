import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import { Nav, Navbar, Icon } from 'rsuite';

import util from './util/utils';
import constants from './util/constants';
import MobileNav from './components/Header/MobileNav';
import SideBar from './components/Header/SideBar';

// import { navdata } from './data/navdata';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import CardsPage from './components/Pages/CardsPage';
import DrillPage from './components/Pages/DrillPage';
import Upload from './components/Pages/Upload';

import './App.scss';

const App = () => {
  console.log(constants);
  const [isLoggedin, setIsLoggedin] = useState(null);
  const [showMobileNav, toggleMobileNav] = useState(false);
  const [navdata, setNavdata] = useState([]);

  // Login check on mount, fetch data
  useEffect(() => {
    const check = async () => {
      const isLoggedin = await util.checkLogin();
      setIsLoggedin(isLoggedin);

      if (isLoggedin) {
        const navdata = await util.getCategories();
        setNavdata(navdata);
      }
    };
    check();
  }, []);

  // Logged out prompt
  const Logout = () => {
    localStorage.removeItem('token');
    return <div className='logged-out'>You are now logged out.</div>;
  };

  const HomePage = () => {
    return navdata.length > 0 && <div>This is a dank homepage</div>;
  };

  const MainContent = () => {
    if (isLoggedin === true) {
      return (
        <div className='main-section'>
          <div className='side-nav'>
          <SideBar navData={navdata} />
          </div>
          <div className='main-content'>
            <>
              <Route exact path='/'>
                <HomePage />
              </Route>
              {navdata.map((navitem, index) => {
                const categoryPath = `/${navitem.value}`;
                return (
                  <Route
                    exact
                    path={categoryPath}
                    component={CardsPage}
                    key={index}
                  >
                    <CardsPage category={navitem.value} />
                  </Route>
                );
              })}
              <Route
                exact
                path={`/:category/:drill/`}
                render={(props) => {
                  const { category, drill } = props.match.params;
                  
                  return <DrillPage category={category} drill={drill} />;
                }}
              ></Route>
            </>
          </div>
        </div>
      );
    } else if (isLoggedin === false) {
      return <div className='no-login'>Please login or register first.</div>;
    } else {
      return null;
    }
  };

  const renderAuthNav = (
    <div className="desktopAuth">
    {isLoggedin === true && (
      <>
        <Nav.Item componentClass={Link} to='/upload'>
          Admin upload
        </Nav.Item>
        <Nav.Item href='/logout'>Logout</Nav.Item>
      </>
    )}
    {isLoggedin === false && (
      <>
        <Nav.Item componentClass={Link} to='/register'>
          Register
        </Nav.Item>
        <Nav.Item componentClass={Link} to='/login'>
          Login
        </Nav.Item>
      </>
    )}
    </div>
  );

  return (
    <div className='App'>
      <Router>
        <div className='header'>
          <MobileNav navData={navdata} showMobileNav={showMobileNav} toggleMobileNav={toggleMobileNav}/>
          <Navbar appearance='inverse'>
            <Navbar.Header>
              <a href='/' className='navbar-brand logo'>
                <img src="https://cdn3.sportngin.com/attachments/contact/f7f0-140393562/Scarborough_Stingers_Full_Logo.png" />
                Stingers Training
              </a>
            </Navbar.Header>
            <Navbar.Body>
              <Nav pullRight>
                {renderAuthNav}
                <Icon icon="bars" onClick={() => toggleMobileNav(true)} className="navIcon"/>
              </Nav>
            </Navbar.Body>
          </Navbar>
        </div>
        <Switch>
          <Route exact path='/register'>
            <Register />
          </Route>
          <Route exact path='/login'>
            <Login />
          </Route>
          <Route exact path='/logout'>
            <Logout />
          </Route>
          <Route exact path='/upload'>
            <Upload />
          </Route>
          <Route>
            <MainContent />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
