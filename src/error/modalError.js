import React, { Component } from 'react';
import '../main_page/main_page.css';
import './error.css';
import '../index.css';
import {Modal, Button} from 'react-bootstrap';

export default class ModalError extends Component {
    state = { 
      show: false,
      errorBody : 'At the moment server can\'t execute your request. Try latter :-(',
    };
  
    showModal1 = () => {
      this.setState({ show: true });
      if (this.props.error) {
        this.setState({
          errorBody : this.props.error,
        })
      }
    };
  
    hideModal = () => {
      this.setState({ show: false });
    };

    showModal = (error) => {
      this.setState({ show: true });
      if (error) {
        this.setState({
          errorBody : error,
        });
      }
    };
  
    hideModal = () => {
      this.setState({ show: false });
    };

  render(){
       return(
            <div>
                 <Modal show={this.state.show} onHide={this.hideModal} animation='true' centered>
                   <Modal.Header  closeButton style={{backgroundColor: "#ff8e09"}}> 
                        <Modal.Title >OOPS!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{this.state.errorBody}</Modal.Body>
                    <Modal.Footer>
                       <Button style={{backgroundColor: "#ff8e09"}}  block onClick={this.hideModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        ); 
    }
}
