import React, { useRef } from 'react'

function Compartment(props) {
    // This reference will give us direct access to the mesh
    const mesh = useRef()

    return (
        <mesh
            {...props}
            ref={mesh} receiveShadow>
            <boxBufferGeometry attach="geometry" args={[props.depth, props.height, props.width]} />
            <meshStandardMaterial attach="material" color='gray'
                transparent
                opacity={0.25} />
        </mesh>
    )
}

export default Compartment