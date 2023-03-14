import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import * as React from 'react'

export const MinusSquare = (props: SvgIconProps) => (
	<SvgIcon fontSize='inherit' style={{ width: 14, height: 14 }} {...props}>
		{/* tslint:disable-next-line: max-line-length */}
		<path d='M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z' />
	</SvgIcon>
)

export const PlusSquare = (props: SvgIconProps) => (
	<SvgIcon fontSize='inherit' style={{ width: 14, height: 14 }} {...props}>
		{/* tslint:disable-next-line: max-line-length */}
		<path d='M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z' />
	</SvgIcon>
)

export const DocumentSquare = (props: SvgIconProps) => (
	<SvgIcon fontSize='inherit' style={{ width: 14, height: 14 }} {...props}>
		{/* tslint:disable-next-line: max-line-length */}
		<path
			d='M35,31.75v-25c0-2.761-2.238-5-5-5H5c-2.762,0-5,2.239-5,5v25c0,2.761,2.238,5,5,5h25C32.762,36.75,35,34.511,35,31.75z
		 M7.25,8h10.038c0.828,0,1.5,0.671,1.5,1.5s-0.672,1.5-1.5,1.5H7.25c-0.828,0-1.5-0.671-1.5-1.5S6.422,8,7.25,8z M7.25,14.5h10
		c0.828,0,1.5,0.671,1.5,1.5s-0.672,1.5-1.5,1.5h-10c-0.828,0-1.5-0.671-1.5-1.5S6.422,14.5,7.25,14.5z M27.75,30.5H7.25
		c-0.828,0-1.5-0.671-1.5-1.5s0.672-1.5,1.5-1.5h20.5c0.828,0,1.5,0.671,1.5,1.5S28.578,30.5,27.75,30.5z M27.75,24H7.25
		c-0.828,0-1.5-0.671-1.5-1.5S6.422,21,7.25,21h20.5c0.828,0,1.5,0.671,1.5,1.5S28.578,24,27.75,24z M38.5,10.214v22.113
		c0,2.442-1.979,4.423-4.423,4.423h-2.493c2.762,0,5-2.239,5-5v-25c0-0.065-0.018-0.126-0.02-0.191
		C37.732,7.355,38.5,8.694,38.5,10.214z'
		/>
	</SvgIcon>
)