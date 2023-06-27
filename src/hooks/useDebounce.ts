import { useState, useEffect } from 'react'

// source https://typeofnan.dev/writing-a-custom-react-usedebounce-hook-with-typescript/

export default function useDebounce<T>(
	initialValue: T,
	time = 300
): [T, T, React.Dispatch<T>] {
	const [value, setValue] = useState<T>(initialValue)
	const [debouncedValue, setDebouncedValue] = useState<T>(initialValue)

	useEffect(() => {
		const debounce = setTimeout(() => {
			setDebouncedValue(value)
		}, time)
		return () => {
			clearTimeout(debounce)
		}
	}, [value, time])

	return [debouncedValue, value, setValue]
}
