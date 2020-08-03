import React, { useState, } from 'react';
import Users from './users.js';
import Hubs from './hubs.js';
import Transport from './transport.js';
import ExtraFunctionalities from './extra-functionalities.js';
import './admin.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tab, Nav, Container, Col, Row } from "react-bootstrap";
import '../App.css';

export default function Admin(props) {
    const [existedHubs, setExistedHubs] = useState([]);
    const [transportTypes, setTransportTypes] = useState([]);

    if (Boolean(props.data.ifAdmin) === false) {
    }
    return (
        <div>
            <Row id="title-row">
                <Col md={{span: 5, offset: 5}}>
                    <h2 className="title-text"> Adminstator's page </h2>
                </Col>
            </Row>
            <Container id="load-body">
                <Tab.Container defaultActiveKey="extratab">
                    <Nav variant="tabs bg-title-black" fill>
                        <Nav.Item className='col-md-2 ml-3 h4 font-weight-bold'>
                            <Nav.Link className='title-text grey-bg mb-1 mt-1' eventKey="users">Users</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className='col-md-2 h4 font-weight-bold'>
                            <Nav.Link className='title-text grey-bg mb-1 mt-1' eventKey="hubs">Hubs</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className='col-md-2 h4 font-weight-bold'>
                            <Nav.Link className='title-text grey-bg mb-1 mt-1'
                                eventKey="transports">Transports</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className='col-md-2 h4 font-weight-bold'>
                            <Nav.Link className='title-text grey-bg mb-1 mt-1' eventKey="extratab">Extra</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Tab.Content>
                        <Tab.Pane eventKey="extratab">
                            <ExtraFunctionalities transportTypes={transportTypes} token={props.data.token}/>
                        </Tab.Pane>
                        <Tab.Pane eventKey="users">
                            <Users token={props.data.token}/>
                        </Tab.Pane>
                        <Tab.Pane eventKey="hubs">
                            <Hubs setExistedHubs={setExistedHubs} existedHubs={existedHubs} token={props.data.token}/>
                        </Tab.Pane>
                        <Tab.Pane eventKey="transports">
                            <Transport existedHubs={existedHubs} setTransportTypes={setTransportTypes} transportTypes={transportTypes} token={props.data.token}/>
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </Container>
        </div>
    );

}


