import React, { Component, useContext } from 'react'
require('shepherd.js/dist/css/shepherd.css')
import { ShepherdTour, ShepherdTourContext } from 'react-shepherd'
const steps = [
	{
		id: 'intro',
		attachTo: { element: '.first-element', on: 'bottom' },
		beforeShowPromise: function () {
			return new Promise(function (resolve) {
				setTimeout(function () {
					window.scrollTo(0, 0)
					// resolve()
				}, 500)
			})
		},
		buttons: [
			{
				classes: 'shepherd-button-secondary',
				text: 'Exit',
				type: 'cancel',
			},
			{
				classes: 'shepherd-button-primary',
				text: 'Back',
				type: 'back',
			},
			{
				classes: 'shepherd-button-primary',
				text: 'Next',
				type: 'next',
			},
		],
		classes: 'custom-class-name-1 custom-class-name-2',
		highlightClass: 'highlight',
		scrollTo: false,
		cancelIcon: {
			enabled: true,
		},
		title: 'Welcome to the HIP!',
		text: [
			'The HIP is a platform for sharing and collaborating on research data.',
		],
		when: {
			show: () => {
				console.log('show step')
			},
			hide: () => {
				console.log('hide step')
			},
		},
	},
	
]

const tourOptions = {
	defaultStepOptions: {
		cancelIcon: {
			enabled: true,
		},
	},
	useModalOverlay: true,
}

function Button() {
	const tour = useContext(ShepherdTourContext)

	return (
		<button className='button dark' onClick={tour?.start}>
			Start Tour
		</button>
	)
}

class App extends Component {
	render() {
		return (
			<div>
				<ShepherdTour steps={steps} tourOptions={tourOptions}>
					<Button />
				</ShepherdTour>
			</div>
		)
	}
}

export default App