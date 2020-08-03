import React from 'react';
import PropTypes from 'prop-types';
import LogInMenu from './LoginMenu';
import './header.css';
import icon from './user-icon1.png';
import { Link } from 'react-router-dom';
import { Overlay, Popover, Button, Row } from 'react-bootstrap';
import axios from 'axios'; 
import './loginmenu.css';
import { useState, useRef } from 'react';

function Greeting(props) {
	if (props.ifLoggedIn) {
		return <UserLoggedIn ifAdmin={props.ifAdmin} email={props.email} handleToken={props.handleToken} />;
	}
	return <NotLogedIn handleToken={props.handleToken} />;
}

class NotLogedIn extends React.Component {
	constructor(props) {
		super(props);
		this.disableModal = this.disableModal.bind(this);
		this.enableModal = this.enableModal.bind(this);
		this.state = {
			ifShowModal: false,
		};
	}

	disableModal() {
		this.setState({ ifShowModal: false });
	}

	enableModal() {
		this.setState({ ifShowModal: true });
	}

	render() {
		const style = {
			divAbsolute: {
				position: 'absolute',
				top: '0',
				right: '0',
				paddingTop: '15px',
			}
		}
		return (
			<div style={style.divAbsolute}>
				<div className="Div-Login" >
					<h4 onClick={this.enableModal} className="h4" >LogIn</h4>
					{
						<LogInMenu ifShowModal={this.state.ifShowModal}
							disableModal={this.disableModal}
							handleToken={this.props.handleToken} />
					}
				</div>
				<div className="Div-Login1" >
					<h4 >|</h4>
				</div>
				<div className="Div-Login" >
					<Link className="a" to="/registration">
						<h4 >SignUp</h4>
					</Link>
				</div>
			</div>
		);
	}
}

const style = {
	divAbsolute: {
		position: 'absolute',
		top: '5px',
		right: '0',
	}
}

function UserLoggedIn(props) {
	const [show, setShow] = useState(false);
	const [target, setTarget] = useState(null);
	const ref = useRef(null);

	const link = ( props.ifAdmin == true ) ? "/admin" : "/profile";
	const logoutData = {
		token: '',
		userId: '',
		userEmail: '',
		ifAdmin: '',
		ifLoggedIn: false
	}

	async function logOut() {
		await axios({
            'method': 'GET',
            'url': 'http://localhost:8041/reset',
            'headers': {
                'Authorization': `Bearer_${sessionStorage.getItem('token1')}`
            }
        }).then(response => {
            if (response.status === 200) {
				props.handleToken(logoutData);
			};
        }).catch(error => {
			props.handleToken(logoutData);
		});
	}

	return (
		<div style={style.divAbsolute} ref={ref}>
			<Button className="login-button" onClick={(event) => {
				setShow(!show);
				setTarget(event.target)
			}} >
				{props.email}
			</Button>
			<Overlay placement='bottom'
				show={show}
				target={ref.current}
			>
				<Popover id={`popover-positioned-bottom`} className="user-info-menu">
					<Popover.Title as="h3">{props.userEmail}</Popover.Title>
					<Popover.Content>
						<ul className="list-reset">
							<li>
								<Button className="modal-button" onClick={() => { setShow(!show) }}>
									<Link className="a" to={link}>My Profile</Link>
								</Button>
							</li>
							<li>
								<Button className="modal-button" onClick={() => { logOut() }}>
									<Link className="a" to="/">Log out</Link>
								</Button>
							</li>
						</ul>
					</Popover.Content>
				</Popover>
			</Overlay>
		</div>
	);
}

NotLogedIn.propTypes = {
	ifShowModal: PropTypes.bool
}

export default Greeting;