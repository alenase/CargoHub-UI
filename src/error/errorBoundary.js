import React, { Component, useRef, createRef } from 'react';
import '../main_page/main_page.css';
import './error.css';
import '../index.css';
import Header from '../header/Header';
import {Button} from 'react-bootstrap';
import ModalError from './modalError';
import Modal401 from './modal401';


export class TestBoundary extends Component {
   constructor(props) {
       super(props);
       this.state = {};
   }
   accessChild1 = () => {
       this.refs.child1.showModal();
   }
   accessChild2 = () => {
      this.refs.child2.showModal(); 
   }
   render() {
        return(
            <div>
                <Header/>
                <div className="Title"> <h1 >Bootstrap Modal in React</h1> </div>
                <div className="Main-background">
                 <Button variant="warning" onClick ={
                    this.accessChild1
                }>Push button to see modal server side error</Button>
                 <Button variant="warning" onClick ={
                    this.accessChild2
                }>Push button to see modal authorities failure</Button>
                <ModalError error='Something really goes wrong' ref='child1' />
                <Modal401 ref='child2'/>
                </div>
            </div>
        )
    }
}