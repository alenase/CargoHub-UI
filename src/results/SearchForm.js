import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import DropDownDeparture from '../main_page/DropDownDeparture';
import DropDownArrival from "../main_page/DropDownArrival";
import '../App.css';

function SearchForm(props) {



    let summ = 0;
    function countWeight(listOfBoxes) {
        return(
        listOfBoxes.map((box) => {
            summ = parseInt(summ) + parseInt(box.weight);
        }))
    }

    countWeight(props.listOfBoxes);


    return (
        <Form onSubmit={props.submitHandler} onChange={props.handleChange}>
            <Row className='my-3'>
                <Col>
                    <h5>Cargo Information:</h5>
                </Col>
            </Row>
            <Row className='my-3'>
                <Col>
                    <Form.Label>Quantity of boxes: {props.listOfBoxes.length}</Form.Label>

                </Col>
                <Col >
                    <Form.Label>Total weight: {summ} kg</Form.Label>
                </Col>
            </Row>
            <Row className='my-3'>
                <Col className='dropdown'>
                    <Form.Label>From:</Form.Label>
                    <DropDownDeparture handleSelectedDeparture={props.handleSelectedDeparture}
                        cities={props.citiesList}
                        departure={props.departure} />
                </Col>
                <Col className='dropdown'>
                    <Form.Label>To:</Form.Label>
                    <DropDownArrival handleSelectedArrival={props.handleSelectedArrival}
                        cities={props.citiesList}
                        arrival={props.arrival} />
                </Col>
                <Col>
                    <Button id="body-button" type="submit" onClick={props.submitHandler}>Update</Button>
                </Col>
            </Row>
            <Row className='my-3'>
                <Col >
                    {(props.ifFormIncorrect) && (<p>Please make sure that you have filled all details correctly</p>)}
                </Col>
            </Row>
        </Form>
    );
}

export default SearchForm;