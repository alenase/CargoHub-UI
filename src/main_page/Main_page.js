import React from 'react';
import axios from 'axios';
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Button, Container, Table } from "react-bootstrap";
import '../App.css';
import DropDownDeparture from './DropDownDeparture';
import DropDownArrival from "./DropDownArrival";
import { Redirect } from 'react-router-dom';
import history from '../history';
import MultipleCargo from './AddMultipleBoxes';
import ModalError from "../error/modalErrorFF.js";

class MainPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            departure: 'Departure',
            arrival: 'Arrival',
            weight: '',
            height: '',
            width: '',
            length: '',
            ifFormIncorrect: false,
            ifSameHubSelected: false,
            ifRedirect: false,
            citiesList: [],
            showFlag: false,
            listOfBoxes: [],
            ifShowModalError: false,
            errorMessage: '',
        }

        this.handleSelectedDeparture = this.handleSelectedDeparture.bind(this);
        this.handleSelectedArrival = this.handleSelectedArrival.bind(this);
        this.handleModal = this.handleModal.bind(this);
        this.handleListOfBoxes = this.handleListOfBoxes.bind(this);
        this.removeBox = this.removeBox.bind(this);
        this.ifError = this.ifError.bind(this);
    }

    async componentDidMount(setIfShowModalError, setErrorMessage) {
        await axios.get(`http://localhost:9041/cities`)
            .then(res => {
                this.setState({ citiesList: res.data })
            })
            .catch((error) => {
                this.setState({ errorMessage: error.response.data.message, ifShowModalError: true });
            });
    }

    ifError(props) {
        this.setState({ ifShowModalError: false });
    }

    handleListOfBoxes(receivedListOfBoxes) {
        this.setState({ listOfBoxes: this.state.listOfBoxes.concat(receivedListOfBoxes) })
    }

    removeBox(index) {
        let temp = this.state.listOfBoxes;
        temp.splice(index, 1);
        this.setState({ listOfBoxes: temp })
    }

    formValid = ({ departure, arrival, weight, length, width, height, listOfBoxes }) => {
        let valid = true;

        if (departure === arrival) {
            this.setState({ ifSameHubSelected: true })
            valid = false;
        } else {
            this.setState({ ifSameHubSelected: false })
        }

        if (departure === "Departure" || arrival === "Arrival") {
            valid = false;
        }

        if (weight.length >= 1 || height.length >= 1 || length.length >= 1 || width.length >= 1) {
            let box = {
                weight: weight,
                width: width,
                height: height,
                length: length,
            }
            this.setState({ listOfBoxes: this.state.listOfBoxes.concat(box) })
            valid = true;
            return valid;
        }

        if (parseInt(listOfBoxes.length) === 0) {
            valid = false;
        }

        return valid;
    }

    submitHandler = e => {
        this.setState({ ifFormIncorrect: false, ifSameHubSelected: false });

        if (this.formValid(this.state)) {
            this.setState({ ifRedirect: true });
        } else {
            this.setState({ ifFormIncorrect: true });
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
        e.preventDefault();
        this.setState({ ifFormIncorrect: false })
    }

    handleSelectedDeparture(e) {
        this.setState({ departure: e });
    }

    handleSelectedArrival(e) {
        this.setState({ arrival: e });
    }

    handleSwitch(arrival, departure) {
        const tempReplace = arrival;
        if (arrival === "Arrival" && departure === "Departure") {
        } else if (arrival === "Arrival") {
            this.setState({ arrival: departure, departure: "Departure" });
        } else if (departure === "Departure") {
            this.setState({ arrival: "Arrival", departure: arrival });
        } else
            this.setState({ arrival: this.state.departure, departure: tempReplace });
    }

    handleModal() {
        this.setState({ showFlag: !this.state.showFlag })
    }

    render() {
        if (this.state.ifRedirect) {
            //history.push(this.state);
            sessionStorage.setItem('departure', this.state.departure);
            sessionStorage.setItem('arrival', this.state.arrival);
            sessionStorage.setItem('listOfBoxes', JSON.stringify(this.state.listOfBoxes));

            return <Redirect to='/routes' />
        }

        return (
            <div>

                {(this.state.ifShowModalError) && <ModalError ifShow={this.state.ifShowModalError}
                    message={this.state.errorMessage}
                    ifError={this.ifError} />}

                <Row id="title-row">
                    <Col md={{ span: 3, offset: 5 }}>
                        <h2 className="title-text"> Search Routes </h2>
                    </Col>
                </Row>

                <Container id="load-body">
                    <Row style={{ width: '100%' }}>
                        <Col md={{ span: 8, offset: 2 }}>
                            <Form onSubmit={this.submitHandler} onChange={this.handleChange}>
                                <Row style={{ paddingTop: '15px' }}>
                                    <Col>
                                        <Form.Label>
                                            <h5 style={{ color: "black" }}>Location:</h5>
                                        </Form.Label>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={{ span: 5, offset: 0 }}>
                                        <DropDownDeparture handleSelectedDeparture={this.handleSelectedDeparture}
                                            cities={this.state.citiesList}
                                            departure={this.state.departure}
                                        >
                                        </DropDownDeparture>
                                    </Col>
                                    <Col md={{ span: 1 }} slyle={{ display: "flex", alignItems: "center" }}>
                                        <Button type="button"
                                            style={{ backgroundColor: '#ff8e09', borderColor: '#999999' }}
                                            onClick={() => {
                                                this.handleSwitch(this.state.arrival, this.state.departure)
                                            }}>
                                            &#8644;
                                        </Button>
                                    </Col>
                                    <Col md={{ span: 5, offset: 1 }}>
                                        <DropDownArrival handleSelectedArrival={this.handleSelectedArrival}
                                            cities={this.state.citiesList}
                                            arrival={this.state.arrival}
                                        >
                                        </DropDownArrival>
                                    </Col>
                                </Row>

                                <Row style={{ paddingTop: '15px' }}>
                                    <Col>
                                        <Form.Label>
                                            <h5 style={{ color: "black" }}>Cargo Information:</h5>
                                        </Form.Label>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Form.Label style={{ color: "black" }}>Weight (kg):</Form.Label>
                                        <Form.Control type="number" name="weight" placeholder="kg" onInput={(e) => {
                                            if (parseInt(e.target.value) < 22000) {
                                                e.target.value = Math.max(0, parseInt(e.target.value)).toString()
                                            } else {
                                                e.target.value = 22000
                                            }
                                        }} />
                                    </Col>
                                    <Col>
                                        <Form.Label style={{ color: "black" }}>Length (cm):</Form.Label>
                                        <Form.Control type="number" name="length" placeholder="Length" onInput={(e) => {
                                            if (parseInt(e.target.value) < 3000) {
                                                e.target.value = Math.max(0, parseInt(e.target.value)).toString()
                                            } else {
                                                e.target.value = 3000
                                            }
                                        }} />
                                    </Col>
                                    <Col>
                                        <Form.Label style={{ color: "black" }}>Width (cm):</Form.Label>
                                        <Form.Control type="number" name="width" placeholder="Width" onInput={(e) => {
                                            if (parseInt(e.target.value) < 3000) {
                                                e.target.value = Math.max(0, parseInt(e.target.value)).toString()
                                            } else {
                                                e.target.value = 3000
                                            }
                                        }} />
                                    </Col>
                                    <Col>
                                        <Form.Label style={{ color: "black" }}>Height (cm):</Form.Label>
                                        <Form.Control type="number" name="height" placeholder="Height" onInput={(e) => {
                                            if (parseInt(e.target.value) < 3000) {
                                                e.target.value = Math.max(0, parseInt(e.target.value)).toString()
                                            } else {
                                                e.target.value = 3000
                                            }
                                        }} />
                                    </Col>

                                </Row>
                                <Row>
                                    <Col style={{ paddingTop: "30px" }} md={{ span: 2, offset: 9 }}  >
                                        <Button style={{ minWidth: "150px", backgroundColor: "#ff8e09", borderColor: "#999999" }} onClick={() => { this.handleModal() }}>
                                            or add multiple boxes</Button>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        {(this.state.ifFormIncorrect) && (
                                            <p>Please make sure that you have filled all details correctly</p>)}
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={{ span: 3, offset: 5 }}>

                                        <Button id="body-button" onClick={this.submitHandler}>
                                            <h4>Search</h4>
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                            {(parseInt(this.state.listOfBoxes.length) !== 0) &&
                                <GenerateTable data={this.state} removeBox={this.removeBox} />}
                        </Col>
                    </Row>
                </Container>
                <MultipleCargo showFlag={this.state.showFlag} handleModal={this.handleModal}
                    handleListOfBoxes={this.handleListOfBoxes} />
            </div>
        );
    }
}

