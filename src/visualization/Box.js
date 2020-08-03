import React, { useRef } from 'react'

function Box(props) {
    // This reference will give us direct access to the mesh
    const mesh = useRef()

    const color = '#' + Math.random().toString(16).substr(-6);

    return (
        <mesh
            {...props}
            ref={mesh} castShadow receiveShadow>
            <boxBufferGeometry attach="geometry" args={[props.depth, props.height, props.width]} />
            <meshStandardMaterial attach="material" roughness={0.75} color={color} />
        </mesh>
    )
}

export default Box