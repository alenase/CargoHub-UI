import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Row, Col } from "react-bootstrap";

function MultipleCargo(props) {

    const [flag, setFlag] = useState(true);
    const [boxes, setBox] = useState([]);
    const [multiplicator, setMult] = useState(1);

    const [weight, setWeight] = useState(1);
    const [width, setWidth] = useState(30);
    const [height, setHeight] = useState(30);
    const [length, setLength] = useState(30);

    const ColoredLine = ({ color }) => (
        <hr
            style={{
                color: color,
                backgroundColor: color,
                height: 1
            }}
        />
    );

    function addNewBoxes(m) {
        let newBoxes = [];
        for (let i = 0; i < m; i++) {
            newBoxes[i] = {
                //working version
                // cargoWeight: weight,
                // cargoWidth: width,
                // cargoHeight: height,
                // cargoLength: length,


                weight: weight,
                width: width,
                height: height,
                length: length,
            }
        }
        setBox(boxes.concat(newBoxes));
    }

    function removeBox(index) {
        let newBoxes = [].concat(boxes);
        newBoxes.splice(index, 1);
        setBox(newBoxes);
    }

    useEffect(() => {
        if (flag) {
            setFlag(false);
        }
    },[flag]);
    return (
        <div>
            <Modal size="lg" show={props.showFlag} onHide={() => { }} animation='true'
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header>
                    <Modal.Title className="font-weight-bold ml-3">
                        List of cargo
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row}>
                            <Form.Label className='pl-4 font-italic' column sm="">
                                Add new box(es):
                            </Form.Label>
                        </Form.Group>
                        <Form.Group as={Row} className='mt-1 mr-7 ml-7 pt-1 pb-1'>
                            <Col>
                                <Form.Control type="number" size='sm' defaultValue={weight} onChange={(e) => setWeight(e.target.value)} />
                            </Col>
                            <Col>
                                <Form.Control type="number" size='sm' defaultValue={width} onChange={(e) => setWidth(e.target.value)} />
                            </Col>
                            <Col>
                                <Form.Control type="number" size='sm' defaultValue={height} onChange={(e) => setHeight(e.target.value)} />
                            </Col>
                            <Col>
                                <Form.Control type="number" size='sm' defaultValue={length} onChange={(e) => setLength(e.target.value)} />
                            </Col>
                            <Col md="align-right">
                                <Button style={{ minWidth: "80px" }} variant='outline-success' onClick={() => addNewBoxes(multiplicator)} size="sm"> Add box</Button>
                            </Col>
                            <Col>x</Col>
                            <Col>
                                <Form.Control type="number" size='sm' defaultValue={multiplicator} onChange={(e) => setMult(e.target.value)} />
                            </Col>
                        </Form.Group>
                        <ColoredLine color="orange" />
                        <Row>
                            <Form.Label className='text-center font-italic' column sm="2" style={{ color: "black" }}>Weight</Form.Label>
                            <Form.Label className='text-center font-italic' column sm="2" style={{ color: "black" }}>Width</Form.Label>
                            <Form.Label className='text-center font-italic' column sm="2" style={{ color: "black" }}>Height</Form.Label>
                            <Form.Label className='text-center font-italic' column sm="2" style={{ color: "black" }}>Length</Form.Label>
                        </Row>
                        {
                            boxes.map((box, index) =>
                                <Row key={index}>
                                    <Form.Label className='text-center' column sm="2" style={{ color: "black" }}>
                                        {
                                            box.weight
                                        }
                                    </Form.Label>
                                    <Form.Label className='text-center' column sm="2" style={{ color: "black" }}>
                                        {
                                            box.width
                                        }
                                    </Form.Label>
                                    <Form.Label className='text-center' column sm="2" style={{ color: "black" }}>
                                        {
                                            box.height
                                        }
                                    </Form.Label>
                                    <Form.Label className='text-center' column sm="2" style={{ color: "black" }}>
                                        {
                                            box.length
                                        }
                                    </Form.Label>
                                    <Form.Label className='text-center' column sm="4">
                                        <Button variant="outline-danger" size="sm" onClick={() => removeBox(index)}>
                                            Remove
                                        </Button>
                                    </Form.Label>
                                </Row>
                            )
                        }
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button id="body-button" className='col-md-5 mr-3' onClick={() => { props.handleListOfBoxes(boxes); setBox([]); props.handleModal() }}>
                        Add Boxes
                    </Button>
                    <Button id="body-button2" className='col-md-5 mr-4' onClick={() => { setBox([]); props.handleModal() }}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default MultipleCargo;