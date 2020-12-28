import { Sidenav, Nav } from "rsuite";
import { Link, useLocation } from 'react-router-dom';

const SideBar = ({ navData, onClick }) => {
  const location = useLocation();
  const callOnClick = () => onClick ? onClick() : null;

  return (
    <Sidenav appearance='subtle'>
      {navData.map((navitem, index) => (
          <Nav.Item
            key={index}
            active={location.pathname === `/${navitem.value}`}
            componentClass={Link}
            to={`/${navitem.value}`}
            onClick={callOnClick}
          >
            {navitem.label}
          </Nav.Item>
        ))}
    </Sidenav>
  );
}

export default SideBar;
