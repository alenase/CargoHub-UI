import React from 'react'
import { Tabs, Tab, Container, Row, Col } from 'react-bootstrap'
import Suggestions from './Suggestions'

class Result extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedTab: 'price'
		}
	}


	handleSelectedTab(key) {
		this.setState({ selectedTab: key })
	}

	render() {
		return (	
			<Container style={{ backgroundColor: '#c2c2c2' }}>
				<Row>
					<Col>
						<Tabs
							className='nav-fill'
							activeKey={this.state.selectedTab}
							onSelect={(key) => {
								this.handleSelectedTab(key)
							}}
						>
							<Tab
								className='nav-item'
								eventKey='price'
								title='Sort By Price:'
							>
								<Suggestions
									departure={this.props.departure}
									arrival={this.props.arrival}
									data={this.props.routes.priceSorted}
									userDetails={this.props.data.data}
									cities={this.props.citiesList}
									boxes={this.props.listOfBoxes}
								/>
							</Tab>
							<Tab
								className='nav-item'
								eventKey='deliveryDate'
								title='Sort By Delivery Date:'
							>
								<Suggestions
									departure={this.props.departure}
									arrival={this.props.arrival}
									data={this.props.routes.dateSorted}
									userDetails={this.props.data.data}
									cities={this.props.citiesList}
									boxes={this.props.listOfBoxes}
								/>
							</Tab>
						</Tabs>
					</Col>
				</Row>
			</Container>
		)
	}
}

export default Result
