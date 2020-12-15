import { Sidenav, Nav } from "rsuite";
import { Link, useLocation } from 'react-router-dom';

const SideBar = ({ navData }) => {
  const location = useLocation();
  return (
    <Sidenav appearance='subtle'>
      {navData.map((navitem, index) => {
        return (
          <Nav.Item
            key={index}
            active={location.pathname === `/${navitem.value}`}
            componentClass={Link}
            to={`/${navitem.value}`}
          >
            {navitem.label}
          </Nav.Item>
        );
      })}
    </Sidenav>
  );
}

export default SideBar;
