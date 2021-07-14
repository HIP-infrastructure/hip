import React from 'react'
import { InputSwitch } from 'primereact/inputswitch'
import Sessions from '../sessions/sessions'
import Apps from '../apps/apps'
import Activity from '../activity/activity'
import Files from '../files/files'

import { useAppStore } from '../context/appProvider'

import './spaces.css'

const Spaces = (): JSX.Element => {
	const {
		debug: [debug, setDebug],
	} = useAppStore()

	return (
		<div className='spaces__layout-wrapper'>
			<div className='services__apps'>
				<Apps />
			</div>
			<div className='spaces__layout-top'>
				<div className='services__sessions'>
					<Sessions />
				</div>
				{debug && (
					<div className='services__files'>
						<Files />
					</div>
				)}
			</div>

			<div className='spaces__layout-bottom' />
			<div className='services__activity'>
				<p>Debug</p>
				<InputSwitch checked={debug} onChange={() => setDebug(!debug)} />
				<hr />
				{debug && <Activity />}
			</div>
		</div>
	)
}

export default Spaces
