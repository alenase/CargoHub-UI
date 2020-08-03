import React, {useState} from 'react'
import s from "./payment.module.css";
import {Dropdown, Form, Modal, Table} from "react-bootstrap";
import axios from "axios";
import {Route, Link, Redirect} from 'react-router-dom';
import Profile from "../user_profile/Profile";


const cscRegEx = /\b\d{3}\b/;

function GenerateDropDownRows(cards) {

    const departureList = cards.cards.map((c, index) =>
        <Dropdown.Item key={index} eventKey={c.id} className={s.drop_item}>
            <div className={s.drop_menu_item}>
                <div>
                    <span className={s.span}>
                        Card Number:{c.cardNumber}
                    </span>
                </div>
                <div>
                    <span className={s.span}>
                        Card Name:{c.nameOnCard}
                    </span>
                </div>
            </div>
        </Dropdown.Item>
    );

    return (
        <Dropdown.Menu className={s.drop_items}>
            {departureList}
        </Dropdown.Menu>
    );

}

function getTable(boxes) {
    const departureList = boxes.map((c, index) =>
        <tr key={index}>
            <td>{c.weight}</td>
            <td>{c.width}</td>
            <td>{c.height}</td>
            <td>{c.length}</td>
        </tr>
    );

    return (
        <Table striped bordered hover variant="dark">
            <thead>
            <tr>
                <th>Weight</th>
                <th>Width</th>
                <th>Height</th>
                <th>Length</th>
            </tr>
            </thead>
            <tbody>
            {departureList}
            </tbody>
        </Table>
    );

}

function Suggestion(props) {

    const departure = props.departure
    const arrival = props.arrival
    const boxes = props.boxes

    const userDetails = props.dataOfUser;

    const trackingId = props.id
    const deliveryDate = props.deliveryDate
    const price = props.price;
    const isLoggedIn = userDetails.ifLoggedIn;
    const [ifButtonClick, setIfButtonClick] = useState(false)
    const [ifConfirm, setIfConfirm] = useState(false)

    const handleClose = () => {
        setShow(false)
        refreshData()
    }

    function handleShow() {
        if (isLoggedIn) {
            getCards();
            setShow(true)
        } else {
            // return <Redirect to='/registration'/>
            setIfButtonClick(true);
        }
    }


    const [nameOnCard, setNameOnCard] = useState("Choose card")
    const [show, setShow] = useState(false);
    const [cards, setCards] = useState([{}])
    const [csc, setCsc] = useState('')
    const [errorCsc, setErrorCsc] = useState('')
    const [cardId, setCardId] = useState();

    const refreshData = () => {
        setCards([{}])
        setNameOnCard("Choose card")
        setErrorCsc('');
        setCsc('')
    }
    const getCards = () => {
        axios({
            'method': 'GET',
            'url': `http://localhost:8041/user/${userDetails.userId}/billing-details/`,
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer_${userDetails.token}`
            },
        }).then(response => {
            initialization(response.data);
        })
    }

    const initialization = (data) => {
        setCards(data)
    }

    function handleSubmit() {
        if (formValid({
                errorCsc,
            },
            {
                csc,
            })) {
            send()
        }
    }

    function send() {
        props.send(trackingId, deliveryDate, price, props.hubs, departure, arrival,boxes)
        setIfConfirm(true)
        handleClose();
    }

    const formValid = (errors, data) => {
        let valid = true;
        Object.values(errors).forEach(value => {
            if (value.length > 0) {
                valid = false;
            }
        })
        Object.values(data).forEach(value => {
            if (!value.length > 0) {
                valid = false;
                setErrorCsc("Invalid field")
            }
        })
        if (String(nameOnCard) === String("Choose card")) {
            setErrorCsc("Please choose card")
            valid = false
        }
        return valid;
    }

    const handleChange = (e) => {
        e.preventDefault();
        const {name, value} = e.target;
        let error;
        switch (name) {
            case "csc":
                setCsc(value);
                error = cscRegEx.test(value)
                    ? ''
                    : "Not valid csc"
                setErrorCsc(error)
                break;
        }
    }

    const handleSelect = (e) => {
        const card = getCardFromArray(e);
        setCardId(card.id)
        setNameOnCard(card.nameOnCard);
    }

    function getCardFromArray(id) {
        let dat;
        cards.forEach(
            (card) => {
                if (String(card.id) === (id)) {
                    dat = card;
                    return card;
                }
            }
        )
        return dat;
    }

    return (
        <li key={props.id} className='suggestion-card'>
            {(isLoggedIn !== "true" && ifButtonClick === true) && <Redirect to='/registration'/>}
            {(String(isLoggedIn) === String("true") && ifConfirm === true) && <Redirect to='/profile'/>}
            <div>
                <p>Price: {props.price}</p>
                <p>
                    Delivery Date:{' '}
                    {new Date(props.deliveryDate).toLocaleDateString()}
                </p>
            </div>
            <div>
                <button className='btn btn-dark' onClick={handleShow}>
                    Pay Now
                </button>
                <div>
                    <>
                        <Form
                            // onSubmit={handleSubmit} onChange={handleChange}
                        >
                            <Modal show={show} size="lg"
                                   aria-labelledby="contained-modal-title-vcenter"
                                   centered>
                                <Modal.Header>
                                    <Modal.Title>Confirm the order</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div>
                                        <div className={s.modal_container}>
                                            <span className={s.before_input_text}>Price:{price}</span>
                                        </div>
                                        <div className={s.modal_container}>
                                            <span className={s.before_input_text}>Delivery date:{deliveryDate}</span>
                                        </div>
                                        <div>
                                            <Dropdown onSelect={handleSelect}>
                                                <Dropdown.Toggle id={s.drop_down_main_component}>
                                                    {nameOnCard}
                                                </Dropdown.Toggle>
                                                <GenerateDropDownRows cards={cards}/>
                                            </Dropdown>
                                        </div>
                                        <div>
                                            <h3 className={s.cargo_info}>Cargo Info</h3>
                                            <div className={s.modal_container}>
                                                {getTable(boxes)}
                                            </div>
                                        </div>

                                        <div className={s.modal_container}>
                                            <span className={s.before_input_text}>Csc:</span>
                                            <Form.Control
                                                name="csc"
                                                className={s.input_style} type="text"
                                                placeholder="Enter name of credit card"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        {errorCsc.length > 0 && (
                                            <div>
                                                <div className={s.errorMessages}>{errorCsc}</div>
                                            </div>
                                        )}
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <button className={s.button} id={s.close} onClick={handleClose}>
                                        Close
                                    </button>
                                    <button className={s.button} id={s.confirm} onClick={handleSubmit}>
                                        Confirm
                                    </button>
                                </Modal.Footer>
                            </Modal>
                        </Form>
                    </>
                </div>
            </div>
        </li>
    )
}

export default Suggestion
