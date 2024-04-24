import { useKeyboardControls } from "@react-three/drei"
import useGame from "./stores/useGame"
import { useEffect, useRef } from "react"
import { addEffect } from "@react-three/fiber"

export default function Interface() {
	const time = useRef()

	const forward = useGame((state)=>state.forward)
	const backward = useGame((state)=>state.backward)
	const leftward = useGame((state)=>state.leftward)
	const rightward = useGame((state)=>state.rightward)
	const jump = useGame((state)=>state.jump)
	const set = useGame((state)=>state.set)
	
	// const setForward = useGame((state)=>state.setForward)
	// const setBackward = useGame((state)=>state.setBackward)
	// const setLeftward = useGame((state)=>state.setLeftward)
	// const setRightward = useGame((state)=>state.setRightward)
	// const setJump = useGame((state)=>state.setJump)

	const [subscribeKeys, getKeys] = useKeyboardControls()

	const restart = useGame(state=>state.restart)

	const phase = useGame(state=>state.phase)

	useEffect(()=>{
		const removeEffect = addEffect(()=>{
			const state = useGame.getState()

			let elapsedTime = 0;

			switch(state.phase){
				case 'playing':
					elapsedTime = Date.now() - state.startTime
					break
				case 'ended':
					elapsedTime = state.endTime - state.startTime
					break
			}

			elapsedTime /= 1000
			elapsedTime = elapsedTime.toFixed(2)

			if(time.current)
				time.current.textContent = elapsedTime
		})

		const unsubscribeForward = subscribeKeys(state=>state.forward, (value)=>(set({ forward: value })))
		const unsubscribeLeftward = subscribeKeys(state=>state.leftward, (value)=>(set({ leftward: value })))
		const unsubscribeBackward = subscribeKeys(state=>state.backward, (value)=>(set({ backward: value })))
		const unsubscribeRightward = subscribeKeys(state=>state.rightward, (value)=>(set({ rightward: value })))
		const unsubscribeJump = subscribeKeys(state=>state.jump, (value)=>(set({ jump: value })))

		return ()=>{
			removeEffect()
			unsubscribeForward()
			unsubscribeLeftward()
			unsubscribeBackward()
			unsubscribeRightward()
			unsubscribeJump()
		}
	}, [])

	return (
		<div className="interface">
			<div className="time" ref={time}>0.00</div>
			{phase === 'ended' && <div className="restart" onClick={restart}>Restart</div>}
			{phase !== 'ended' && <div className="controls">
				<div className="raw">
					<div onPointerDown={()=>set({ forward: true })} onPointerLeave={()=>set({ forward: false })} onPointerUp={()=>set({ forward: false })} className={`key ${forward && 'active'}`}></div>
				</div>
				<div className="raw">
					<div onPointerDown={()=>set({ leftward: true })} onPointerLeave={()=>set({ leftward: false })} onPointerUp={()=>set({ leftward: false })} className={`key ${leftward && 'active'}`}></div>
					<div onPointerDown={()=>set({ backward: true })} onPointerLeave={()=>set({ backward: false })} onPointerUp={()=>set({ backward: false })} className={`key ${backward && 'active'}`}></div>
					<div onPointerDown={()=>set({ rightward: true })} onPointerLeave={()=>set({ rightward: false })} onPointerUp={()=>set({ rightward: false })} className={`key ${rightward && 'active'}`}></div>
				</div>
				<div className="raw">
					<div onPointerDown={()=>set({ jump: true })} onPointerLeave={()=>set({ jump: false })} onPointerUp={()=>set({ jump: false })} className={`key large ${jump && 'active'}`}></div>
				</div>
				{/* <div className="raw">
					<div onPointerDown={()=>setForward(true)} onPointerUp={()=>setForward(false)} className={`key ${forward && 'active'}`}></div>
				</div>
				<div className="raw">
					<div onPointerDown={()=>setLeftward(true)} onPointerUp={()=>setLeftward(false)} className={`key ${leftward && 'active'}`}></div>
					<div onPointerDown={()=>setBackward(true)} onPointerUp={()=>setBackward(false)} className={`key ${backward && 'active'}`}></div>
					<div onPointerDown={()=>setRightward(true)} onPointerUp={()=>setRightward(false)} className={`key ${rightward && 'active'}`}></div>
				</div>
				<div className="raw">
					<div onPointerDown={()=>setJump(true)} onPointerUp={()=>setJump(false)} className={`key large ${jump && 'active'}`}></div>
				</div> */}
			</div>}
		</div>
	)
}