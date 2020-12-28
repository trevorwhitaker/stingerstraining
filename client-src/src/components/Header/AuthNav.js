import React from 'react';
import { Nav } from 'rsuite';
import { Link } from 'react-router-dom';

import constants from '../../util/constants';

const AuthNav = ({ isLoggedin, isAdmin, setIsLoggedin, onClick }) => {
  const callOnClick = () => onClick ? onClick() : null;

  const logout = async () => {
    callOnClick();
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    const response = await fetch(constants.logoutEndpoint, options);
      if (response.ok) {
        localStorage.removeItem('loggedIn');
        setIsLoggedin(false);
      } else {
        console.log(response.msg);
      }
  };

  return (
    <span>
      {isLoggedin === true && (
        <>
          {isAdmin === true && (<Nav.Item componentClass={Link} to='/upload' onClick={callOnClick}>
            Admin upload
          </Nav.Item>)
          }
          <Nav.Item onClick={logout}>Logout</Nav.Item>
        </>
      )}
      {isLoggedin === false && (
        <>
          <Nav.Item componentClass={Link} to='/register' onClick={callOnClick}>
            Register
          </Nav.Item>
          <Nav.Item componentClass={Link} to='/login' onClick={callOnClick}>
            Login
          </Nav.Item>
        </>
      )}
      </span>
    );
};

export default AuthNav;
