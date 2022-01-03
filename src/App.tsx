import React from 'react'
import { TabMenu } from 'primereact/tabmenu'
import Spaces from './components/spaces'
import './App.css'
import { InputSwitch } from 'primereact/inputswitch'
import { useAppStore } from './store/appProvider'
import { Routes, Route, Link, useLocation, Outlet } from "react-router-dom";
import Data from './components/data'
import BIDSConverterForm from './components/convert'


const ROUTE_PREFIX = '/index.php/apps/hip'

const items = [
	{
		label: 'Personal',
		routerLink: '/private',
	},
	{
		label: 'Collaborative',
		routerLink: '/private',
	},
	{
		label: 'Public',
		disabled: true,
	}
]

const Home = (): JSX.Element => {
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

const App = () => <>
	<h1>Welcome router</h1>
	{/* <pre>{JSON.stringify(useLocation(), null, 2)}</pre> */}
	<Link to={`${ROUTE_PREFIX}/workflows`}>Bids</Link>
	<Routes>
		<Route path={`${ROUTE_PREFIX}/`} element={<Home />}>
			<Route path={`${ROUTE_PREFIX}/`} element={<Data />} />
			<Route path={`${ROUTE_PREFIX}/workflows`} element={<BIDSConverterForm />} />
		</Route>
	</Routes></>

export default App
