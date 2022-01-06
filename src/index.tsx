import * as React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { AppStoreProvider } from './store/appProvider'
import { BrowserRouter, useLocation } from "react-router-dom";

const DebugRouter = ({ children }: { children: JSX.Element }) => {
	if (process.env.NODE_ENV === "development") {
		const location = useLocation()
		console.log(
			`Route: ${location.pathname}${location.search}, State: ${JSON.stringify(
				location.state,
			)}`,
		)
	}

	return children
}

ReactDOM.render(
	<React.StrictMode>
		<AppStoreProvider>
			<BrowserRouter>
				<DebugRouter>
					<App />
				</DebugRouter>
			</BrowserRouter>
		</AppStoreProvider>
	</React.StrictMode>,
	document.getElementById('hip-root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
