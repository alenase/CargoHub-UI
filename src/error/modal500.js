import React, { Component, useState, useEffect } from 'react';
import '../main_page/main_page.css'
import './error.css';
import '../index.css';
import {Modal, Button} from 'react-bootstrap';

export default class Modal500 extends Component {
    state = { show: false };
  
    showModal = () => {
      this.setState({ show: true });
    };
  
    hideModal = () => {
      this.setState({ show: false });
    };

  render(){
       return(
            <div>
                 <Modal show={this.state.show} onHide={this.hideModal} animation='true' centered>
                   <Modal.Header  closeButton className = "bg-warning"> 
                        <Modal.Title >OOPS! Execution time-out</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>At the moment server can't execute your request. Try latter :-(</Modal.Body>
                    <Modal.Footer>
                       <Button variant="outline-warning"  block onClick={this.hideModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        ); 
    }
}
