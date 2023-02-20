import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Modal,
	Typography,
} from '@mui/material'
import React, { forwardRef, useImperativeHandle, useState } from 'react'

interface PromiseResponse {
	resolve: (value: boolean | PromiseLike<boolean>) => void
	reject: (value: boolean | PromiseLike<boolean>) => void
}

const modalStyle = {
	position: 'absolute' as 'const',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	minWidth: 275,
	maxWidth: 360,
	bgcolor: 'background.paper',
	boxShadow: 4,
}

export type ModalComponentHandle = {
	/**
	 * Open a modal and wait for a reply (async)
	 * @param title the modal title
	 * @param message the modal body message
	 * @returns true if user accepted, false otherwise.
	 */
	open: (title: string, message: string) => Promise<boolean>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = Record<string, any>

const ModalComponent = forwardRef<ModalComponentHandle, Props>(
	(props, ref): JSX.Element => {
		const [isOpen, setIsOpen] = useState(false)
		const [title, setTitle] = useState('')
		const [message, setMessage] = useState('')
		const [promiseRes, setPromiseRes] = useState<PromiseResponse>()

		useImperativeHandle(ref, () => ({
			open: async (title: string, message: string): Promise<boolean> => {
				setTitle(title)
				setMessage(message)
				setIsOpen(true)
				return new Promise<boolean>((resolve, reject) => {
					setPromiseRes({ resolve, reject })
				})
			},
		}))

		return (
			<Modal open={isOpen}>
				<Box sx={{ ...modalStyle }}>
					<Card>
						<React.Fragment>
							<CardContent>
								<Typography variant='h5'>{title}</Typography>
								<Typography variant='body2'>{message}</Typography>
							</CardContent>
							<CardActions sx={{ ml: 1 }}>
								<Button
									onClick={(): void => {
										setIsOpen(false)
										promiseRes?.resolve(false)
									}}
								>
									Cancel
								</Button>
								<Button
									onClick={(): void => {
										setIsOpen(false)
										promiseRes?.resolve(true)
									}}
								>
									OK
								</Button>
							</CardActions>
						</React.Fragment>
					</Card>
				</Box>
			</Modal>
		)
	}
)

ModalComponent.displayName = 'ModalComponent'
export default ModalComponent
