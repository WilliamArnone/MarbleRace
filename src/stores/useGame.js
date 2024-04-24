import { create } from "zustand";
import {subscribeWithSelector} from 'zustand/middleware'

export default create(subscribeWithSelector((set)=>{
	return{
		blocksCount: 20,
		blockSeed: 0,

		phase: 'ready',
		startTime: 0,
		endTime: 0,

		
		forward: false,
		backward: false,
		leftward: false,
		rightward: false,
		jump: false,
		

		// setForward:  (value)=>{
		// 	set({ forward: value })
		// },
		// setBackward:  (value)=>{
		// 	set({ backward: value })
		// },
		// setLeftward:  (value)=>{
		// 	set({ leftward: value })
		// },
		// setRightward:  (value)=>{
		// 	set({ rightward: value })
		// },
		// setJump:  (value)=>{
		// 	set({ jump: value })
		// },

		set: set,
		
		start: ()=>{
			set(state => state.phase === 'ready' ? { phase: 'playing', startTime: Date.now() } : {})
		},
		restart: ()=>{
			set(state => state.phase === 'playing' || state.phase === 'ended' ? { 
				phase: 'ready', 
				blockSeed: state.phase === 'ended' ? state.blockSeed + 1: state.blockSeed,
				forward: false,
				backward: false,
				leftward: false,
				rightward: false,
				jump: false
			} : {})
		},
		end: ()=>{
			set(state => state.phase === 'playing' ? { 
				phase: 'ended', endTime: Date.now(),
				forward: false,
				backward: false,
				leftward: false,
				rightward: false,
				jump: false
			} : {})
		}
	}
}))