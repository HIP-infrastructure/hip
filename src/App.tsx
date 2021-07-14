import React from 'react'
import { TabMenu } from 'primereact/tabmenu'
import Spaces from './components/spaces'
import './App.css'
import { AppStoreProvider } from './context/appProvider'

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

const App = (): JSX.Element => (
	<AppStoreProvider>
		<main>
			<section>
				<nav className='nav-menu' />
				<div className='spaces'>
					<div>
						<div className='spaces__nav'>
							<TabMenu model={items} />
						</div>
						<Spaces />
					</div>
				</div>
			</section>
			<footer>
				<p>HIP 2021</p>
			</footer>
		</main>
	</AppStoreProvider>
)

export default App
