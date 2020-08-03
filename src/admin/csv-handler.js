import React, { useEffect, useState } from 'react'
import { Image, Button, Col, Row } from "react-bootstrap";
import { CSVReader } from 'react-papaparse'
import transportImage from './admin_resource/csv-transport1.png';
import hubImage from './admin_resource/csv-hub1.png';
import userImage from './admin_resource/csv-user1.png';
import axios from 'axios';

const buttonRef = React.createRef()

export default function CsvHandler(props) {
  let token = props.token;
  const [showItemsFlag, setShowItemsFlag] = useState('hidden');
  const [items, setItems] = useState([]);
  const [imageLogic, setImageLogic] = useState('');

  const handleOpenDialog = (e) => {
    if (buttonRef.current) {
      buttonRef.current.open(e)
    }
  }

  const handleOnFileLoad = (data) => {
    let loadedItems = [];
    data.map((item, index) => {
      loadedItems.push(item.data);
    });
    loadedItems.pop();
    setShowItemsFlag("visible");
    findOutServerResource(loadedItems[0], loadedItems);
    setItems(loadedItems);
  }

  const handleOnError = (err, file, inputElem, reason) => {
  }

  const handleOnRemoveFile = (data) => {
    setShowItemsFlag('hidden');
    setImageLogic('');
  }

  const handleRemoveFile = (e) => {
    if (buttonRef.current) {
      buttonRef.current.removeFile(e)
    }
  }

  const findOutServerResource = (item, items) => {
    let resource = 'default';
    let formedItems = [];
    if (item.hasOwnProperty('firstName') && item.hasOwnProperty('lastName')) {
      resource = 'USERS';
      formedItems = formUsers(items);
    } else if (item.hasOwnProperty('maximumWeight') && item.hasOwnProperty('width')) {
      resource = 'TRANSPORTS';
      formedItems = formTransports(items);
    } else {
      resource = '';
    }
    formImageLogic(resource, formedItems, '');
  }

  const formImageLogic = (resource, items, responseText) => {
    let logic = '';
    switch (resource) {
      case 'USERS':
        logic = <Row className='mt-2'>
          <Col sm='5'>
            <Image src={userImage} className='csv-image' rounded />
            <Button className='csv-button' onClick={() => {
              registerUsers(resource, items);
              setShowItemsFlag('hidden');
            }}>Send to server</Button>
          </Col>
          <Col sm='7'>
            <p className='csv-response'>{responseText}</p>
          </Col>
        </Row>
        break;
      case 'TRANSPORTS':
        logic = <Row className='mt-2'>
          <Col sm='5'>
            <Image src={transportImage} className='csv-image' rounded />
            <Button className='csv-button' onClick={() => {
              createTransports(resource, items);
              setShowItemsFlag('hidden');
            }}>Send to server</Button>
          </Col>
          <Col sm='7'>
            <p className='csv-response'>{responseText}</p>
          </Col>
        </Row>
        break;
      case 'HUBS':
        logic = <div>
          <Image src={hubImage} className='csv-image' rounded />
          <Button>Send to server</Button>
        </div>
        break;
      default:
    }
    setImageLogic(logic);
  }

  const registerUsers = (resource, items) => {
    console.log('create users: ', items);
    axios({
      method: 'POST',
      url: 'http://localhost:8041/admin/batch/registration',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Authorization': `Bearer_${token}`,
      },
      data: items,
    }).then(response => {
      if (response.status === 201) {
        formImageLogic(resource, items, items.length + " items has been created. Follow to tab Users to look at them.");
      }
    }).catch(error => {
      formImageLogic(resource, items, error.response.data.message + ". Try later!");
    });
  }

  const formUsers = (items) => {
    let users = [];
    items.map((item) => {
      let user = {
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        password: item.password,
        phoneNumber: item.phoneNumber,
        address: item.address,
        billingDetails: [{
          cardNumber: item.cardNumber,
          nameOnCard: item.nameOnCard,
          csc: item.csc,
          expirationMonth: item.expirationMonth,
          expirationYear: item.expirationYear,
          billingAddress: item.billingAddress,
        }],
      }
      users.push(user);
    });
    return users;
  }

  const createTransports = (resource, items) => {
    console.log('create transports: ', items);
    axios({
      method: 'POST',
      url: 'http://localhost:9041/admin/transport/batch',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Authorization': `Bearer_${token}`,
      },
      data: items,
    }).then(response => {
      if (response.status === 201) {
        formImageLogic(resource, items, items.length + " items has been created. Follow to tab Transports to look at them.");
      }
    }).catch(error => {
      formImageLogic(resource, items, error.response.data.message + ". Try later!");
    });
  }

  const formTransports = (items) => {
    let transports = [];
    items.map((item) => {
      let transport = {
        hubName: item.hubName,
        compartments: [
          {
            maximumWeight: item.maximumWeight,
            volume: {
              width: item.width,
              height: item.height,
              length: item.length,
            }
          }
        ],
        type: item.type,
      }
      transports.push(transport);
    });
    return transports;
  }

  useEffect(() => {
  });
  return (
    <div>
      <CSVReader
        ref={buttonRef}
        onFileLoad={handleOnFileLoad}
        onError={handleOnError}
        noClick
        noDrag
        onRemoveFile={handleOnRemoveFile}
        config={{ header: true }}
      >
        {({ file }) => (
          <aside
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginLeft: 30,
            }}
          >
            <button
              type='button'
              onClick={handleOpenDialog}
              style={{
                borderRadius: 3,
                marginLeft: 0,
                marginRight: 0,
                width: '15%',
                paddingLeft: 0,
                paddingRight: 0,
              }}
            >
              Browse file
                </button>
            <div
              style={{
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: '#ccc',
                height: 30,
                marginTop: 0,
                marginBottom: 0,
                paddingLeft: 0,
                paddingTop: 0,
                width: '25%',
                verticalAlign: 'middle',
                textAlign: 'center',
              }}
            >
              {file && file.name}
            </div>
            <button
              style={{
                borderRadius: 3,
                marginLeft: 0,
                marginRight: 0,
                paddingLeft: 20,
                paddingRight: 20,
                width: '15%',
              }}
              onClick={handleRemoveFile}
            >
              Remove
                </button>
            <div
              style={{
                borderRadius: 3,
                visibility: showItemsFlag,
                background: '#22f55e',
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: '#ccc',
                height: 30,
                marginTop: 0,
                marginBottom: 0,
                paddingLeft: 0,
                paddingTop: 0,
                width: '40%',
                verticalAlign: 'middle',
                textAlign: 'center',
              }}>
              {items.length} items are ready to be sent
                  </div>
          </aside>
        )}
      </CSVReader>
      {
        imageLogic
      }
    </div>
  );
}