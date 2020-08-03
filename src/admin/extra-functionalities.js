import React, {useState, useEffect} from 'react';
import {
    Accordion,
    Card,
    Table,
    Dropdown,
    Button,
    Modal,
    Form,
    Col,
    Row,
    OverlayTrigger,
    Tooltip
} from "react-bootstrap";
import DropdownMenu from 'react-bootstrap/DropdownMenu';
import CsvHandler from './csv-handler.js';
import axios from 'axios';
import ModalError from "../error/modalErrorFF.js";

const style = {
    Button: {
        "backgroundColor": "#ff8e09",
        "border": "none"
    }
}

function ExtraFunctionalities(props) {
    let url = 'http://localhost:9041/admin/transport/details';
    let transportTypes = props.transportTypes;
    const [transportEntities, setTransportEntities] = useState([]);
    const [flag, setFlag] = useState(true);
    const [createTransportEntityFlag, setCreateTransportEntityFlag] = useState(false);
    const [type, setType] = useState('');
    const [averageSpeed, setAverageSpeed] = useState(40);
    const [pricePerKm, setPricePerKm] = useState(25);
    const [updateTrEnFlag, setUpdateTrEnFlag] = useState(false);
    const [idTransportEntity, setIdTransportEntity] = useState(-1);
    let [ifShowModalError, setIfShowModalError] = useState(false);
    let [errorMessage, setErrorMessage] = useState('');
    const [logs, setLogs] = useState([]);

    function ifError() {
        let temp = !ifShowModalError;
        setIfShowModalError(temp);
    }

    function initialiseExistedTransportEntities(transportEntities) {
        setFlag(false);
        setTransportEntities(transportEntities);
    }

    function getExistedTransportEntities(props) {
        axios({
            'method': 'GET',
            'url': url,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer_${props}`,
            },
        }).then(response => {
            initialiseExistedTransportEntities(response.data.content);
        }).catch(error => {
            setIfShowModalError(true);
            setErrorMessage(error.response.data.message);
        });
    }

    function createTransportEntity(props) {
        axios({
            'method': 'POST',
            'url': url,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer_${props}`,
            },
            data:
                {
                    type: type,
                    averageSpeed: averageSpeed,
                    pricePerKm: pricePerKm,
                    cellSize: 3

                },
        }).then(response => {
            if (response.status === 201) {
                setFlag(true);
                setCreateTransportEntityFlag(false);
            }
        }).catch(error => {
            setCreateTransportEntityFlag(false);
            setIfShowModalError(true);
            setErrorMessage(error.response.data.message);
        });
    }

    function updateTransportEntity(props) {
        axios({
            'method': 'PUT',
            'url': url,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer_${props}`,
            },
            data:
                {
                    id: idTransportEntity,
                    type: type,
                    averageSpeed: averageSpeed,
                    pricePerKm: pricePerKm,
                },

        }).then(response => {
            if (response.status === 200) {
                setFlag(true);
                setUpdateTrEnFlag(false);
            }
        }).catch(error => {
            setUpdateTrEnFlag(false);
            setIfShowModalError(true);
            setErrorMessage(error.response.data.message);
        });
    }

    function removeTransportEntity(id, props) {
        axios({
            'method': 'DELETE',
            'url': url + "/" + id,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer_${props}`,
            },
        }).then(response => {
            if (response.status === 200) {
                setFlag(true);
            }
        }).catch(error => {
            setIfShowModalError(true);
            setErrorMessage(error.response.data.message);
        });
    }

    function hideModal() {
        setCreateTransportEntityFlag(false);
        setUpdateTrEnFlag(false);
    }

    function handleUpdateTransportEntity(transportEntity) {
        setType(transportEntity.type);
        setAverageSpeed(transportEntity.averageSpeed);
        setPricePerKm(transportEntity.pricePerKm);
        setIdTransportEntity(transportEntity.id);
        setUpdateTrEnFlag(true);
    }

    function simulationMigration(props) {
        axios({
            'method': 'GET',
            'url': "http://localhost:9041/admin/neo4j/to/mysql",
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer_${props}`,
            },

        }).then(response => {
            if (response.status === 200) {
                alert("migration has been started");
            }
        }).catch(error => {
            setIfShowModalError(true);
            setErrorMessage(error.response.data.message);
        });
    }

    function simulationRun(props) {
        axios({
            'method': 'GET',
            'url': "http://localhost:9041/admin/simulation",
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer_${props}`,
            },

        }).then(response => {
            if (response.status === 200) {
                alert("simulation has been started");
            }
        }).catch(error => {
            setIfShowModalError(true);
            setErrorMessage(error.response.data.message);
        });
    }

    function simulationLog(props) {
        axios({
            'method': 'GET',
            'url': "http://localhost:9041/admin/transport/logs",
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer_${props}`,
            },

        }).then(response => {
            if (response.status === 200) {
                setLogs(response.data);
            }
        }).catch(error => {
            setIfShowModalError(true);
            setErrorMessage(error.response.data.message);
        });
    }

    function simulationClear(props) {
        setLogs([]);
        axios({
            'method': 'GET',
            'url': "http://localhost:9041/admin/clear",
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer_${props}`,
            },

        }).then(response => {
            if (response.status === 200) {
                alert("clearing finished");
            }
        }).catch(error => {
            setIfShowModalError(true);
            setErrorMessage(error.response.data.message);
        });
    }

    function formLogs() {
        if (logs.length == 0) {
            return;
        }
        return <Table variant='dark' size='md' striped bordered hover>
            <thead>
            <tr>
                <th className='text-center mb-1'>Transport</th>
                <th className='text-center mb-1'>Date and time</th>
            </tr>
            </thead>
            <tbody>
            {
                logs.map((log, index) => {
                    return <tr key={index}>
                        <td className='pl-5 align-middle'>{log[0]}</td>
                        <td className='text-center align-middle'>{log[1]}</td>
                    </tr>
                })
            }
            </tbody>
        </Table>
    }

    useEffect(() => {
        if (flag) {
            getExistedTransportEntities(props.token);
        }
    });
    return (
        <div>
            {(ifShowModalError) && <ModalError ifShow={ifShowModalError}
                                               message={errorMessage}
                                               ifError={ifError}/>}
            <Accordion className='mt-5 ml-5 mr-5' defaultActiveKey="algorithm">
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="transport-detail">
                        <h3 className='text-center align-middle font-weight-bold'>Transport details</h3>
                    </Accordion.Toggle>
                    <Accordion.Collapse className='grey-bg' eventKey="transport-detail">
                        <Card.Body>
                            <div className='component-small'>
                                <Table variant='dark' size='md' striped bordered hover>
                                    <thead>
                                    <tr>
                                        <th className='text-center mb-1'>Type</th>
                                        <th className='text-center mb-1'>Average speed</th>
                                        <th className='text-center aling-top'>Price per km</th>
                                        <th className='text-center aling-middle'>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {(transportEntities !== undefined) && transportEntities.map((transportEntity, index) =>
                                        <tr key={index}>
                                            <td className='text-center align-middle'>
                                                {transportEntity.type}
                                            </td>
                                            <td className='text-center align-middle'>{transportEntity.averageSpeed}</td>
                                            <td className='text-center align-middle'>{transportEntity.pricePerKm}</td>
                                            <td className='text-center align-middle'>
                                                <Dropdown size='md'>
                                                    <Dropdown.Toggle style={style.Button}>Action</Dropdown.Toggle>
                                                    <DropdownMenu>
                                                        <Dropdown.Item as="button"
                                                                       onSelect={() => handleUpdateTransportEntity(transportEntity)}>Update</Dropdown.Item>
                                                        <Dropdown.Divider/>
                                                        <Dropdown.Item as="button"
                                                                       onSelect={() => removeTransportEntity(transportEntity.id, props.token)}>Delete</Dropdown.Item>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </Table>
                            </div>
                            <div className="col text-right">
                                <Button id='new-hub-img' variant="light"
                                        onClick={() => setCreateTransportEntityFlag(true)}/>
                            </div>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="csv-loader">
                        <h3 className='text-center align-middle font-weight-bold'>CSV loader</h3>
                    </Accordion.Toggle>
                    <Accordion.Collapse className='grey-bg' eventKey="csv-loader">
                        <Card.Body>
                            <CsvHandler token={props.token}/>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="algorithm">
                        <h3 className='text-center align-middle font-weight-bold'>Algorithm runner</h3>
                    </Accordion.Toggle>
                    <Accordion.Collapse className='grey-bg' eventKey="algorithm">
                        <Card.Body>
                            <Row>
                                <Col sm="3">
                                    <OverlayTrigger placement='top' overlay={
                                        <Tooltip>from Neo4j to MySQL</Tooltip>}>
                                        <Button id="body-button3" onClick={() => simulationMigration(props.token)}
                                                block>Import</Button>
                                    </OverlayTrigger>
                                </Col>
                                <Col sm="3">
                                    <OverlayTrigger placement='top' overlay={
                                        <Tooltip>simulation of algorithm</Tooltip>}>
                                        <Button id="body-button3" onClick={() => simulationRun(props.token)}
                                                block>Start</Button>
                                    </OverlayTrigger>
                                </Col>
                                <Col sm="3">
                                    <OverlayTrigger placement='top' overlay={
                                        <Tooltip>logs of simulation</Tooltip>}>
                                        <Button id="body-button3" onClick={() => simulationLog(props.token)}
                                                block>Show</Button>
                                    </OverlayTrigger>
                                </Col>
                                <Col sm="3">
                                    <OverlayTrigger placement='top' overlay={
                                        <Tooltip>drop all data after simulation in dataMySQL storage</Tooltip>}>
                                        <Button id="body-button3" onClick={() => simulationClear(props.token)}
                                                block>Clear</Button>
                                    </OverlayTrigger>
                                </Col>
                            </Row>
                            <Row className='component-small'>
                                {
                                    formLogs()
                                }
                            </Row>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
            <Modal show={createTransportEntityFlag || updateTrEnFlag} onHide={() => hideModal()} animation='true'>
                <Modal.Header closeButton>
                    <Modal.Title className="font-weight-bold ml-3">
                        {
                            createTransportEntityFlag ? 'Create transport entity' : 'Update transport entity'
                        }
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row}>
                            <Form.Label className='text-right' column sm="4">
                                Type
                            </Form.Label>
                            <Col sm="5">
                                <Form.Control as="select" className='pl-5' defaultValue={
                                    (createTransportEntityFlag) ? "Choose type" : type
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
                            <Form.Label className='text-right' column sm="4">
                                Average speed
                            </Form.Label>
                            <Col sm="5">
                                <Form.Control type="number" className='text-center' size='sm'
                                              defaultValue={averageSpeed}
                                              onChange={(e) => setAverageSpeed(e.target.value)}/>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className='text-right' column sm="4">
                                Price per km
                            </Form.Label>
                            <Col sm="5">
                                <Form.Control type="number" className='text-center' size='sm' defaultValue={pricePerKm}
                                              onChange={(e) => setPricePerKm(e.target.value)}/>
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='col-md-5 mr-3'
                            onClick={() => createTransportEntityFlag ? createTransportEntity(props.token) : updateTransportEntity(props.token)}>
                        {
                            createTransportEntityFlag ? "Create" : "Update"
                        }
                    </Button>
                    <Button className='col-md-5 mr-4' variant='secondary' onClick={() => hideModal()}>cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ExtraFunctionalities;