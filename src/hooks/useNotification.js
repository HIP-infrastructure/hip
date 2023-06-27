import { useSnackbar } from 'notistack'
import { useCallback } from 'react'

export const useNotification = () => {
	const { enqueueSnackbar } = useSnackbar()

	const showNotif = useCallback(
		(message, variant) => {
			enqueueSnackbar(message, { variant })
		},
		[enqueueSnackbar]
	)

	return { showNotif }
}
