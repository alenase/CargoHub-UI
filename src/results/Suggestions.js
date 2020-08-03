import React from 'react';
import Suggestion from './Suggestion';
import axios from "axios";
import { Col } from 'react-bootstrap';


const url = "localhost:9041"

function Suggestions(props) {

    function sendAxios(trackingId, deliveryDate, price, hubs, departure, arrival, boxes) {
        let cargos = boxes;
        let route = {
            hubs
        }
        let data = {
            "price": price,
            "estimatedDeliveryDate": deliveryDate,
            "departureHub": departure,
            "arrivalHub": arrival,
            "trackingId": trackingId,
            "cargos": cargos,
            "route": route
        }
        


        let dataToSend = {
            price: data.price,
            estimatedDeliveryDate: data.estimatedDeliveryDate,
            departureHub: data.departureHub,
            arrivalHub: data.arrivalHub,
            trackingId: data.trackingId,
            cargos: data.cargos,
            route: route
        }

        axios({
            method: 'POST',
            url: `http://${url}/${props.userDetails.userId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer_${props.userDetails.token}`
            },
            data: dataToSend
        }).then(response => {
                console.log("Ok")
            }).catch((error) => {
                console.log(error);
                if (error.status === 404) {
                    window.location = '/error';
                }
            });
    }

    const suggestionList = props.data.map((item) =>
        <Suggestion
            key={item.trackingId}
            id={item.trackingId}
            price={item.price}
            boxes={props.boxes}
            hubs={item.hubs}
            deliveryDate={item.estimatedDeliveryDate}
            departure={props.departure}
            arrival={props.arrival}
            send={sendAxios}
            dataOfUser={props.userDetails}
        />
    );
    return (
        <ul className='list-reset'>{suggestionList}</ul>
    );
}

export default Suggestions;