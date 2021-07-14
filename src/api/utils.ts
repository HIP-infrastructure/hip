export const uniq = (type = 'session'): string => {
	const uniqid = `${type === 'session' ? 'session' : 'app'}-${Date.now()
		.toString()
		.slice(-3)}`

	return uniqid
}
