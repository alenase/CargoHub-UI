import React, { Component } from 'react';
import '../main_page/main_page.css';
import './error.css';
import '../index.css';
import page404 from './page4044.jpg';

export default class Page404 extends Component {
    render() {
        return(
            <div>
               <div className="Title">
                   <h1>Oops! Could not find it!</h1>
               </div>
               <div className="Main-background">
                  <img src={page404} className='error-image' alt="page not found"/>
                </div>
            </div>
        );
    }
}