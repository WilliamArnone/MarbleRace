import { useKeyboardControls, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from 'three'
import { cameraPosition } from "three/examples/jsm/nodes/Nodes.js";
import useGame from "./stores/useGame";

export default function Player() {

	const ball = useRef()
	const {rapier, world} = useRapier()

	const [smoothedCameraPosition] = useState(()=> new THREE.Vector3(10, 10, 10))
	const [smoothedCameraTarget] = useState(()=> new THREE.Vector3())

	const start = useGame(state=>state.start)
	const restart = useGame(state=>state.restart)
	const end = useGame(state=>state.end)
	const phase = useGame(state=>state.phase)
	const blocksCount = useGame(state=>state.blocksCount)
	
	const reset = ()=>{
		ball.current.setTranslation({x: 0, y: 0, z: 0})
		ball.current.setLinvel({x: 0, y: 0, z: 0})
		ball.current.setAngvel({x: 0, y: 0, z: 0})
	}

	useFrame((state, delta)=>{
		if(phase === 'ended')
			return

		const {forward, backward, leftward, rightward} = useGame.getState()
		
		const impulse = {x: 0, y: 0, z: 0}
		const torque = {x: 0, y: 0, z: 0}

		const impulseStrength = 0.6 * delta
		const torqueStrength = 0.2 * delta

		if(forward){
			impulse.z -= impulseStrength
			torque.x -= torqueStrength
		}

		if(backward){
			impulse.z += impulseStrength
			torque.x += torqueStrength
		}

		if(rightward){
			impulse.x += impulseStrength
			torque.z -= torqueStrength
		}

		if(leftward){
			impulse.x -= impulseStrength
			torque.z += torqueStrength
		}

		ball.current.applyImpulse(impulse)
		ball.current.applyTorqueImpulse(torque)

		/**
		 * Camera
		 */
		const ballPosition = ball.current.translation()
		const cameraPosition = new THREE.Vector3()
		cameraPosition.copy(ballPosition)
		cameraPosition.z += 2.8
		cameraPosition.y += 1.4
		const cameraTarget = new THREE.Vector3()
		cameraTarget.copy(ballPosition)
		cameraTarget.y += 0.6

		smoothedCameraPosition.lerp(cameraPosition, 3 * delta)
		smoothedCameraTarget.lerp(cameraTarget, 3 * delta)

		state.camera.position.copy(smoothedCameraPosition)
		state.camera.lookAt(smoothedCameraTarget)

		if(ballPosition.z < -(blocksCount * 4 + 2))
			end()
		if (ballPosition.y < -4)
			restart()
	})

	useEffect(()=>{
		const unsubscribeReset = useGame.subscribe(state=>state.phase,
			(value)=>{
				if(value === 'ready')
					reset()
			}
		)

		const unsubscribeJump = useGame.subscribe( state => state.jump , (value)=>{
			if(!value)
				return
			const state = useGame.getState()
			if(state.phase === 'ended') 
				return
			
			const origin = ball.current.translation()
			origin.y -= 0.31

			const direction = {x: 0, y: -1, z: 0}

			const ray = new rapier.Ray(origin, direction)
			const hit = world.castRay(ray, 0.01, true)

			if(!hit)
				return

			ball.current.applyImpulse({x: 0, y: 0.5, z: 0})
		})

		const unsubscribeAny = useGame.subscribe(
			state => 
				state.forward || 
				state.leftward ||
				state.backward ||
				state.rightward ||
				state.jump,			
			()=>{
				const state = useGame.getState()
				if(state.phase === 'ready')
					start()
		})

		return ()=>{unsubscribeReset(); unsubscribeJump(); unsubscribeAny()}
	}, [])

	return (
		<RigidBody
			ref={ball}
			colliders={'ball'}
			restitution={0.2}
			linearDamping={0.5}
			angularDamping={0.5}
			friction={1}
			position-y={0.5}
			canSleep={false}
		>
			<mesh castShadow>
				<icosahedronGeometry args={[0.3, 1]} />
				<meshStandardMaterial flatShading color={'mediumpurple'} />
			</mesh>
		</RigidBody>
	)
}