import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import * as React from 'react'
import { styled } from '@mui/material/styles'

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: '#f5b800',
		color: 'rgba(0, 0, 0, 0.87)',
		boxShadow: theme.shadows[1],
		fontSize: 11,
	},
}))

const CustomToolTip = ({ title, placement, showTooltip, children }: {title: string, placement?: TooltipProps["placement"], showTooltip: boolean, children: JSX.Element}) => (
	<LightTooltip
		title={title}
		placement={placement ?? 'right'}
		arrow
		disableHoverListener
		disableFocusListener
		open={showTooltip}
	>
		{children}
	</LightTooltip>
)

export default CustomToolTip
