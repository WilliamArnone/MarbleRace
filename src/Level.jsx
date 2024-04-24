import { Float, Text, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three'
import useGame from './stores/useGame';

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const floor1Material = new THREE.MeshStandardMaterial({color:'limegreen'});
const floor2Material = new THREE.MeshStandardMaterial({color:'greenyellow'});
const obstacleMaterial = new THREE.MeshStandardMaterial({color:'orangered'});
const wallMaterial = new THREE.MeshStandardMaterial({color:'slategrey'});


function BlockStart({position = [0, 0, 0]}){
	return (
		<group position={position}>
			<Float floatIntensity={0.25} rotationIntensity={0.25}>
				<Text
					scale={0.5}
					font='/bebas-neue-v9-latin-regular.woff'
					maxWidth={0.25}
					lineHeight={0.75}
					textAlign='right'
					// position={[0.75, 0.65, 0]}
					position={[0.0, 1.1, 0]}
					rotation-y={-0.25}
				>
					Marble Race
					<meshBasicMaterial toneMapped={false} />
				</Text>
			</Float>
			<mesh receiveShadow
				position-y={-.1}
				geometry={boxGeometry}
				material={floor1Material}
				scale={[4, .2, 4]}	
			/>
		</group>
	)
}

function BlockEnd({position = [0, 0, 0]}){
	
	const hamburger = useGLTF('/hamburger.glb')

	hamburger.scene.traverse(child=>{
		if(child.isMesh)
			child.castShadow = true
	})

	return (
		<group position={position}>
			<Text
				font='/bebas-neue-v9-latin-regular.woff'
				maxWidth={0.25}
				lineHeight={0.75}
				textAlign='right'
				position={[0.0, 1.7, 0]}
			>
				FINISH
				<meshBasicMaterial toneMapped={false} />
			</Text>
			<mesh receiveShadow
				position-y={0}
				geometry={boxGeometry}
				material={floor1Material}
				scale={[4, .2, 4]}	
			/>
			<RigidBody type={'fixed'} colliders={'hull'}>
				<primitive scale={0.2} position-y={0.25} object={hamburger.scene} />
			</RigidBody>
				
		</group>
	)
}

export function BlockSpinner({
	position = [0, 0, 0],
	speed = ((Math.random() + 0.2) * Math.sign(Math.random()-0.5))
}){
	const obstacle = useRef()
	const [obstacleSpeed] = useState(()=>speed)

	useFrame((state, delta, frame)=>{
		const time = state.clock.getElapsedTime()

		const rotation = new THREE.Quaternion()
		rotation.setFromEuler(new THREE.Euler(0, time * obstacleSpeed, 0))

		obstacle.current.setNextKinematicRotation(rotation)
	})

	return (
		<group position={position}>
			<mesh receiveShadow
				position-y={-.1}
				geometry={boxGeometry}
				material={floor2Material}
				scale={[4, .2, 4]}	
			/>
			<RigidBody
				type={'kinematicPosition'}
				position-y={0.3}
				restitution={0.2}
				friction={0}
				ref={obstacle}
			>
				<mesh castShadow receiveShadow
					geometry={boxGeometry} 
					material={obstacleMaterial}
					scale={[3.5, 0.3, 0.3]}
				/>
			</RigidBody>
		</group>
	)
}

export function BlockLimbo({
	position = [0, 0, 0]
}){
	const obstacle = useRef()
	const [timeOffset] = useState(()=> Math.random() * Math.PI * 2)

	useFrame((state, delta, frame)=>{
		const time = state.clock.getElapsedTime()
		const translation = new THREE.Vector3(0, Math.sin(time+timeOffset)+1.15, 0)
		translation.x += position[0]
		translation.y += position[1]
		translation.z += position[2]
		obstacle.current.setNextKinematicTranslation(translation)
	})

	return (
		<group position={position}>
			<mesh receiveShadow
				position-y={-.1}
				geometry={boxGeometry}
				material={floor2Material}
				scale={[4, .2, 4]}	
			/>
			<RigidBody
				type={'kinematicPosition'}
				position-y={0.3}
				restitution={0.2}
				friction={0}
				ref={obstacle}
			>
				<mesh castShadow receiveShadow
					geometry={boxGeometry} 
					material={obstacleMaterial}
					scale={[3.5, 0.3, 0.3]}
				/>
			</RigidBody>
		</group>
	)
}

export function BlockAxe({
	position = [0, 0, 0]
}){
	const obstacle = useRef()
	const [timeOffset] = useState(()=> Math.random() * Math.PI * 2)

	useFrame((state, delta, frame)=>{
		const time = state.clock.getElapsedTime()
		const translation = new THREE.Vector3(Math.sin(time+timeOffset)*1.25, .75, 0)
		translation.x += position[0]
		translation.y += position[1]
		translation.z += position[2]
		obstacle.current.setNextKinematicTranslation(translation)
	})

	return (
		<group position={position}>
			<mesh receiveShadow
				position-y={-.1}
				geometry={boxGeometry}
				material={floor2Material}
				scale={[4, .2, 4]}	
			/>
			<RigidBody
				type={'kinematicPosition'}
				position-y={0.3}
				restitution={0.2}
				friction={0}
				ref={obstacle}
			>
				<mesh castShadow receiveShadow
					geometry={boxGeometry} 
					material={obstacleMaterial}
					scale={[1.5, 1.5, 0.3]}
				/>
			</RigidBody>
		</group>
	)
}

function Bounds({length}){
	return (
		<RigidBody type='fixed' friction={0} restitution={0.2}>
			<mesh castShadow
				geometry={boxGeometry}
				material={wallMaterial}
				position={[2.15, 0.75, -(length*2)+2]}
				scale={[0.3, 1.5, length*4]}
			/>
			<mesh receiveShadow
				geometry={boxGeometry}
				material={wallMaterial}
				position={[-2.15, 0.75, -(length*2)+2]}
				scale={[0.3, 1.5, length*4]}
			/>
			<mesh receiveShadow
				geometry={boxGeometry}
				material={wallMaterial}
				position={[0, 0.75, -(length*4)+2]}
				scale={[4, 1.5, .3]}
			/>
			<CuboidCollider
				args={[2, .1, 2*length]} 
				position={[0, -.1, -(length*2)+2]}
				restitution={0.2}
				friction={1}
			/>
		</RigidBody>
	)
}

export default function Level({
	count = 5,
	types = [BlockSpinner, BlockAxe, BlockLimbo]
}) {
	const blockSeed = useGame(state=>state.blockSeed)
	const blocks = useMemo(()=>{
		const blocks = []
		for(let i = 0; i<count; i++){
			const index = Math.floor(Math.random()*types.length)
			blocks.push(types[index])
		}
		return blocks
	}, [count, types, blockSeed])

	return (<>
		<BlockStart position={[0, 0, 0]}/>
		{blocks.map((Block, index) => <Block key={index} position={[0, 0, -4*(index+1)]} />)}
		<BlockEnd position={[0, 0, -4*(count+1)]} />

		<Bounds length={count+2} />
	</>)
}