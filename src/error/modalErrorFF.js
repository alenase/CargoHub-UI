import React from 'react';
import '../main_page/main_page.css';
import './error.css';
import '../index.css';
import { Modal, Button } from 'react-bootstrap';

export default function ModalError(props) {
    let responce = '';
    if (props.message !== undefined) {
        responce = props.message;
    } else {
        responce = 'At the moment server can\'t execute your request. Try latter :-('
    }

    return (
        <div>
            <Modal show={props.ifShow} animation='true' centered>
                <Modal.Header  style={{ backgroundColor: "#ff8e09" }}>
                    <Modal.Title >OOPS!</Modal.Title>
                </Modal.Header>
                <Modal.Body>{responce}</Modal.Body>
                <Modal.Footer>
                    <Button style={{ backgroundColor: "#ff8e09" }} block onClick={() => { props.ifError() }}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