export default MainPage;

function GenerateTable(props) {
    return (
        <>
            <Row>
                <Col>
                    <h5>List of boxes</h5>
                </Col>
            </Row>
            <Row>
                <Table variant='dark' size='md' striped bordered hover>
                    <thead>
                        <tr>
                            <th className='text-center aling-middle'>#</th>
                            <th className='text-center aling-middle'>Weight</th>
                            <th className='text-center aling-middle'>Length</th>
                            <th className='text-center aling-middle'>Width</th>
                            <th className='text-center aling-middle'>Height</th>
                            <th className='text-center aling-middle'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.data.listOfBoxes.map((box, index) =>
                            <tr key={index}>
                                <td className='pl-3 align-middle'>{parseInt(index) + 1} </td>
                                <td className='pl-3 align-middle'>{box.weight} kg</td>
                                <td className='pl-4 align-middle'>{box.length} cm</td>
                                <td className='pl-4 align-middle'>{box.width} cm</td>
                                <td className='pl-4 align-middle'>{box.height} cm</td>
                                <td className='text-center'>
                                    <Button variant="" style={{ backgroundColor: "#ff8e09", borderColor: "#999999", color: "white" }} title="action" size='md'
                                        onClick={() => { props.removeBox(index) }}>
                                        Remove
                                    </Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Row>
        </ >);
}