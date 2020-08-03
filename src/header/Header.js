import React from 'react';
import logo from './logo.png';
import './header.css';
import {Link} from 'react-router-dom';
import { Row } from 'react-bootstrap';

function Header(props) {
  return (
    <Row className="Div-Absolute">
      <header className="Main-header">
        <Link to="/" >
          <div className="Div-image">
            <img src={logo} className="Logo" alt="logo" />
          </div>
        </Link>

        <div className="Div-Menu" id="TopNav">
          <Link className="a" to="/about-our-company">
            <h4 >About Us</h4>
          </Link>
        </div>
      </header>
    </Row>
  );
}

export default Header;

