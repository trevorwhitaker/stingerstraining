import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import util from './util/utils';
import Header from './components/Header';
import SideBar from './components/Header/SideBar';

// import { navdata } from './data/navdata';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import CardsPage from './components/Pages/CardsPage';
import DrillPage from './components/Pages/DrillPage';
import ThunderPage from './components/Pages/ThunderPage';
import Upload from './components/Pages/Upload';
import AdminDashboard from './components/Pages/AdminDashboard';

import './App.scss';

const App = () => {
  const [isLoggedin, setIsLoggedin] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [navdata, setNavData] = useState([]);

  // Login check on mount, fetch data
  useEffect(() => {
    const check = async () => {
      let navData = [];
      const isLoggedin = await util.checkLogin();
      setIsLoggedin(isLoggedin);

      if (isLoggedin) navData = await util.getCategories();

      const isAdmin = await util.checkAdmin();
      setNavData(navData);
      setIsAdmin(isAdmin);
    };
    check();
  }, [isLoggedin]);

  // Logged out prompt
  const Logout = () => {
    return <div className='logged-out'>You are now logged out.</div>;
  };

  const HomePage = () => {
    return navdata.length > 0 && <div>Scarborough Stingers Workouts and Drills</div>;
  };

  const MainContent = () => {
    if (isLoggedin === true) {
      return (
        <div className='main-section'>
          <div className='side-nav'>
          <SideBar
            isAdmin={isAdmin}
            isLoggedin={isLoggedin}
            setIsLoggedin={setIsLoggedin}
            navData={navdata}
          />
          </div>
          <div className='main-content'>
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
          </div>
        </div>
      );
    } else if (isLoggedin === false) {
      return <div className='no-login'>Please login or register first.</div>;
    } else {
      return null;
    }
  };

  return (
    <div className='App'>
      <Router>
        <Header
         isAdmin={isAdmin}
         isLoggedin={isLoggedin}
         setIsLoggedin={setIsLoggedin}
         navData={navdata}
        />
        <div className="main">
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
            <Route exact path='/admindash'>
              <AdminDashboard />
            </Route>
            <Route exact path='/thunderstruck'>
              <ThunderPage />
            </Route>
            <Route>
              <MainContent />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
};

export default App;
