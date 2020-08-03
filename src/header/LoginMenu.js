import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import '../App.css';
import ModalError from "../error/modalError.js";

const formValid = ({ formErrors, email, password }) => {
    let valid = true;

    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
    });

    if (email.length < 1) { valid = false; return valid }
    if (password.length < 1) { valid = false; return valid }

    return valid;
}

const emailRegex = RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+[a-zA-Z0-9-]$/)

class LogInMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            formErrors: {
                email: "",
                password: ""
            },
            ifFieldsEmpty: false,
            ifLoginDetailsIncorrect: false,
        }
    }

    handleChange = (e) => {
        e.preventDefault();
        this.setState({ ifFieldsEmpty: false })
        this.setState({ ifLoginDetailsIncorrect: false })
        const { name, value } = e.target;
        let formErrors = this.state.formErrors;


        switch (name) {
            case 'email':
                formErrors.email =
                    emailRegex.test(value)
                        ? ''
                        : 'Please type correct email';
                this.setState({ ifShowFormErrors: false })
                break;
            case 'password':
                formErrors.password = value.length < 5
                    ? 'Password should be at least 5 characters'
                    : "";
                this.setState({ ifShowFormErrors: false })
                break;
            default:
                break;
        }
        this.setState({ formErrors, [name]: value })

    }

    submitHandler = e => {
        const url = 'http://localhost:8041/login'
        if (this.state.email.length < 1) { this.setState({ ifFieldsEmpty: true }) }
        if (this.state.password.length < 1) { this.setState({ ifFieldsEmpty: true }) }
        e.preventDefault()

        const data = {
            email: this.state.email,
            password: this.state.password
        }

        if (formValid(this.state)) {
           axios.post(url, data)
                .then(response => {
                    this.props.handleToken(response.data);
                    this.props.disableModal();
                })
                .catch(error => {
                    this.refs.modError.showModal(error.response.data.message);
                });
        } else {
            this.setState({ ifShowFormErrors: true })
        }
    }

    render() {
        const email = this.email;
        const { formErrors } = this.state;
        return (
            <Modal
                show={this.props.ifShowModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <ModalError ref='modError'/>
                <Container id="modal-window">
                    <Form onSubmit={this.submitHandler}>
                        <Row id="space-between-rows">
                            <Col md={{ offset: 5 }}>
                                {(this.state.ifLoginDetailsIncorrect) && (<span className="Span">Email or password are incorrect</span>)}
                            </Col>
                        </Row>

                        <Row >
                            <Col md={{ span: 1, offset: 3 }}>
                                <p  >    Login: </p>
                            </Col>
                            <Col md={{ span: 0, offset: 1 }}>
                                <Form.Control value={email} type="email" className="Input" name="email" placeholder="Type Email"
                                    onChange={this.handleChange}>
                                </Form.Control>
                            </Col>
                        </Row>

                        <Row id="space-between-rows">
                            <Col md={{ offset: 5 }}>
                                {this.state.ifShowFormErrors && (<span className="Span">{formErrors.email}</span>)}
                            </Col>
                        </Row>

                        <Row >
                            <Col md={{ span: 1, offset: 3 }}>
                                <p >    Password:      </p>
                            </Col>
                            <Col md={{ span: 0, offset: 1 }}>
                                <Form.Control className="Input" type="password" name="password" placeholder="Type Password"
                                    onChange={this.handleChange} >
                                </Form.Control>
                            </Col>
                        </Row>

                        <Row id="space-between-rows">
                            <Col md={{ offset: 5 }}>
                                {this.state.ifShowFormErrors && (<span className="Span">{formErrors.password}</span>)}
                            </Col>
                        </Row>

                        <Row id="space-between-rows">
                            <Col md={{ offset: 5 }}>
                                {(this.state.ifFieldsEmpty) && (<span className="Span">Please make sure that you have filled all fields</span>)}
                            </Col>
                        </Row>

                        <Row >
                            <Col md={{ offset: 3 }}>
                                <Button id="body-button" variant="primary" type="submit" onClick={this.submitHandler} >
                                    Login
                                </Button>
                            </Col>
                            <Col >
                                <Button id="body-button" type="reset" variant="secondary" onClick={this.props.disableModal}   >
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </Modal>
        )
    }
}

export default LogInMenu;

