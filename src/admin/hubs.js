import React, { useState, useEffect } from 'react';
import { Table, Dropdown, Button, Form, Modal, Row, Col } from "react-bootstrap";
import cities from './admin_resource/cities.json';
import axios from 'axios';
import ModalError from "../error/modalErrorFF.js";

const style = {
    Button: {
        "backgroundColor": "#ff8e09",
        "border": "none"
    }
}

function Hubs(props) {
    let url = 'http://localhost:9041/admin/hub';
    let urlForReltion = 'http://localhost:9041/admin/hub/relation';
    let existedHubs = props.existedHubs;
    let setExistedHubs = props.setExistedHubs;
    const [flag, setFlag] = useState(true);
    const [createHubFlag, setCreateHubFlag] = useState(false);
    const [updateHubFlag, setUpdateHubFlag] = useState(false);
    const [relationFlag, setRelationFlag] = useState(false);
    const [currentHub, setCurrentHub] = useState({});
    const [relationListForCurrentHub, setRelationListForCurrentHub] = useState([]);
    const [newHubName, setNewHubName] = useState('');
    let [ifShowModalError, setIfShowModalError] = useState(false);
    let [errorMessage, setErrorMessage] = useState('');

    function ifError() {
        let temp = !ifShowModalError;
        setIfShowModalError(temp);
    }

    function initialiseExistedHubs(hubs) {
        setFlag(false);
        setExistedHubs(hubs);
    }
    function getPossibleRelations(currentHubName) {
        let existingCitiesNames = [];
        existedHubs.map(hub => existingCitiesNames.push(hub.name));
        existingCitiesNames = existingCitiesNames.filter(city => (currentHubName !== city));
        let relationHubs = [];
        relationListForCurrentHub.map(hub => relationHubs.push(hub.name));
        existingCitiesNames = existingCitiesNames.filter(city => !relationHubs.includes(city));
        return existingCitiesNames;
    }
    function getExistedHubs(props) {
        axios({
            'method': 'GET',
            'url': url,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer_${props.token}`,
            },
        }).then(response => {
            if (response.status === 200) {
                initialiseExistedHubs(response.data);
            }
        }).catch(error => {
            console.log('erroring from getExistedHubs: ', error);
        });
    }
    function createHub(props) {
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
                newCity: newHubName,
            },

        }).then(response => {
            if (response.status === 201) {
                setFlag(true);
                setCreateHubFlag(false);
            }
        }).catch((error) => {
            setIfShowModalError(true);
            setErrorMessage(error.response.data.message);
            setCreateHubFlag(false);
        });
    }
    function handleUpdateHubAction(hubToUpdate, props) {
        setCurrentHub(hubToUpdate);
        setUpdateHubFlag(true);
    }
    function updateHub(props) {
        axios({
            method: 'PATCH',
            url: url + '/' + currentHub.name,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'content-type': 'application/json',
                'Authorization': `Bearer_${props.token}`,
            },
            data:
            {
                newName: newHubName,
            }
        }).then(response => {
            if (response.status === 200) {
                setUpdateHubFlag(false);
                setFlag(true);
            }
        }).catch(error => {
            setIfShowModalError(true);
            if ( error.response !== undefined) {
                setErrorMessage(error.response.data.message);
            }
            else {
                setErrorMessage(error.message);
            }
            setUpdateHubFlag(false);
            setFlag(true);
        });
    }
    function removeHub(hub, props) {
        axios({
            'method': 'DELETE',
            'url': url + "/" + hub.name,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'content-type': 'application/json',
                'Authorization': `Bearer_${props.token}`,
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
    function handleShowRelation(hub, props) {
        setCurrentHub(hub);
        showRelationForCurrentHub(hub, props);
    }
    function showRelationForCurrentHub(hub, props) {
        axios({
            'method': 'GET',
            'url': urlForReltion + '/' + hub.name,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'content-type': 'application/json',
                'Authorization': `Bearer_${props.token}`,
            },
            data: {
                id: hub.id,
                name: hub.name,
            }
        }).then(response => {
            initialiseRelationForCurrentHub(response.data);
        }).catch(error => {
            console.log('erroring from showRelationForCurrentHub: ', error);
        });
    }
    function initialiseRelationForCurrentHub(relations) {
        setRelationListForCurrentHub(relations);
        setRelationFlag(true);
    }
    function createRelation(props) {
        axios({
            'method': 'POST',
            'url': urlForReltion,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'content-type': 'application/json',
                'Authorization': `Bearer_${props.token}`,
            },
            data: {
                newCity: currentHub.name,
                connectedCity: newHubName,
            }
        }).then(response => {
            if (response.status === 200) {
                showRelationForCurrentHub(currentHub, props);
            }
        }).catch(error => {
            setIfShowModalError(true);
            setErrorMessage(error.response.data.message);
        });
    }
    function removeRelation(relationHubName, props) {
        axios({
            'method': 'DELETE',
            'url': urlForReltion,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'content-type': 'application/json',
                'Authorization': `Bearer_${props.token}`,
            },
            data: {
                newCity: currentHub.name,
                connectedCity: relationHubName.name,
            }

        }).then(response => {
            if (response.status === 200) {
                showRelationForCurrentHub(currentHub, props);
            }
        }).catch(error => {
            setIfShowModalError(true);
            setErrorMessage(error.response.data.message);
        });
    }
    useEffect(() => {
        if (flag) {
            getExistedHubs(props);
        }
    });
    return (
        <div className='component'>
            {(ifShowModalError) && <ModalError ifShow={ifShowModalError}
                message={errorMessage}
                ifError={ifError} />}
            <Table variant='dark' size='md' striped bordered hover >
                <thead>
                    <tr>
                        <th className='text-center aling-middle'>Hub name</th>
                        <th className='text-center aling-middle'>Longitude</th>
                        <th className='text-center aling-middle'>Latitude</th>
                        <th className='text-center aling-middle'>Relations</th>
                        <th className='text-center aling-middle'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {existedHubs.map((hub, index) =>
                        <tr key={index}>
                            <td className='pl-3 align-middle'>{hub.name}</td>
                            <td className='pl-4 align-middle'>{hub.longitude}</td>
                            <td className='pl-4 align-middle'>{hub.latitude}</td>
                            <td className='text-center'>
                                <Button variant='info' style={style.Button} onClick={() => handleShowRelation(hub, props)}>Show</Button>
                            </td>
                            <td className='text-center'>
                                <Dropdown size='md' >
                                    <Dropdown.Toggle style={style.Button}>Action</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item as="button" onSelect={() => handleUpdateHubAction(hub)}>Update hub</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item as="button" onSelect={() => removeHub(hub, props)}>Delete hub</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <div className="col text-right">
                <Button id='new-hub-img' variant="light" onClick={() => setCreateHubFlag(true)} />
            </div>

            <Modal show={updateHubFlag} onHide={() => setUpdateHubFlag(false)} animation='true'>
                <Modal.Header closeButton>
                    <Modal.Title className="font-weight-bold ml-3">Update hub</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row}>
                            <Form.Label className='pl-4' column sm="4">
                                Current name
                            </Form.Label>
                            <Col sm="7">
                                <Form.Control type="text" defaultValue={currentHub.name} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className='pl-4' column sm="4">
                                New name
                            </Form.Label>
                            <Col sm="7">
                                <Form.Control as="select" onChange={(e) => setNewHubName(e.target.value)}>
                                    <option>Choose city</option>
                                    {
                                        cities.filter(city => !existedHubs.some(existedCity => existedCity.name === city)).map((city, index) =>
                                            <option key={index}>
                                                {city}
                                            </option>
                                        )
                                    }
                                </Form.Control>
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='col-md-5 mr-3' onClick={() => updateHub(props)}>update</Button>
                    <Button className='col-md-5 mr-4' variant='secondary' onClick={() => setUpdateHubFlag(false)}>cancel</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={createHubFlag} onHide={() => setCreateHubFlag(false)} animation='true'>
                <Modal.Header closeButton>
                    <Modal.Title className="font-weight-bold ml-3">Create hub</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row}>
                            <Form.Label className='pl-4' column sm="4">
                                New hub
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control as="select" onChange={(e) => setNewHubName(e.target.value)}>
                                    <option>Choose city</option>
                                    {
                                        cities.filter(city => !existedHubs.some(existedCity => existedCity.name === city)).map((city, index) =>
                                            <option key={index}>
                                                {city}
                                            </option>
                                        )
                                    }
                                </Form.Control>
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='col-md-5 mr-3' onClick={() => createHub(props)}>Create</Button>
                    <Button className='col-md-5 mr-4' variant='secondary' onClick={() => setCreateHubFlag(false)}>cancel</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={relationFlag} onHide={() => setRelationFlag(false)} animation='true'>
                <Modal.Header closeButton>
                    <Modal.Title className="font-weight-bold ml-3">Create relations to {currentHub.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {
                            relationListForCurrentHub.map((city, index) =>
                                <Form.Group as={Row}>
                                    <Form.Label className='pl-5 text-center' column sm="2">
                                        {
                                            (index + 1)
                                        }
                                    </Form.Label>
                                    <Form.Label className='pl-5' column sm="5">
                                        {
                                            city.name
                                        }
                                    </Form.Label>
                                    <Col className='text-center' sm="4">
                                        <Button variant='danger' style={{ borderRadius: 30, width: 50 }} onClick={() => removeRelation(city, props)}>
                                            <strong>-</strong>
                                        </Button>
                                    </Col>
                                </Form.Group>
                            )
                        }
                        <Form.Group as={Row}>
                            <Col className="pl-5" sm="7">
                                <Form.Control as="select" onChange={(e) => setNewHubName(e.target.value)}>
                                    <option>Choose city for new relation</option>
                                    {
                                        getPossibleRelations(currentHub.name).map((city, index) =>
                                            <option key={index}>
                                                {city}
                                            </option>
                                        )
                                    }
                                </Form.Control>
                            </Col>
                            <Col className='text-center' sm="4">
                                <Button style={{ borderRadius: 30, width: 50 }} onClick={() => createRelation(props)}>
                                    <strong>+</strong>
                                </Button>
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='mr-3 ml-3' variant='secondary' onClick={() => setRelationFlag(false)} block>cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Hubs;
