import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap'
import axios from 'axios'
import ModalError from "../error/modalError.js";
import '../App.css';

const formValid = ({ formErrors, email, password }) => {
    let valid = true;

    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
    });
    if (email.length < 1) { valid = false; return valid }
    
    return valid;
}

const emailRegex = RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+[a-zA-Z0-9-]$/)
const nameRegex = RegExp(/^[a-zA-Z]{2,20}$/)
const phoneRegex = RegExp(/^[0-9 -()]{11,20}$/)

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            password: '',
            passwordRepeat: '',

            formErrors: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                address: '',
                password: '',
                passwordRepeat: '',
            },
            ifFieldsEmpty: false,
            ifLoginDetailsIncorrect: false,
        }
    }

    async componentDidMount(props) {

        axios.get(`http://localhost:8041/user/profile/${this.props.data.userId}`, {
            data: {},
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer_${this.props.data.token}`
            }
        }).then(result => {
                this.setState({
                    firstName: result.data.firstName,
                    lastName: result.data.lastName,
                    email: result.data.email,
                    address: result.data.address,
                    phone: result.data.phoneNumber,
                })
            }).catch(error => this.refs.modError.showModal(error.response.data.message));
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

            case 'passwordRepeat':
                formErrors.passwordRepeat = (this.state.password !== value)
                    ? 'Please make sure that you have typed correct password'
                    : "";
                this.setState({ ifShowFormErrors: false })
                break;
            case 'firstName':
                formErrors.firstName =
                    nameRegex.test(value)
                        ? ''
                        : 'Please type correct name';
                this.setState({ ifShowFormErrors: false })
                break;
            case 'lastName':
                formErrors.lastName =
                    nameRegex.test(value)
                        ? ''
                        : 'Please type correct last name';
                this.setState({ ifShowFormErrors: false })
                break;
            case 'phone':
                formErrors.phone =
                    phoneRegex.test(value)
                        ? ''
                        : 'Please type correct phone number';
                this.setState({ ifShowFormErrors: false })
                break;
            default:
                break;
        }
        this.setState({ formErrors, [name]: value })
    }

    submitHandler = (e, props) => {
        const urlUpdateUser = `http://localhost:8041/user/profile/${this.props.data.userId}`;
        const urlUpdatePassword = `http://localhost:8041/user/profile/reset-password/${this.props.data.userId}`;

        if (this.state.email.length < 1) { this.setState({ ifFieldsEmpty: true }) }
        if (this.state.firstName.length < 1) { this.setState({ ifFieldsEmpty: true }) }
        if (this.state.lastName.length < 1) { this.setState({ ifFieldsEmpty: true }) }
        if (this.state.address.length < 1) { this.setState({ ifFieldsEmpty: true }) }
        if (this.state.phone.length < 1) { this.setState({ ifFieldsEmpty: true }) }
        e.preventDefault()

        if (formValid(this.state)) {
            axios.put(urlUpdateUser, {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email,
                address: this.state.address,
                phoneNumber: this.state.phone
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer_${this.props.data.token}`,
                    'Accept': 'application/json'
                }
            }).then(response => {                   
            }).catch(error => {
                    this.refs.modError.showModal(error.response.data.message);
                });

            if (this.state.password.length > 4 && this.state.password === this.state.passwordRepeat) {
                axios.put(urlUpdatePassword, {
                    password: this.state.password
                }, {
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Authorization': `Bearer_${this.props.data.token}`
                    }
                })
                    .then(response => {
                        console.log(response);
                    });
            }

        } else {
            this.setState({ ifShowFormErrors: true })
        }
    }

    render() {

        const { formErrors } = this.state;

        return (
            <Form onSubmit={this.submitHandler}>
                <ModalError ref='modError' />

                <Row id="space-between-rows">
                    <Col md={{ offset: 5 }}>
                        {(this.state.ifLoginDetailsIncorrect) && (<span className="Span">Email or password are incorrect</span>)}
                    </Col>
                </Row>

                <Row >
                    <Col md={{ span: 2, offset: 3 }}>
                        <p  >    First Name: </p>
                    </Col>
                    <Col md={{ span: 0, offset: 0 }}>
                        <Form.Control value={this.state.firstName} type="text" className="Input" name="firstName"

                            onChange={this.handleChange}>
                        </Form.Control>
                    </Col>
                </Row>

                <Row id="space-between-rows">
                    <Col md={{ offset: 5 }}>
                        {this.state.ifShowFormErrors && (<span className="Span">{formErrors.firstName}</span>)}
                    </Col>
                </Row>

                <Row >
                    <Col md={{ span: 2, offset: 3 }}>
                        <p  >    Last Name: </p>
                    </Col>
                    <Col md={{ span: 0, offset: 0 }}>
                        <Form.Control value={this.state.lastName} type="text" className="Input" name="lastName" placeholder={'replace me'}
                            onChange={this.handleChange}>
                        </Form.Control>
                    </Col>
                </Row>

                <Row id="space-between-rows">
                    <Col md={{ offset: 5 }}>
                        {this.state.ifShowFormErrors && (<span className="Span">{formErrors.lastName}</span>)}
                    </Col>
                </Row>

                <Row >
                    <Col md={{ span: 2, offset: 3 }}>
                        <p  >    Email: </p>
                    </Col>
                    <Col md={{ span: 0, offset: 0 }}>
                        <Form.Control value={this.state.email} type="email" className="Input" name="email" placeholder={'replace me'}
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
                    <Col md={{ span: 2, offset: 3 }}>
                        <p  >    Phone: </p>
                    </Col>
                    <Col md={{ span: 0, offset: 0 }}>
                        <Form.Control value={this.state.phone} type="text" className="Input" name="phone" placeholder={'replace me'}
                            onChange={this.handleChange}>
                        </Form.Control>
                    </Col>
                </Row>

                <Row id="space-between-rows">
                    <Col md={{ offset: 5 }}>
                        {this.state.ifShowFormErrors && (<span className="Span">{formErrors.phone}</span>)}
                    </Col>
                </Row>

                <Row >
                    <Col md={{ span: 2, offset: 3 }}>
                        <p  >    Address: </p>
                    </Col>
                    <Col md={{ span: 0, offset: 0 }}>
                        <Form.Control value={this.state.address} type="text" className="Input" name="address" placeholder={'replace me'}
                            onChange={this.handleChange}>
                        </Form.Control>
                    </Col>
                </Row>

                <Row id="space-between-rows">
                    <Col md={{ offset: 5 }}>
                        {this.state.ifShowFormErrors && (<span className="Span">{formErrors.address}</span>)}
                    </Col>
                </Row>

                <Row>
                    <Col md={{ offset: 5 }}>
                        <p> Reset Password</p>
                    </Col>
                </Row>

                <Row >
                    <Col md={{ span: 2, offset: 3 }}>
                        <p >    Password:      </p>
                    </Col>
                    <Col md={{ span: 0, offset: 0 }}>
                        <Form.Control className="Input" type="password" name="password" placeholder="*********"
                            onChange={this.handleChange} >
                        </Form.Control>
                    </Col>
                </Row>

                <Row id="space-between-rows">
                    <Col md={{ offset: 5 }}>
                        {this.state.ifShowFormErrors && (<span className="Span">{formErrors.password}</span>)}
                    </Col>
                </Row>

                <Row >
                    <Col md={{ span: 2, offset: 3 }}>
                        <p >    Repeat Password:      </p>
                    </Col>
                    <Col md={{ span: 0, offset: 0 }}>
                        <Form.Control className="Input" type="password" name="passwordRepeat" placeholder="*********"
                            onChange={this.handleChange} >
                        </Form.Control>
                    </Col>
                </Row>

                <Row id="space-between-rows">
                    <Col md={{ offset: 5 }}>
                        {this.state.ifShowFormErrors && (<span className="Span">{formErrors.passwordRepeat}</span>)}
                    </Col>
                </Row>

                <Row id="space-between-rows">
                    <Col md={{ offset: 5 }}>
                        {(this.state.ifFieldsEmpty) && (<span className="Span">Please make sure that you have filled all fields</span>)}
                    </Col>
                </Row>

                <Row >
                    <Col md={{ offset: 5 }}>
                        <Button id="body-button" variant="primary" type="submit" onClick={this.submitHandler} >
                            Update Details
                                </Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}

export default Profile;