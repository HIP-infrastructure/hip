import React from 'react'
import Sessions from './sessions'
import Apps from './apps'
import { Dialog } from 'primereact/dialog'
import WebdavForm from './webdavLoginForm'
import { useAppStore } from '../store/appProvider'
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button'
import BIDSConverterForm from './convert'
import { OverlayPanel } from 'primereact/overlaypanel';
import { Outlet } from 'react-router-dom'


import './spaces.css'

const Spaces = (): JSX.Element => {
	const {
		showWedavForm: [showWedavForm, setShowWedavForm],
	} = useAppStore()
	const [activeIndex1, setActiveIndex1] = React.useState(1);
	const op = React.useRef<OverlayPanel>(null);

	const handleBIDSConverter = (event: any, target?: any) => {
		op?.current?.toggle(event, null)
	}

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
				<TabView activeIndex={activeIndex1} onTabChange={(e) => setActiveIndex1(e.index)}>
					<TabPanel header="Applications">
						<Apps />
					</TabPanel>
					<TabPanel header="Workflows">
					<Button
						className='p-button-sm p-mr-2'
						label='Bids converter'
						onClick={(e) => handleBIDSConverter(e)}
					/>
					<OverlayPanel
						ref={op}
						showCloseIcon
						id="overlay_panel"
						style={{ width: "450px" }}
						className="overlaypanel-demo"
					>
						<BIDSConverterForm />
					</OverlayPanel>
					</TabPanel>
				</TabView>
			</div>
			<div className='spaces__layout-top'>
				<div className='services__sessions'>
					<Sessions />
				</div>
				<div className='services__data'>
					<Outlet />
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
