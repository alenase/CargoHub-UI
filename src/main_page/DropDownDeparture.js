import React, { useState } from 'react';
import { FormControl, Dropdown } from "react-bootstrap";

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
        style={{ color: 'black' }}
        href=""
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
    </a>
));

const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
        const [value, setValue] = useState('');

        return (
            <div
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
            >
                <FormControl
                    autoFocus
                    className="mx-3 my-2 w-auto"
                    placeholder="Type to filter..."
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                />
                <ul className="list-unstyled">
                    {React.Children.toArray(children).filter(
                        (child) =>
                            !value || child.props.children.toLowerCase().startsWith(value),
                    )}
                </ul>
            </div>
        );
    },
);

function GenerateDropDownRows(cities) {
    const departureList = cities.cities.map((c) =>
        <Dropdown.Item key={c.name} eventKey={c.name}>
            {c.name}
        </Dropdown.Item>
    );
    return (
        <Dropdown.Menu as={CustomMenu}>
            {departureList}
        </Dropdown.Menu>
    );
}

export default class DropDownDeparture extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Dropdown onSelect={this.props.handleSelectedDeparture} style={{ backgroundColor: 'white', padding: '7px', borderRadius: '5px' }}>
                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" >
                    {this.props.departure}
                </Dropdown.Toggle>
                <GenerateDropDownRows cities={this.props.cities} />
            </Dropdown>
        );
    }
}