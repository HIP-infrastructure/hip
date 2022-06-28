import { useSnackbar } from 'notistack'

export const useNotification = () => {
	const { enqueueSnackbar } = useSnackbar()

	const showNotif = (message, variant) => {
		enqueueSnackbar(message, { variant })
	}

	return { showNotif }
}
