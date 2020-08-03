import React from 'react';
import '../App.css';
import { Row, Col, Container, Button, Image } from 'react-bootstrap';
import { Link } from "react-router-dom";
import img1 from "./files/img1.jpg";
import png1 from "./files/inst-1.png";
import png2 from "./files/inst-2.png";
import png3 from "./files/inst-3.png";
import png4 from "./files/inst-4.png";

export default function AboutCompany() {
    return (
        <div>

            <Row id="title-row">
                <Col md={{ span: 3, offset: 5 }}>
                    <h2 className="title-text"> About Company </h2>
                </Col>
            </Row>

            <Container id="load-body" style={{ paddingBottom: "35px" }}>
                <Row id="space-between-rows">
                    <Col>
                        <Image src={img1} fluid />
                    </Col>
                </Row>

                <Row id="space-between-rows">
                    <Col md={{ span: 3, offset: 5 }} > <h4>Our History</h4></Col>
                </Row>
                <Row>
                    <Col md={{ span: 10, offset: 1 }}>
                        <p>Today Cargo Hub offers its customers high quality services, the most loyal prices, while retaining all the benefits of the operator's 3PL logistics service.
                    Our customers receive cost optimization and time savings for logistics processes with us. <br /> We are grateful to each Client for their trust and we are proud to cooperate with anyone who trusts us with their goods!</p>
                    </Col>
                </Row>

                <Row id="space-between-rows">
                    <Col md={{ span: 3, offset: 5 }} > <h4>How do we work?</h4></Col>
                </Row>
                <Row style={{ padding: "0 10%" }} id="space-between-rows">
                    <Col><Image src={png1} fluid /> <h6 style={{ paddingTop: "1rem" }}>Select destinations</h6></Col>
                    <Col><Image src={png2} fluid /> <h6 style={{ paddingTop: "1rem" }}>Pass the registration</h6></Col>
                    <Col><Image src={png3} fluid /> <h6 style={{ paddingTop: "1rem" }}>Make the payment</h6></Col>
                    <Col><Image src={png4} fluid /> <h6 style={{ paddingTop: "1rem" }}>Receive your parcle</h6></Col>
                </Row>

                <Row style={{ margin: "35px" }}>
                    <Col md={{ span: 4, offset: 5 }} >
                        <Button style={{ backgroundColor: "#ff8e09", border: "none" }}>
                            <Link to="/" style={{ textDecoration: "none", color: "white" }}>
                                <h6>  Return to Main Page</h6>
                            </Link>
                        </Button>
                    </Col>
                </Row>

            </Container>
        </div>
    );
}