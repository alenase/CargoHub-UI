import React, { useEffect, useState, useRef } from 'react';
import {
  Canvas,
  useFrame,
  extend,
  useThree,
} from "react-three-fiber";
import Compartment from './Compartment.js';
import Box from './Box.js';
import Plane from './Plane.js';
import SidePanel from './SidePanel.js';
import { Modal, Row, Button } from "react-bootstrap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as THREE from 'three'
import axios from 'axios';
import './visualization.css';

// Calling extend with the native OrbitControls class from Three.js
// will make orbitControls available as a native JSX element.
// Notice how the OrbitControls classname becomes lowercase orbitControls when used as JSX element.
extend({ OrbitControls });

function Cargo3D(props) {
  const [data, setData] = useState([]);
  const [showFlag, setShowFlag] = useState(true);

  // Initialize zero for coordinates
  const zeroWidth = -4;
  const zeroHeight = -4;
  const zeroDepth = -20;

 // const [flag, setFlag] = useState(props.showFlag);

  function getBoxesDataForVisualisation() {
    axios({
      'method': 'GET',
      'url': "http://localhost:9041/admin/cargosByTransporter?id=" + props.id,
      'headers': {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Authorization': `Bearer_${props.token}`,
      },
    }).then(response => {
      if (response.status === 200) {
        setData(response.data);
        console.log("positions", response.data);
      }

    }).catch((error) => {
      console.log("visualize error");
    });
  }

  useEffect(() => {
    //setShowFlag(props.showFlag);
    if (props.showFlag) {
      if (showFlag) {
        setInterval(getBoxesDataForVisualisation,2000);

        setShowFlag(false);
      }
    }
  });
  return (
    <div>
      <Modal show={props.showFlag} animation='true' onHide={() => setShowFlag(false)} slyle={{backgroundColor: "#2d292"}}>
        <Modal.Header className="visual-header" >
          <Modal.Title className="font-weight-bold ml-3">
            <Row>

            <h4 style={{ color: 'darkorange' }}>Compartment Visualization&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h4>
              <Button variant="warning" slyte={{backgroundColor: "#ff8e09" }} onClick={() => {getBoxesDataForVisualisation()}}>
                Refresh
              </Button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button variant="warning" slyte={{backgroundColor: "#ff8e09" }} onClick={() => {props.disable(); setShowFlag(true)}}>
              X
            </Button>

            </Row>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="visual-body">
          <Canvas shadowMap camera={{ fov: 75, position: [30, 30, 30] }} onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.outputEncoding = THREE.sRGBEncoding
          }}>
            <CameraControls />
            <pointLight position={[0, 10, 0]} intensity={0.3} />
            <spotLight intensity={0.75} position={[-15, 30, 20]} angle={2.0} penumbra={1} castShadow />
            <spotLight intensity={0.25} position={[15, 30, -20]} angle={1.5} penumbra={1} castShadow />
            <spotLight intensity={0.2} position={[-30, 20, 0]} angle={1.5} penumbra={1} castShadow />
            <Plane zPos={-4} xPos={0} yPos={0} xAxis={-1.57} zAxis={0} yAxis={0} />
            <SidePanel zPos={95} xPos={0} yPos={-99} xAxis={0} zAxis={0} yAxis={0} />
            <SidePanel zPos={95} xPos={0} yPos={99} xAxis={0} zAxis={0} yAxis={9.425} />
            <SidePanel zPos={95} xPos={-99} yPos={0} xAxis={0} zAxis={0} yAxis={1.57} />
            <SidePanel zPos={95} xPos={99} yPos={0} xAxis={0} zAxis={0} yAxis={-1.57} />
            <Compartment position={[0, 0, 0]} depth={40} height={8} width={8} />
            {
              data.map(box => {
                return <Box position={[zeroDepth + box.lengthPos + (box.length / 0.6), zeroHeight + box.heightPos + (box.height / 0.6), zeroWidth + box.widthPos + (box.width / 0.6)]} depth={box.length / 0.3} height={box.height / 0.3} width={box.width / 0.3} />
              })
            }
          </Canvas>
        </Modal.Body>
      </Modal>
    </div>
  );
}

const CameraControls = () => {
  // Get a reference to the Three.js Camera, and the canvas html element.
  // We need these to setup the OrbitControls class.
  const {
    camera,
    gl: { domElement }
  } = useThree();

  // Ref to the controls, so that we can update them on every frame using useFrame
  const controls = useRef();
  useFrame(state => controls.current.update());
  return (
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      enableZoom={true}
      maxAzimuthAngle={Math.PI}
      maxPolarAngle={Math.PI / 2}
      minAzimuthAngle={-Math.PI}
      minPolarAngle={0}
    />
  );
};

export default Cargo3D