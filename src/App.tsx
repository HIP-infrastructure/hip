import React from 'react'
import { TabMenu } from 'primereact/tabmenu'
import Spaces from './components/spaces'
import './App.css'
import { InputSwitch } from 'primereact/inputswitch'
import { useAppStore } from './store/appProvider'

const items = [
	{
		label: 'Personal',
		routerLink: '/personal',
	},
	{
		label: 'Collaborative',
		disabled: true,
	},
	{
		label: 'Public',
		disabled: true,
	},
]

const App = (): JSX.Element => {
	const {
		debug: [debug, setDebug],
	} = useAppStore()

	return (
		<main>
			<section>
				<nav className='nav-menu' />
				<div className='spaces'>
					<div>
						<div className='spaces__nav'>
							<TabMenu model={items} />
							<div>
								<span className='p-mr-2'>debug</span>
								<InputSwitch className='p-mr-2' checked={debug} onChange={() => setDebug(!debug)} />
							</div>
						</div>
						<Spaces />
					</div>
				</div>
			</section>
			<footer>
				<p>HIP 2021</p>
			</footer>
		</main>
	)
}

export default App
