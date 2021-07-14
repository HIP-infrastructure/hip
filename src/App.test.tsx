import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders Personal link', () => {
	render(<App />)
	const linkElement = screen.getByText(/Personal/i)
	expect(linkElement).toBeInTheDocument()
})
