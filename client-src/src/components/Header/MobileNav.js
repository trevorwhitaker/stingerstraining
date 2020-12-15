import React, { useState } from 'react';
import { Drawer, Nav } from 'rsuite';
import { Link } from 'react-router-dom';

import SideBar from './SideBar';


const MobileNav = ({ navData, showMobileNav, toggleMobileNav }) => (
  <div className="mobileNav">
    <Drawer show={showMobileNav} onHide={() => toggleMobileNav(false)} full>
      <Drawer.Header />
      <Drawer.Body>
        <SideBar navData={navData} />
      </Drawer.Body>
      <Drawer.Footer>
        <Nav.Item componentClass={Link} to='/upload'>
          Admin upload
        </Nav.Item>
        <Nav.Item href='/logout'>Logout</Nav.Item>
      </Drawer.Footer>
    </Drawer>
  </div>
);

export default MobileNav;
