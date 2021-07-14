export const uniq = (type = 'server'): string => {
	const uniqid = `${type === 'server' ? 'session' : 'app'}-${Date.now()
		.toString()
		.slice(-3)}`

	return uniqid
}
