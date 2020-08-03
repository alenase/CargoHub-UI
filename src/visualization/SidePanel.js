import React, { useRef } from 'react'
function SidePanel(props) {
    return (
        <mesh visible position={[props.xPos, props.zPos, props.yPos]} rotation={[props.xAxis, props.yAxis, props.zAxis]} receiveShadow>
            <planeBufferGeometry attach="geometry" args={[200, 200, 32, 32]} />
            <meshStandardMaterial attach="material" roughness={1.0} color={0x000000} />
        </mesh>
    )
}
export default SidePanel