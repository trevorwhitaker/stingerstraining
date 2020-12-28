import React from 'react';
import { Drawer } from 'rsuite';

import SideBar from './SideBar';
import AuthNav from './AuthNav';


const MobileNav = ({ navData, showMobileNav, toggleMobileNav, isLoggedin, isAdmin, setIsLoggedin }) => (
  <div className="mobileNav">
    <Drawer show={showMobileNav} onHide={() => toggleMobileNav(false)} full>
      <Drawer.Header />
      <Drawer.Body>
        <SideBar navData={navData} onClick={() => toggleMobileNav(false)} />
      </Drawer.Body>
      <Drawer.Footer>
        <AuthNav
          isAdmin={isAdmin}
          isLoggedin={isLoggedin}
          setIsLoggedin={setIsLoggedin}
          onClick={() => toggleMobileNav(false)}
        />
      </Drawer.Footer>
    </Drawer>
  </div>
);

export default MobileNav;
