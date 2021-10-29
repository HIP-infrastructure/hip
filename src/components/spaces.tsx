import React from 'react'
import { InputSwitch } from 'primereact/inputswitch'
import Sessions from './sessions'
import Apps from './apps'
import { Dialog } from 'primereact/dialog'
import WebdavForm from './webdavLoginForm'
import { useAppStore } from '../store/appProvider'
import Data from './data'

import './spaces.css'

const Spaces = (): JSX.Element => {
	const {
		debug: [debug, setDebug],
		showWedavForm: [showWedavForm, setShowWedavForm],
	} = useAppStore()

	return (
		<div className='spaces__layout-wrapper'>
			<Dialog
				header='Data access'
				visible={showWedavForm}
				onHide={() => setShowWedavForm(false)}
			>
				<WebdavForm />
			</Dialog>
			<div className='services__apps'>
				<Apps />
				<div>
					<p>Debug</p>
					<InputSwitch checked={debug} onChange={() => setDebug(!debug)} />
				</div>
			</div>
			<div className='spaces__layout-top'>
				<div className='services__sessions'>
					<Sessions />
				</div>
				<div className='services__data'>
					<Data />
				</div>
			</div>

			<div className='spaces__layout-bottom' />
			{/* <div className='services__activity'>
				{debug && <Activity />}
			</div> */}
		</div>
	)
}

export default Spaces
