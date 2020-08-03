import React from "react";
import { Tabs, Tab, Row, Col, Container } from 'react-bootstrap';
import Profile from "./Profile";
import './profile.css';
import Orders from "./Orders";
import { Redirect } from 'react-router-dom';
import BillingDetails from "../Billing/BillingDetails/BillingDetails";

export default class UsersTabsMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'profile',
            headerText: 'Profile'
        }
    }

    handleSelectedTab(key) {
        const tabMap = new Map([
            ['profile', 'Profile'],
            ['orders', 'Orders'],
            ['billing', 'Billing Details'],
        ]);
        this.setState({ selectedTab: key, headerText: tabMap.get(key) })
    }

    render() {

        if (this.props.data.ifLoggedIn === false) {
            return <Redirect to='/' />
        }

        return (
            <>
                <Row id="title-row">
                    <Col md={{ span: 5, offset: 5 }}>
                        <h2 className="title-text"> {this.state.headerText}  </h2>
                    </Col>
                </Row>
                <Container id="load-body" >
                    <Tabs className="nav nav-fill nav-tabs"
                          activeKey={this.state.selectedTab}
                          onSelect={(key) => { this.handleSelectedTab(key) }}  >
                        <Tab className="nav-item" eventKey="profile" title="Profile"  >
                            <Profile data={this.props.data} />
                        </Tab>
                        <Tab className="nav-item" eventKey="orders" title="Orders">
                            <Orders data={this.props.data} />
                        </Tab>
                        <Tab className="nav-item" eventKey="billing" title="Billing Details">
                            <BillingDetails data={this.props.data}/>
                        </Tab>
                    </Tabs>
                </Container>
            </>
        );
    }
}
