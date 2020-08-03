import React, { useEffect, useState } from 'react';
import Card from "./Card/Card";
import s from './BillingDetails.module.css'
import { Modal,  Form } from "react-bootstrap";
import axios from 'axios'
import ModalError from "../../error/modalErrorFF.js";

const cscRegEx = /\b\d{3}\b/;
const cardRegEx = /\b\d{16}\b/;

const url = "localhost:8041";

const BillingDetails = (props) => {

    const userId = props.data.userId
    const token = props.data.token
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let [cardNumber, setCardNumber] = useState('')
    let [nameOnCard, setnameOnCard] = useState('')
    let [csc, setCsc] = useState('')
    let [expirationMonth, setExpirationMonth] = useState('')
    let [expirationYear, setExpirationYear] = useState('')
    let [billingAddress, setBillingAddress] = useState('')
    let [errorCardNumber, setErrorCardNumber] = useState('')
    let [errorCardName, setErrorCardName] = useState('')
    let [errorCsc, setErrorCsc] = useState('')
    let [errorExpirationMonth, setErrorExpirationMonth] = useState('')
    let [errorExpirationYear, setErrorExpirationYear] = useState('')
    let [errorBillingAddress, setErrorBillingAddress] = useState('')
    let [flag, setFlag] = useState(true);
    let [ifShowModalError, setIfShowModalError] = useState(false);
    let [errorMessage, setErrorMessage] = useState('');

    function ifError() {
        let temp = !ifShowModalError;
        setIfShowModalError(temp);
    }

    let [cards, setCards] = useState([])

    const getCards = () => {
        axios({
            'method': 'GET',
            'url': `http://${url}/user/${userId}/billing-details/`,
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer_${token}`
            },
        }).then(response => {
            initialization(response.data);
        });
    }

    useEffect(() => {
        if (flag) {
            getCards()
            setFlag(false);
        }
    }, [flag, getCards]);

    const initialization = (data) => {
        setCards(data)
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
                setErrorBillingAddress("Invalid fields")
            }
        })
        return valid;
    }

    const refreshCardData = () => {
        setnameOnCard('')
        setCardNumber('')
        setCsc('')
        setErrorBillingAddress('')
        setnameOnCard('')
        setErrorCardName('')
        setErrorCardNumber('')
        setErrorCsc('')
        setErrorExpirationMonth('')
        setErrorExpirationYear('')
        setErrorBillingAddress('')
    }

    const sendCard = () => {
        axios.post(`http://${url}/user/${userId}/billing-details`, {
            cardNumber: cardNumber,
            nameOnCard: nameOnCard,
            csc: csc,
            expirationMonth: expirationMonth,
            expirationYear: expirationYear,
            billingAddress: billingAddress
        },
            {
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer_${token}`
                }
            }).then(response => {
                setFlag(true)
            }).catch((error) => {
                setIfShowModalError(true);
                setErrorMessage(error.response.data.message);
            });
    }

    const deleteCard = (id) => {
        axios.delete(`http://${url}/user/${userId}/billing-details/${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer_${token}`
                },
                data: {}
            }).then(response => {

            }).catch((error) => {
                setIfShowModalError(true);
                setErrorMessage(error.response.data.message);
            });
        setFlag(true)
    }

    const createCardAndAddToData = () => {
        sendCard()
        refreshCardData();
    }

    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let error;
        switch (name) {
            case "cardNumber":
                setCardNumber(value);
                error = cardRegEx.test(value)
                    ? ''
                    : "Not valid card number"
                setErrorCardNumber(error);
                break;
            case "nameOnCard":
                setnameOnCard(value);
                error = value.length > 3
                    ? ''
                    : "Not valid card name"
                setErrorCardName(error)
                break;
            case "csc":
                setCsc(value);
                error = cscRegEx.test(value)
                    ? ''
                    : "Not valid csc"
                setErrorCsc(error)
                break;
            case "expirationDate":
                setExpirationMonth(value.slice(5, 7))
                setExpirationYear(value.slice(2, value.length - 6))
                break;
            case "billingAddress":
                setBillingAddress(value);
                error = value.length > 6
                    ? ''
                    : "Not valid billing address"
                setErrorBillingAddress(error)
                break;
        }
    }

    const handleSubmit = () => {
        if (formValid({
            errorCardName,
            errorCardNumber,
            errorCsc,
            errorBillingAddress,
            errorExpirationMonth,
            errorExpirationYear,
        },
            {
                nameOnCard,
                cardNumber,
                csc,
                billingAddress,
                expirationMonth,
                expirationYear
            })) {
            createCardAndAddToData();
            handleClose()

        }
        setFlag(true);
    }

    return (
        <div>
            {(ifShowModalError) && <ModalError ifShow={ifShowModalError}
                message={errorMessage}
                ifError={ifError} />}
            <div>
                <p className={s.text}>
                    Please note that at least 1 card is required ??
                </p>
                <div className={s.container}>
                    <div>
                        <>
                            <button className={s.button} onClick={handleShow}>
                                Add new card
                            </button>
                            <Form onSubmit={handleSubmit} onChange={handleChange}>
                                <Modal show={show} size="lg"
                                    aria-labelledby="contained-modal-title-vcenter"
                                    centered>
                                    <Modal.Header>
                                        <Modal.Title>Creating new card</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <div>
                                            <div className={s.modal_container}>
                                                <span className={s.before_input_text}>Name of card:</span>
                                                <Form.Control
                                                    name="nameOnCard"
                                                    className={s.input_style} type="text"
                                                    placeholder="Enter name of credit card"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            {errorCardName.length > 0 && (
                                                <div>
                                                    <div className={s.errorMessages}>{errorCardName}</div>
                                                </div>
                                            )}
                                            <div className={s.modal_container}>
                                                <span className={s.before_input_text}>Card number:</span>
                                                <Form.Control
                                                    name="cardNumber"
                                                    className={s.input_style} type="text"
                                                    placeholder="Enter numb of credit card"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div>
                                                {errorCardNumber.length > 0 && (
                                                    <div className={s.errorMessages}>{errorCardNumber}</div>
                                                )}
                                            </div>
                                            <div className={s.modal_container}>
                                                <span className={s.before_input_text}>CSC:</span>
                                                <Form.Control
                                                    name="csc"
                                                    className={s.input_style} type="text"
                                                    placeholder="Enter CSC of card"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div>
                                                {errorCsc.length > 0 && (
                                                    <div className={s.errorMessages}>{errorCsc}</div>
                                                )}
                                            </div>
                                            <div className={s.modal_container}>
                                                <span className={s.before_input_text}>Expiration date:</span>
                                                <Form.Control
                                                    name="expirationDate"
                                                    className={s.input_style} type="date"
                                                    placeholder="Enter date of credit card"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className={s.modal_container}>
                                                <span className={s.before_input_text}>Billing address:</span>
                                                <Form.Control
                                                    name="billingAddress"
                                                    className={s.input_style} type="text"
                                                    placeholder="Enter billing address"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div>
                                                {errorBillingAddress.length > 0 && (
                                                    <div className={s.errorMessages}>{errorBillingAddress}</div>
                                                )}
                                            </div>
                                        </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <button className={s.button} onClick={handleClose}>
                                            Close
                                        </button>
                                        <button className={s.button} onClick={handleSubmit}>
                                            Create
                                        </button>
                                    </Modal.Footer>
                                </Modal>
                            </Form>
                        </>
                    </div>
                </div>
            </div>
            <div>
                {
                    cards.map((card, index) => {
                        return <Card data={card} key={index} userId={userId} del={deleteCard} />
                    })
                }
            </div>
        </div>
    )
}

export default BillingDetails;