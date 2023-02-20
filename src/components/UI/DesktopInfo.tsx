import React, { useEffect, useRef } from 'react'
import { Typography, Box, Chip } from "@mui/material"
import { Container } from "../../api/types"
import { color } from "../../api/utils"

const DesktopInfo = ({ desktop }: { desktop: Container}) => (
	<>
		<Typography sx={{ fontSize: 14 }} >
			{desktop?.userId}
		</Typography>
		<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
			<Typography variant='h5' component='div'>
				Desktop #{desktop?.name}
			</Typography>

			<Chip
				label={
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						{desktop?.state}
					</Box>
				}
				color={color(desktop?.state)}
				variant='outlined'
			/>
		</Box>
		<Typography variant='caption' gutterBottom component='div'>
			{desktop?.id}
		</Typography>
	</>
)

DesktopInfo.displayName = 'DesktopInfo'
export default DesktopInfo
