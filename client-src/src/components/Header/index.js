import React, { useState } from 'react';
import { Nav, Navbar, Icon } from 'rsuite';

import AuthNav from './AuthNav';
import MobileNav from './MobileNav';

const Header = ({ isLoggedin, isAdmin, setIsLoggedin, navData }) => {
  const [showMobileNav, toggleMobileNav] = useState(false);

  return (
    <div className='header'>
      <MobileNav
       navData={navData}
       showMobileNav={showMobileNav}
       toggleMobileNav={toggleMobileNav}
       isAdmin={isAdmin}
       isLoggedin={isLoggedin}
       setIsLoggedin={setIsLoggedin}
      />
        <Navbar appearance='inverse'>
          <Navbar.Header>
            <a href='/' className='navbar-brand logo'>
              <img
                src="https://cdn3.sportngin.com/attachments/contact/f7f0-140393562/Scarborough_Stingers_Full_Logo.png"
                alt="Scarborough Stingers Logo"
              />
              Stingers Training
            </a>
          </Navbar.Header>
          <Navbar.Body>
            <Nav pullRight>
              <div className="desktopAuth">
                <AuthNav
                  isAdmin={isAdmin}
                  isLoggedin={isLoggedin}
                  setIsLoggedin={setIsLoggedin}
                />
              </div>
              <Icon icon="bars" onClick={() => toggleMobileNav(true)} className="navIcon"/>
            </Nav>
          </Navbar.Body>
        </Navbar>
      </div>
    );
  };

  export default Header;
  