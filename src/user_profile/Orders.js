import React, { useEffect, useState } from 'react';
import { Pagination, Table } from "react-bootstrap";
import axios from 'axios';
import ModalError from "../error/modalErrorFF.js";

function Orders(props) {
    const [pagination, setPagination] = useState([]);
    const [activePage, setActivePage] = useState(1);
    let totalPage = 1;
    let token = props.data.token;
    const [flag, setFlag] = useState(true);
    const [orders, setOrders] = useState([]);
    let [ifShowModalError, setIfShowModalError] = useState(false);
    let [errorMessage, setErrorMessage] = useState('');

    function ifError() {
        let temp = !ifShowModalError;
        setIfShowModalError(temp);
    }

    function initializeData(data) {
        totalPage = data.totalPages;
        setOrders(data.content);
        setPagination(formPagination(activePage, totalPage));
    }

    function updatePagination(newActivePage) {
        setActivePage(newActivePage);
        setFlag(true);
    }

    function formPagination(newActivePage, totalPage) {
        let itemsArray = [];
        for (let number = 1; number <= totalPage; number++) {
            itemsArray.push(
                <Pagination.Item key={number} active={number === newActivePage} onClick={() => updatePagination(number)}>
                    {number}
                </Pagination.Item>,
            );
        }
        return itemsArray;
    }

    function getOrdersById() {
        axios({
            'method': 'GET',
            'url': 'http://localhost:9041/' + props.data.userId + '/profile',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer_${token}`
            },
            'params': {
                'page': activePage - 1,
                'limit': 5
            },
        }).then(response => {
            initializeData(response.data);
        }).catch((error) => {
            setIfShowModalError(true);
            setErrorMessage(error.response.data.message);
        });
    }

    useEffect(() => {
        if (flag) {
            getOrdersById();
            setFlag(false);
        }
    });

    return (
        <div>
            {(ifShowModalError) && <ModalError ifShow={ifShowModalError}
                message={errorMessage}
                ifError={ifError} />}

            <div className='component'>
                <Table variant='dark' size='md' striped bordered hover >
                    <thead>
                        <tr>
                            <th className='text-center aling-middle'>Tracking Id</th>
                            <th className='text-center aling-middle'>Price</th>
                            <th className='text-center aling-middle'>Estimated delivery date</th>
                            <th className='text-center aling-middle'>Departure</th>
                            <th className='text-center aling-middle'>Arrival</th>
                              <th className='text-center aling-middle'>Delivery status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) =>
                            <tr key={index}>
                                <td className='text-center align-middle'>{order.trackingId}</td>
                                <td className='text-center align-middle'>{order.price}</td>
                                <td className='text-center align-middle'>{order.estimatedDeliveryDate}</td>
                                <td className='text-center align-middle'>{order.departureHub}</td>
                                <td className='text-center align-middle'>{order.arrivalHub}</td>
                                <td className='text-center align-middle'>{order.deliveryStatus}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
            <Pagination className='justify-content-center'>{pagination}</Pagination>
        </div>
    );

}

export default Orders;