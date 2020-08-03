import React, { useEffect, useState } from 'react';
import { Pagination, Table, Dropdown, Button, Form, Modal, Row, Col } from "react-bootstrap";
import axios from 'axios';
import ModalError from "../error/modalErrorFF.js";
import DropdownMenu from 'react-bootstrap/DropdownMenu';
import Cargo3D from '../visualization/CargoHoldVisual.js';

function Transports(props) {
    let url = 'http://localhost:9041/admin/transport';
    let urlForTransportTypes = 'http://localhost:9041/admin/transport/types';
    const [pagination, setPagination] = useState([]);
    const [activePage, setActivePage] = useState(0);
    let existedHubs = props.existedHubs;
    const [flag, setFlag] = useState(true);
    const [transports, setTransports] = useState([]);
    let transportTypes = props.transportTypes;
    let setTransportTypes = props.setTransportTypes;
    const [boundedHub, setBoundedHub] = useState('');
    const [compartments, setCompartments] = useState([
        {
            maximumWeight: 22,
            volume: {
                width: 2.4,
                height: 2.4,
                length: 12,
            }
        },
    ]);
    const [type, setType] = useState('');
    const [createModalFlag, setCreateModalFlag] = useState(false);
    const [weight, setWeight] = useState(22);
    const [width, setWidth] = useState(2.4);
    const [height, setHeight] = useState(2.4);
    const [length, setLength] = useState(12);
    const [updateModalFlag, setUpdateModalFlag] = useState(false);
    const [currentTransport, setCurrentTransport] = useState({});
    let [ifShowModalError, setIfShowModalError] = useState(false);
    let [errorMessage, setErrorMessage] = useState('');
    const [visualizeFlag, setVisualizeFlag] = useState(false);

    function ifError() {
        let temp = !ifShowModalError;
        setIfShowModalError(temp);
    }
    const style = {
        Button: {
            "backgroundColor": "#ff8e09",
            "border": "none"
        }
    }

    if (transportTypes.length === 0) {
        getAllTransportTypes(props);
    }

    function initializeData(data) {
        setTransports(data.content);
        setPagination(formPagination(activePage, data.totalPages));
    }

    function updatePagination(newActivePage) {
        setActivePage(newActivePage);
        setFlag(true);
    }
    function formPagination(newActivePage, totalPage) {
        let itemsArray = [];
        for (let number = 1; number <= totalPage; number++) {
            itemsArray.push(
                <Pagination.Item key={number} active={number === newActivePage + 1} onClick={() => updatePagination(number - 1)}>
                    {number}
                </Pagination.Item>,
            );
        }
        return itemsArray;
    }
    function getAllTransports(props) {
        axios({
            'method': 'GET',
            'url': url + '?page=' + activePage + '&size=5',
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer_${props}`,
            },
            'params': {
                'search': 'parameter',
            },
        }).then(response => {
            if (response.status === 200) {
                initializeData(response.data);
            }

        }).catch((error) => {
            console.log(error);
            setIfShowModalError(true);
            setErrorMessage(error.response.data.message);
        });
    }
    function getAllTransportTypes(props) {
        axios({
            'method': 'GET',
            'url': urlForTransportTypes,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer_${props.token}`,
            },
        }).then(response => {
            if (response.status === 200) {
                setTransportTypes(response.data)
            }
        }).catch(error => {
            console.log('erroring from getAllTransTypes: ', error);
        });
    }
    function createTransport(props) {
        compartments.map(compartment => {
            compartment.id = null;
            compartment.volume.id = null;
        });
        axios({
            'method': 'POST',
            'url': url,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer_${props.token}`,
            },
            data:
            {
                "hubName": boundedHub,
                "compartments": compartments,
                "type": type,
            },

        }).then(response => {
            if (response.status === 201) {
                setFlag(true);
                setCreateModalFlag(false);
            }
        }).catch((error) => {
            setIfShowModalError(true);
            setErrorMessage(error.response.data.message);
            setCreateModalFlag(false);
        });
    }
    function updateTransport(props) {
        axios({
            'method': 'PUT',
            'url': url,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer_${props.token}`,
            },
            data:
            {
                "id": currentTransport.id,
                "hubName": boundedHub ? boundedHub : currentTransport.hubName,
                "compartments": compartments,
                "type": type ? type : currentTransport.type,
            },

        }).then(response => {
            if (response.status === 200) {
                setFlag(true);
                setCreateModalFlag(false);
                setUpdateModalFlag(false);
            }
        }).catch((error) => {
            setIfShowModalError(true);
            setErrorMessage(error.response.data.message);
            setCreateModalFlag(false);
            setUpdateModalFlag(false);
        });
    }
    function removeTransport(transport, props) {
        axios({
            'method': 'DELETE',
            'url': url + '/' + transport.id,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer_${props.token}`,
            }
        }).then(response => {
            if (response.status === 200) {
                setFlag(true);
            }
        }).catch((error) => {
            setIfShowModalError(true);
            setErrorMessage(error.response.data.message);
        });
    }
    function addNewCompartment() {
        setCompartments([...compartments,
        {
            maximumWeight: weight,
            volume: {
                width: width,
                height: height,
                length: length,
            }
        }]);
    }
    function removeCompartment(index) {
        let newCompartments = [].concat(compartments);
        newCompartments.splice(index, 1);
        setCompartments(newCompartments);
    }
    function closeCreateUpdateModalWindow() {
        setCreateModalFlag(false);
        setUpdateModalFlag(false);
    }
    function handleUpdateTransport(transport) {
        setCurrentTransport(transport);
        setCompartments(transport.compartments);
        setUpdateModalFlag(true);
    }
    function visualize(transport) {
        console.log("visualiar transport .js",transport);
        setVisualizeFlag(true);
        setCurrentTransport(transport);
    }

    function disable(){
        setVisualizeFlag(false);
    }
    
    useEffect(() => {
        if (flag) {
            getAllTransports(props.token);
            setFlag(false);
        }
    }, [flag, getAllTransports, props.token]);
    return (
        <div>
            {(ifShowModalError) && <ModalError ifShow={ifShowModalError}
                message={errorMessage}
                ifError={ifError} />}
            <div className='component'>
                <Table variant='dark' size='md' striped bordered hover >
                    <thead>
                        <tr>
                            <th className='text-center mb-1'>Number</th>
                            <th className='text-center mb-1'>Bound hub</th>
                            <th className='text-center mb-1'>
                                <h4>Compartments</h4>
                                <Row>
                                    <Col sm="1">#</Col>
                                    <Col sm="3">Maximum weight</Col>
                                    <Col sm="2">Free space</Col>
                                    <Col sm="2">Width</Col>
                                    <Col sm="2">Height</Col>
                                    <Col sm="2">Length</Col>
                                </Row>
                            </th>
                            <th className='text-center aling-top'>Type</th>
                            <th className='text-center aling-middle'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transports.map((transport, index) =>
                            <tr key={index}>
                                <td className='text-center align-middle'>HM{transport.id}UA</td>
                                <td className='text-center align-middle'>{transport.hubName}</td>
                                <td className='pl-4 align-middle text-center'>
                                    {
                                        transport.compartments.map((compartment, index2) =>
                                            <Row key={index2}>
                                                <Col sm="1">{(index2 + 1)}</Col>
                                                <Col sm="3">{compartment.maximumWeight}</Col>
                                                <Col sm="2">{compartment.freeSpace}</Col>
                                                <Col sm="2">{compartment.volume.width}</Col>
                                                <Col sm="2">{compartment.volume.height}</Col>
                                                <Col sm="2">{compartment.volume.length}</Col>
                                            </Row>
                                        )
                                    }
                                </td>
                                <td className='pl-4 align-middle'>{transport.type}</td>
                                <td className='text-center align-middle'>
                                    <Dropdown size='md' >
                                        <Dropdown.Toggle style={style.Button}>Action</Dropdown.Toggle>
                                        <DropdownMenu>
                                            <Dropdown.Item as="button" onSelect={() => handleUpdateTransport(transport)}>Update</Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item as="button" onSelect={() => removeTransport(transport, props)}>Delete</Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item as="button" onSelect={() => visualize(transport)}>Show</Dropdown.Item>
                                        </DropdownMenu>
                                    </Dropdown>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                <div className="col text-right">
                    <Button id='new-hub-img' variant="light" onClick={() => setCreateModalFlag(true)} />
                </div>
            </div>
            <Pagination className='justify-content-center'>{pagination}</Pagination>
            <Modal show={createModalFlag || updateModalFlag} onHide={() => closeCreateUpdateModalWindow()} animation='true'>
                <Modal.Header closeButton>
                    <Modal.Title className="font-weight-bold ml-3">
                        {
                            (createModalFlag) ? "Create new transport item" : "Update transport item"
                        }
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row}>
                            <Form.Label className='pl-4' column sm="4">
                                Bound hub
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control as="select" defaultValue={
                                    (createModalFlag) ? "Choose city" : currentTransport.hubName
                                } onChange={(e) => setBoundedHub(e.target.value)}>
                                    <option>Choose city</option>
                                    {
                                        existedHubs.map((city, index) =>
                                            <option key={index}>
                                                {city.name}
                                            </option>
                                        )
                                    }
                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className='pl-4' column sm="4">
                                Transport type
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control as="select" defaultValue={
                                    (createModalFlag) ? "Choose type" : currentTransport.type
                                } onChange={(e) => setType(e.target.value)}>
                                    <option>Choose type</option>
                                    {
                                        transportTypes.map((type, index) =>
                                            <option key={index}>
                                                {type}
                                            </option>
                                        )
                                    }
                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className='pl-4 font-italic' column sm="12">
                                Compartments:
                            </Form.Label>
                        </Form.Group>
                        <Row>
                            <Form.Label className='text-center font-italic' column sm="2">Weight</Form.Label>
                            <Form.Label className='text-center font-italic' column sm="2">Width</Form.Label>
                            <Form.Label className='text-center font-italic' column sm="2">Height</Form.Label>
                            <Form.Label className='text-center font-italic' column sm="2">Length</Form.Label>
                            <Form.Label className='text-center font-italic' column sm="4">Remove</Form.Label>
                        </Row>
                        {
                            compartments.map((compartment, index) =>
                                <Row key={index}>
                                    <Form.Label className='text-center' column sm="2">
                                        {
                                            compartment.maximumWeight
                                        }
                                    </Form.Label>
                                    <Form.Label className='text-center' column sm="2">
                                        {
                                            compartment.volume.width
                                        }
                                    </Form.Label>
                                    <Form.Label className='text-center' column sm="2">
                                        {
                                            compartment.volume.height
                                        }
                                    </Form.Label>
                                    <Form.Label className='text-center' column sm="2">
                                        {
                                            compartment.volume.length
                                        }
                                    </Form.Label>
                                    <Form.Label className='text-center' column sm="4">
                                        <Button variant='danger' style={{ height: 3 }} onClick={() => removeCompartment(index)}>
                                            -
                                        </Button>
                                    </Form.Label>
                                </Row>
                            )
                        }
                        <Form.Group as={Row} className='mt-1 mr-2 ml-1 pt-1 pb-1' style={{ border: '1px grey solid' }}>
                            <Col>
                                <Form.Control type="number" className='text-left' size='sm' defaultValue={weight} onChange={(e) => setWeight(e.target.value)} />
                            </Col>
                            <Col>
                                <Form.Control type="number" size='sm' defaultValue={width} onChange={(e) => setWidth(e.target.value / 100)} />
                            </Col>
                            <Col>
                                <Form.Control type="number" size='sm' defaultValue={height} onChange={(e) => setHeight(e.target.value / 100)} />
                            </Col>
                            <Col sm="3">
                                <Form.Control type="number" size='sm' defaultValue={length} onChange={(e) => setLength(e.target.value / 100)} />
                            </Col>
                            <Col className="align-middle text-center">
                                <Button onClick={() => addNewCompartment()} size="sm">+</Button>
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='col-md-5 mr-3' onClick={() => (createModalFlag) ? createTransport(props) : updateTransport(props)}>
                        {
                            (createModalFlag) ? "Create" : 'Update'
                        }
                    </Button>
                    <Button className='col-md-5 mr-4' variant='secondary' onClick={() => closeCreateUpdateModalWindow()}>cancel</Button>
                </Modal.Footer>
            </Modal>
            <Cargo3D showFlag={visualizeFlag} disable={disable} id={currentTransport.id ? currentTransport.id : 1000} token={props.token} />
            {/*
                visualizeFlag ? <Cargo3D showFlag="true" id={currentTransport.id ? currentTransport.id : 1000} token={props.token} /> : <div>{console.log(visualizeFlag)}</div>
                */
            }
        </div>
    );
}
 
export default Transports;
