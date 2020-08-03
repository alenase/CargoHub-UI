import React from "react";
import {Row, Col, Container} from 'react-bootstrap';
import './footer.css'
function Footer() {
    return(
      <Row md={2} className='bg-header footer align-middle pt-2'>
      <Col className='align-middle'>      
        <h5 className = 'align-middle font-weight-bold'>
          <a href='#'>All rights reserved</a>
        </h5>  
      </Col>
      <Col>
        <h5 className = 'align-middle text-right font-italic'>
          <a href='#'>Links to social networks</a>
        </h5>
      </Col>
    </Row>
    )
}
export default Footer;