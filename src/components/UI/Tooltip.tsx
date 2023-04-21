import { Tooltip } from '@mui/material'
import * as React from 'react'

const CustomToolTip = ({ title, placement, showTooltip, children }: any) => (
	<Tooltip
		title={title}
		placement={placement || 'right'}
		arrow
		disableHoverListener
		disableFocusListener
		open={showTooltip}
	>
		{children}
	</Tooltip>
)

export default CustomToolTip
