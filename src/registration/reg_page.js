import React from "react";
import "./reg_page.css"
import Billing from "../Billing/billing";
import ReactDOM from 'react-dom';
import {Row, Col, Form, Container, Button} from 'react-bootstrap';

const emailRegex = RegExp(
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+[a-zA-Z0-9-]$/);
const phoneRegex = RegExp(
    /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/);

const formValid = ({formErrors, ...rest}) => {
    let valid = true;

    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
    });

    Object.values(rest).forEach(val => {
        val === null && (valid = false);
    });

    return valid;
};

class RegPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: null,
            lastName: null,
            email: null,
            password: null,
            repeatPassword: null,
            phoneNumber: null,
            validation: false,
            formErrors: {
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                repeatPassword: "",
                phoneNumber: "",
            }
        }
    }

    handleSubmit = e => {
        e.preventDefault();

        if (formValid(this.state)) {
            ReactDOM.render(<Billing data={this.state} token={this.context}/>,
                document.getElementById('root'));
        }
    };

    handleChange = e => {
        e.preventDefault();

        const {name, value} = e.target;

        let formErrors = {...this.state.formErrors};

        switch (name) {
            case "firstName":
                formErrors.firstName =
                    value.length < 3 ? "minimum 3 characters required" : "";
                break;
            case "lastName":
                formErrors.lastName =
                    value.length < 3 ? "minimum 3 characters required" : "";
                break;
            case "email":
                formErrors.email = emailRegex.test(value)
                    ? ""
                    : "invalid email address";
                break;
            case "password":
                formErrors.password =
                    value.length < 5 ? "minimum 5 characters required" : "";
                break;
            case "repeatPassword":
                formErrors.repeatPassword = this.state.password === value ? "" : "password doesnt match";
                break;
            case "phone":
                formErrors.phone = phoneRegex.test(value)
                    ? ""
                    : "invalid phone number";
                break;
            default:
                break;
        }

        this.setState({formErrors, [name]: value});
    };

    render() {
        const {formErrors} = this.state;

        return (
            <div>

                <Row id="title-row">
                    <Col md={{span: 3, offset: 5}}>
                        <h2 className="title-text"> Registration </h2>
                    </Col>
                </Row>

                <Container id="load-body">
                    <Row>
                        <Col md={{span: 5, offset: 3}}>
                            <Form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                                <Row>
                                    <Col>
                                        <Form.Label column sm={8}>
                                            First Name
                                        </Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Label column sm={8}>
                                            Last Name
                                        </Form.Label>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Control
                                            type="text"
                                            placeholder="First Name"
                                            name="firstName"
                                            onChange={this.handleChange}/>
                                        {formErrors.firstName.length > 0 && (
                                            <span className="errorMessage">{formErrors.firstName}</span>)}
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            placeholder="Last Name"
                                            type="text"
                                            name="lastName"
                                            onChange={this.handleChange}
                                        />
                                        {formErrors.lastName.length > 0 && (
                                            <span className="errorMessage">{formErrors.lastName}</span>
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Label column sm={8}>
                                            Email
                                        </Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Label column sm={8}>
                                            Phone
                                        </Form.Label>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Control
                                            placeholder="Email"
                                            type="email"
                                            name="email"
                                            onChange={this.handleChange}
                                        />
                                        {formErrors.email.length > 0 && (
                                            <span className="errorMessage">{formErrors.email}</span>
                                        )}
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            placeholder="Phone number"
                                            type="phone"
                                            name="phoneNumber"
                                            onChange={this.handleChange}
                                        />
                                        {formErrors.phoneNumber.length > 0 && (
                                            <span className="errorMessage">{formErrors.phoneNumber}</span>
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Label column sm={8}>
                                            Password
                                        </Form.Label>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={{span: 6, offset: 0}}>
                                        <Form.Control
                                            placeholder="Password"
                                            type="password"
                                            name="password"
                                            onChange={this.handleChange}
                                        />
                                        {formErrors.password.length > 0 && (
                                            <span className="errorMessage">{formErrors.password}</span>
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Label column sm={8}>
                                            Repeat password
                                        </Form.Label>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={{span: 6, offset: 0}}>
                                        <Form.Control
                                            placeholder="Repeat password"
                                            type="password"
                                            name="repeatPassword"
                                            onChange={this.handleChange}
                                        />
                                        {formErrors.repeatPassword.length > 0 && (
                                            <span className="errorMessage">{formErrors.repeatPassword}</span>
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={{span: 3, offset: 5}}>
                                        <Button id="body-button" type="submit"
                                                onClick={this.handleSubmit}> Billings </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default RegPage;