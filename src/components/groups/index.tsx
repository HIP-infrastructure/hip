import * as React from 'react'
import { Outlet, useLocation } from 'react-router-dom'

const Groups = () => {
	const location = useLocation()

	return <Outlet key={location.pathname} />
}

export default Groups
